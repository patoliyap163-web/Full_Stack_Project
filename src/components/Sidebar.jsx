import React from 'react';

const Sidebar = ({ active, setActive }) => {
  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <h2 style={{margin: 0, fontSize: "24px"}}> Student</h2>
        <p style={{margin: "5px 0 0 0", fontSize: "12px", opacity: 0.7}}>Portal</p>
      </div>

      <div style={styles.menuDivider}></div>

      {[
        { key: "explore", label: "Explore", icon: "🔍" },
        { key: "financial-aid", label: "Financial Aid", icon: "💰" },
        { key: "applications", label: "My Applications", icon: "📋" },
        { key: "profile", label: "My Profile", icon: "👤" }
      ].map((item) => (
        <div
          key={item.key}
          style={active === item.key ? styles.activeMenuItem : styles.menuItem}
          onClick={() => setActive(item.key)}
        >
          <span style={{fontSize: "18px", marginRight: "10px"}}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "280px",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    color: "white",
    padding: "30px 20px",
    position: "fixed",
    left: 0,
    top: "60px",
    height: "calc(100vh - 60px)",
    overflow: "auto",
    boxSizing: "border-box",
    borderRight: "1px solid rgba(255,255,255,0.1)"
  },
  sidebarHeader: { paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.2)" },
  menuDivider: { height: "1px", background: "rgba(255,255,255,0.1)", margin: "15px 0" },
  menuItem: {
    padding: "15px 15px",
    cursor: "pointer",
    margin: "8px 0",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    color: "rgba(255,255,255,0.7)"
  },
  activeMenuItem: {
    padding: "15px 15px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    cursor: "pointer",
    margin: "8px 0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
    color: "white",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
  }
};

export default Sidebar;