import { useState } from "react";
import { PRODUCTS, STATUS_STEPS } from "../data/data";
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

export default function ShopApp({ onLogout, initialProfile }) {
  const [view, setView] = useState("catalog");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  // Every placed order lives in this array — nothing gets overwritten when a new one is placed.
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null); // which order confirmation is currently showing

  const [profile, setProfile] = useState(
    initialProfile || { prenom: "", nom: "", email: "", telephone: "", adresse: "", photo: null }
  );

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const [legalTab, setLegalTab] = useState("cgv");

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchQuery =
      query.trim() === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.filiale.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty }));

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

  const placeOrder = (details) => {
    const id = Date.now();
    const ref = "DVX-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id,
      ref,
      items: cartItems,
      total: cartTotal,
      statusIndex: 0,
      received: false,
      cancelled: false,
      refundStatus: null, // null | "en_cours" | "remboursee" — only relevant for card payments
      placedAt: new Date(),
      ...details,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(id);
    pushNotification(`Votre commande ${ref} ${STATUS_STEPS[0].note}`);
    setCart({});
    setView("confirmation");
  };

  const advanceStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = Math.min(o.statusIndex + 1, STATUS_STEPS.length - 1);
        pushNotification(`Votre commande ${o.ref} ${STATUS_STEPS[next].note}`);
        return { ...o, statusIndex: next };
      })
    );
  };

  const confirmReception = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        pushNotification(`Réception de la commande ${o.ref} confirmée — merci d'avoir commandé chez DIVINDUS.`);
        return { ...o, received: true };
      })
    );
  };

  // Bank transfer isn't charged until the proforma is settled, so cancelling is instant.
  // Card payments are charged immediately, so cancelling starts a refund instead of an instant undo.
  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.paiement === "carte") {
          pushNotification(`Demande d'annulation reçue pour la commande ${o.ref}. Remboursement sous 5 à 7 jours ouvrés.`);
          return { ...o, refundStatus: "en_cours" };
        }
        pushNotification(`Votre commande ${o.ref} a été annulée. Aucun paiement n'ayant encore été prélevé, aucun remboursement n'est nécessaire.`);
        return { ...o, cancelled: true };
      })
    );
  };

  // Demo-only: simulates the bank confirming the refund a few days later.
  const completeRefund = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        pushNotification(`Remboursement de la commande ${o.ref} effectué.`);
        return { ...o, cancelled: true, refundStatus: "remboursee" };
      })
    );
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
      {view === "catalog" && (
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

      {view === "orders" && (
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
