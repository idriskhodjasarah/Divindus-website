import { useState } from "react";
import { Search, Download, CheckCircle2 } from "lucide-react";
import { styles } from "../styles/styles";
import { fmt, dateFmt, downloadCsv, downloadJson } from "../data/data";

export default function OrdersSection({ orders, query, setQuery }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [selected, setSelected] = useState([]);

  const filtered = orders.filter((o) => {
    const matchQuery = query.trim() === "" || o.ref.toLowerCase().includes(query.toLowerCase()) || o.client.toLowerCase().includes(query.toLowerCase());
    const status = o.cancelled ? "cancelled" : o.received ? "received" : o.statusIndex === 1 ? "arrived" : "confirmed";
    const matchStatus = statusFilter === "all" || statusFilter === status;
    return matchQuery && matchStatus;
  });

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.includes(o.id));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((o) => o.id));
  const toggleOne = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const statusLabel = (o) => (o.cancelled ? "Annulée" : o.received ? "Réceptionnée" : o.statusIndex === 1 ? "Arrivée — à confirmer" : "Confirmée");

  const exportRows = (list) => list.map((o) => [
    o.ref, o.client, o.email, o.telephone, o.wilaya,
    o.items.reduce((s, i) => s + i.price * i.qty, 0),
    o.paiement === "carte" ? "Carte" : "Virement",
    statusLabel(o),
    dateFmt(o.placedAt),
  ]);
  const csvHeaders = ["Référence", "Client", "Email", "Téléphone", "Wilaya", "Total (DA)", "Paiement", "Statut", "Date"];

  const exportTarget = selected.length > 0 ? orders.filter((o) => selected.includes(o.id)) : filtered;
  const exportLabel = selected.length > 0 ? `(${selected.length} sélectionnée${selected.length > 1 ? "s" : ""})` : `(${filtered.length})`;
  const exportCsv = () => downloadCsv(selected.length > 0 ? "commandes-selection.csv" : "commandes.csv", csvHeaders, exportRows(exportTarget));
  const exportJson = () => downloadJson(selected.length > 0 ? "commandes-selection.json" : "commandes.json", exportTarget);

  return (
    <div>
      <div style={styles.searchWrap}>
        <Search size={15} color="#8A8375" />
        <input style={styles.searchInput} placeholder="Rechercher une référence ou un client…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <h1 style={styles.pageTitle}>Commandes ({orders.length})</h1>

      <div style={styles.toolbar}>
        <div style={styles.filterRow}>
          {[
            { k: "all", l: "Toutes" },
            { k: "confirmed", l: "Confirmée" },
            { k: "arrived", l: "Arrivée" },
            { k: "received", l: "Réceptionnée" },
            { k: "cancelled", l: "Annulée" },
          ].map((f) => (
            <button key={f.k} style={{ ...styles.filterChip, ...(statusFilter === f.k ? styles.filterChipActive : {}) }} onClick={() => setStatusFilter(f.k)}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.bulkBar}>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} /> Tout sélectionner
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.secondaryBtnSmall} onClick={exportCsv}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> CSV {exportLabel}</span>
          </button>
          <button style={styles.secondaryBtnSmall} onClick={exportJson} title="Conserve le détail des articles par commande">
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> JSON {exportLabel}</span>
          </button>
        </div>
      </div>

      <div style={styles.ordersList}>
        {filtered.map((o) => {
          const total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
          const status = statusLabel(o);
          const isOpen = expanded === o.id;
          return (
            <div key={o.id} style={styles.orderRow}>
              <div style={styles.orderRowHeadWrap}>
                <input type="checkbox" style={styles.rowCheckbox} checked={selected.includes(o.id)} onChange={() => toggleOne(o.id)} />
                <button style={styles.orderRowHead} onClick={() => setExpanded(isOpen ? null : o.id)}>
                  <div style={styles.orderRowMain}>
                    <span style={styles.orderRef}>{o.ref}</span>
                    <span style={styles.orderClient}>{o.client}</span>
                  </div>
                  <span style={styles.orderWilaya}>{o.wilaya}</span>
                  <span style={styles.orderDate}>{dateFmt(o.placedAt)}</span>
                  <span style={styles.orderTotal}>{fmt(total)}</span>
                  <span style={{ ...styles.statusPill, ...(o.cancelled ? styles.statusPillMuted : o.received ? styles.statusPillDone : {}) }}>{status}</span>
                </button>
              </div>

              {isOpen && (
                <div style={styles.orderDetail}>
                  <div style={styles.orderDetailGrid}>
                    <div>
                      <div style={styles.detailLabel}>Client</div>
                      <div style={styles.detailValue}>{o.client}</div>
                      <div style={styles.detailValue}>{o.email}</div>
                      <div style={styles.detailValue}>{o.telephone}</div>
                    </div>
                    <div>
                      <div style={styles.detailLabel}>Paiement</div>
                      <div style={styles.detailValue}>{o.paiement === "carte" ? "Carte CIB / Edahabia" : "Virement bancaire"}</div>
                      {o.refundStatus && <div style={styles.detailValue}>Remboursement : {o.refundStatus === "en_cours" ? "en cours" : "effectué"}</div>}
                    </div>
                  </div>

                  <table style={styles.itemsTable}>
                    <tbody>
                      {o.items.map((i, idx) => (
                        <tr key={idx}>
                          <td style={styles.itemsTd}>{i.qty} × {i.name}</td>
                          <td style={styles.itemsTd}>{i.filiale}</td>
                          <td style={{ ...styles.itemsTd, textAlign: "right" }}>{i.price ? fmt(i.price * i.qty) : "Sur devis"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p style={styles.statusNote}>
                    <CheckCircle2 size={13} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                    Le statut de livraison est mis à jour par le client lui-même
                    (confirmation de réception) — il n'est pas modifiable depuis
                    l'administration.
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p style={styles.emptyState}>Aucune commande ne correspond à cette recherche.</p>}
      </div>
    </div>
  );
}
