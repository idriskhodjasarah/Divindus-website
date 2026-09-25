export const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
input:focus, textarea:focus, button:focus-visible { outline: 2px solid #C9821F; outline-offset: 1px; }
@media (max-width: 900px) {
  .field-row { flex-direction: column !important; gap: 0 !important; }
  .two-col-grid { grid-template-columns: 1fr !important; }
}
@media (max-width: 800px) {
  .admin-mobile-toggle { display: flex !important; }
  .admin-sidebar { position: fixed !important; left: -240px; top: 0; z-index: 25; transition: left 0.2s ease; }
  .admin-sidebar.open { left: 0 !important; }
  .admin-content { padding: 70px 20px 40px !important; }
}
`;

export const color = {
  graphite: "#1B2024",
  concrete: "#EDE9E1",
  concreteDark: "#DFDACD",
  line: "#C9C2B0",
  amber: "#C9821F",
  rust: "#8C3F22",
  ink: "#22262B",
  inkSoft: "#5B5749",
  white: "#FCFBF8",
};

export const styles = {
  app: { fontFamily: "'Work Sans', sans-serif", background: color.concrete, color: color.ink, minHeight: "100vh", width: "100%" },

  fieldGroup: { marginBottom: 14 },
  fieldRow: { display: "flex", gap: 14 },
  fieldLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: color.inkSoft, marginBottom: 5 },
  input: { width: "100%", border: `1px solid ${color.line}`, background: color.white, padding: "9px 11px", fontSize: 13.5, fontFamily: "'Work Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", border: `1px solid ${color.line}`, background: color.white, padding: "9px 11px", fontSize: 13.5, fontFamily: "'Work Sans', sans-serif", outline: "none", boxSizing: "border-box", minHeight: 70, resize: "vertical" },
  pwWrap: { display: "flex", alignItems: "center", border: `1px solid ${color.line}`, background: color.white, padding: "9px 11px" },
  pwToggle: { background: "none", border: "none", cursor: "pointer", color: color.inkSoft, display: "flex" },

  primaryBtn: { background: color.amber, color: color.graphite, border: "none", padding: "11px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" },
  btnDarkSmall: { display: "inline-flex", alignItems: "center", background: color.graphite, color: color.white, border: "none", padding: "8px 14px", fontSize: 12.5, fontWeight: 500, cursor: "pointer", textDecoration: "none" },
  linkBtnSmall: { background: "none", border: "none", color: color.rust, fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" },
  iconTextBtn: { display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: color.inkSoft, fontSize: 12, cursor: "pointer", padding: 0 },

  // Shell / sidebar
  shell: { display: "flex", minHeight: "100vh" },
  mobileNavToggle: { display: "none", position: "fixed", top: 12, left: 12, zIndex: 30, background: color.graphite, color: color.white, border: "none", padding: "8px 12px", fontSize: 13, alignItems: "center", gap: 6, cursor: "pointer" },
  sidebar: { width: 220, background: color.graphite, borderRight: `3px solid ${color.amber}`, display: "flex", flexDirection: "column", padding: "20px 14px", flexShrink: 0, position: "sticky", top: 0, height: "100vh" },
  sidebarOpen: {},
  sidebarLogo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28, paddingLeft: 4 },
  navList: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  navItem: { display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", color: "#C7C2B4", padding: "10px 10px", fontSize: 13.5, cursor: "pointer", textAlign: "left" },
  navItemActive: { background: "rgba(201,130,31,0.15)", color: color.white, fontWeight: 600 },
  navBadge: { background: color.amber, color: color.graphite, fontSize: 10.5, fontWeight: 700, borderRadius: "50%", width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center" },

  logoMark: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 17, color: color.graphite, background: color.amber, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoText: { fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: 1, color: color.white },
  authLogoTag: { color: color.amber, fontSize: 11.5, fontWeight: 600, letterSpacing: 1 },

  content: { flex: 1, padding: "32px 36px", minWidth: 0 },
  pageTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 600, margin: "0 0 24px" },
  sectionHeadRow: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  subHead: { fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, margin: "0 0 12px" },

  // Hero revenue card
  heroCard: { background: color.graphite, padding: "24px 26px", marginBottom: 24 },
  heroCardHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 18 },
  heroLabel: { fontSize: 12.5, color: "#9A968A", marginBottom: 6 },
  heroValue: { fontFamily: "'Oswald', sans-serif", fontSize: 34, fontWeight: 600, color: color.white },
  sparkline: { width: "100%", height: 60, display: "block" },
  trendBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, padding: "6px 12px" },
  trendBadgeUp: { background: "rgba(201,130,31,0.18)", color: color.amber },
  trendBadgeDown: { background: "rgba(140,63,34,0.25)", color: "#E0A98C" },

  // KPIs + charts
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 },
  kpiCard: { background: color.white, border: `1px solid ${color.line}`, borderTop: `3px solid ${color.amber}`, padding: 18 },
  kpiIcon: { marginBottom: 10 },
  kpiValue: { fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 600 },
  kpiLabel: { fontSize: 12.5, color: color.inkSoft, marginTop: 4 },

  twoColGrid: { display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20, marginBottom: 24 },
  panelCard: { background: color.white, border: `1px solid ${color.line}`, padding: 20 },

  chartGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 },
  chartCard: { background: color.white, border: `1px solid ${color.line}`, padding: 20 },
  chartTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, margin: "0 0 16px" },
  barRow: { display: "grid", gridTemplateColumns: "140px 1fr 90px", alignItems: "center", gap: 10, marginBottom: 10 },
  barLabel: { fontSize: 12, color: color.inkSoft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  barTrack: { background: color.concreteDark, height: 7 },
  barFill: { background: color.amber, height: "100%" },
  barValue: { fontSize: 12, color: color.ink, textAlign: "right", fontWeight: 500 },

  rankedRow: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14 },
  rankedRank: { fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 600, color: color.line, width: 16, flexShrink: 0 },
  rankedBody: { flex: 1, minWidth: 0 },
  rankedTopLine: { display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 5 },
  rankedLabel: { fontSize: 12.5, color: color.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  rankedValue: { fontSize: 12.5, color: color.inkSoft, fontWeight: 500, flexShrink: 0 },

  donutRow: { display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" },
  donutWrap: { position: "relative", width: 140, height: 140, flexShrink: 0 },
  donutRing: { width: "100%", height: "100%", borderRadius: "50%" },
  donutHole: { position: "absolute", inset: 20, background: color.white, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  donutTotal: { fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 600 },
  donutTotalLabel: { fontSize: 10.5, color: color.inkSoft },
  donutLegend: { display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 160 },
  legendRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 },
  legendDot: { width: 9, height: 9, borderRadius: "50%", flexShrink: 0 },
  legendLabel: { color: color.inkSoft, flex: 1 },
  legendValue: { color: color.ink, fontWeight: 600 },

  activityList: { display: "flex", flexDirection: "column", gap: 4 },
  activityRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${color.concreteDark}` },
  activityDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  activityMain: { flex: 1, minWidth: 0 },
  activityClient: { fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  activityMeta: { fontSize: 11.5, color: color.inkSoft, fontFamily: "monospace" },
  activityRight: { textAlign: "right", flexShrink: 0 },
  activityAmount: { fontSize: 13, fontWeight: 600 },
  activityTime: { fontSize: 11, color: color.inkSoft },
  clientRank: { fontFamily: "'Oswald', sans-serif", fontSize: 12, fontWeight: 600, color: color.line, width: 14, flexShrink: 0 },
  clientAvatar: { width: 28, height: 28, borderRadius: "50%", background: color.concreteDark, color: color.ink, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  toolbar: { marginBottom: 20 },
  searchWrap: { display: "flex", alignItems: "center", gap: 8, background: color.white, border: `1px solid ${color.line}`, padding: "9px 12px", marginBottom: 12, maxWidth: 420 },
  searchInput: { border: "none", outline: "none", background: "none", fontSize: 13.5, width: "100%" },
  filterRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  filterChip: { fontSize: 12.5, padding: "7px 12px", background: color.white, border: `1px solid ${color.line}`, color: color.inkSoft, cursor: "pointer" },
  filterChipActive: { background: color.graphite, borderColor: color.graphite, color: color.white },

  ordersList: { display: "flex", flexDirection: "column", gap: 10 },
  orderRow: { background: color.white, border: `1px solid ${color.line}` },
  orderRowHead: { width: "100%", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", background: "none", border: "none", padding: 16, cursor: "pointer", textAlign: "left" },
  orderRowMain: { display: "flex", flexDirection: "column", gap: 2, minWidth: 160, flex: 1 },
  orderRef: { fontFamily: "monospace", fontSize: 12, color: color.rust },
  orderClient: { fontSize: 13.5, fontWeight: 500 },
  orderWilaya: { fontSize: 12.5, color: color.inkSoft, minWidth: 80 },
  orderDate: { fontSize: 12, color: color.inkSoft, minWidth: 90 },
  orderTotal: { fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 600, minWidth: 100 },
  statusPill: { fontSize: 11.5, fontWeight: 600, padding: "5px 10px", background: color.concreteDark, color: color.graphite, whiteSpace: "nowrap" },
  statusPillDone: { background: color.amber },
  statusPillMuted: { background: "transparent", border: `1px solid ${color.line}`, color: color.inkSoft },

  orderDetail: { borderTop: `1px solid ${color.concreteDark}`, padding: 16 },
  orderDetailGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 16 },
  detailLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, color: color.rust, fontWeight: 600, marginBottom: 4 },
  detailValue: { fontSize: 13, color: color.ink, marginBottom: 2 },
  itemsTable: { width: "100%", borderCollapse: "collapse", marginBottom: 16 },
  itemsTd: { fontSize: 12.5, color: color.inkSoft, padding: "6px 8px 6px 0", borderBottom: `1px solid ${color.concreteDark}` },
  orderDetailActions: { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" },
  statusNote: { fontSize: 12, color: color.inkSoft, background: color.concreteDark, padding: "10px 12px", margin: 0 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: color.inkSoft, padding: "4px 0" },

  emptyState: { fontSize: 13.5, color: color.inkSoft, padding: "30px 0", textAlign: "center" },

  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  productCard: { background: color.white, border: `1px solid ${color.line}`, padding: 16 },
  productCode: { fontFamily: "monospace", fontSize: 11.5, color: color.rust, marginBottom: 6 },
  productName: { fontSize: 14, fontWeight: 600, marginBottom: 4 },
  productFiliale: { fontSize: 12, color: color.inkSoft, marginBottom: 10 },
  productDesc: { fontSize: 12.5, color: color.inkSoft, lineHeight: 1.5, marginBottom: 12 },
  productPrice: { fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12 },
  productUnit: { fontFamily: "'Work Sans', sans-serif", fontSize: 11.5, color: color.inkSoft, fontWeight: 400 },
  productActions: { display: "flex", gap: 14, flexWrap: "wrap", borderTop: `1px solid ${color.concreteDark}`, paddingTop: 10 },

  modalOverlay: { position: "fixed", inset: 0, background: "rgba(27,32,36,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 },
  modal: { width: "100%", maxWidth: 440, background: color.white, padding: 24, maxHeight: "90vh", overflowY: "auto" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  modalTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, margin: 0 },
  iconBtn: { background: "none", border: "none", cursor: "pointer", color: color.ink },

  globalSearchWrap: { position: "relative", marginBottom: 28, maxWidth: 480 },
  searchDropdown: { position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: color.white, border: `1px solid ${color.line}`, boxShadow: "0 8px 24px rgba(27,32,36,0.12)", zIndex: 20, maxHeight: 360, overflowY: "auto", padding: "8px 0" },
  searchEmpty: { fontSize: 12.5, color: color.inkSoft, padding: "10px 14px", margin: 0 },
  searchGroup: { padding: "4px 0" },
  searchGroupLabel: { fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.5, color: color.rust, fontWeight: 600, padding: "6px 14px 2px" },
  searchResult: { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "8px 14px", fontSize: 13, color: color.ink, cursor: "pointer" },
  searchResultRef: { fontFamily: "monospace", fontSize: 12, color: color.rust },

  bulkBar: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  checkboxLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: color.inkSoft, cursor: "pointer" },
  orderRowHeadWrap: { display: "flex", alignItems: "center", gap: 4 },
  rowCheckbox: { marginLeft: 16, flexShrink: 0 },
  secondaryBtnSmall: { background: color.white, color: color.ink, border: `1px solid ${color.line}`, padding: "8px 14px", fontSize: 12.5, fontWeight: 500, cursor: "pointer" },

  demoNoteInline: { fontSize: 12, color: color.inkSoft, background: color.concreteDark, border: `1px dashed ${color.line}`, padding: 12, margin: "0 0 20px" },
  legalTabs: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 },
  contentBlock: { background: color.white, border: `1px solid ${color.line}`, padding: 18, marginBottom: 16 },
  slideBlockHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
profileWrapAdmin: { maxWidth: 640 },
  savedNote: { fontSize: 12.5, color: color.rust, marginTop: 12 },
};
