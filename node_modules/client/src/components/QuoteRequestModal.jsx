import { useState } from "react";
import { X } from "lucide-react";
import { styles, color, apiFetch, authHeader } from "divindus-shared";

export default function QuoteRequestModal({ product, onClose }) {
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!details.trim()) {
      setError("Merci de décrire votre besoin.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await apiFetch("/quotes", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ produit: product.name, product_id: product.id, details }),       });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.drawerOverlay} onClick={onClose}>
      <div style={{ ...styles.drawer, width: 420 }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.drawerHead}>
          <h2 style={styles.drawerTitle}>Demander un devis</h2>
          <button style={styles.iconBtn} onClick={onClose}><X size={20} /></button>
        </div>

        {!sent ? (
          <>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13.5, color: color.inkSoft, marginBottom: 16 }}>
                {product.name} — décrivez votre projet, un chargé d'affaires vous répondra avec un prix.
              </p>
              <textarea
                style={{ ...styles.textarea, minHeight: 160 }}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ex : dimensions souhaitées, délai, wilaya…"
              />
              {error && <p style={styles.errorText}>{error}</p>}
            </div>

            <div style={styles.drawerFoot}>
              <button
                style={{ ...styles.primaryBtn, width: "100%", opacity: sending ? 0.6 : 1 }}
                onClick={submit}
                disabled={sending}
              >
                {sending ? "Envoi…" : "Envoyer la demande"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: color.ink }}>
                Votre demande a été envoyée. Vous serez recontacté par email ou téléphone avec un prix.
              </p>
            </div>

            <div style={styles.drawerFoot}>
              <button style={{ ...styles.primaryBtn, width: "100%" }} onClick={onClose}>
                Fermer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}