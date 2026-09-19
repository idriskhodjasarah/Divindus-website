import { styles } from "../styles/styles";

export default function Footer({ onOpenLegal, onOpenSupport }) {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner} className="footer-grid">
        <div>
          <div style={styles.logoText}>DIVINDUS</div>
          <p style={styles.footerText}>
            Groupe des Industries Locales — 14 filiales industrielles présentes
            dans 43 wilayas.
          </p>
        </div>
        <div>
          <div style={styles.footerColTitle}>Contact</div>
          <p style={styles.footerText}>
            Pavillon 12, Résidence la Butte des deux Bassins, Oued Roumane, Alger
          </p>
          <p style={styles.footerText}>+213 (0)21 00 00 00</p>
          <p style={styles.footerText}>contact@divindus.dz</p>
          <button style={styles.footerLink} onClick={onOpenSupport}>Aide et contact</button>
        </div>
        <div>
          <div style={styles.footerColTitle}>Légal</div>
          <button style={styles.footerLink} onClick={() => onOpenLegal("cgv")}>Conditions générales de vente</button>
          <button style={styles.footerLink} onClick={() => onOpenLegal("mentions")}>Mentions légales</button>
          <button style={styles.footerLink} onClick={() => onOpenLegal("confidentialite")}>Confidentialité</button>
        </div>
      </div>
      <div style={styles.footerBottom}>© 2026 DIVINDUS. Tous droits réservés.</div>
    </footer>
  );
}
