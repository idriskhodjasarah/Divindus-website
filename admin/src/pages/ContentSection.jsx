import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { styles, color, apiFetch, authHeader } from "divindus-shared";

export default function ContentSection() {
  const [tab, setTab] = useState("hero");
  const [slides, setSlides] = useState([]);
  const [footer, setFooter] = useState({ adresse: "", telephone: "", email: "" });
  const [legal, setLegal] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/content")
      .then(({ content }) => {
        setSlides(content.hero_slides || []);
        setFooter(content.footer || { adresse: "", telephone: "", email: "" });
        setLegal(content.legal || {});
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setError("");
    setSaving(true);
    try {
      await apiFetch("/content", {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ hero_slides: slides, footer, legal }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSlide = (i, key, value) => setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  const addSlide = () => setSlides((prev) => [...prev, { tag: "", title: "", desc: "" }]);
  const removeSlide = (i) => setSlides((prev) => prev.filter((_, idx) => idx !== i));

  if (loading) {
    return <p style={styles.emptyState}>Chargement du contenu…</p>;
  }

  return (
    <div>
      <h1 style={styles.pageTitle}>Contenu du site</h1>
      <p style={styles.demoNoteInline}>
        Ces modifications sont enregistrées dans la base de données et
        s'appliquent immédiatement sur le site client et l'espace admin.
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
        </div>
      )}

      {tab === "legal" && (
        <div>
          {Object.entries(legal).map(([key, page]) => (
            <div key={key} style={styles.contentBlock}>
              <div style={styles.subHead}>{page.title}</div>
              {page.sections.map((s, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={styles.fieldGroup}>
                    <div style={styles.fieldLabel}>Titre de la section</div>
                    <input
                      style={styles.input}
                      value={s.h}
                      onChange={(e) =>
                        setLegal((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], sections: prev[key].sections.map((sec, idx) => (idx === i ? { ...sec, h: e.target.value } : sec)) },
                        }))
                      }
                    />
                  </div>
                  <textarea
                    style={styles.textarea}
                    value={s.p}
                    onChange={(e) =>
                      setLegal((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], sections: prev[key].sections.map((sec, idx) => (idx === i ? { ...sec, p: e.target.value } : sec)) },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: color.rust, fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
      <button style={{ ...styles.primaryBtn, opacity: saving ? 0.6 : 1 }} onClick={save} disabled={saving}>
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
      {saved && <p style={styles.savedNote}>Modifications enregistrées.</p>}
    </div>
  );
}