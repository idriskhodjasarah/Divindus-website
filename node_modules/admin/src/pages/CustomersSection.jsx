import { useState } from "react";
import { Download } from "lucide-react";
import { styles } from "../styles/styles";
import { fmt, dateFmt, downloadCsv, downloadJson } from "../data/data";

export default function CustomersSection({ orders, customers }) {
  const [expanded, setExpanded] = useState(null);
  const [selected, setSelected] = useState([]);

  const allSelected = customers.length > 0 && customers.every((c) => selected.includes(c.name));
  const toggleAll = () => setSelected(allSelected ? [] : customers.map((c) => c.name));
  const toggleOne = (name) => setSelected((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));

  const exportTarget = selected.length > 0 ? customers.filter((c) => selected.includes(c.name)) : customers;
  const exportLabel = selected.length > 0 ? `(${selected.length} sélectionné${selected.length > 1 ? "s" : ""})` : `(${customers.length})`;
  const exportCsv = () => downloadCsv(
    selected.length > 0 ? "clients-selection.csv" : "clients.csv",
    ["Nom", "Email", "Téléphone", "Nombre de commandes", "Total dépensé (DA)"],
    exportTarget.map((c) => [c.name, c.email, c.telephone, c.count, c.total])
  );
  const exportJson = () => downloadJson(selected.length > 0 ? "clients-selection.json" : "clients.json", exportTarget);

  return (
    <div>
      <h1 style={styles.pageTitle}>Clients ({customers.length})</h1>

      <div style={styles.bulkBar}>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} /> Tout sélectionner
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.secondaryBtnSmall} onClick={exportCsv}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> CSV {exportLabel}</span>
          </button>
          <button style={styles.secondaryBtnSmall} onClick={exportJson} title="Conserve l'historique complet des commandes par client">
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Download size={14} /> JSON {exportLabel}</span>
          </button>
        </div>
      </div>

      <div style={styles.ordersList}>
        {customers.map((c) => {
          const isOpen = expanded === c.name;
          return (
            <div key={c.name} style={styles.orderRow}>
              <div style={styles.orderRowHeadWrap}>
                <input type="checkbox" style={styles.rowCheckbox} checked={selected.includes(c.name)} onChange={() => toggleOne(c.name)} />
                <button style={styles.orderRowHead} onClick={() => setExpanded(isOpen ? null : c.name)}>
                  <div style={styles.orderRowMain}>
                    <span style={styles.orderClient}>{c.name}</span>
                    <span style={styles.orderRef}>{c.email}</span>
                  </div>
                  <span style={styles.orderWilaya}>{c.telephone}</span>
                  <span style={styles.orderDate}>{c.count} commande{c.count > 1 ? "s" : ""}</span>
                  <span style={styles.orderTotal}>{fmt(c.total)}</span>
                </button>
              </div>
              {isOpen && (
                <div style={styles.orderDetail}>
                  {c.orders.map((o) => (
                    <div key={o.id} style={styles.summaryRow}>
                      <span>{o.ref} — {dateFmt(o.placedAt)}</span>
                      <span>{fmt(o.items.reduce((s, i) => s + i.price * i.qty, 0))}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
