import { ChevronLeft } from "lucide-react";
import { styles } from "../styles/styles";

export function AuthShell({ children, onBack, wide }) {
  return (
    <div style={styles.authPage}>
      <div className="auth-card-pad" style={{ ...styles.authCard, maxWidth: wide ? 560 : 400 }}>
        <button style={styles.backBtn} onClick={onBack}>
          <ChevronLeft size={16} /> Retour
        </button>
        {children}
      </div>
    </div>
  );
}

export function AuthField({ icon, label, children }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.fieldLabel}>
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

