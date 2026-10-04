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
import { Landing, Login, styles, globalCss,apiFetch, authHeader } from "divindus-shared";
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
const [stage, setStage] = useState("checking");  const [pending, setPending] = useState(null); // { contact }
  const [profile, setProfile] = useState(null); // { prenom, nom, email, telephone, adresse }
  const [legalTab, setLegalTab] = useState("cgv");
  const [returnStage, setReturnStage] = useState("landing"); // where "back" goes from legal/support
  const [resetToken, setResetToken] = useState(null);
  const recoveryHandled = useRef(false);
  const openLegal = (tab, from) => { setLegalTab(tab); setReturnStage(from); setStage("legal"); };
  const openSupport = (from) => { setReturnStage(from); setStage("support"); };
 const [resetLinkError, setResetLinkError] = useState("");
useEffect(() => {
 // Prevent the recovery flow from being processed twice
  if (recoveryHandled.current) {
    return;
  }

  // First check if this is a password recovery link
  const hash = new URLSearchParams(window.location.hash.slice(1));

 if (hash.get("type") === "recovery" && hash.get("access_token")) {
  recoveryHandled.current = true;

  setResetToken(hash.get("access_token"));
  setStage("reset");

  window.history.replaceState(null, "", window.location.pathname);
  return;
}

  if (hash.get("error")) {
    setResetLinkError(
      hash.get("error_code") === "otp_expired"
        ? "Ce lien a expiré ou a déjà été utilisé. Merci de demander un nouveau lien de réinitialisation."
        : "Ce lien n'est plus valide. Merci de demander un nouveau lien de réinitialisation."
    );
    setStage("login");
    window.history.replaceState(null, "", window.location.pathname);
    return;
  }

  // Otherwise, do the normal session check
  const session = localStorage.getItem("divindus_session");

  if (!session) {
    setStage("landing");
    return;
  }

  apiFetch("/auth/me", { headers: authHeader() })
    .then(({ profile }) => {
      setProfile(profile);
      setStage("shop");
    })
    .catch(() => {
      localStorage.removeItem("divindus_session");
      localStorage.removeItem("divindus_profile");
      setStage("landing");
    });
}, []);

  return (
    <div style={styles.app}>
      <style>{globalCss}</style>
      {stage === "checking" && null}
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
          initialError={resetLinkError}        
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
  <ShopApp
    onLogout={() => {
      localStorage.removeItem("divindus_session");
      localStorage.removeItem("divindus_profile");
      setProfile(null);
      setStage("landing");
    }}
    initialProfile={profile}
  />
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
