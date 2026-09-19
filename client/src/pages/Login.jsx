import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { styles } from "../styles/styles";
import { AuthShell, AuthField } from "../components/AuthShell";

export default function Login({ onLogin, onRegister, onBack, onOpenResetDemo }) {
  const [showPw, setShowPw] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell onBack={onBack}>
      {!forgot ? (
        <>
          <h2 style={styles.authTitle}>Se connecter</h2>
          <p style={styles.authSub}>Accédez à votre espace de commande DIVINDUS.</p>

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
              />
              <button style={styles.pwToggle} onClick={() => setShowPw((v) => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </AuthField>

          <button style={styles.linkBtn} onClick={() => setForgot(true)}>
            Mot de passe oublié ?
          </button>

          <button
            style={{ ...styles.primaryBtn, width: "100%", marginTop: 18 }}
            onClick={onLogin}
          >
            Se connecter
          </button>

          <p style={styles.authFoot}>
            Pas encore de compte ?{" "}
            <button style={styles.inlineLink} onClick={onRegister}>
              Créer un compte
            </button>
          </p>
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
                <input style={styles.input} type="email" placeholder="vous@entreprise.dz" />
              </AuthField>
              <button
                style={{ ...styles.primaryBtn, width: "100%", marginTop: 8 }}
                onClick={() => setSent(true)}
              >
                Envoyer le lien
              </button>
            </>
          ) : (
            <>
              <p style={styles.authSub}>
                Un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail.
              </p>
              <div style={styles.demoNote}>
                <p style={{ margin: "0 0 8px" }}>
                  Aperçu démo — dans le vrai produit, ceci se passe par email. Ici, simulez le clic sur le lien reçu :
                </p>
                <button style={styles.demoBtn} onClick={onOpenResetDemo}>
                  Ouvrir le lien reçu par email (démo)
                </button>
              </div>
            </>
          )}
          <button style={styles.linkBtn} onClick={() => { setForgot(false); setSent(false); }}>
            Retour à la connexion
          </button>
        </>
      )}
    </AuthShell>
  );
}
