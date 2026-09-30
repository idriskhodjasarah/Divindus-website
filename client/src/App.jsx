import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check,
  Building2,
  Truck,
  CreditCard,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Search,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  LogOut,
  Layers,
  FileText,
  ShieldCheck,
  Printer,
  Bell,
  Package,
  Home,
  PackageCheck,
  ClipboardList,
  Camera,
} from "lucide-react";
import { Landing, Login, styles, globalCss } from "divindus-shared";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import ShopApp from "./pages/ShopApp";
import LegalPage from "./pages/LegalPage";
import SupportPage from "./pages/SupportPage";
// ---------------------------------------------------------------------------
// Root app — auth flow + shop
// ---------------------------------------------------------------------------

export default function App() {
  const [stage, setStage] = useState("landing"); // landing | login | register | verify | shop | legal | support
  const [pending, setPending] = useState(null); // { contact }
  const [profile, setProfile] = useState(null); // { prenom, nom, email, telephone, adresse }
  const [legalTab, setLegalTab] = useState("cgv");
  const [returnStage, setReturnStage] = useState("landing"); // where "back" goes from legal/support
  const [resetToken, setResetToken] = useState(null);
  const openLegal = (tab, from) => { setLegalTab(tab); setReturnStage(from); setStage("legal"); };
  const openSupport = (from) => { setReturnStage(from); setStage("support"); };
  useEffect(() => {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  if (hash.get("type") === "recovery" && hash.get("access_token")) {
    setResetToken(hash.get("access_token"));
    setStage("reset");
    window.history.replaceState(null, "", window.location.pathname); // clean the URL
  }
}, []);
  return (
    <div style={styles.app}>
      <style>{globalCss}</style>

      {stage === "landing" && (
        <Landing
          onConnect={() => setStage("login")}
          onOpenLegal={(tab) => openLegal(tab, "landing")}
          onOpenSupport={() => openSupport("landing")}
        />
      )}

      {stage === "login" && (
        <Login
          onLogin={(profile) => { setProfile(profile); setStage("shop"); }}
          onRegister={() => setStage("register")}
          onBack={() => setStage("landing")}
          onOpenResetDemo={() => setStage("reset")}
        />
      )}

      {stage === "reset" && (
  <ResetPassword accessToken={resetToken} onDone={() => setStage("login")} />
)}

      {stage === "register" && (
        <Register
          onSubmit={(data) => {
            setPending(data);
            setProfile(data.profile);
            setStage("verify");
          }}
          onBack={() => setStage("login")}
        />
      )}

      {stage === "verify" && (
        <Verify
          pending={pending}
          onVerified={() => setStage("shop")}
          onBack={() => setStage("register")}
        />
      )}

      {stage === "shop" && (
        <ShopApp onLogout={() => setStage("landing")} initialProfile={profile} />
      )}

      {stage === "legal" && (
        <LegalPage tab={legalTab} setTab={setLegalTab} onBack={() => setStage(returnStage)} />
      )}

      {stage === "support" && (
        <SupportPage onBack={() => setStage(returnStage)} />
      )}
    </div>
  );
}
