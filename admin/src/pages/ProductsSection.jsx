import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { styles, color } from "../styles/styles";
import { fmt } from "../data/data";
import { apiFetch, authHeader } from "divindus-shared";

export default function ProductsSection({ products, setProducts, loading }) {
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (product) => {
    setError("");
    setSaving(true);
    const { desc, ...rest } = product;
    const payload = { ...rest, description: desc };
    const isNew = !products.some((p) => p.id === product.id);

    try {
      if (isNew) {
        const { product: created } = await apiFetch("/products", {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify(payload),
        });
        setProducts((prev) => [{ ...created, desc: created.description }, ...prev]);
      } else {
        const { product: updated } = await apiFetch(`/products/${product.id}`, {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify(payload),
        });
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...updated, desc: updated.description } : p)));
      }
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE", headers: authHeader() });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleActive = async (product) => {
    setError("");
    try {
      const { product: updated } = await apiFetch(`/products/${product.id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ active: !product.active }),
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, active: updated.active } : p)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p style={styles.emptyState}>Chargement des produits…</p>;
  }

  return (
    <div>
      <div style={styles.sectionHeadRow}>
        <h1 style={styles.pageTitle}>Produits ({products.length})</h1>
        <button style={styles.primaryBtn} onClick={() => setEditing({ id: "", name: "", filiale: "", price: 0, unit: "unité", lead: "", active: true, desc: "", spec: [] })}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={15} /> Ajouter un produit</span>
        </button>
      </div>

      {error && <p style={{ color: color.rust, fontSize: 13, marginBottom: 16 }}>{error}</p>}

      <div style={styles.productGrid}>
        {products.map((p) => (
          <div key={p.id} style={{ ...styles.productCard, ...(p.active ? {} : { opacity: 0.5 }) }}>
            <div style={styles.productCode}>{p.id}</div>
            <div style={styles.productName}>{p.name}</div>
            <div style={styles.productFiliale}>{p.filiale}</div>
            <p style={styles.productDesc}>{p.desc}</p>
            <div style={styles.productPrice}>{p.price ? fmt(p.price) : "Sur devis"} <span style={styles.productUnit}>/ {p.unit}</span></div>
            <div style={styles.productActions}>
              <button style={styles.iconTextBtn} onClick={() => setEditing(p)}><Pencil size={13} /> Modifier</button>
              <button style={styles.iconTextBtn} onClick={() => toggleActive(p)}>{p.active ? "Désactiver" : "Activer"}</button>
              <button style={{ ...styles.iconTextBtn, color: color.rust }} onClick={() => remove(p.id)}><Trash2 size={13} /> Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {editing && <ProductModal product={editing} onSave={save} onClose={() => setEditing(null)} saving={saving} />}
    </div>
  );
}

function ProductModal({ product, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    ...product,
    specText: (product.spec || []).join("\n"),
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    const { specText, ...rest } = form;
    onSave({
      ...rest,
      price: form.price === "" ? null : form.price,
      spec: specText.split("\n").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <h3 style={styles.modalTitle}>{product.id ? "Modifier le produit" : "Nouveau produit"}</h3>
          <button style={styles.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Référence (SKU)</div><input style={styles.input} value={form.id} onChange={set("id")} disabled={!!product.id} /></div>
        <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Nom du produit</div><input style={styles.input} value={form.name} onChange={set("name")} /></div>
        <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Filiale</div><input style={styles.input} value={form.filiale} onChange={set("filiale")} /></div>
        <div style={styles.fieldGroup}>
          <div style={styles.fieldLabel}>Description (affichée au client)</div>
          <textarea style={styles.textarea} value={form.desc || ""} onChange={set("desc")} />
        </div>
        <div style={styles.fieldGroup}>
          <div style={styles.fieldLabel}>Caractéristiques (une par ligne)</div>
          <textarea style={styles.textarea} value={form.specText} onChange={set("specText")} placeholder={"Ex :\nSurface : 15 à 40 m²\nOssature acier galvanisé"} />
        </div>
        <div className="field-row" style={styles.fieldRow}>
          <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Prix (DA, vide = sur devis)</div><input style={styles.input} type="number" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : null }))} /></div>
          <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Unité</div><input style={styles.input} value={form.unit} onChange={set("unit")} /></div>
        </div>
        <div style={styles.fieldGroup}><div style={styles.fieldLabel}>Délai</div><input style={styles.input} value={form.lead} onChange={set("lead")} /></div>
        <button style={{ ...styles.primaryBtn, width: "100%", opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}