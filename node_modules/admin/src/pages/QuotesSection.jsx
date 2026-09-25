import { useState } from "react";
import { styles } from "../styles/styles";
import { fmt, dateFmt } from "../data/data";

export default function QuotesSection({ quotes, onAnswer }) {
  const [expanded, setExpanded] = useState(null);
  const pending = quotes.filter((q) => q.status === "nouveau");
  const answered = quotes.filter((q) => q.status === "répondu");

  return (
    <div>
      <h1 style={styles.pageTitle}>Devis ({pending.length} en attente)</h1>

      <h3 style={styles.subHead}>Nouvelles demandes ({pending.length})</h3>
      <div style={styles.ordersList}>
        {pending.length === 0 && <p style={styles.emptyState}>Aucune demande de devis en attente.</p>}
        {pending.map((q) => (
          <QuoteRow key={q.id} quote={q} isOpen={expanded === q.id} onToggle={() => setExpanded(expanded === q.id ? null : q.id)} onAnswer={onAnswer} />
        ))}
      </div>

      <h3 style={{ ...styles.subHead, marginTop: 32 }}>Devis envoyés ({answered.length})</h3>
      <div style={styles.ordersList}>
        {answered.map((q) => (
          <QuoteRow key={q.id} quote={q} isOpen={expanded === q.id} onToggle={() => setExpanded(expanded === q.id ? null : q.id)} onAnswer={onAnswer} />
        ))}
      </div>
    </div>
  );
}

function QuoteRow({ quote, isOpen, onToggle, onAnswer }) {
  const [prix, setPrix] = useState(quote.reponsePrix || "");
  const [message, setMessage] = useState(quote.reponseMessage || "");

  return (
    <div style={styles.orderRow}>
      <button style={styles.orderRowHead} onClick={onToggle}>
        <div style={styles.orderRowMain}>
          <span style={styles.orderClient}>{quote.client}</span>
          <span style={styles.orderRef}>{quote.produit}</span>
        </div>
        <span style={styles.orderDate}>{dateFmt(quote.date)}</span>
        <span style={{ ...styles.statusPill, ...(quote.status === "répondu" ? styles.statusPillDone : {}) }}>
          {quote.status === "répondu" ? "Répondu" : "Nouveau"}
        </span>
      </button>

      {isOpen && (
        <div style={styles.orderDetail}>
          <div style={styles.orderDetailGrid}>
            <div>
              <div style={styles.detailLabel}>Client</div>
              <div style={styles.detailValue}>{quote.client}</div>
              <div style={styles.detailValue}>{quote.email}</div>
              <div style={styles.detailValue}>{quote.telephone}</div>
            </div>
            <div>
              <div style={styles.detailLabel}>Demande</div>
              <div style={styles.detailValue}>{quote.details}</div>
            </div>
          </div>

          {quote.status === "répondu" ? (
            <div style={styles.statusNote}>
              Réponse envoyée : <strong>{fmt(quote.reponsePrix)}</strong> — {quote.reponseMessage}
            </div>
          ) : (
            <>
              <div className="field-row" style={styles.fieldRow}>
                <div style={styles.fieldGroup}>
                  <div style={styles.fieldLabel}>Prix proposé (DA)</div>
                  <input style={styles.input} type="number" value={prix} onChange={(e) => setPrix(e.target.value)} />
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <div style={styles.fieldLabel}>Message au client</div>
                <textarea style={styles.textarea} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Détails du devis, délai, conditions…" />
              </div>
              <button style={styles.primaryBtn} disabled={!prix || !message} onClick={() => onAnswer(quote.id, Number(prix), message)}>
                Envoyer la réponse
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
