import { useState, useEffect } from "react";
import { STATUS_STEPS, apiFetch, authHeader } from "divindus-shared";
import TopBar from "../components/TopBar";
import Catalog from "../components/Catalog";
import CartDrawer from "../components/CartDrawer";
import ShopFooter from "../components/ShopFooter";
import NotificationsDrawer from "../components/NotificationsDrawer";
import Checkout from "./Checkout";
import Confirmation from "./Confirmation";
import OrdersList from "./OrdersList";
import Account from "./Account";
import LegalPage from "./LegalPage";
import SupportPage from "./SupportPage";

// The DB uses snake_case and nests line items as "order_items"; the UI expects
// camelCase and a flat "items" array with a "total" already computed. Map once, here.
function mapOrder(o) {
  const items = (o.order_items || []).map((i) => ({ id: i.product_id, name: i.name, filiale: i.filiale, qty: i.qty, price: i.price }));
  return {
    ...o,
    items,
    total: items.reduce((s, i) => s + (i.price || 0) * i.qty, 0),
    statusIndex: o.status_index,
    refundStatus: o.refund_status,
    placedAt: o.placed_at,
  };
}

export default function ShopApp({ onLogout, initialProfile }) {
  const [view, setView] = useState("catalog");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    apiFetch("/products")
      .then(({ products }) => {
        // The DB column is "description"; the existing UI expects "desc" — map it once here.
        setProducts(products.filter((p) => p.active).map((p) => ({ ...p, desc: p.description })));
      })
      .catch((err) => setProductsError(err.message))
      .finally(() => setProductsLoading(false));
  }, []);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState(null); // which order confirmation is currently showing

  useEffect(() => {
    apiFetch("/orders", { headers: authHeader() })
      .then(({ orders }) => setOrders(orders.map(mapOrder)))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  const [profile, setProfile] = useState(
    initialProfile || { prenom: "", nom: "", email: "", telephone: "", adresse: "", photo: null }
  );

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const [legalTab, setLegalTab] = useState("cgv");

  const filtered = products.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchQuery =
      query.trim() === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.filiale.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...products.find((p) => p.id === id), qty }));

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  const hasQuoteOnly = cartItems.some((i) => i.price === null);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const changeQty = (id, delta) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + delta) }));

  const pushNotification = (text) => {
    setNotifications((n) => [
      { id: Date.now() + Math.random(), text, time: new Date().toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit" }) },
      ...n,
    ]);
    setUnread((u) => u + 1);
  };

  const placeOrder = async (details) => {
    try {
      const { order } = await apiFetch("/orders", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ items: cartItems, ...details }),
      });
      const mapped = mapOrder(order);
      setOrders((prev) => [mapped, ...prev]);
      setActiveOrderId(mapped.id);
      pushNotification(`Votre commande ${mapped.ref} ${STATUS_STEPS[0].note}`);
      setCart({});
      setView("confirmation");
    } catch (err) {
      pushNotification(`Erreur lors de la commande : ${err.message}`);
    }
  };

  const patchOrder = async (orderId, patch) => {
    const { order } = await apiFetch(`/orders/${orderId}`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify(patch),
    });
    const mapped = mapOrder(order);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? mapped : o)));
    return mapped;
  };

  const advanceStatus = async (orderId) => {
    const current = orders.find((o) => o.id === orderId);
    const next = Math.min(current.statusIndex + 1, STATUS_STEPS.length - 1);
    const updated = await patchOrder(orderId, { status_index: next });
    pushNotification(`Votre commande ${updated.ref} ${STATUS_STEPS[next].note}`);
  };

  const confirmReception = async (orderId) => {
    const updated = await patchOrder(orderId, { received: true });
    pushNotification(`Réception de la commande ${updated.ref} confirmée — merci d'avoir commandé chez DIVINDUS.`);
  };

  // Bank transfer isn't charged until the proforma is settled, so cancelling is instant.
  // Card payments are charged immediately, so cancelling starts a refund instead of an instant undo.
  const cancelOrder = async (orderId) => {
    const current = orders.find((o) => o.id === orderId);
    if (current.paiement === "carte") {
      const updated = await patchOrder(orderId, { refund_status: "en_cours" });
      pushNotification(`Demande d'annulation reçue pour la commande ${updated.ref}. Remboursement sous 5 à 7 jours ouvrés.`);
    } else {
      const updated = await patchOrder(orderId, { cancelled: true });
      pushNotification(`Votre commande ${updated.ref} a été annulée. Aucun paiement n'ayant encore été prélevé, aucun remboursement n'est nécessaire.`);
    }
  };

  // Demo-only: simulates the bank confirming the refund a few days later.
  const completeRefund = async (orderId) => {
    const updated = await patchOrder(orderId, { cancelled: true, refund_status: "remboursee" });
    pushNotification(`Remboursement de la commande ${updated.ref} effectué.`);
  };

  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopBar
        cartCount={cartCount}
        unread={unread}
        ordersCount={orders.length}
        profile={profile}
        onCartClick={() => setCartOpen(true)}
        onNotifClick={() => { setNotifOpen(true); setUnread(0); }}
        onOrdersClick={() => setView("orders")}
        onAccountClick={() => setView("account")}
        onLogoClick={() => setView("catalog")}
        onLogout={onLogout}
      />

      <div style={{ flex: 1 }}>
      {view === "catalog" && productsLoading && (
        <p style={{ padding: 40, textAlign: "center", color: "#5B5749" }}>Chargement du catalogue…</p>
      )}
      {view === "catalog" && productsError && (
        <p style={{ padding: 40, textAlign: "center", color: "#8C3F22" }}>Impossible de charger le catalogue : {productsError}</p>
      )}
      {view === "catalog" && !productsLoading && !productsError && (
        <Catalog
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          products={filtered}
          onAdd={addToCart}
          qtyOf={(id) => cart[id] || 0}
          onChangeQty={changeQty}
        />
      )}

      {view === "checkout" && (
        <Checkout
          items={cartItems}
          total={cartTotal}
          hasQuoteOnly={hasQuoteOnly}
          onBack={() => setView("catalog")}
          onSubmit={placeOrder}
        />
      )}

      {view === "confirmation" && activeOrder && (
        <Confirmation
          order={activeOrder}
          orderRef={activeOrder.ref}
          onNewOrder={() => setView("catalog")}
          onViewOrders={() => setView("orders")}
        />
      )}

      {view === "orders" && ordersLoading && (
        <p style={{ padding: 40, textAlign: "center", color: "#5B5749" }}>Chargement de vos commandes…</p>
      )}
      {view === "orders" && !ordersLoading && (
        <OrdersList
          orders={orders}
          onAdvance={advanceStatus}
          onConfirmReception={confirmReception}
          onCancel={cancelOrder}
          onCompleteRefund={completeRefund}
          onShopMore={() => setView("catalog")}
        />
      )}

      {view === "account" && (
        <Account
          profile={profile}
          onSave={(p) => setProfile(p)}
          onBack={() => setView("catalog")}
        />
      )}

      {view === "legal" && (
        <LegalPage tab={legalTab} setTab={setLegalTab} onBack={() => setView("catalog")} />
      )}

      {view === "support" && (
        <SupportPage onBack={() => setView("catalog")} />
      )}

      </div>

      {cartOpen && (
        <CartDrawer
          items={cartItems}
          total={cartTotal}
          onClose={() => setCartOpen(false)}
          onChangeQty={changeQty}
          onCheckout={() => {
            setCartOpen(false);
            setView("checkout");
          }}
        />
      )}

      {notifOpen && (
        <NotificationsDrawer
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onViewOrders={orders.length > 0 ? () => { setNotifOpen(false); setView("orders"); } : null}
        />
      )}

      <ShopFooter onOpenLegal={(tab) => { setLegalTab(tab); setView("legal"); }} onOpenSupport={() => setView("support")} />
    </div>
  );
}
