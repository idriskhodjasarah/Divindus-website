import { useState, useEffect } from "react";
import { styles } from "../styles/styles";
import { apiFetch } from "../api";

export default function Footer({ onOpenLegal, onOpenSupport }) {
  const [contact, setContact] = useState({
    adresse: "Pavillon 12, Résidence la Butte des deux Bassins, Oued Roumane, Alger",
    telephone: "+213 (0)21 00 00 00",
    email: "contact@divindus.dz",
  });

  useEffect(() => {
    apiFetch("/content")
      .then(({ content }) => {
        if (content.footer) setContact(content.footer);
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="contact" style={styles.footer}>
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
          <p style={styles.footerText}>{contact.adresse}</p>
          <p style={styles.footerText}>{contact.telephone}</p>
          <p style={styles.footerText}>{contact.email}</p>
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