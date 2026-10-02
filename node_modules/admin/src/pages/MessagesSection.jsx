import { useState } from "react";
import { styles } from "../styles/styles";
import { dateFmt } from "../data/data";
import { apiFetch, authHeader } from "divindus-shared";
export default function MessagesSection({ messages, setMessages }) {
  const [expanded, setExpanded] = useState(null);
const toggleResolved = async (id, current) => {
  const { message } = await apiFetch(`/messages/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ resolved: !current }),
  });
  setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
};
  return (
    <div>
      <h1 style={styles.pageTitle}>Messages ({messages.filter((m) => !m.resolved).length} non traités)</h1>
      <div style={styles.ordersList}>
        {messages.map((m) => {
          const isOpen = expanded === m.id;
          return (
            <div key={m.id} style={styles.orderRow}>
              <button style={styles.orderRowHead} onClick={() => setExpanded(isOpen ? null : m.id)}>
                <div style={styles.orderRowMain}>
                  <span style={styles.orderClient}>{m.nom}</span>
                  <span style={styles.orderRef}>{m.sujet}</span>
                </div>
<span style={styles.orderDate}>{dateFmt(m.created_at)}</span>                <span style={{ ...styles.statusPill, ...(m.resolved ? styles.statusPillDone : {}) }}>{m.resolved ? "Traité" : "Non traité"}</span>
              </button>
              {isOpen && (
                <div style={styles.orderDetail}>
                  <p style={styles.detailValue}>{m.message}</p>
                  <div style={styles.orderDetailActions}>
                    <a style={styles.btnDarkSmall} href={`mailto:${m.email}?subject=Re: ${m.sujet}`}>Répondre par email</a>
                    <button style={styles.linkBtnSmall} onClick={() => toggleResolved(m.id, m.resolved)}>                      {m.resolved ? "Marquer non traité" : "Marquer comme traité"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
