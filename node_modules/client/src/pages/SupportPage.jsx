import { useState } from "react";
import { ChevronLeft, Phone, Mail, MapPin } from "lucide-react";
import { styles, color, FAQ_ITEMS } from "divindus-shared";
import { apiFetch, authHeader } from "divindus-shared";
export default function SupportPage({ onBack }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ sujet: "", message: "" });
const [sent, setSent] = useState(false);
const [error, setError] = useState("");
const [sending, setSending] = useState(false);
const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

const submit = async () => {
  if (!form.sujet || !form.message) {
    setError("Merci de remplir le sujet et le message.");
    return;
  }
  setError("");
  setSending(true);
  try {
    await apiFetch("/messages", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(form),
    });
    setSent(true);
  } catch (err) {
    setError(err.message);
  } finally {
    setSending(false);
  }
};
  return (
    <div style={styles.legalPage}>
      <div style={styles.legalWrap}>
        <button style={styles.backBtn} onClick={onBack}><ChevronLeft size={16} /> Retour</button>
        <h2 style={styles.sectionTitle}>Aide et contact</h2>
        <p style={{ fontSize: 13.5, color: color.inkSoft, marginBottom: 28 }}>
          Une question sur une commande, un paiement ou une livraison ? Consultez les questions fréquentes ci-dessous ou écrivez-nous directement.
        </p>

        <div style={styles.contactStrip}>
          <div style={styles.contactCard}><Phone size={16} /><div><div style={styles.contactLabel}>Téléphone</div><div style={styles.contactValue}>+213 (0)21 00 00 00</div></div></div>
          <div style={styles.contactCard}><Mail size={16} /><div><div style={styles.contactLabel}>Email</div><div style={styles.contactValue}>support@divindus.dz</div></div></div>
          <div style={styles.contactCard}><MapPin size={16} /><div><div style={styles.contactLabel}>Adresse</div><div style={styles.contactValue}>Oued Roumane, Alger</div></div></div>
        </div>

        <h3 style={styles.legalSectionTitle}>Questions fréquentes</h3>
        <div style={styles.faqList}>
          {FAQ_ITEMS.map((f, i) => (
            <div key={i} style={styles.faqItem}>
              <button style={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <p style={styles.faqAnswer}>{f.a}</p>}
            </div>
          ))}
        </div>

        <h3 style={{ ...styles.legalSectionTitle, marginTop: 32 }}>Nous écrire</h3>
        {sent ? (
          <div style={styles.demoNote}>Votre message a été envoyé. Notre équipe vous répondra sous peu.</div>
        ) : (
          <>
            <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Sujet</div><input style={styles.input} value={form.sujet} onChange={set("sujet")} placeholder="Ex : Question sur ma commande DVX-..." /></div>
            <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Message</div><textarea style={styles.textarea} value={form.message} onChange={set("message")} /></div>
             { error && <p style={styles.errorText}>{error}</p>}
              <button style={{ ...styles.primaryBtn, opacity: sending ? 0.6 : 1 }} onClick={submit} disabled={sending}>
              {sending ? "Envoi…" : "Envoyer"}
             </button>
          </>
        )}
      </div>
    </div>
  );
}
