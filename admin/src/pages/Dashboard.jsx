import { useState, useEffect } from "react";
import { Menu, LayoutDashboard, ShoppingBag, FileText, Boxes, Users, RotateCcw, MessageSquare, LayoutTemplate, UserCog } from "lucide-react";
import { styles } from "../styles/styles";
import { computeCustomers } from "../data/data";
import { apiFetch, authHeader } from "divindus-shared";
import Sidebar from "../components/Sidebar";
import GlobalSearch from "../components/GlobalSearch";
import Overview from "./Overview";
import OrdersSection from "./OrdersSection";
import ProductsSection from "./ProductsSection";
import CustomersSection from "./CustomersSection";
import RefundsSection from "./RefundsSection";
import MessagesSection from "./MessagesSection";
import QuotesSection from "./QuotesSection";
import ContentSection from "./ContentSection";
import ProfileSection from "./ProfileSection";

// The DB uses snake_case and nests line items as "order_items"; the admin UI
// expects camelCase, a flat "items" array, a computed "total", and a "client"
// display name. Map once, here, same pattern used in the client app.
function mapOrder(o) {
  const items = (o.order_items || []).map((i) => ({ id: i.product_id, name: i.name, filiale: i.filiale, qty: i.qty, price: i.price }));
  return {
    ...o,
    items,
    total: items.reduce((s, i) => s + (i.price || 0) * i.qty, 0),
    client: o.entreprise || o.contact,
    statusIndex: o.status_index,
    refundStatus: o.refund_status,
    placedAt: o.placed_at,
  };
}
function mapQuote(q) {
  return { ...q, date: q.created_at, reponsePrix: q.reponse_prix, reponseMessage: q.reponse_message };
}
const NAV = [
  { key: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { key: "orders", label: "Commandes", icon: ShoppingBag },
  { key: "quotes", label: "Devis", icon: FileText },
  { key: "products", label: "Produits", icon: Boxes },
  { key: "customers", label: "Clients", icon: Users },
  { key: "refunds", label: "Remboursements", icon: RotateCcw },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "content", label: "Contenu du site", icon: LayoutTemplate },
  { key: "profile", label: "Mon profil", icon: UserCog },
];

export default function Dashboard({ onLogout }) {
  const [section, setSection] = useState("overview");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    apiFetch("/orders", { headers: authHeader() })
      .then(({ orders }) => setOrders(orders.map(mapOrder)))
      .finally(() => setOrdersLoading(false));
  }, []);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    apiFetch("/products")
      .then(({ products }) => setProducts(products.map((p) => ({ ...p, desc: p.description }))))
      .finally(() => setProductsLoading(false));
  }, []);

const [messages, setMessages] = useState([]);

useEffect(() => {
  apiFetch("/messages", { headers: authHeader() })
    .then(({ messages }) => setMessages(messages))
    .catch(() => {});
}, []);
const [quotes, setQuotes] = useState([]);

useEffect(() => {
  apiFetch("/quotes", { headers: authHeader() })
    .then(({ quotes }) => setQuotes(quotes.map(mapQuote)))
    .catch(() => {});
}, []);
  const [navOpen, setNavOpen] = useState(false);
  const [ordersQuery, setOrdersQuery] = useState("");

  const completeRefund = async (id) => {
    const { order } = await apiFetch(`/orders/${id}`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ refund_status: "remboursee" }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? mapOrder(order) : o)));
  };

const answerQuote = async (id, prix, message) => {
  const { quote } = await apiFetch(`/quotes/${id}`, {
    method: "PATCH",
    headers: authHeader(),
    body: JSON.stringify({ reponse_prix: prix, reponse_message: message }),
  });
  setQuotes((prev) => prev.map((q) => (q.id === id ? mapQuote(quote) : q)));
};
  const customers = computeCustomers(orders);

  const refundCount = orders.filter((o) => o.refundStatus === "en_cours").length;
  const unresolvedMsgCount = messages.filter((m) => !m.resolved).length;
  const newQuotesCount = quotes.filter((q) => q.status === "nouveau").length;

  return (
    <div style={styles.shell}>
      <button className="admin-mobile-toggle" style={styles.mobileNavToggle} onClick={() => setNavOpen((v) => !v)}>
        <Menu size={18} /> Menu
      </button>

      <Sidebar
        nav={NAV}
        section={section}
        setSection={setSection}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        refundCount={refundCount}
        unresolvedMsgCount={unresolvedMsgCount}
        newQuotesCount={newQuotesCount}
        onLogout={onLogout}
      />

      <main className="admin-content" style={styles.content}>
        {section !== "orders" && section !== "profile" && section !== "content" && section !== "overview" && (
          <GlobalSearch orders={orders} products={products} customers={customers} onGoTo={(sec, query) => { if (query) setOrdersQuery(query); setSection(sec); }} />
        )}

        {section === "overview" && <Overview orders={orders} products={products} customers={customers} />}
        {section === "orders" && (
          <OrdersSection orders={orders} query={ordersQuery} setQuery={setOrdersQuery} loading={ordersLoading} />
        )}
        {section === "quotes" && <QuotesSection quotes={quotes} onAnswer={answerQuote} />}
        {section === "products" && <ProductsSection products={products} setProducts={setProducts} loading={productsLoading} />}
        {section === "customers" && <CustomersSection orders={orders} customers={customers} />}
        {section === "refunds" && <RefundsSection orders={orders} onCompleteRefund={completeRefund} />}
        {section === "messages" && <MessagesSection messages={messages} setMessages={setMessages} />}
        {section === "content" && <ContentSection />}
        {section === "profile" && <ProfileSection />}
      </main>
    </div>
  );
}
