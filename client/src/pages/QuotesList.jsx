import { useState } from "react";
import { ChevronLeft, Check, Minus, Plus } from "lucide-react";
import { styles, color, fmt } from "divindus-shared";

export default function QuotesList({ quotes, newIds, onOrder, onBack }) {
  const [qtys, setQtys] = useState({});
  const qtyOf = (id) => qtys[id] || 1;
  const changeQty = (id, delta) =>
    setQtys((prev) => ({ ...prev, [id]: Math.min(999, Math.max(1, (prev[id] || 1) + delta)) }));

  const dateFmt = (d) =>
    new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <main style={styles.ordersWrap}>
      <button style={styles.backBtn} onClick={onBack}><ChevronLeft size={16} /> Retour au catalogue</button>
      <h2 style={styles.sectionTitle}>Mes devis</h2>

      {quotes.length === 0 ? (
        <div style={styles.ordersEmpty}>
          <p style={{ marginBottom: 16 }}>Vous n'avez pas encore demandé de devis.</p>
          <button style={styles.primaryBtn} onClick={onBack}>Parcourir le catalogue</button>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {quotes.map((q) => {
            const answered = q.status === "répondu";
            const isNew = newIds.includes(q.id);
            const qty = qtyOf(q.id);
            return (
              <div key={q.id} style={styles.orderCard}>
                <div style={styles.orderCardTop}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600 }}>
                        {q.produit}
                      </span>
                      {isNew && (
                        <span style={{ background: color.amber, color: color.graphite, fontSize: 10.5, fontWeight: 700, padding: "2px 7px" }}>
                          NOUVEAU
                        </span>
                      )}
                    </div>
                    <div style={styles.orderCardDate}>Demandé le {dateFmt(q.created_at)}</div>
                  </div>
                  <div style={{ ...styles.orderStatusBadge, ...(answered ? styles.orderStatusBadgeDone : {}) }}>
                    {answered ? "Répondu" : "En attente"}
                  </div>
                </div>

                <div style={styles.orderCardItems}>
                  <span style={styles.orderCardItemLine}>Votre demande : {q.details}</span>
                </div>

                {answered ? (
                  <>
                    <div style={styles.noteBox}>
                      <div style={{ fontWeight: 600, color: color.ink }}>
                        Prix proposé : {fmt(q.reponse_prix)} / unité
                      </div>
                      <p style={{ margin: "6px 0 0" }}>{q.reponse_message}</p>
                    </div>

                    {q.order_id ? (
                      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                        <span style={styles.orderReceivedTag}>
                          <Check size={15} /> Commande passée
                        </span>
                      </div>
                    ) : (
                      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                          <div style={styles.qtyStepper}>
                            <button style={styles.qtyBtn} onClick={() => changeQty(q.id, -1)}><Minus size={14} /></button>
                            <span style={styles.qtyValue}>{qty}</span>
                            <button style={styles.qtyBtn} onClick={() => changeQty(q.id, 1)}><Plus size={14} /></button>
                          </div>
                          <span style={{ fontSize: 13.5, color: color.inkSoft }}>
                            Total : <strong style={{ color: color.ink }}>{fmt(q.reponse_prix * qty)}</strong>
                          </span>
                        </div>
                        <button style={styles.primaryBtn} onClick={() => onOrder(q, qty)}>
                          Commander à ce prix
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize: 12.5, color: color.inkSoft, margin: 0 }}>
                    Un chargé d'affaires étudie votre demande.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}