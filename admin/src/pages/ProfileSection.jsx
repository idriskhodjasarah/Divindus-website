import { useState } from "react";
import { styles, color } from "../styles/styles";
import { ADMIN_PROFILE_SEED } from "../data/data";

export default function ProfileSection() {
  const [form, setForm] = useState(ADMIN_PROFILE_SEED);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const savePassword = () => {
    if (!pw.current || !pw.next) { setPwError("Merci de remplir tous les champs."); return; }
    if (pw.next !== pw.confirm) { setPwError("Les mots de passe ne correspondent pas."); return; }
    setPwError("");
    setPw({ current: "", next: "", confirm: "" });
    setSaved(true);
  };

  return (
    <div style={styles.profileWrapAdmin}>
      <h1 style={styles.pageTitle}>Mon profil</h1>

      <div style={styles.contentBlock}>
        <div style={styles.subHead}>Informations</div>
        <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Nom</div><input style={styles.input} value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} /></div>
        <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Email</div><input style={styles.input} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
        <button style={styles.primaryBtn} onClick={() => setSaved(true)}>Enregistrer</button>
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
      </div>

      {saved && <p style={styles.savedNote}>Modifications enregistrées.</p>}
    </div>
  );
}
