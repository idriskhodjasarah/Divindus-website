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
import QuotesList from "./QuotesList";
import Account from "./Account";
import LegalPage from "./LegalPage";
import SupportPage from "./SupportPage";

// The DB uses snake_case and nests line items as "order_items"; the UI expects
// camelCase and a flat "items" array with a "total" already computed. Map once, here.
function mapOrder(o) {
  const items = (o.order_items || []).map((i) => ({
    id: i.product_id || "DEVIS",
    name: i.name,
    filiale: i.filiale,
    qty: i.qty,
    price: i.price,
  }));
  return {
    ...o,
    items,
    total: items.reduce((s, i) => s + (i.price || 0) * i.qty, 0),
    statusIndex: o.status_index,
    refundStatus: o.refund_status,
    placedAt: o.placed_at,
  };
}

// Notifications are stored with a raw timestamp; the drawer expects a
// ready-to-display "time" string, same format the old local version used.
function mapNotification(n) {
  return { ...n, time: new Date(n.created_at).toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit" }) };
}

export default function ShopApp({ onLogout, initialProfile }) {
  const [view, setView] = useState("catalog");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  // ---- Products -----------------------------------------------------------
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    apiFetch("/products")
      .then(({ products }) => {
        setProducts(products.filter((p) => p.active).map((p) => ({ ...p, desc: p.description })));
      })
      .catch((err) => setProductsError(err.message))
      .finally(() => setProductsLoading(false));
  }, []);

  // ---- Orders -------------------------------------------------------------
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    apiFetch("/orders", { headers: authHeader() })
      .then(({ orders }) => setOrders(orders.map(mapOrder)))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  // Opening "Mes commandes": mark every order seen, so the header badge clears.
  const openOrders = () => {
    if (orders.some((o) => !o.seen_by_client)) {
      setOrders((prev) => prev.map((o) => ({ ...o, seen_by_client: true })));
      apiFetch("/orders/seen", { method: "POST", headers: authHeader() }).catch(() => {});
    }
    setView("orders");
  };

  // ---- Quotes -------------------------------------------------------------
  const [quotes, setQuotes] = useState([]);
  const [newQuoteIds, setNewQuoteIds] = useState([]);
  const [checkoutQuote, setCheckoutQuote] = useState(null);

  const fetchQuotes = () => apiFetch("/quotes", { headers: authHeader() }).then(({ quotes }) => quotes);

  useEffect(() => {
    fetchQuotes().then(setQuotes).catch(() => {});
  }, []);

  const openQuotes = async () => {
    try {
      const fresh = await fetchQuotes();
      const unseen = fresh.filter((q) => q.status === "répondu" && !q.seen_by_client);
      setNewQuoteIds(unseen.map((q) => q.id));
      setQuotes(fresh.map((q) => (q.status === "répondu" ? { ...q, seen_by_client: true } : q)));
      if (unseen.length > 0) {
        apiFetch("/quotes/seen", { method: "POST", headers: authHeader() }).catch(() => {});
      }
    } catch {
      // keep whatever we already had
    }
    setView("quotes");
  };

  const startQuoteOrder = (quote, qty) => {
    setCheckoutQuote({ ...quote, qty: qty || 1 });
    setView("checkout");
  };

  // ---- Notifications --------------------------------------------------------
  // Real, persisted rows now — nothing is invented client-side anymore. Every
  // event that matters (order confirmed, reception confirmed, refund done,
  // quote answered...) is written by the server at the moment it happens.
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const loadNotifications = () =>
    apiFetch("/notifications", { headers: authHeader() })
      .then(({ notifications }) => {
        const mapped = notifications.map(mapNotification);
        setNotifications(mapped);
        setUnread(mapped.filter((n) => !n.seen).length);
      })
      .catch(() => {});

  useEffect(() => {
    loadNotifications();
  }, []);

  // Opening the panel: fetch fresh (so anything new shows up immediately),
  // THEN mark everything seen. The notifications themselves never disappear —
  // only the unread count resets to 0.
  const openNotifications = async () => {
    setNotifOpen(true);
    await loadNotifications();
    setUnread(0);
    apiFetch("/notifications/seen", { method: "POST", headers: authHeader() }).catch(() => {});
  };

  const [legalTab, setLegalTab] = useState("cgv");

  // ---- Catalog + cart -----------------------------------------------------
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

  // ---- Placing an order (from the cart OR from an answered quote) --------
  const placeOrder = async (details) => {
    try {
      const payload = checkoutQuote
        ? { quote_id: checkoutQuote.id, quote_qty: checkoutQuote.qty, ...details }
        : { items: cartItems.map((i) => ({ id: i.id, qty: i.qty })), ...details };

      const { order } = await apiFetch("/orders", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(payload),
      });

      const mapped = mapOrder(order);
      setOrders((prev) => [mapped, ...prev]);
      setActiveOrderId(mapped.id);
      loadNotifications();

      if (checkoutQuote) {
        setCheckoutQuote(null);
        fetchQuotes().then(setQuotes).catch(() => {});
      } else {
        setCart({});
      }
      setView("confirmation");
    } catch (err) {
      // No real notification exists for a failed attempt — show it inline instead.
      setProductsError(""); // no-op, kept for clarity that this isn't a product error
      alert(`Erreur lors de la commande : ${err.message}`);
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
    loadNotifications();
    return mapped;
  };

  const confirmReception = (orderId) => patchOrder(orderId, { received: true });

  const cancelOrder = (orderId) => {
    const current = orders.find((o) => o.id === orderId);
    return current.paiement === "carte"
      ? patchOrder(orderId, { refund_status: "en_cours" })
      : patchOrder(orderId, { cancelled: true });
  };

  const completeRefund = (orderId) => patchOrder(orderId, { cancelled: true, refund_status: "remboursee" });

  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;

  const checkoutItems = checkoutQuote
    ? [{ id: checkoutQuote.id, name: checkoutQuote.produit, qty: checkoutQuote.qty, price: checkoutQuote.reponse_prix }]
    : cartItems;
  const checkoutTotal = checkoutQuote ? checkoutQuote.reponse_prix * checkoutQuote.qty : cartTotal;

  const [profile, setProfile] = useState(
    initialProfile || { prenom: "", nom: "", email: "", telephone: "", adresse: "", photo: null }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopBar
        cartCount={cartCount}
        unread={unread}
        ordersCount={orders.filter((o) => !o.seen_by_client).length}
        quotesBadge={quotes.filter((q) => q.status === "répondu" && !q.seen_by_client).length}
        profile={profile}
        onCartClick={() => setCartOpen(true)}
        onNotifClick={openNotifications}
        onOrdersClick={openOrders}
        onQuotesClick={openQuotes}
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
            items={checkoutItems}
            total={checkoutTotal}
            hasQuoteOnly={checkoutQuote ? false : hasQuoteOnly}
            onBack={() => {
              const back = checkoutQuote ? "quotes" : "catalog";
              setCheckoutQuote(null);
              setView(back);
            }}
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
            onConfirmReception={confirmReception}
            onCancel={cancelOrder}
            onCompleteRefund={completeRefund}
            onShopMore={() => setView("catalog")}
          />
        )}

        {view === "quotes" && (
          <QuotesList
            quotes={quotes}
            newIds={newQuoteIds}
            onOrder={startQuoteOrder}
            onBack={() => setView("catalog")}
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
            setCheckoutQuote(null);
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