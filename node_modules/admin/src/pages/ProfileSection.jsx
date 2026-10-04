import { useState, useEffect } from "react";
import { styles, color } from "../styles/styles";
import { apiFetch, authHeader } from "divindus-shared";
export default function ProfileSection() {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "" });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/auth/me", { headers: authHeader() })
      .then(({ profile }) => setForm({ prenom: profile.prenom || "", nom: profile.nom || "", email: profile.email || "" }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setError("");
    setSaved(false);
    try {
      await apiFetch("/auth/profile", {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ prenom: form.prenom, nom: form.nom }),
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const savePassword = async () => {
    if (!pw.current || !pw.next) { setPwError("Merci de remplir tous les champs."); return; }
    if (pw.next !== pw.confirm) { setPwError("Les mots de passe ne correspondent pas."); return; }
    setPwError("");
    setPwSaved(false);
    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      });
      setPw({ current: "", next: "", confirm: "" });
      setPwSaved(true);
    } catch (err) {
      setPwError(err.message);
    }
  };

  if (loading) {
    return <p style={styles.emptyState}>Chargement…</p>;
  }

  return (
    <div style={styles.profileWrapAdmin}>
      <h1 style={styles.pageTitle}>Mon profil</h1>

      <div style={styles.contentBlock}>
        <div style={styles.subHead}>Informations</div>
        <div className="field-row" style={styles.fieldRow}>
          <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Prénom</div><input style={styles.input} value={form.prenom} onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))} /></div>
          <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Nom</div><input style={styles.input} value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} /></div>
        </div>
        <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Email</div><input style={styles.input} type="email" value={form.email} disabled /></div>
        {error && <p style={{ color: color.rust, fontSize: 12.5, marginBottom: 10 }}>{error}</p>}
        <button style={styles.primaryBtn} onClick={saveProfile}>Enregistrer</button>
        {saved && <p style={styles.savedNote}>Informations enregistrées.</p>}
      </div>

      <div style={{ ...styles.contentBlock, marginTop: 24 }}>
        <div style={styles.subHead}>Changer le mot de passe</div>
        <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Mot de passe actuel</div><input style={styles.input} type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} /></div>
        <div className="field-row" style={styles.fieldRow}>
          <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Nouveau mot de passe</div><input style={styles.input} type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} /></div>
          <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Confirmer</div><input style={styles.input} type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} /></div>
        </div>
        {pwError && <p style={{ color: color.rust, fontSize: 12.5, marginBottom: 10 }}>{pwError}</p>}
        <button style={styles.primaryBtn} onClick={savePassword}>Mettre à jour le mot de passe</button>
        {pwSaved && <p style={styles.savedNote}>Mot de passe mis à jour.</p>}
      </div>
    </div>
  );
}