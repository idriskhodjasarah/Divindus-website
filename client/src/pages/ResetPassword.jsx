import { useState } from "react";
import { ShieldCheck, Check, Lock, Eye, EyeOff } from "lucide-react";
import { styles, AuthShell, AuthField, apiFetch } from "divindus-shared";

export default function ResetPassword({ accessToken, onDone }) {
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!password || password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ access_token: accessToken, password }),
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell onBack={onDone}>
      {!done ? (
        <>
          <div style={styles.verifyIcon}><ShieldCheck size={24} /></div>
          <h2 style={styles.authTitle}>Nouveau mot de passe</h2>
          <p style={styles.authSub}>
            Ce lien vous a été envoyé par email et n'est valable qu'une seule
            fois. Choisissez un nouveau mot de passe pour votre compte.
          </p>

          <AuthField icon={<Lock size={16} />} label="Nouveau mot de passe">
            <div style={styles.pwWrap}>
              <input
                style={{ ...styles.input, border: "none", padding: 0, flex: 1 }}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button style={styles.pwToggle} onClick={() => setShowPw((v) => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </AuthField>

          <AuthField icon={<Lock size={16} />} label="Confirmer le mot de passe">
            <input
              style={styles.input}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </AuthField>

          {error && <p style={styles.errorText}>{error}</p>}

          <button
            style={{ ...styles.primaryBtn, width: "100%", marginTop: 8, opacity: loading ? 0.6 : 1 }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Enregistrement…" : "Réinitialiser le mot de passe"}
          </button>
        </>
      ) : (
        <>
          <div style={styles.verifyIcon}><Check size={24} /></div>
          <h2 style={styles.authTitle}>Mot de passe mis à jour</h2>
          <p style={styles.authSub}>
            Votre mot de passe a été modifié avec succès. Vous pouvez maintenant
            vous connecter avec vos nouveaux identifiants.
          </p>
          <button style={{ ...styles.primaryBtn, width: "100%" }} onClick={onDone}>
            Se connecter
          </button>
        </>
      )}
    </AuthShell>
  );
}