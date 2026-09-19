import { Search } from "lucide-react";
import { styles } from "../styles/styles";
import { CATEGORIES } from "../data/data";
import ProductCard from "./ProductCard";

export default function Catalog({ query, setQuery, category, setCategory, products, onAdd, qtyOf, onChangeQty }) {
  return (
    <main>
      <section style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <Search size={16} strokeWidth={1.75} color="#8A8375" />
          <input
            style={styles.searchInput}
            placeholder="Rechercher un produit, une filiale…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={styles.catRow}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              style={{ ...styles.catBtn, ...(category === c.id ? styles.catBtnActive : {}) }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section style={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} p={p} qty={qtyOf(p.id)} onAdd={() => onAdd(p.id)} onChangeQty={(d) => onChangeQty(p.id, d)} />
        ))}
        {products.length === 0 && <p style={styles.empty}>Aucun produit ne correspond à cette recherche.</p>}
      </section>
    </main>
  );
}
