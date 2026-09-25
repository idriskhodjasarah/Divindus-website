export const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
input:focus, textarea:focus, button:focus-visible {
  outline: 2px solid #C9821F;
  outline-offset: 1px;
}
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
@media print {
  body * { visibility: hidden; }
  #invoice-print, #invoice-print * { visibility: visible; }
  #invoice-print { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 24px; }
  .no-print { display: none !important; }
}

/* ---- Mobile responsiveness ---- */
@media (max-width: 768px) {
  .checkout-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
  .field-row { flex-direction: column !important; gap: 0 !important; }
  .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; text-align: left; }
  .stats-row { flex-wrap: wrap !important; gap: 24px !important; }
  .public-nav { display: none !important; }
  .party-row { flex-direction: column !important; gap: 20px !important; }
  .pay-row { flex-direction: column !important; }
  .shop-tag { display: none !important; }
  .responsive-header { flex-wrap: wrap !important; row-gap: 10px !important; }
  .invoice-scroll { overflow-x: auto !important; }
  .invoice-scroll table { min-width: 560px; }
}
@media (max-width: 480px) {
  .auth-card-pad { padding: 22px 18px !important; }
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
  app: { fontFamily: "'Work Sans', sans-serif", background: color.concrete, color: color.ink, minHeight: "100%", width: "100%" },

  // Public header / footer
  publicHeader: { background: color.graphite, borderBottom: `3px solid ${color.amber}` },
  publicNav: { display: "flex", gap: 24, color: "#C7C2B4", fontSize: 14, flex: 1, justifyContent: "center" },
  connectBtn: { display: "flex", alignItems: "center", gap: 6, background: color.amber, color: color.graphite, border: "none", padding: "9px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" },

  heroCarousel: { position: "relative", background: color.graphite, minHeight: 420, overflow: "hidden" },
  slide: { position: "absolute", inset: 0, display: "flex", alignItems: "center", transition: "opacity 0.6s ease" },
  slideInner: { maxWidth: 1080, width: "100%", margin: "0 auto", padding: "0 20px" },
  slideTag: { color: color.amber, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 14 },
  slideTitle: { fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 38, lineHeight: 1.2, color: color.white, margin: "0 0 16px", maxWidth: 620 },
  slideDesc: { color: "#C7C2B4", fontSize: 16, lineHeight: 1.6, maxWidth: 520, margin: "0 0 28px" },
  slideDots: { position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: "50%", border: "none", background: "#4A5158", cursor: "pointer", padding: 0 },
  dotActive: { background: color.amber, width: 22, borderRadius: 4 },

  section: { maxWidth: 1080, margin: "0 auto", padding: "56px 20px" },
  sectionHead: { fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 600, margin: "0 0 32px" },

  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 },
  featureCard: { background: color.white, border: `1px solid ${color.line}`, padding: 24 },
  featureIcon: { color: color.rust, marginBottom: 14 },
  featureTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, margin: "0 0 8px" },
  featureDesc: { fontSize: 13.5, color: color.inkSoft, lineHeight: 1.55, margin: 0 },

  statsBand: { background: color.graphite, padding: "40px 20px" },
  statsBandInner: { maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between" },
  statBlock: {},
  statValue: { fontFamily: "'Oswald', sans-serif", fontSize: 30, fontWeight: 600, color: color.amber },
  statLabel: { fontSize: 13, color: "#9A968A" },

  partnerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 },
  partnerCard: { border: `1px solid ${color.line}`, background: color.white, padding: "18px 16px" },
  partnerName: { fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 15, marginBottom: 4 },
  partnerDesc: { fontSize: 12.5, color: color.inkSoft },

  previewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 },

  ctaBand: { background: color.rust, padding: "48px 20px", textAlign: "center" },
  ctaTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 600, color: color.white, margin: "0 0 10px" },
  ctaSub: { color: "#F0DDD2", fontSize: 14.5, margin: "0 0 24px" },

  footer: { background: color.graphite, padding: "48px 20px 20px" },
  footerInner: { maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 32 },
  footerColTitle: { color: color.white, fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 10 },
  footerText: { color: "#9A968A", fontSize: 13, lineHeight: 1.7, margin: "0 0 4px" },
  footerBottom: { maxWidth: 1080, margin: "32px auto 0", paddingTop: 16, borderTop: "1px solid #3A4046", color: "#75716A", fontSize: 12 },

  // Shared topbar (shop)
  topbar: { background: color.graphite, borderBottom: `3px solid ${color.amber}` },
  topbarInner: { maxWidth: 1080, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 },
  logoBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 },
  logoMark: { fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18, color: color.graphite, background: color.amber, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 17, letterSpacing: 1, color: color.white },
  topbarTag: { color: "#A9A497", fontSize: 13, flex: 1 },
  iconBtnDark: { width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: `1px solid #4A5158`, color: color.white, cursor: "pointer", padding: 0 },
  cartBtn: { position: "relative", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: `1px solid #4A5158`, color: color.white, cursor: "pointer", padding: 0 },
  cartBadge: { position: "absolute", top: -6, right: -6, background: color.amber, color: color.graphite, fontSize: 11, fontWeight: 600, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" },

  toolbar: { maxWidth: 1080, margin: "0 auto", padding: "28px 20px 0" },
  searchWrap: { display: "flex", alignItems: "center", gap: 8, background: color.white, border: `1px solid ${color.line}`, padding: "10px 14px", marginBottom: 16, maxWidth: 420 },
  searchInput: { border: "none", outline: "none", background: "none", fontFamily: "'Work Sans', sans-serif", fontSize: 14, width: "100%", color: color.ink },
  catRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  catBtn: { fontFamily: "'Work Sans', sans-serif", fontSize: 13, fontWeight: 500, padding: "8px 14px", background: "transparent", border: `1px solid ${color.line}`, color: color.inkSoft, cursor: "pointer" },
  catBtnActive: { background: color.graphite, borderColor: color.graphite, color: color.white },

  grid: { maxWidth: 1080, margin: "0 auto", padding: "24px 20px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 },
  empty: { color: color.inkSoft, fontSize: 14 },

  card: { background: color.white, border: `1px solid ${color.line}`, padding: 18, display: "flex", flexDirection: "column" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 },
  cardCode: { fontFamily: "monospace", fontSize: 12, color: color.rust },
  cardFiliale: { fontSize: 11, color: color.inkSoft },
  cardName: { fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.25 },
  cardDesc: { fontSize: 13.5, color: color.inkSoft, lineHeight: 1.5, margin: "0 0 12px" },
  specList: { listStyle: "none", padding: 0, margin: "0 0 16px", borderTop: `1px solid ${color.concreteDark}`, paddingTop: 10 },
  specItem: { fontSize: 12.5, color: color.inkSoft, padding: "3px 0" },
  cardFooter: { marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardPrice: { fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 16 },
  cardLead: { fontSize: 11.5, color: color.inkSoft },
  addBtn: { background: color.graphite, color: color.white, border: "none", padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" },

  qtyStepper: { display: "flex", alignItems: "center", gap: 10, border: `1px solid ${color.line}`, padding: "4px 8px" },
  qtyBtn: { background: "none", border: "none", cursor: "pointer", color: color.ink, display: "flex" },
  qtyValue: { fontSize: 14, fontWeight: 500, minWidth: 14, textAlign: "center" },

  drawerOverlay: { position: "fixed", inset: 0, background: "rgba(27,32,36,0.5)", display: "flex", justifyContent: "flex-end", zIndex: 40 },
  drawer: { width: 380, maxWidth: "90vw", background: color.white, height: "100%", display: "flex", flexDirection: "column", padding: 24 },
  drawerHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  drawerTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600, margin: 0 },
  iconBtn: { background: "none", border: "none", cursor: "pointer", color: color.ink },
  drawerEmpty: { color: color.inkSoft, fontSize: 14 },
  drawerList: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 },
  drawerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${color.concreteDark}`, paddingBottom: 14 },
  drawerRowName: { fontSize: 14, fontWeight: 500, marginBottom: 4, maxWidth: 200 },
  drawerRowMeta: { fontSize: 12, color: color.inkSoft },
  drawerFoot: { borderTop: `1px solid ${color.line}`, paddingTop: 16, marginTop: 16 },
  drawerTotalRow: { display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 14 },
  drawerTotalValue: { fontFamily: "'Oswald', sans-serif", fontWeight: 600 },

  primaryBtn: { background: color.amber, color: color.graphite, border: "none", padding: "13px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  secondaryBtn: { background: "transparent", color: color.ink, border: `1px solid ${color.ink}`, padding: "12px 22px", fontSize: 14, fontWeight: 500, cursor: "pointer" },

  checkoutWrap: { maxWidth: 1080, margin: "0 auto", padding: "28px 20px 80px" },
  backBtn: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: color.inkSoft, fontSize: 13, cursor: "pointer", marginBottom: 24, padding: 0 },
  checkoutGrid: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "start" },
  sectionTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600, margin: "0 0 18px" },
  fieldGroup: { marginBottom: 16, flex: 1 },
  fieldRow: { display: "flex", gap: 16 },
  fieldLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: color.inkSoft, marginBottom: 6 },
  input: { width: "100%", border: `1px solid ${color.line}`, background: color.white, padding: "10px 12px", fontSize: 14, fontFamily: "'Work Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", border: `1px solid ${color.line}`, background: color.white, padding: "10px 12px", fontSize: 14, fontFamily: "'Work Sans', sans-serif", outline: "none", minHeight: 70, resize: "vertical", boxSizing: "border-box" },
  payRow: { display: "flex", gap: 14, marginBottom: 16 },
  payOption: { flex: 1, display: "flex", gap: 10, alignItems: "flex-start", border: `1px solid ${color.line}`, background: color.white, padding: 14, cursor: "pointer", textAlign: "left" },
  payOptionActive: { borderColor: color.graphite, boxShadow: `inset 0 0 0 1px ${color.graphite}` },
  payOptionIcon: { color: color.rust, marginTop: 2 },
  payOptionLabel: { fontSize: 14, fontWeight: 600 },
  payOptionSub: { fontSize: 12, color: color.inkSoft },
  noteBox: { fontSize: 12.5, color: color.inkSoft, background: color.concreteDark, padding: 12, borderLeft: `3px solid ${color.amber}` },

  summaryCard: { background: color.white, border: `1px solid ${color.line}`, padding: 22, position: "sticky", top: 20 },
  summaryTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, margin: "0 0 16px" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13.5, color: color.inkSoft, marginBottom: 8, gap: 10 },
  summaryDivider: { borderTop: `1px solid ${color.line}`, margin: "12px 0" },
  summaryTotalRow: { display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, marginBottom: 18 },

  confirmWrap: { maxWidth: 760, margin: "0 auto", padding: "64px 20px 80px", textAlign: "center" },
  confirmIcon: { width: 52, height: 52, borderRadius: "50%", background: color.amber, color: color.graphite, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  confirmTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 600, margin: "0 0 10px" },
  confirmSub: { fontSize: 14, color: color.inkSoft, lineHeight: 1.6, marginBottom: 28 },
  confirmCard: { background: color.white, border: `1px solid ${color.line}`, padding: 22, textAlign: "left", marginBottom: 28 },

  invoiceCard: { background: color.white, border: `1px solid ${color.line}`, padding: 32, textAlign: "left", marginBottom: 20 },
  invoiceHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `2px solid ${color.graphite}`, paddingBottom: 18, marginBottom: 18, gap: 20 },
  invoiceLogo: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  invoiceHeadRight: { textAlign: "right" },
  invoiceTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 600, margin: "0 0 8px", color: color.ink },
  invoiceMeta: { fontSize: 12, color: color.inkSoft, margin: "0 0 3px", lineHeight: 1.5 },
  invoiceParties: { display: "flex", gap: 40, marginBottom: 24 },
  invoicePartyLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: color.rust, fontWeight: 600, marginBottom: 8 },
  invoicePartyLine: { fontSize: 13, color: color.ink, margin: "0 0 3px", lineHeight: 1.5 },
  invoiceTable: { width: "100%", borderCollapse: "collapse", marginBottom: 8 },
  invoiceTh: { textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, color: color.inkSoft, borderBottom: `1px solid ${color.line}`, padding: "0 8px 8px 0" },
  invoiceTd: { fontSize: 13, color: color.ink, borderBottom: `1px solid ${color.concreteDark}`, padding: "10px 8px 10px 0" },
  invoiceNote: { fontSize: 11.5, color: color.inkSoft, fontStyle: "italic", margin: "8px 0 0" },
  invoiceTotals: { marginLeft: "auto", width: 260, marginTop: 20 },
  invoiceTotalRow: { display: "flex", justifyContent: "space-between", fontSize: 13.5, color: color.inkSoft, marginBottom: 8 },
  invoiceDivider: { borderTop: `1px solid ${color.line}`, margin: "8px 0" },
  invoiceGrandTotal: { display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 600, color: color.ink },
  invoiceLegal: { fontSize: 11, color: color.inkSoft, marginTop: 28, paddingTop: 14, borderTop: `1px solid ${color.concreteDark}`, lineHeight: 1.6 },
  invoiceActions: { display: "flex", gap: 14, justifyContent: "center" },

  // Auth pages
  authPage: { minHeight: "100vh", background: color.graphite, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  authCard: { width: "100%", background: color.white, padding: "32px 32px 28px", border: `1px solid ${color.line}` },
  authTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 24, fontWeight: 600, margin: "6px 0 8px" },
  authSub: { fontSize: 13.5, color: color.inkSoft, lineHeight: 1.55, marginBottom: 22 },
  authFoot: { fontSize: 13, color: color.inkSoft, marginTop: 18, textAlign: "center" },
  inlineLink: { background: "none", border: "none", color: color.rust, fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 13 },
  linkBtn: { display: "block", background: "none", border: "none", color: color.rust, fontSize: 13, cursor: "pointer", padding: 0, marginTop: 4, textAlign: "center", width: "100%" },
  pwWrap: { display: "flex", alignItems: "center", border: `1px solid ${color.line}`, background: color.white, padding: "10px 12px" },
  pwToggle: { background: "none", border: "none", cursor: "pointer", color: color.inkSoft, display: "flex" },
  methodRow: { display: "flex", gap: 10 },
  methodBtn: { flex: 1, border: `1px solid ${color.line}`, background: color.white, padding: "10px 12px", fontSize: 13.5, cursor: "pointer" },
  methodBtnActive: { borderColor: color.graphite, background: color.graphite, color: color.white },
  errorText: { color: color.rust, fontSize: 12.5, marginBottom: 12 },
  verifyIcon: { color: color.amber, marginBottom: 6 },
  codeInput: { width: "100%", border: `1px solid ${color.line}`, background: color.white, padding: "14px 12px", fontSize: 24, letterSpacing: 10, textAlign: "center", fontFamily: "monospace", outline: "none", boxSizing: "border-box" },

  // Tracking
  trackingWrap: { maxWidth: 640, margin: "0 auto", padding: "28px 20px 80px" },
  timeline: { marginBottom: 32 },
  timelineRow: { display: "flex", gap: 16 },
  timelineLeft: { display: "flex", flexDirection: "column", alignItems: "center" },
  timelineDot: { width: 36, height: 36, borderRadius: "50%", border: `1px solid ${color.line}`, background: color.white, color: color.inkSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  timelineDotDone: { background: color.amber, borderColor: color.amber, color: color.graphite },
  timelineLine: { width: 2, flex: 1, minHeight: 28, background: color.line },
  timelineLineDone: { background: color.amber },
  timelineContent: { paddingBottom: 22, paddingTop: 6 },
  timelineLabel: { fontSize: 14.5, color: color.inkSoft, fontWeight: 500 },
  timelineLabelCurrent: { color: color.ink, fontWeight: 600 },
  timelineSub: { fontSize: 12, color: color.rust, marginTop: 3 },
  receivedBox: { display: "flex", alignItems: "center", gap: 10, background: color.concreteDark, border: `1px solid ${color.line}`, padding: "14px 16px", fontSize: 14, color: color.ink },
  demoBtn: { background: "transparent", color: color.inkSoft, border: `1px dashed ${color.line}`, padding: "11px 18px", fontSize: 13, cursor: "pointer" },
  demoNote: { background: color.concreteDark, border: `1px dashed ${color.line}`, padding: 14, fontSize: 12.5, color: color.inkSoft, marginTop: 4 },

  // Notifications
  notifRow: { display: "flex", gap: 10, alignItems: "flex-start", borderBottom: `1px solid ${color.concreteDark}`, paddingBottom: 14 },
  notifText: { fontSize: 13.5, color: color.ink, lineHeight: 1.5, marginBottom: 3 },
  notifTime: { fontSize: 11.5, color: color.inkSoft },

  // Orders list
  ordersWrap: { maxWidth: 760, margin: "0 auto", padding: "28px 20px 80px" },
  ordersEmpty: { background: color.white, border: `1px solid ${color.line}`, padding: 40, textAlign: "center", color: color.inkSoft },
  ordersList: { display: "flex", flexDirection: "column", gap: 16 },
  orderCard: { background: color.white, border: `1px solid ${color.line}`, padding: 20 },
  orderCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  orderCardRef: { fontFamily: "monospace", fontSize: 13, color: color.rust, marginBottom: 4 },
  orderCardDate: { fontSize: 12, color: color.inkSoft },
  orderStatusBadge: { fontSize: 12, fontWeight: 600, color: color.graphite, background: color.concreteDark, padding: "5px 10px", whiteSpace: "nowrap" },
  orderStatusBadgeDone: { background: color.amber },
  orderCardItems: { display: "flex", flexDirection: "column", gap: 3, borderTop: `1px solid ${color.concreteDark}`, borderBottom: `1px solid ${color.concreteDark}`, padding: "10px 0", marginBottom: 12 },
  orderCardItemLine: { fontSize: 13, color: color.inkSoft },
  orderCardFoot: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  orderCardTotal: { fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600 },
  btnDarkSmall: { background: color.graphite, color: color.white, border: "none", padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  orderReceivedTag: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: color.rust, fontWeight: 600 },
  orderCardCancelled: { opacity: 0.55 },
  orderStatusBadgeCancelled: { background: "transparent", border: `1px solid ${color.line}`, color: color.inkSoft },
  orderCancelledTag: { fontSize: 12.5, color: color.inkSoft, fontStyle: "italic" },
  orderCardEditRow: { display: "flex", gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${color.concreteDark}` },
  refundNote: { fontSize: 12, color: color.rust, background: color.concreteDark, padding: "8px 10px", marginBottom: 12 },
  linkBtnSmall: { background: "none", border: "none", color: color.ink, fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" },

  // Account page
  accountWrap: { maxWidth: 560, margin: "0 auto", padding: "28px 20px 80px" },
  avatarRow: { display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 28 },
  avatarCircle: { width: 80, height: 80, borderRadius: "50%", background: color.concreteDark, border: `1px solid ${color.line}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarInitials: { fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 600, color: color.inkSoft },
  avatarNote: { fontSize: 11.5, color: color.inkSoft, marginTop: 8, maxWidth: 280, lineHeight: 1.5 },
  avatarBtn: { width: 40, height: 40, border: `1px solid #4A5158`, background: "none", color: color.white, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", padding: 0 },
  avatarBtnImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarBtnInitials: { fontSize: 11.5, fontWeight: 600, color: color.white },

  // Footer links (public landing footer)
  footerLink: { display: "block", background: "none", border: "none", color: "#9A968A", fontSize: 13, lineHeight: 1.9, cursor: "pointer", padding: 0, textAlign: "left" },

  // Shop footer (persistent, post-login)
  shopFooter: { background: color.graphite, borderTop: `1px solid #3A4046`, padding: "18px 20px", marginTop: 40 },
  shopFooterInner: { maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 },
  footerMini: { fontSize: 12, color: "#75716A" },
  shopFooterLinks: { display: "flex", gap: 20, flexWrap: "wrap" },
  footerMiniLink: { background: "none", border: "none", color: "#9A968A", fontSize: 12, cursor: "pointer", padding: 0 },

  // Legal & support pages
  legalPage: { background: color.concrete, minHeight: "100vh" },
  legalWrap: { maxWidth: 720, margin: "0 auto", padding: "28px 20px 80px" },
  legalTabs: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  legalTabBtn: { fontSize: 12.5, fontWeight: 500, padding: "8px 14px", background: color.white, border: `1px solid ${color.line}`, color: color.inkSoft, cursor: "pointer" },
  legalTabBtnActive: { background: color.graphite, borderColor: color.graphite, color: color.white },
  legalSection: { marginBottom: 20 },
  legalSectionTitle: { fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 600, margin: "0 0 6px" },
  legalSectionText: { fontSize: 13.5, color: color.inkSoft, lineHeight: 1.6, margin: 0 },
  legalDisclaimer: { fontSize: 11.5, color: color.inkSoft, fontStyle: "italic", marginTop: 28, paddingTop: 16, borderTop: `1px solid ${color.concreteDark}` },

  contactStrip: { display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 32 },
  contactCard: { flex: "1 1 180px", display: "flex", gap: 10, alignItems: "flex-start", background: color.white, border: `1px solid ${color.line}`, padding: 14, color: color.rust },
  contactLabel: { fontSize: 11, color: color.inkSoft, marginBottom: 2 },
  contactValue: { fontSize: 13, color: color.ink, fontWeight: 500 },

  faqList: { marginBottom: 8 },
  faqItem: { borderBottom: `1px solid ${color.concreteDark}` },
  faqQuestion: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "14px 0", fontSize: 14, fontWeight: 500, color: color.ink, cursor: "pointer", textAlign: "left" },
  faqAnswer: { fontSize: 13.5, color: color.inkSoft, lineHeight: 1.6, margin: "0 0 16px" },
};