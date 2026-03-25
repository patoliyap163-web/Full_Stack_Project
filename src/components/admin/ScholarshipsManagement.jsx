import React from "react";

const ScholarshipsManagement = ({
  scholarships,
  formData,
  editId,
  handleChange,
  handleSubmit,
  handleDelete,
  handleEdit,
  scholarshipsLoading,
  scholarshipsError
}) => {
  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>Manage Scholarships</h1>
        <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
          Create and manage scholarship programs
        </p>
      </div>

      <div style={styles.formContainer}>
        <h2 style={{ marginTop: 0 }}>{editId ? "Edit Scholarship" : "Add New Scholarship"}</h2>
        <form onSubmit={handleSubmit} style={styles.scholarshipForm}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Scholarship Title *</label>
              <input
                name="title"
                placeholder="e.g., Merit Excellence Award"
                value={formData.title}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">-- Select Category --</option>
                <option value="Academic">Academic</option>
                <option value="Merit-based">Merit-based</option>
                <option value="Need-based">Need-based</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Amount ($) *</label>
              <input
                name="amount"
                type="number"
                placeholder="e.g., 5000"
                value={formData.amount}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Deadline *</label>
              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                placeholder="Describe the scholarship requirements and benefits"
                value={formData.description}
                onChange={handleChange}
                style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Eligibility *</label>
              <textarea
                name="eligibility"
                placeholder="Who can apply for this scholarship?"
                value={formData.eligibility}
                onChange={handleChange}
                style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Min GPA</label>
              <input
                name="gpa"
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                placeholder="e.g., 3.0"
                value={formData.gpa}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Benefits</label>
              <textarea
                name="benefits"
                placeholder="Additional benefits or perks"
                value={formData.benefits}
                onChange={handleChange}
                style={{ ...styles.input, minHeight: "60px", resize: "vertical" }}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Requirements</label>
            <textarea
              name="requirements"
              placeholder="Specific requirements or documents needed"
              value={formData.requirements}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: "60px", resize: "vertical" }}
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            {editId ? "Update Scholarship" : "Add Scholarship"}
          </button>
        </form>
      </div>

      <div style={styles.scholarshipsGrid}>
        {scholarshipsLoading && <div style={styles.infoState}>Loading scholarships...</div>}

        {!scholarshipsLoading && scholarshipsError && (
          <div style={styles.errorState}>{scholarshipsError}</div>
        )}

        {!scholarshipsLoading && !scholarshipsError && scholarships.length === 0 && (
          <div style={styles.infoState}>No scholarships found for this admin yet.</div>
        )}

        {!scholarshipsLoading &&
          !scholarshipsError &&
          scholarships.map((item) => (
            <div key={item.id} style={styles.scholarshipCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={{ margin: "0 0 8px 0", color: "white" }}>{item.title}</h3>
                  <span style={styles.categoryBadge}>{item.category || "Scholarship"}</span>
                </div>

                <div style={styles.amountBox}>
                  <span style={styles.currencySymbol}>$</span>
                  <span style={styles.amountValue}>{item.amount}</span>
                </div>
              </div>

              <div style={styles.cardSection}>
                <h4 style={styles.sectionTitle}>Description</h4>
                <p style={styles.cardText}>{item.description}</p>
              </div>

              <div style={styles.cardSection}>
                <h4 style={styles.sectionTitle}>Eligibility</h4>
                <p style={styles.cardText}>{item.eligibility}</p>
              </div>

              {item.gpa !== null && item.gpa !== undefined && item.gpa !== "" && (
                <div style={styles.cardSection}>
                  <h4 style={styles.sectionTitle}>
                    Min GPA: <strong>{item.gpa}</strong>
                  </h4>
                </div>
              )}

              {item.benefits && (
                <div style={styles.cardSection}>
                  <h4 style={styles.sectionTitle}>Benefits</h4>
                  <p style={styles.cardText}>{item.benefits}</p>
                </div>
              )}

              {item.requirements && (
                <div style={styles.cardSection}>
                  <h4 style={styles.sectionTitle}>Requirements</h4>
                  <p style={styles.cardText}>{item.requirements}</p>
                </div>
              )}

              <div style={styles.deadlineSection}>
                Deadline: <strong>{item.deadline}</strong>
              </div>

              <div style={styles.cardActions}>
                <button type="button" style={styles.editBtn} onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button type="button" style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "40px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  formContainer: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    marginBottom: "40px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0"
  },
  scholarshipForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b"
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    outline: "none"
  },
  submitBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    marginTop: "10px"
  },
  infoState: {
    padding: "18px 20px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
    color: "#1d4ed8",
    fontWeight: "500"
  },
  errorState: {
    padding: "18px 20px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    color: "#b91c1c",
    fontWeight: "500"
  },
  scholarshipsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "25px"
  },
  scholarshipCard: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
    padding: "0",
    border: "1px solid #e2e8f0"
  },
  cardHeader: {
    padding: "20px",
    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  categoryBadge: {
    background: "rgba(255,255,255,0.2)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    marginTop: "8px",
    display: "inline-block"
  },
  amountBox: {
    padding: "20px",
    background: "linear-gradient(135deg, #ecf0f1 0%, #f8f9fb 100%)",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "baseline",
    gap: "8px"
  },
  currencySymbol: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#10b981"
  },
  amountValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#10b981"
  },
  cardSection: {
    padding: "15px 20px",
    borderBottom: "1px solid #e2e8f0"
  },
  sectionTitle: {
    margin: "0 0 10px 0",
    color: "#1e293b",
    fontSize: "13px",
    fontWeight: "600"
  },
  cardText: {
    margin: "0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6"
  },
  deadlineSection: {
    padding: "15px 20px",
    background: "#fffbeb",
    borderBottom: "1px solid #fcd34d",
    fontSize: "13px",
    fontWeight: "500",
    color: "#92400e"
  },
  cardActions: {
    padding: "15px 20px",
    display: "flex",
    gap: "12px"
  },
  editBtn: {
    flex: 1,
    padding: "10px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  deleteBtn: {
    flex: 1,
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    fontWeight: "600",
    transition: "all 0.3s ease"
  }
};

export default ScholarshipsManagement;
