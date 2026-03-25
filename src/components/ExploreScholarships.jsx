import React from 'react';

const ExploreScholarships = ({
  scholarships,
  applications,
  studentName,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  handleApply
}) => {
  const getStatus = (scholarshipId) => {
    const app = applications.find(
      (a) => a.scholarshipId === scholarshipId && a.studentName === studentName
    );
    return app ? app.status : null;
  };

  const filteredScholarships = scholarships.filter((sch) => {
    const matchesSearch =
      sch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sch.category && sch.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sch.description && sch.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Normalize category comparison (handle spaces and hyphens)
    const normalizeCategory = (cat) => {
      if (!cat) return "";
      return cat.toLowerCase().replace(/[-\s]+/g, " ").trim();
    };

    const normalizedSchCategory = normalizeCategory(sch.category);
    const normalizedFilter = normalizeCategory(filterCategory);

    const matchesCategory = filterCategory === "All" || normalizedSchCategory.includes(normalizedFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>🔍 Explore Scholarships</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Find and apply for scholarships matching your profile</p>
      </div>

      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="🔍 Search scholarships by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Categories</option>
          <option value="Merit-based">Merit-based</option>
          <option value="Need-based">Need-based</option>
        </select>
      </div>

      {filteredScholarships.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{fontSize: "18px", color: "#666"}}>No scholarships found</p>
        </div>
      ) : (
        <div style={styles.scholarshipsGrid}>
          {filteredScholarships.map((item) => {
            const status = getStatus(item.id);

            return (
              <div key={item.id} style={styles.scholarshipCard}>
                <div style={styles.cardHeader}>
                  <h3 style={{margin: "0 0 8px 0"}}>{item.title}</h3>
                  <span style={styles.categoryBadge}>{item.category || "Scholarship"}</span>
                </div>

                <div style={styles.amountBox}>
                  <span style={{fontSize: "18px", fontWeight: "bold", color: "#10b981"}}>$</span>
                  <span style={{fontSize: "32px", fontWeight: "700", color: "#10b981"}}>{item.amount}</span>
                </div>

                {item.description && (
                  <div style={styles.cardInfo}>
                    <strong>📝 Details:</strong>
                    <p style={{margin: "8px 0 0 0", fontSize: "13px", color: "#64748b"}}>{item.description}</p>
                  </div>
                )}

                {item.gpa && (
                  <div style={styles.cardInfo}>
                    <strong>📊 Min GPA:</strong> {item.gpa}
                  </div>
                )}

                {item.deadline && (
                  <div style={styles.cardInfo}>
                    <strong>📅 Deadline:</strong> {item.deadline}
                  </div>
                )}

                {status ? (
                  <div style={{
                    padding: "10px 15px",
                    background: status === "Approved" ? "#d1fae5" : status === "Pending" ? "#fef3c7" : "#fee2e2",
                    borderRadius: "6px",
                    color: status === "Approved" ? "#065f46" : status === "Pending" ? "#92400e" : "#991b1b",
                    fontWeight: "600",
                    fontSize: "13px",
                    marginTop: "15px",
                    textAlign: "center"
                  }}>
                    ✓ Applied: {status}
                  </div>
                ) : (
                  <button
                    style={styles.applyBtn}
                    onClick={() => handleApply(item)}
                  >
                    ➕ Apply Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  searchSection: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  searchInput: {
    flex: 1,
    minWidth: "250px",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none"
  },
  filterSelect: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    cursor: "pointer"
  },
  scholarshipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  scholarshipCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease"
  },
  cardHeader: {
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid #e2e8f0"
  },
  categoryBadge: {
    padding: "4px 12px",
    background: "#ecf0f1",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: "8px",
    display: "inline-block"
  },
  amountBox: {
    padding: "15px",
    background: "#f0fdf4",
    borderRadius: "8px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    borderLeft: "4px solid #10b981"
  },
  cardInfo: {
    padding: "12px 0",
    fontSize: "13px",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0"
  },
  applyBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "15px",
    transition: "all 0.3s ease"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0"
  }
};

export default ExploreScholarships;