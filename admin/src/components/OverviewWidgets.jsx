import { TrendingUp, TrendingDown } from "lucide-react";
import { styles, color } from "../styles/styles";

export function timeAgo(date) {
  const hrs = Math.round((Date.now() - new Date(date).getTime()) / 3600000);
  if (hrs < 1) return "À l'instant";
  if (hrs < 24) return `Il y a ${hrs} h`;
  return `Il y a ${Math.round(hrs / 24)} j`;
}

export function TrendBadge({ pct }) {
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div style={{ ...styles.trendBadge, ...(up ? styles.trendBadgeUp : styles.trendBadgeDown) }}>
      <Icon size={14} /> {up ? "+" : ""}{pct}% vs 7 jours précédents
    </div>
  );
}

export function Sparkline({ data }) {
  const w = 100, h = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const linePath = "M" + points.join(" L");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={styles.sparkline} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color.amber} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color.amber} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkFade)" stroke="none" />
      <path d={linePath} fill="none" stroke={color.amber} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function KpiCard({ icon: Icon, label, value, tint }) {
  return (
    <div style={{ ...styles.kpiCard, borderTopColor: tint }}>
      <div style={{ ...styles.kpiIcon, color: tint }}><Icon size={17} /></div>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiLabel}>{label}</div>
    </div>
  );
}

export function DonutChart({ data, valueFormat, centerLabel }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const stops = data.map((d) => {
    const start = (acc / total) * 100;
    acc += d.value;
    const end = (acc / total) * 100;
    return `${d.color} ${start}% ${end}%`;
  });
  const gradient = `conic-gradient(${stops.join(", ")})`;
  const fmtVal = valueFormat || ((v) => v);

  return (
    <div style={styles.donutRow}>
      <div style={styles.donutWrap}>
        <div style={{ ...styles.donutRing, background: gradient }} />
        <div style={styles.donutHole}>
          <div style={styles.donutTotal}>{valueFormat ? fmtVal(total).split(" ")[0] : total}</div>
          <div style={styles.donutTotalLabel}>{centerLabel || (valueFormat ? "DA" : "commandes")}</div>
        </div>
      </div>
      <div style={styles.donutLegend}>
        {data.map((d) => (
          <div key={d.label} style={styles.legendRow}>
            <span style={{ ...styles.legendDot, background: d.color }} />
            <span style={styles.legendLabel}>{d.label}</span>
            <span style={styles.legendValue}>{fmtVal(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RankedBarCard({ title, data, formatValue }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>
      {data.map((d, i) => (
        <div key={d.label} style={styles.rankedRow}>
          <div style={styles.rankedRank}>{i + 1}</div>
          <div style={styles.rankedBody}>
            <div style={styles.rankedTopLine}>
              <span style={styles.rankedLabel}>{d.label}</span>
              <span style={styles.rankedValue}>{formatValue ? formatValue(d.value) : d.value}</span>
            </div>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${(d.value / max) * 100}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
