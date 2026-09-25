import { styles } from "../styles/styles";
import { fmt } from "../data/data";

export default function RefundsSection({ orders, onCompleteRefund }) {
  const pending = orders.filter((o) => o.refundStatus === "en_cours");
  const done = orders.filter((o) => o.refundStatus === "remboursee");

  return (
    <div>
      <h1 style={styles.pageTitle}>Remboursements</h1>

      <h3 style={styles.subHead}>En attente ({pending.length})</h3>
      <div style={styles.ordersList}>
        {pending.length === 0 && <p style={styles.emptyState}>Aucun remboursement en attente.</p>}
        {pending.map((o) => {
          const total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
          return (
            <div key={o.id} style={{ ...styles.orderRow, padding: 16 }}>
              <div style={styles.orderRowMain}>
                <span style={styles.orderRef}>{o.ref}</span>
                <span style={styles.orderClient}>{o.client} — {fmt(total)}</span>
              </div>
              <button style={{ ...styles.btnDarkSmall, marginTop: 10 }} onClick={() => onCompleteRefund(o.id)}>
                Marquer comme remboursée
              </button>
            </div>
          );
        })}
      </div>

      <h3 style={{ ...styles.subHead, marginTop: 32 }}>Remboursés ({done.length})</h3>
      <div style={styles.ordersList}>
        {done.map((o) => (
          <div key={o.id} style={{ ...styles.orderRow, padding: 16, opacity: 0.6 }}>
            <div style={styles.orderRowMain}>
              <span style={styles.orderRef}>{o.ref}</span>
              <span style={styles.orderClient}>{o.client}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
