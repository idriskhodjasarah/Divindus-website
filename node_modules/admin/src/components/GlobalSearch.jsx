import { useState } from "react";
import { Search } from "lucide-react";
import { styles } from "../styles/styles";

export default function GlobalSearch({ orders, products, customers, onGoTo }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const term = q.trim().toLowerCase();

  const matchedOrders = term ? orders.filter((o) => o.ref.toLowerCase().includes(term) || o.client.toLowerCase().includes(term)).slice(0, 4) : [];
  const matchedCustomers = term ? customers.filter((c) => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)).slice(0, 4) : [];
  const matchedProducts = term ? products.filter((p) => p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)).slice(0, 4) : [];
  const hasResults = matchedOrders.length || matchedCustomers.length || matchedProducts.length;

  return (
    <div style={styles.globalSearchWrap}>
      <div style={styles.searchWrap}>
        <Search size={15} color="#8A8375" />
        <input
          style={styles.searchInput}
          placeholder="Rechercher une commande, un client, un produit…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && term && (
        <div style={styles.searchDropdown}>
          {!hasResults && <p style={styles.searchEmpty}>Aucun résultat pour « {q} ».</p>}

          {matchedOrders.length > 0 && (
            <div style={styles.searchGroup}>
              <div style={styles.searchGroupLabel}>Commandes</div>
              {matchedOrders.map((o) => (
                <button key={o.id} style={styles.searchResult} onClick={() => { onGoTo("orders", o.ref); setQ(""); setOpen(false); }}>
                  <span style={styles.searchResultRef}>{o.ref}</span> — {o.client}
                </button>
              ))}
            </div>
          )}

          {matchedCustomers.length > 0 && (
            <div style={styles.searchGroup}>
              <div style={styles.searchGroupLabel}>Clients</div>
              {matchedCustomers.map((c) => (
                <button key={c.name} style={styles.searchResult} onClick={() => { onGoTo("customers"); setQ(""); setOpen(false); }}>
                  {c.name} — {c.email}
                </button>
              ))}
            </div>
          )}

          {matchedProducts.length > 0 && (
            <div style={styles.searchGroup}>
              <div style={styles.searchGroupLabel}>Produits</div>
              {matchedProducts.map((p) => (
                <button key={p.id} style={styles.searchResult} onClick={() => { onGoTo("products"); setQ(""); setOpen(false); }}>
                  <span style={styles.searchResultRef}>{p.id}</span> — {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
