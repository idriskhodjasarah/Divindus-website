import { styles } from "../styles/styles";

export default function ShopFooter({ onOpenLegal, onOpenSupport }) {
  return (
    <footer style={styles.shopFooter}>
      <div style={styles.shopFooterInner} className="footer-grid">
        <span style={styles.footerMini}>© 2026 DIVINDUS</span>
        <div style={styles.shopFooterLinks}>
          <button style={styles.footerMiniLink} onClick={() => onOpenLegal("cgv")}>CGV</button>
          <button style={styles.footerMiniLink} onClick={() => onOpenLegal("mentions")}>Mentions légales</button>
          <button style={styles.footerMiniLink} onClick={() => onOpenLegal("confidentialite")}>Confidentialité</button>
          <button style={styles.footerMiniLink} onClick={onOpenSupport}>Aide et contact</button>
        </div>
      </div>
    </footer>
  );
}
