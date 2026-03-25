import React from 'react';

const MyApplications = ({ applications, studentName }) => {
  const myApplications = applications.filter(
    (app) => app.studentName === studentName
  );

  const getApprovedCount = () => myApplications.filter(a => a.status === "Approved").length;
  const getPendingCount = () => myApplications.filter(a => a.status === "Pending").length;
  const getRejectedCount = () => myApplications.filter(a => a.status === "Rejected").length;

  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>📋 My Applications</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Track your scholarship application status in real-time</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{fontSize: "32px"}}>✅</div>
          <p>Approved</p>
          <h3>{getApprovedCount()}</h3>
        </div>
        <div style={styles.statCard}>
          <div style={{fontSize: "32px"}}>⏳</div>
          <p>Pending</p>
          <h3>{getPendingCount()}</h3>
        </div>
        <div style={styles.statCard}>
          <div style={{fontSize: "32px"}}>❌</div>
          <p>Rejected</p>
          <h3>{getRejectedCount()}</h3>
        </div>
        <div style={styles.statCard}>
          <div style={{fontSize: "32px"}}>📊</div>
          <p>Total</p>
          <h3>{myApplications.length}</h3>
        </div>
      </div>

      {myApplications.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{fontSize: "18px", color: "#666"}}>No applications yet. Start exploring scholarships!</p>
        </div>
      ) : (
        <div style={styles.applicationsContainer}>
          {myApplications.map((app) => (
            <div key={app.id} style={styles.applicationCard}>
              <div style={styles.appCardHeader}>
                <div>
                  <h3 style={{margin: "0 0 5px 0"}}>{app.scholarshipTitle}</h3>
                  <p style={{margin: 0, color: "#666", fontSize: "13px"}}>Applied on {app.appliedDate}</p>
                </div>
                <span style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontWeight: "600",
                  fontSize: "13px",
                  background: app.status === "Approved" ? "#d1fae5" : app.status === "Pending" ? "#fef3c7" : "#fee2e2",
                  color: app.status === "Approved" ? "#065f46" : app.status === "Pending" ? "#92400e" : "#991b1b"
                }}>
                  {app.status}
                </span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: app.status === "Approved" ? "100%" : app.status === "Pending" ? "50%" : "0%",
                  background: app.status === "Approved" ? "#10b981" : app.status === "Pending" ? "#f59e0b" : "#ef4444"
                }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },
  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0"
  },
  applicationsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  applicationCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
  },
  appCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px"
  },
  progressBar: {
    height: "6px",
    background: "#e2e8f0",
    borderRadius: "10px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    transition: "width 0.3s ease"
  }
};

export default MyApplications;