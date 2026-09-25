import { useState } from "react";
import { Plus } from "lucide-react";
import { styles } from "../styles/styles";
import { HERO_SLIDES_SEED, FOOTER_CONTENT_SEED, LEGAL_CONTENT_SEED } from "../data/data";

export default function ContentSection() {
  const [tab, setTab] = useState("hero");
  const [slides, setSlides] = useState(HERO_SLIDES_SEED);
  const [footer, setFooter] = useState(FOOTER_CONTENT_SEED);
  const [legal, setLegal] = useState(LEGAL_CONTENT_SEED);
  const [saved, setSaved] = useState(false);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const updateSlide = (i, key, value) => setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  const addSlide = () => setSlides((prev) => [...prev, { tag: "", title: "", desc: "" }]);
  const removeSlide = (i) => setSlides((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div>
      <h1 style={styles.pageTitle}>Contenu du site</h1>
      <p style={styles.demoNoteInline}>
        Aperçu démo — ces modifications ne sont pas connectées au site client dans ce prototype ; en production, les deux liraient le même contenu.
      </p>

      <div style={styles.legalTabs}>
        <button style={{ ...styles.filterChip, ...(tab === "hero" ? styles.filterChipActive : {}) }} onClick={() => setTab("hero")}>Page d'accueil</button>
        <button style={{ ...styles.filterChip, ...(tab === "footer" ? styles.filterChipActive : {}) }} onClick={() => setTab("footer")}>Coordonnées</button>
        <button style={{ ...styles.filterChip, ...(tab === "legal" ? styles.filterChipActive : {}) }} onClick={() => setTab("legal")}>Pages légales</button>
      </div>

      {tab === "hero" && (
        <div>
          {slides.map((s, i) => (
            <div key={i} style={styles.contentBlock}>
              <div style={styles.slideBlockHead}>
                <div style={styles.subHead}>Diapositive {i + 1}</div>
                {slides.length > 1 && (
                  <button style={styles.linkBtnSmall} onClick={() => removeSlide(i)}>Supprimer</button>
                )}
              </div>
              <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Filiale mise en avant</div><input style={styles.input} value={s.tag} onChange={(e) => updateSlide(i, "tag", e.target.value)} /></div>
              <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Titre</div><input style={styles.input} value={s.title} onChange={(e) => updateSlide(i, "title", e.target.value)} /></div>
              <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Description</div><textarea style={styles.textarea} value={s.desc} onChange={(e) => updateSlide(i, "desc", e.target.value)} /></div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.secondaryBtnSmall} onClick={addSlide}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> Ajouter une diapositive</span>
            </button>
            <button style={styles.primaryBtn} onClick={flash}>Enregistrer</button>
          </div>
        </div>
      )}

      {tab === "footer" && (
        <div style={styles.contentBlock}>
          <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Adresse</div><input style={styles.input} value={footer.adresse} onChange={(e) => setFooter((f) => ({ ...f, adresse: e.target.value }))} /></div>
          <div className="field-row" style={styles.fieldRow}>
            <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Téléphone</div><input style={styles.input} value={footer.telephone} onChange={(e) => setFooter((f) => ({ ...f, telephone: e.target.value }))} /></div>
            <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Email</div><input style={styles.input} value={footer.email} onChange={(e) => setFooter((f) => ({ ...f, email: e.target.value }))} /></div>
          </div>
          <button style={styles.primaryBtn} onClick={flash}>Enregistrer</button>
        </div>
      )}

      {tab === "legal" && (
        <div>
          {Object.entries(legal).map(([key, page]) => (
            <div key={key} style={styles.contentBlock}>
              <div style={styles.subHead}>{page.title}</div>
              <textarea
                style={{ ...styles.textarea, minHeight: 140 }}
                value={page.body}
                onChange={(e) => setLegal((prev) => ({ ...prev, [key]: { ...prev[key], body: e.target.value } }))}
              />
            </div>
          ))}
          <button style={styles.primaryBtn} onClick={flash}>Enregistrer</button>
        </div>
      )}

      {saved && <p style={styles.savedNote}>Modifications enregistrées.</p>}
    </div>
  );
}
