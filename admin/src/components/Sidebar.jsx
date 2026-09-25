import { LogOut } from "lucide-react";
import { logo } from "divindus-shared";
import { styles } from "../styles/styles";

export default function Sidebar({ nav, section, setSection, navOpen, setNavOpen, refundCount, unresolvedMsgCount, newQuotesCount, onLogout }) {
  return (
    <aside className={`admin-sidebar${navOpen ? " open" : ""}`} style={styles.sidebar}>
      <div style={styles.sidebarLogo}>
        <img src={logo} alt="DIVINDUS" style={{ height: 40, maxWidth: "100%" }} />
      </div>
      <nav style={styles.navList}>
        {nav.map((n) => {
          const Icon = n.icon;
          const badge = n.key === "refunds" ? refundCount : n.key === "messages" ? unresolvedMsgCount : n.key === "quotes" ? newQuotesCount : 0;
          return (
            <button
              key={n.key}
              style={{ ...styles.navItem, ...(section === n.key ? styles.navItemActive : {}) }}
              onClick={() => { setSection(n.key); setNavOpen(false); }}
            >
              <Icon size={17} />
              <span style={{ flex: 1, textAlign: "left" }}>{n.label}</span>
              {badge > 0 && <span style={styles.navBadge}>{badge}</span>}
            </button>
          );
        })}
      </nav>
      <button style={styles.navItem} onClick={onLogout}>
        <LogOut size={17} /><span>Déconnexion</span>
      </button>
    </aside>
  );
}
