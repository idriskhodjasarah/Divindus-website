import { X, Bell } from "lucide-react";
import { styles, color } from "../styles/styles";

export default function NotificationsDrawer({ notifications, onClose, onViewOrders }) {
  return (
    <div style={styles.drawerOverlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.drawerHead}>
          <h2 style={styles.drawerTitle}>Notifications</h2>
          <button style={styles.iconBtn} onClick={onClose}><X size={20} /></button>
        </div>

        {notifications.length === 0 ? (
          <p style={styles.drawerEmpty}>Vous n'avez pas encore de notification.</p>
        ) : (
          <div style={styles.drawerList}>
            {notifications.map((n) => (
              <div key={n.id} style={styles.notifRow}>
                <Bell size={16} style={{ color: color.amber, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={styles.notifText}>{n.text}</div>
                  <div style={styles.notifTime}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {onViewOrders && (
          <div style={styles.drawerFoot}>
            <button style={{ ...styles.primaryBtn, width: "100%" }} onClick={onViewOrders}>
              Voir mes commandes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
