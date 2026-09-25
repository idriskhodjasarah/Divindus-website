import { useState } from "react";
import { ShoppingBag, Clock, Wallet, XCircle } from "lucide-react";
import { styles, color } from "../styles/styles";
import { fmt, REVENUE_TREND_30 } from "../data/data";
import { TrendBadge, Sparkline, KpiCard, DonutChart, RankedBarCard, timeAgo } from "../components/OverviewWidgets";

export default function Overview({ orders, products, customers }) {
  const [range, setRange] = useState(14); // 7 | 14 | 30 | 0 (0 = all time)

  const cutoff = range ? Date.now() - range * 24 * 60 * 60 * 1000 : 0;
  const scopedOrders = range ? orders.filter((o) => new Date(o.placedAt).getTime() >= cutoff) : orders;
  const trendData = range ? REVENUE_TREND_30.slice(-range) : REVENUE_TREND_30;

  const active = scopedOrders.filter((o) => !o.cancelled);
  const revenue = active.reduce((s, o) => s + o.items.reduce((a, i) => a + i.price * i.qty, 0), 0);
  const pending = scopedOrders.filter((o) => !o.cancelled && !o.received).length;
  const cancelledCount = scopedOrders.filter((o) => o.cancelled).length;
  const cancelRate = scopedOrders.length ? Math.round((cancelledCount / scopedOrders.length) * 100) : 0;
  const avgOrder = active.length ? Math.round(revenue / active.length) : 0;

  const half = Math.floor(trendData.length / 2) || 1;
  const last = trendData.slice(-half).reduce((a, b) => a + b, 0);
  const prev = trendData.slice(-half * 2, -half).reduce((a, b) => a + b, 0);
  const revenueTrendPct = prev ? Math.round(((last - prev) / prev) * 100) : 0;

  const statusCounts = [
    { label: "Confirmée", value: scopedOrders.filter((o) => !o.cancelled && o.statusIndex === 0).length, color: color.line },
    { label: "Arrivée — à confirmer", value: scopedOrders.filter((o) => !o.cancelled && o.statusIndex === 1 && !o.received).length, color: color.amber },
    { label: "Réceptionnée", value: scopedOrders.filter((o) => o.received).length, color: color.graphite },
    { label: "Annulée", value: cancelledCount, color: color.rust },
  ];

  const paymentRevenue = { virement: 0, carte: 0 };
  active.forEach((o) => { paymentRevenue[o.paiement] += o.items.reduce((s, i) => s + i.price * i.qty, 0); });
  const paymentData = [
    { label: "Virement bancaire", value: paymentRevenue.virement, color: color.graphite },
    { label: "Carte CIB / Edahabia", value: paymentRevenue.carte, color: color.amber },
  ];

  const clientTotals = {};
  active.forEach((o) => {
    if (!clientTotals[o.client]) clientTotals[o.client] = { name: o.client, total: 0, count: 0 };
    clientTotals[o.client].total += o.items.reduce((s, i) => s + i.price * i.qty, 0);
    clientTotals[o.client].count += 1;
  });
  const topClients = Object.values(clientTotals).sort((a, b) => b.total - a.total).slice(0, 5);

  const filialeRevenue = {};
  active.forEach((o) => o.items.forEach((i) => { filialeRevenue[i.filiale] = (filialeRevenue[i.filiale] || 0) + i.price * i.qty; }));
  const byFiliale = Object.entries(filialeRevenue).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

  const productQty = {};
  active.forEach((o) => o.items.forEach((i) => { productQty[i.name] = (productQty[i.name] || 0) + i.qty; }));
  const topProducts = Object.entries(productQty).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const recentOrders = [...scopedOrders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)).slice(0, 5);

  return (
    <div>
      <div style={styles.sectionHeadRow}>
        <h1 style={styles.pageTitle}>Vue d'ensemble</h1>
        <div style={styles.filterRow}>
          {[{ v: 7, l: "7 jours" }, { v: 14, l: "14 jours" }, { v: 30, l: "30 jours" }, { v: 0, l: "Tout" }].map((r) => (
            <button key={r.v} style={{ ...styles.filterChip, ...(range === r.v ? styles.filterChipActive : {}) }} onClick={() => setRange(r.v)}>
              {r.l}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.heroCard}>
        <div style={styles.heroCardHead}>
          <div>
            <div style={styles.heroLabel}>Chiffre d'affaires — {range ? `${range} derniers jours` : "toutes périodes"}</div>
            <div style={styles.heroValue}>{fmt(revenue)}</div>
          </div>
          <TrendBadge pct={revenueTrendPct} />
        </div>
        <Sparkline data={trendData} />
      </div>

      <div style={styles.kpiGrid}>
        <KpiCard icon={ShoppingBag} label="Commandes totales" value={scopedOrders.length} tint={color.graphite} />
        <KpiCard icon={Clock} label="En attente" value={pending} tint={color.amber} />
        <KpiCard icon={Wallet} label="Panier moyen" value={fmt(avgOrder)} tint={color.graphite} />
        <KpiCard icon={XCircle} label="Taux d'annulation" value={cancelRate + "%"} tint={color.rust} />
      </div>

      <div style={styles.twoColGrid} className="two-col-grid">
        <div style={styles.panelCard}>
          <h3 style={styles.chartTitle}>Commandes par statut</h3>
          <DonutChart data={statusCounts} />
        </div>

        <div style={styles.panelCard}>
          <h3 style={styles.chartTitle}>Activité récente</h3>
          <div style={styles.activityList}>
            {recentOrders.map((o) => {
              const total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
              const label = o.cancelled ? "Annulée" : o.received ? "Réceptionnée" : o.statusIndex === 1 ? "Arrivée" : "Confirmée";
              const dotColor = o.cancelled ? color.rust : o.received ? color.graphite : o.statusIndex === 1 ? color.amber : color.line;
              return (
                <div key={o.id} style={styles.activityRow}>
                  <span style={{ ...styles.activityDot, background: dotColor }} />
                  <div style={styles.activityMain}>
                    <div style={styles.activityClient}>{o.client}</div>
                    <div style={styles.activityMeta}>{o.ref} · {label}</div>
                  </div>
                  <div style={styles.activityRight}>
                    <div style={styles.activityAmount}>{fmt(total)}</div>
                    <div style={styles.activityTime}>{timeAgo(o.placedAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.twoColGrid} className="two-col-grid">
        <div style={styles.panelCard}>
          <h3 style={styles.chartTitle}>Répartition des paiements</h3>
          <DonutChart data={paymentData} valueFormat={fmt} />
        </div>

        <div style={styles.panelCard}>
          <h3 style={styles.chartTitle}>Meilleurs clients</h3>
          <div style={styles.activityList}>
            {topClients.length === 0 && <p style={styles.emptyState}>Aucune donnée sur cette période.</p>}
            {topClients.map((c, i) => (
              <div key={c.name} style={styles.activityRow}>
                <span style={styles.clientRank}>{i + 1}</span>
                <span style={styles.clientAvatar}>{c.name.slice(0, 2).toUpperCase()}</span>
                <div style={styles.activityMain}>
                  <div style={styles.activityClient}>{c.name}</div>
                  <div style={styles.activityMeta}>{c.count} commande{c.count > 1 ? "s" : ""}</div>
                </div>
                <div style={styles.activityRight}>
                  <div style={styles.activityAmount}>{fmt(c.total)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.chartGrid}>
        <RankedBarCard title="Chiffre d'affaires par filiale" data={byFiliale} formatValue={fmt} />
        <RankedBarCard title="Produits les plus vendus (unités)" data={topProducts} />
      </div>
    </div>
  );
}
