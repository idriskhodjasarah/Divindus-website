import { User } from "lucide-react";
import { styles } from "../styles/styles";
import logo from "../assets/logo.png";

export default function PublicHeader({ onConnect }) {
  return (
    <header style={styles.publicHeader}>
      <div style={styles.topbarInner} className="responsive-header">
        <div style={styles.logoBtn}>
          <img src={logo} alt="DIVINDUS" style={{ height: 42 }} />
        </div>
        <nav style={styles.publicNav} className="public-nav">
          <span>Catalogue</span>
          <span>Filiales</span>
          <span>Contact</span>
        </nav>
        <button style={styles.connectBtn} onClick={onConnect}>
          <User size={15} />
          Se connecter
        </button>
      </div>
    </header>
  );
}
