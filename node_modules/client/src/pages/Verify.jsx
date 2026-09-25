import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { styles, AuthShell } from "divindus-shared";
import { apiFetch } from "divindus-shared"
export default function Verify({ pending, onVerified, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const contact = pending?.contact || "vos coordonnées";
  const CODE_LENGTH = 8;

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const { session } = await apiFetch("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ email: pending.contact, code }),
      });
      // Store the session so later requests (orders, profile, etc.) can prove who's logged in.
      localStorage.setItem("divindus_session", JSON.stringify(session));
      onVerified();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell onBack={onBack}>
      <div style={styles.verifyIcon}>
        <ShieldCheck size={24} />
      </div>
      <h2 style={styles.authTitle}>Vérification</h2>
      <p style={styles.authSub}>
        Un code à {CODE_LENGTH} chiffres a été envoyé par email à <strong>{contact}</strong>.
      </p>

      <input
        style={{ ...styles.codeInput, letterSpacing: 6, fontSize: 22 }}
        maxLength={CODE_LENGTH}
        placeholder={"—".repeat(CODE_LENGTH)}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))}
      />

      {error && <p style={styles.errorText}>{error}</p>}

      <button
        style={{ ...styles.primaryBtn, width: "100%", marginTop: 18, opacity: code.length === CODE_LENGTH && !loading ? 1 : 0.5 }}
        disabled={code.length !== CODE_LENGTH || loading}
        onClick={submit}
      >
        {loading ? "Vérification…" : "Vérifier et continuer"}
      </button>
    </AuthShell>
  );
}
