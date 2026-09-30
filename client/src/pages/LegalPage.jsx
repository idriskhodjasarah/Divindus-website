import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { styles, LEGAL_CONTENT, apiFetch } from "divindus-shared";

export default function LegalPage({ tab, setTab, onBack }) {
  const [legal, setLegal] = useState(LEGAL_CONTENT); // static fallback until the real content loads

  useEffect(() => {
    apiFetch("/content")
      .then(({ content }) => {
        if (content.legal && Object.keys(content.legal).length > 0) setLegal(content.legal);
      })
      .catch(() => {});
  }, []);

  const content = legal[tab];

  return (
    <div style={styles.legalPage}>
      <div style={styles.legalWrap}>
        <button style={styles.backBtn} onClick={onBack}><ChevronLeft size={16} /> Retour</button>

        <div style={styles.legalTabs}>
          {Object.entries(legal).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{ ...styles.legalTabBtn, ...(tab === key ? styles.legalTabBtnActive : {}) }}
            >
              {val.title}
            </button>
          ))}
        </div>

        <h2 style={styles.sectionTitle}>{content.title}</h2>
        {content.sections.map((s, i) => (
          <div key={i} style={styles.legalSection}>
            <h3 style={styles.legalSectionTitle}>{s.h}</h3>
            <p style={styles.legalSectionText}>{s.p}</p>
          </div>
        ))}
        <p style={styles.legalDisclaimer}>
          Contenu de démonstration à faire valider par le service juridique de DIVINDUS avant toute mise en production.
        </p>
      </div>
    </div>
  );
}