import React from 'react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ApplicationsManagement = ({
  applications,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  updateApplicationStatus,
  currentApplications,
  totalPages,
  currentPage,
  setCurrentPage
}) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Scholarship Applications Report", 14, 15);

    const tableColumn = ["Student Name", "Scholarship", "Status"];
    const tableRows = [];

    applications.filter((app) => {
      const matchesSearch = (app.studentName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || app.status === filterStatus;

      return matchesSearch && matchesStatus;
    }).forEach((app) => {
      tableRows.push([app.studentName, app.scholarshipTitle, app.status]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("applications_report.pdf");
  };

  const exportToExcel = () => {
    const filteredApps = applications.filter((app) => {
      const matchesSearch = (app.studentName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || app.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredApps);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(data, "applications_report.xlsx");
  };

  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>📋 Student Applications</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Total: {applications.length} applications</p>
      </div>

      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="🔍 Search by student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.filterSelect}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <button style={styles.exportBtn} onClick={exportToPDF}>
          📄 Export PDF
        </button>

        <button style={styles.exportBtn} onClick={exportToExcel}>
          📊 Export Excel
        </button>
      </div>

      <div style={styles.applicationsContainer}>
        {currentApplications.length > 0 ? (
          currentApplications.map((app) => (
            <div key={app.id} style={styles.applicationCard}>
              <div style={styles.appHeader}>
                <div>
                  <h3 style={{margin: "0 0 5px 0", fontSize: "18px"}}>{app.studentName}</h3>
                  <p style={{margin: 0, color: "#666", fontSize: "13px"}}>{app.scholarshipTitle}</p>
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
                    onClick={() => updateApplicationStatus(app.id, "Approved")}
                  >
                    ✓ Approve
                  </button>
                  <button
                    style={styles.rejectBtnSmall}
                    onClick={() => updateApplicationStatus(app.id, "Rejected")}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <p style={{fontSize: "16px", color: "#666"}}>No applications found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              style={{
                ...styles.pageBtn,
                ...(currentPage === index + 1 ? styles.pagebtnActive : {})
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
  exportBtn: {
    padding: "10px 16px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.3s ease"
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

export default ApplicationsManagement;