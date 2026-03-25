function ScholarshipCard({ title, amount, deadline }) {
  const daysLeft = Math.floor(Math.random() * 45) + 1;
  
  return (
    <div style={styles.card}>
      <div style={styles.badge}>{daysLeft} days left</div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.amount}>
        <span style={styles.amountLabel}>₹</span>
        <span style={styles.amountValue}>{(amount / 1000).toFixed(0)}K</span>
      </p>
      <div style={styles.divider}></div>
      <p style={styles.deadline}>
        <strong>📅 Deadline:</strong> {deadline}
      </p>
      <button style={styles.button} onMouseEnter={(e) => e.target.style.backgroundColor = "#1425a7"} onMouseLeave={(e) => e.target.style.backgroundColor = "#1e3a8a"}>
        Apply Now →
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    border: "2px solid #f0f0f0",
    borderRadius: "15px",
    padding: "28px",
    position: "relative",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    ":hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 30px rgba(102, 126, 234, 0.2)",
      borderColor: "#667eea"
    }
  },
  badge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "15px",
    marginTop: "5px"
  },
  amount: {
    margin: "15px 0",
    display: "flex",
    alignItems: "baseline",
    gap: "5px"
  },
  amountLabel: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#667eea"
  },
  amountValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#667eea"
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #667eea, transparent)",
    margin: "15px 0"
  },
  deadline: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px"
  },
  button: {
    width: "100%",
    marginTop: "10px",
    padding: "12px 16px",
    backgroundColor: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(30, 58, 138, 0.3)"
  }
};

export default ScholarshipCard;
