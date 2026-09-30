import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Camera, User, Phone, Mail, MapPin } from "lucide-react";
import { styles, color, AuthField, apiFetch, authHeader } from "divindus-shared";

export default function Account({ profile, onSave, onBack }) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setSaved(false); };

  // The email/telephone/adresse passed in via "profile" come from login/registration
  // and can be a little stale — refresh from the real database once on load.
  useEffect(() => {
    apiFetch("/auth/me", { headers: authHeader() })
      .then(({ profile: fresh }) => setForm((f) => ({ ...f, ...fresh })))
      .catch(() => {});
  }, []);

  const initials = ((form.prenom?.[0] || "") + (form.nom?.[0] || "")).toUpperCase() || "?";

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, photo: reader.result }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setError("");
    setSaving(true);
    try {
      const { profile: updated } = await apiFetch("/auth/profile", {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ prenom: form.prenom, nom: form.nom, telephone: form.telephone, adresse: form.adresse, photo: form.photo }),
      });
      onSave(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={styles.accountWrap}>
      <button style={styles.backBtn} onClick={onBack}><ChevronLeft size={16} /> Retour au catalogue</button>
      <h2 style={styles.sectionTitle}>Mon compte</h2>
      <p style={{ fontSize: 13.5, color: color.inkSoft, marginBottom: 24 }}>
        Ces informations peuvent être pré-remplies automatiquement lors de vos prochaines commandes.
      </p>

      <div style={styles.avatarRow}>
        <div style={styles.avatarCircle}>
          {form.photo ? (
            <img src={form.photo} alt="Photo de profil" style={styles.avatarImg} />
          ) : (
            <span style={styles.avatarInitials}>{initials}</span>
          )}
        </div>
        <div>
          <button style={styles.secondaryBtn} onClick={() => fileInputRef.current?.click()}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Camera size={15} /> {form.photo ? "Changer la photo" : "Ajouter une photo"}
            </span>
          </button>
          {form.photo && (
            <button style={styles.linkBtnSmall} onClick={() => setForm((f) => ({ ...f, photo: null }))}>
              Supprimer la photo
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
          <p style={styles.avatarNote}>
            Visible uniquement par le livreur, pour vous identifier lors de la remise de votre colis.
          </p>
        </div>
      </div>

      <div className="field-row" style={styles.fieldRow}>
        <AuthField icon={<User size={16} />} label="Prénom">
          <input style={styles.input} value={form.prenom || ""} onChange={set("prenom")} />
        </AuthField>
        <AuthField icon={<User size={16} />} label="Nom">
          <input style={styles.input} value={form.nom || ""} onChange={set("nom")} />
        </AuthField>
      </div>

      <div className="field-row" style={styles.fieldRow}>
        <AuthField icon={<Phone size={16} />} label="Téléphone">
          <input style={styles.input} value={form.telephone || ""} onChange={set("telephone")} />
        </AuthField>
        <AuthField icon={<Mail size={16} />} label="Adresse email">
          <input style={styles.input} type="email" value={form.email || ""} disabled />
        </AuthField>
      </div>

      <AuthField icon={<MapPin size={16} />} label="Adresse par défaut">
        <input style={styles.input} value={form.adresse || ""} onChange={set("adresse")} />
      </AuthField>

      {error && <p style={styles.errorText}>{error}</p>}
      {saved && <p style={{ fontSize: 12.5, color: color.rust, marginBottom: 12 }}>Informations enregistrées.</p>}

      <button style={{ ...styles.primaryBtn, opacity: saving ? 0.6 : 1 }} onClick={save} disabled={saving}>
        {saving ? "Enregistrement…" : "Enregistrer les modifications"}
      </button>
    </main>
  );
}