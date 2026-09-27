import { Minus, Plus } from "lucide-react";
import { styles, fmt } from "divindus-shared";
import QuoteRequestModal from "../components/QuoteRequestModal";
import { useState } from "react";
export default function ProductCard({ p, qty, onAdd, onChangeQty }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  return (
    <article style={styles.card}>
      <div style={styles.cardTop}>
        <span style={styles.cardCode}>{p.id}</span>
        <span style={styles.cardFiliale}>{p.filiale}</span>
      </div>
      <h3 style={styles.cardName}>{p.name}</h3>
      <p style={styles.cardDesc}>{p.desc}</p>
      <ul style={styles.specList}>
        {p.spec.map((s, i) => (
          <li key={i} style={styles.specItem}>{s}</li>
        ))}
      </ul>
      <div style={styles.cardFooter}>
        <div>
          <div style={styles.cardPrice}>{p.price ? fmt(p.price) : "Sur devis"}</div>
          <div style={styles.cardLead}>Délai : {p.lead}</div>
        </div>
        {qty === 0 ? (
          <button style={styles.addBtn} onClick={onAdd}>Ajouter</button>
        ) : (
          <div style={styles.qtyStepper}>
            <button style={styles.qtyBtn} onClick={() => onChangeQty(-1)}><Minus size={14} /></button>
            <span style={styles.qtyValue}>{qty}</span>
            <button style={styles.qtyBtn} onClick={() => onChangeQty(1)}><Plus size={14} /></button>
          </div>
        )}
      </div>
    </article>
  );
}
