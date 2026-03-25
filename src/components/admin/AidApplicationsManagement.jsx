import React from 'react';

const AidApplicationsManagement = ({
  aidApplications,
  aidSearchTerm,
  setAidSearchTerm,
  aidFilterStatus,
  setAidFilterStatus,
  updateAidApplicationStatus,
  currentAidApplications,
  aidTotalPages,
  aidCurrentPage,
  setAidCurrentPage
}) => {
  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>💳 Financial Aid Applications</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Total: {aidApplications.length} aid applications</p>
      </div>

      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search by student name..."
          value={aidSearchTerm}
          onChange={(e) => setAidSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={aidFilterStatus}
          onChange={(e) => setAidFilterStatus(e.target.value)}
          style={styles.filterSelect}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div style={styles.applicationsContainer}>
        {currentAidApplications.length > 0 ? (
          currentAidApplications.map((app) => (
            <div key={app.id} style={styles.applicationCard}>
              <div style={styles.appHeader}>
                <div>
                  <h3 style={{margin: "0 0 5px 0", fontSize: "18px"}}>{app.studentName}</h3>
                  <p style={{margin: 0, color: "#666", fontSize: "13px"}}>{app.aidTitle}</p>
                  <p style={{margin: "5px 0 0 0", color: "#64748b", fontSize: "13px"}}>Applied on {app.appliedDate}</p>
                </div>
                <span style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: "600",
                  fontSize: "12px",
                  background: app.status === "Approved" ? "#d1fae5" : app.status === "Pending" ? "#fef3c7" : "#fee2e2",
                  color: app.status === "Approved" ? "#065f46" : app.status === "Pending" ? "#92400e" : "#991b1b"
                }}>
                  {app.status}
                </span>
              </div>

              {app.description && (
                <div style={styles.appDescription}>
                  <strong>Description:</strong>
                  <p style={{margin: "8px 0 0 0", fontSize: "13px", color: "#64748b"}}>{app.description}</p>
                </div>
              )}

              {app.status === "Pending" && (
                <div style={styles.appActions}>
                  <button
                    style={styles.approveBtnSmall}
                    onClick={() => updateAidApplicationStatus(app.id, "Approved")}
                  >
                    ✓ Approve
                  </button>
                  <button
                    style={styles.rejectBtnSmall}
                    onClick={() => updateAidApplicationStatus(app.id, "Rejected")}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <p style={{fontSize: "16px", color: "#666"}}>No aid applications found</p>
          </div>
        )}
      </div>

      {aidTotalPages > 1 && (
        <div style={styles.pagination}>
          {Array.from({ length: aidTotalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setAidCurrentPage(index + 1)}
              style={{
                ...styles.pageBtn,
                ...(aidCurrentPage === index + 1 ? styles.pagebtnActive : {})
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "40px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  filterSection: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  searchInput: {
    flex: 1,
    minWidth: "200px",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease"
  },
  filterSelect: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    cursor: "pointer",
    outline: "none"
  },
  applicationsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px"
  },
  applicationCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease"
  },
  appHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px"
  },
  appDescription: {
    padding: "15px",
    background: "#f8f9fb",
    borderRadius: "8px",
    marginBottom: "15px",
    border: "1px solid #e2e8f0"
  },
  appActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },
  approveBtnSmall: {
    flex: 1,
    padding: "8px 12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.3s ease"
  },
  rejectBtnSmall: {
    flex: 1,
    padding: "8px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.3s ease"
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#f8f9fb",
    borderRadius: "10px",
    border: "1px dashed #cbd5e1"
  },
  pagination: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  pageBtn: {
    padding: "8px 16px",
    border: "1px solid #e2e8f0",
    background: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
    fontSize: "13px"
  },
  pagebtnActive: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "1px solid #3b82f6"
  }
};

export default AidApplicationsManagement;