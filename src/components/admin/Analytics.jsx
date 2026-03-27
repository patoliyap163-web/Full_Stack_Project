import React, { useMemo } from 'react';

const STATUS = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED"
};

const getStatusCounts = (items = []) => {
  return items.reduce(
    (counts, item) => {
      const normalizedStatus = String(item?.status || "").toUpperCase();

      if (normalizedStatus === STATUS.APPROVED) counts.approved += 1;
      if (normalizedStatus === STATUS.PENDING) counts.pending += 1;
      if (normalizedStatus === STATUS.REJECTED) counts.rejected += 1;

      return counts;
    },
    { approved: 0, pending: 0, rejected: 0 }
  );
};

const Analytics = ({
  scholarships = [],
  applications = [],
  aidApplications = [],
  users = []
}) => {
  const applicationCounts = useMemo(() => getStatusCounts(applications), [applications]);
  const aidApplicationCounts = useMemo(() => getStatusCounts(aidApplications), [aidApplications]);

  const totalScholarships = scholarships.length;
  const totalApplications = applications.length;
  const totalAidApplications = aidApplications.length;

  const inferredUsersCount = useMemo(() => {
    if (users.length > 0) {
      return users.length;
    }

    const uniqueUsers = new Set();

    [...applications, ...aidApplications].forEach((application) => {
      const studentId = application?.student?.id;
      const studentEmail = application?.student?.email;
      const studentName = application?.student?.name;
      const identity = studentId || studentEmail || studentName;

      if (identity) {
        uniqueUsers.add(identity);
      }
    });

    return uniqueUsers.size;
  }, [users, applications, aidApplications]);

  const approvalRate = totalApplications > 0
    ? ((applicationCounts.approved / totalApplications) * 100).toFixed(1)
    : "0.0";

  const aidApprovalRate = totalAidApplications > 0
    ? ((aidApplicationCounts.approved / totalAidApplications) * 100).toFixed(1)
    : "0.0";

  const averageApplicationsPerUser = inferredUsersCount > 0
    ? (totalApplications / inferredUsersCount).toFixed(1)
    : "0.0";

  const scholarshipCategoryData = useMemo(() => {
    const counts = scholarships.reduce((acc, scholarship) => {
      const category = scholarship?.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [scholarships]);

  const renderStatusRow = (label, color, count, total) => (
    <div style={styles.statusItem}>
      <div style={styles.statusBar}>
        <div
          style={{
            ...styles.statusFill,
            background: color,
            width: `${total > 0 ? (count / total) * 100 : 0}%`
          }}
        />
      </div>
      <div style={styles.statusLabel}>
        <span style={{color}}>{label}</span>
        <span style={{fontWeight: "600"}}>{count}</span>
      </div>
    </div>
  );

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
            <h3 style={{margin: 0, fontSize: "24px", fontWeight: "700"}}>{inferredUsersCount}</h3>
            <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Active Applicants</p>
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
            <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Scholarship Applications</p>
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
            {renderStatusRow("Approved", "#10b981", applicationCounts.approved, totalApplications)}
            {renderStatusRow("Pending", "#f59e0b", applicationCounts.pending, totalApplications)}
            {renderStatusRow("Rejected", "#ef4444", applicationCounts.rejected, totalApplications)}
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={{margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600"}}>Financial Aid Status Distribution</h3>
          <div style={styles.statusChart}>
            {renderStatusRow("Approved", "#10b981", aidApplicationCounts.approved, totalAidApplications)}
            {renderStatusRow("Pending", "#f59e0b", aidApplicationCounts.pending, totalAidApplications)}
            {renderStatusRow("Rejected", "#ef4444", aidApplicationCounts.rejected, totalAidApplications)}
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
            <span style={{fontSize: "32px", fontWeight: "700", color: "#8b5cf6"}}>{averageApplicationsPerUser}</span>
            <span style={{fontSize: "14px", color: "#666", marginLeft: "10px"}}>applications per user</span>
          </div>
        </div>
      </div>

      <div style={styles.breakdownSection}>
        <div style={styles.chartCard}>
          <h3 style={{margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600"}}>Scholarship Categories</h3>
          {scholarshipCategoryData.length > 0 ? (
            <div style={styles.categoryList}>
              {scholarshipCategoryData.map((item) => (
                <div key={item.label} style={styles.categoryRow}>
                  <span style={styles.categoryName}>{item.label}</span>
                  <span style={styles.categoryValue}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>No scholarship data available yet.</div>
          )}
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
    gap: "20px",
    marginBottom: "40px"
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
    gap: "10px",
    flexWrap: "wrap"
  },
  breakdownSection: {
    display: "grid",
    gridTemplateColumns: "1fr"
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  categoryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    background: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #e2e8f0"
  },
  categoryName: {
    color: "#334155",
    fontWeight: "500"
  },
  categoryValue: {
    color: "#1e293b",
    fontWeight: "700"
  },
  emptyState: {
    padding: "18px",
    borderRadius: "10px",
    background: "#f8fafc",
    color: "#64748b",
    border: "1px dashed #cbd5e1"
  }
};

export default Analytics;
