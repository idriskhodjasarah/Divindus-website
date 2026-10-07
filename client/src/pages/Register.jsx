import { useState } from "react";
import { User, Phone, Mail, MapPin, Lock } from "lucide-react";
import { styles } from "divindus-shared";
import { AuthShell, AuthField } from "divindus-shared";
import { apiFetch } from "divindus-shared"
import { isValidPhone, isValidAddress, PHONE_ERROR, ADDRESS_ERROR } from "divindus-shared";
export default function Register({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const isValid =
    form.prenom && form.nom && form.telephone && form.email && form.adresse && form.password;

  const submit = async () => {
    if (!isValid) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    if (!isValidPhone(form.telephone)) {
  setError(PHONE_ERROR);
  return;
}
if (!isValidAddress(form.adresse)) {
  setError(ADDRESS_ERROR);
  return;
}
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          prenom: form.prenom,
          nom: form.nom,
          telephone: form.telephone,
          adresse: form.adresse,
        }),
      });
      onSubmit({
        contact: form.email,
        profile: {
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          adresse: form.adresse,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell onBack={onBack} wide>
      <h2 style={styles.authTitle}>Créer un compte</h2>
      <p style={styles.authSub}>
        Renseignez vos informations pour commander sur la plateforme DIVINDUS.
      </p>

      <div className="field-row" style={styles.fieldRow}>
        <AuthField icon={<User size={16} />} label="Prénom">
          <input style={styles.input} value={form.prenom} onChange={set("prenom")} />
        </AuthField>
        <AuthField icon={<User size={16} />} label="Nom">
          <input style={styles.input} value={form.nom} onChange={set("nom")} />
        </AuthField>
      </div>

      <div className="field-row" style={styles.fieldRow}>
        <AuthField icon={<Phone size={16} />} label="Téléphone">
          <input style={styles.input} value={form.telephone} onChange={set("telephone")} placeholder="0X XX XX XX XX" />
        </AuthField>
        <AuthField icon={<Mail size={16} />} label="Adresse email">
          <input style={styles.input} type="email" value={form.email} onChange={set("email")} />
        </AuthField>
      </div>

      <AuthField icon={<MapPin size={16} />} label="Adresse">
        <input style={styles.input} value={form.adresse} onChange={set("adresse")} placeholder="Adresse, wilaya" />
      </AuthField>

      <div className="field-row" style={styles.fieldRow}>
        <AuthField icon={<Lock size={16} />} label="Mot de passe">
          <input style={styles.input} type="password" value={form.password} onChange={set("password")} />
        </AuthField>
        <AuthField icon={<Lock size={16} />} label="Confirmer le mot de passe">
          <input style={styles.input} type="password" value={form.confirm} onChange={set("confirm")} />
        </AuthField>
      </div>

      <p style={{ fontSize: 12, color: "#5B5749", marginBottom: 14 }}>
        Un code de vérification à 8 chiffres vous sera envoyé par email.
      </p>

      {error && <p style={styles.errorText}>{error}</p>}

      <button
        style={{ ...styles.primaryBtn, width: "100%", marginTop: 8, opacity: loading ? 0.6 : 1 }}
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Création du compte…" : "Créer mon compte"}
      </button>

      <p style={styles.authFoot}>
        Déjà un compte ?{" "}
        <button style={styles.inlineLink} onClick={onBack}>
          Se connecter
        </button>
      </p>
    </AuthShell>
  );
}
