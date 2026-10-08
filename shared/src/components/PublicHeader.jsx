import { User } from "lucide-react";
import { styles } from "../styles/styles";
import logo from "../assets/logo.png";

const scrollToId = (id) => () => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const navBtnStyle = { background: "none", border: "none", color: "inherit", font: "inherit", cursor: "pointer", padding: 0 };

export default function PublicHeader({ onConnect }) {
  return (
    <header style={styles.publicHeader}>
      <div style={styles.topbarInner} className="responsive-header">
        <div style={styles.logoBtn}>
          <img src={logo} alt="DIVINDUS" style={{ height: 42 }} />
        </div>
        <nav style={styles.publicNav} className="public-nav">
          <button style={navBtnStyle} onClick={scrollToId("catalogue")}>Catalogue</button>
          <button style={navBtnStyle} onClick={scrollToId("filiales")}>Filiales</button>
          <button style={navBtnStyle} onClick={scrollToId("contact")}>Contact</button>
        </nav>
        <button style={styles.connectBtn} onClick={onConnect}>
          <User size={15} />
          Se connecter
        </button>
      </div>
    </header>
  );
}