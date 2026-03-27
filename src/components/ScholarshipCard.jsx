const getDeadlineMeta = (deadline) => {
  if (!deadline) {
    return {
      label: "No deadline",
      badgeStyle: styles.badgeNeutral,
      deadlineTextStyle: styles.deadlineNeutral
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return {
      label: "Deadline unavailable",
      badgeStyle: styles.badgeNeutral,
      deadlineTextStyle: styles.deadlineNeutral
    };
  }

  deadlineDate.setHours(0, 0, 0, 0);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((deadlineDate - today) / millisecondsPerDay);

  if (daysLeft < 0) {
    return {
      label: "Expired",
      badgeStyle: styles.badgeExpired,
      deadlineTextStyle: styles.deadlineExpired
    };
  }

  if (daysLeft === 0) {
    return {
      label: "Ends today",
      badgeStyle: styles.badgeUrgent,
      deadlineTextStyle: styles.deadlineUrgent
    };
  }

  if (daysLeft <= 7) {
    return {
      label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
      badgeStyle: styles.badgeUrgent,
      deadlineTextStyle: styles.deadlineUrgent
    };
  }

  return {
    label: `${daysLeft} days left`,
    badgeStyle: styles.badgeActive,
    deadlineTextStyle: styles.deadlineActive
  };
};

function ScholarshipCard({ title, amount, deadline, onApply }) {
  const deadlineMeta = getDeadlineMeta(deadline);
  const formattedAmount = Number(amount) ? (Number(amount) / 1000).toFixed(0) : "0";

  return (
    <div style={styles.card}>
      <div style={{ ...styles.badge, ...deadlineMeta.badgeStyle }}>{deadlineMeta.label}</div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.amount}>
        <span style={styles.amountLabel}>₹</span>
        <span style={styles.amountValue}>{formattedAmount}K</span>
      </p>
      <div style={styles.divider}></div>
      <p style={{ ...styles.deadline, ...deadlineMeta.deadlineTextStyle }}>
        <strong>📅 Deadline:</strong> {deadline || "Not available"}
      </p>
      <button
        type="button"
        style={styles.button}
        onClick={onApply}
        onMouseEnter={(e) => { e.target.style.backgroundColor = "#1425a7"; }}
        onMouseLeave={(e) => { e.target.style.backgroundColor = "#1e3a8a"; }}
      >
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
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },
  badgeActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  badgeUrgent: {
    background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)"
  },
  badgeExpired: {
    background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)"
  },
  badgeNeutral: {
    background: "linear-gradient(135deg, #64748b 0%, #475569 100%)"
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
    marginBottom: "20px"
  },
  deadlineActive: {
    color: "#666"
  },
  deadlineUrgent: {
    color: "#b45309"
  },
  deadlineExpired: {
    color: "#b91c1c"
  },
  deadlineNeutral: {
    color: "#64748b"
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
