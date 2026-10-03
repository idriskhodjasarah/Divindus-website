import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { styles } from "../styles/styles.js";
import { AuthShell, AuthField } from "../components/AuthShell.jsx";
import { apiFetch } from "../api.js";

export default function Login({ onLogin, onRegister, onBack, onOpenResetDemo, requireAdmin, initialError }) {  const [showPw, setShowPw] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSending, setResetSending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [error, setError] = useState(initialError || "");  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const { session, profile } = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (requireAdmin && !profile.is_admin) {
        setError("Ce compte n'a pas accès à l'espace administration.");
        setLoading(false);
        return;
      }

      localStorage.setItem("divindus_session", JSON.stringify(session));
      localStorage.setItem("divindus_profile", JSON.stringify(profile));
      onLogin(profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell onBack={onBack}>
      {!forgot ? (
        <>
          <h2 style={styles.authTitle}>Se connecter</h2>
          <p style={styles.authSub}>
            {requireAdmin ? "Accédez à l'espace administration DIVINDUS." : "Accédez à votre espace de commande DIVINDUS."}
          </p>

          <AuthField icon={<Mail size={16} />} label="Adresse email">
            <input
              style={styles.input}
              type="email"
              placeholder="vous@entreprise.dz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </AuthField>

          <AuthField icon={<Lock size={16} />} label="Mot de passe">
            <div style={styles.pwWrap}>
              <input
                style={{ ...styles.input, border: "none", padding: 0, flex: 1 }}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <button style={styles.pwToggle} onClick={() => setShowPw((v) => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </AuthField>

          {!requireAdmin && (
            <button style={styles.linkBtn} onClick={() => setForgot(true)}>
              Mot de passe oublié ?
            </button>
          )}

          {error && <p style={styles.errorText}>{error}</p>}

          <button
            style={{ ...styles.primaryBtn, width: "100%", marginTop: 18, opacity: loading ? 0.6 : 1 }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          {!requireAdmin && (
            <p style={styles.authFoot}>
              Pas encore de compte ?{" "}
              <button style={styles.inlineLink} onClick={onRegister}>
                Créer un compte
              </button>
            </p>
          )}
        </>
      ) : (
        <>
          <h2 style={styles.authTitle}>Mot de passe oublié</h2>
          {!sent ? (
            <>
              <p style={styles.authSub}>
                Indiquez votre adresse email : un lien de réinitialisation vous
                sera envoyé.
              </p>
              <AuthField icon={<Mail size={16} />} label="Adresse email">
                <input
                  style={styles.input}
                  type="email"
                  placeholder="vous@entreprise.dz"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </AuthField>
              {error && <p style={styles.errorText}>{error}</p>}
              <button
                style={{ ...styles.primaryBtn, width: "100%", marginTop: 8, opacity: resetSending ? 0.6 : 1 }}
                disabled={resetSending}
                onClick={async () => {
                  setError("");
                  setResetSending(true);
                  try {
                    await apiFetch("/auth/forgot-password", {
                      method: "POST",
                      body: JSON.stringify({ email: resetEmail }),
                    });
                    setSent(true);
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setResetSending(false);
                  }
                }}
              >
                {resetSending ? "Envoi…" : "Envoyer le lien"}
              </button>
            </>
          ) : (
            <p style={styles.authSub}>
              Un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail — le lien vous ramènera directement sur cette page pour choisir un nouveau mot de passe.
            </p>
          )}
          <button style={styles.linkBtn} onClick={() => { setForgot(false); setSent(false); }}>
            Retour à la connexion
          </button>
        </>
      )}
    </AuthShell>
  );
}