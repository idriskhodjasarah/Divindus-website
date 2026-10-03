import { useState,useEffect } from "react";
import { Landing, Login, globalCss as landingCss } from "divindus-shared";
import { apiFetch, authHeader } from "divindus-shared";
import { styles, globalCss } from "./styles/styles";
import Dashboard from "./pages/Dashboard";

export default function AdminApp() {
const [stage, setStage] = useState("checking");
useEffect(() => {
  const session = localStorage.getItem("divindus_session");
  if (!session) {
    setStage("landing");
    return;
  }
  apiFetch("/auth/me", { headers: authHeader() })
    .then(({ profile }) => {
      if (profile.is_admin) {
        setStage("dashboard");
      } else {
        localStorage.removeItem("divindus_session");
        localStorage.removeItem("divindus_profile");
        setStage("landing");
      }
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
      <style>{landingCss}</style>
      {stage === "landing" && (
        <Landing onConnect={() => setStage("login")} onOpenLegal={() => {}} onOpenSupport={() => {}} />
      )}
      {stage === "login" && (
<Login
  requireAdmin
  onLogin={() => setStage("dashboard")}
  onRegister={() => {}}
  onBack={() => setStage("landing")}
  onOpenResetDemo={() => {}}
/>      )}
{stage === "dashboard" && (
  <Dashboard
    onLogout={() => {
      localStorage.removeItem("divindus_session");
      localStorage.removeItem("divindus_profile");
      setStage("landing");
    }}
  />
)}    </div>
  );
}