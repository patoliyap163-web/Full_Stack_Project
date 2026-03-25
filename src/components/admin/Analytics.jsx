import React from 'react';

const Analytics = ({
  scholarships,
  applications,
  aidApplications,
  users
}) => {
  // Calculate analytics data
  const totalScholarships = scholarships.length;
  const totalApplications = applications.length;
  const totalAidApplications = aidApplications.length;
  const totalUsers = users.length;

  const approvedApplications = applications.filter(app => app.status === "Approved").length;
  const pendingApplications = applications.filter(app => app.status === "Pending").length;
  const rejectedApplications = applications.filter(app => app.status === "Rejected").length;

  const approvedAidApplications = aidApplications.filter(app => app.status === "Approved").length;
  const pendingAidApplications = aidApplications.filter(app => app.status === "Pending").length;
  const rejectedAidApplications = aidApplications.filter(app => app.status === "Rejected").length;

  const approvalRate = totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(1) : 0;
  const aidApprovalRate = totalAidApplications > 0 ? ((approvedAidApplications / totalAidApplications) * 100).toFixed(1) : 0;



  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>📊 Analytics Dashboard</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Platform performance and insights</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎓</div>
          <div style={styles.statContent}>
            <h3 style={{margin: 0, fontSize: "24px", fontWeight: "700"}}>{totalUsers}</h3>
            <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Total Users</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📚</div>
          <div style={styles.statContent}>
            <h3 style={{margin: 0, fontSize: "24px", fontWeight: "700"}}>{totalScholarships}</h3>
            <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Scholarships</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📝</div>
          <div style={styles.statContent}>
            <h3 style={{margin: 0, fontSize: "24px", fontWeight: "700"}}>{totalApplications}</h3>
            <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Applications</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💳</div>
          <div style={styles.statContent}>
            <h3 style={{margin: 0, fontSize: "24px", fontWeight: "700"}}>{totalAidApplications}</h3>
            <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Aid Applications</p>
          </div>
        </div>
      </div>

      <div style={styles.chartsSection}>
        <div style={styles.chartCard}>
          <h3 style={{margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600"}}>Application Status Distribution</h3>
          <div style={styles.statusChart}>
            <div style={styles.statusItem}>
              <div style={styles.statusBar}>
                <div
                  style={{
                    ...styles.statusFill,
                    background: "#10b981",
                    width: `${totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div style={styles.statusLabel}>
                <span style={{color: "#10b981"}}>Approved</span>
                <span style={{fontWeight: "600"}}>{approvedApplications}</span>
              </div>
            </div>

            <div style={styles.statusItem}>
              <div style={styles.statusBar}>
                <div
                  style={{
                    ...styles.statusFill,
                    background: "#f59e0b",
                    width: `${totalApplications > 0 ? (pendingApplications / totalApplications) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div style={styles.statusLabel}>
                <span style={{color: "#f59e0b"}}>Pending</span>
                <span style={{fontWeight: "600"}}>{pendingApplications}</span>
              </div>
            </div>

            <div style={styles.statusItem}>
              <div style={styles.statusBar}>
                <div
                  style={{
                    ...styles.statusFill,
                    background: "#ef4444",
                    width: `${totalApplications > 0 ? (rejectedApplications / totalApplications) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div style={styles.statusLabel}>
                <span style={{color: "#ef4444"}}>Rejected</span>
                <span style={{fontWeight: "600"}}>{rejectedApplications}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={{margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600"}}>Financial Aid Status Distribution</h3>
          <div style={styles.statusChart}>
            <div style={styles.statusItem}>
              <div style={styles.statusBar}>
                <div
                  style={{
                    ...styles.statusFill,
                    background: "#10b981",
                    width: `${totalAidApplications > 0 ? (approvedAidApplications / totalAidApplications) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div style={styles.statusLabel}>
                <span style={{color: "#10b981"}}>Approved</span>
                <span style={{fontWeight: "600"}}>{approvedAidApplications}</span>
              </div>
            </div>

            <div style={styles.statusItem}>
              <div style={styles.statusBar}>
                <div
                  style={{
                    ...styles.statusFill,
                    background: "#f59e0b",
                    width: `${totalAidApplications > 0 ? (pendingAidApplications / totalAidApplications) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div style={styles.statusLabel}>
                <span style={{color: "#f59e0b"}}>Pending</span>
                <span style={{fontWeight: "600"}}>{pendingAidApplications}</span>
              </div>
            </div>

            <div style={styles.statusItem}>
              <div style={styles.statusBar}>
                <div
                  style={{
                    ...styles.statusFill,
                    background: "#ef4444",
                    width: `${totalAidApplications > 0 ? (rejectedAidApplications / totalAidApplications) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <div style={styles.statusLabel}>
                <span style={{color: "#ef4444"}}>Rejected</span>
                <span style={{fontWeight: "600"}}>{rejectedAidApplications}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.metricsSection}>
        <div style={styles.metricCard}>
          <h4 style={{margin: "0 0 10px 0", fontSize: "16px", fontWeight: "600"}}>Scholarship Application Approval Rate</h4>
          <div style={styles.metricValue}>
            <span style={{fontSize: "32px", fontWeight: "700", color: "#3b82f6"}}>{approvalRate}%</span>
            <span style={{fontSize: "14px", color: "#666", marginLeft: "10px"}}>of applications approved</span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <h4 style={{margin: "0 0 10px 0", fontSize: "16px", fontWeight: "600"}}>Financial Aid Approval Rate</h4>
          <div style={styles.metricValue}>
            <span style={{fontSize: "32px", fontWeight: "700", color: "#10b981"}}>{aidApprovalRate}%</span>
            <span style={{fontSize: "14px", color: "#666", marginLeft: "10px"}}>of aid applications approved</span>
          </div>
        </div>

        <div style={styles.metricCard}>
          <h4 style={{margin: "0 0 10px 0", fontSize: "16px", fontWeight: "600"}}>Average Applications per User</h4>
          <div style={styles.metricValue}>
            <span style={{fontSize: "32px", fontWeight: "700", color: "#8b5cf6"}}>{totalUsers > 0 ? (totalApplications / totalUsers).toFixed(1) : 0}</span>
            <span style={{fontSize: "14px", color: "#666", marginLeft: "10px"}}>applications per user</span>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "40px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  statCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "all 0.3s ease"
  },
  statIcon: {
    fontSize: "40px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "12px",
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },
  statContent: {
    flex: 1
  },
  chartsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "25px",
    marginBottom: "40px"
  },
  chartCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  statusChart: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  statusItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  statusBar: {
    flex: 1,
    height: "20px",
    background: "#f1f5f9",
    borderRadius: "10px",
    overflow: "hidden"
  },
  statusFill: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.5s ease"
  },
  statusLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "120px",
    fontSize: "14px",
    fontWeight: "500"
  },
  metricsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },
  metricCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  metricValue: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px"
  }
};

export default Analytics;