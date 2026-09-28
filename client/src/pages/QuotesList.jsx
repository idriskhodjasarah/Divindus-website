import { styles, color, fmt } from "divindus-shared";

export default function QuotesList({ quotes, onBack }) {
  const dateFmt = (d) =>
    new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <main style={styles.ordersWrap}>
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
            return (
              <div key={q.id} style={styles.orderCard}>
                <div style={styles.orderCardTop}>
                  <div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                      {q.produit}
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
                  <div style={styles.noteBox}>
                    <div style={{ fontWeight: 600, color: color.ink }}>
                      Prix proposé : {fmt(q.reponse_prix)}
                    </div>
                    <p style={{ margin: "6px 0 0" }}>{q.reponse_message}</p>
                  </div>
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