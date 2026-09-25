import { useState } from "react";
import { Menu, LayoutDashboard, ShoppingBag, FileText, Boxes, Users, RotateCcw, MessageSquare, LayoutTemplate, UserCog } from "lucide-react";
import { styles } from "../styles/styles";
import { ORDERS_SEED, PRODUCTS_SEED, MESSAGES_SEED, QUOTES_SEED, computeCustomers } from "../data/data";
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
  const [orders, setOrders] = useState(ORDERS_SEED);
  const [products, setProducts] = useState(PRODUCTS_SEED);
  const [messages, setMessages] = useState(MESSAGES_SEED);
  const [quotes, setQuotes] = useState(QUOTES_SEED);
  const [navOpen, setNavOpen] = useState(false);
  const [ordersQuery, setOrdersQuery] = useState("");

  const completeRefund = (id) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, refundStatus: "remboursee" } : o)));
  const answerQuote = (id, prix, message) => setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: "répondu", reponsePrix: prix, reponseMessage: message } : q)));

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
        {section !== "orders" && section !== "profile" && section !== "content" && section !== "overview" &&(
          <GlobalSearch orders={orders} products={products} customers={customers} onGoTo={(sec, query) => { if (query) setOrdersQuery(query); setSection(sec); }} />
        )}

        {section === "overview" && <Overview orders={orders} products={products} customers={customers} />}
        {section === "orders" && (
          <OrdersSection orders={orders} query={ordersQuery} setQuery={setOrdersQuery} />
        )}
        {section === "quotes" && <QuotesSection quotes={quotes} onAnswer={answerQuote} />}
        {section === "products" && <ProductsSection products={products} setProducts={setProducts} />}
        {section === "customers" && <CustomersSection orders={orders} customers={customers} />}
        {section === "refunds" && <RefundsSection orders={orders} onCompleteRefund={completeRefund} />}
        {section === "messages" && <MessagesSection messages={messages} setMessages={setMessages} />}
        {section === "content" && <ContentSection />}
        {section === "profile" && <ProfileSection />}
      </main>
    </div>
  );
}
