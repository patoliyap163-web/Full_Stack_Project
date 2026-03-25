import React from 'react';

const DashboardOverview = ({
  scholarships,
  financialAid,
  applications,
  aidApplications,
  overallStatusCounts,
  aidStatusCounts
}) => {
  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>📊 Admin Dashboard</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Welcome back! Here's an overview of your scholarship platform</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📚</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Scholarships</p>
            <p style={styles.statValue}>{scholarships.length}</p>
          </div>
          <div style={styles.statTrend}>↑ Active</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Financial Aid</p>
            <p style={styles.statValue}>{financialAid.length}</p>
          </div>
          <div style={styles.statTrend}>Programs</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📋</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Applications</p>
            <p style={styles.statValue}>{applications.length}</p>
          </div>
          <div style={styles.statTrend}>↑ Growing</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💳</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Aid Applications</p>
            <p style={styles.statValue}>{aidApplications.length}</p>
          </div>
          <div style={styles.statTrend}>Interests</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Approved</p>
            <p style={styles.statValue}>{overallStatusCounts.Approved}</p>
          </div>
          <div style={styles.statTrend}>Success</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Pending</p>
            <p style={styles.statValue}>{overallStatusCounts.Pending}</p>
          </div>
          <div style={styles.statTrend}>Review</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>❌</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Rejected</p>
            <p style={styles.statValue}>{overallStatusCounts.Rejected}</p>
          </div>
          <div style={styles.statTrend}>Processed</div>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <button style={styles.actionBtn} onClick={() => window.location.hash = '#scholarships'}>
            ➕ Add Scholarship
          </button>
          <button style={styles.actionBtn} onClick={() => window.location.hash = '#financial-aid'}>
            💰 Add Financial Aid
          </button>
          <button style={styles.actionBtn} onClick={() => window.location.hash = '#applications'}>
            📋 View Applications
          </button>
          <button style={styles.actionBtn} onClick={() => window.location.hash = '#aid-applications'}>
            💳 View Aid Applications
          </button>
          <button style={styles.actionBtn} onClick={() => window.location.hash = '#analytics'}>
            📊 Analytics
          </button>
          <button style={styles.actionBtn} onClick={() => window.location.hash = '#profile'}>
            👤 My Profile
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "40px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  statCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)"
    }
  },
  statIcon: { fontSize: "40px" },
  statContent: { flex: 1 },
  statLabel: { margin: "0", color: "#64748b", fontSize: "13px", fontWeight: "500" },
  statValue: { margin: "5px 0", fontSize: "32px", fontWeight: "700", color: "#1e293b" },
  statTrend: { fontSize: "12px", color: "#10b981", fontWeight: "600", padding: "4px 8px", background: "#d1fae5", borderRadius: "6px" },
  quickActions: { background: "white", padding: "30px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #e2e8f0" },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginTop: "15px" },
  actionBtn: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontSize: "13px"
  }
};

export default DashboardOverview;