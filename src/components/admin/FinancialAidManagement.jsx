import React from 'react';

const FinancialAidManagement = ({
  financialAid,
  setFinancialAid,
  aidFormData,
  setAidFormData,
  aidEditId,
  setAidEditId,
  addFinancialAid,
  deleteFinancialAid,
  editFinancialAid
}) => {
  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>💰 Financial Aid Management</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Manage financial aid opportunities and loans</p>
      </div>

      <div style={styles.formContainer}>
        <h2 style={{marginTop: 0}}>➕ Add Financial Aid</h2>
        <form onSubmit={addFinancialAid} style={styles.scholarshipForm}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Aid Name *</label>
              <input
                name="title"
                placeholder="e.g., Federal Student Loan"
                value={aidFormData.title}
                onChange={(e) => setAidFormData({...aidFormData, title: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type</label>
              <select
                name="type"
                value={aidFormData.type}
                onChange={(e) => setAidFormData({...aidFormData, type: e.target.value})}
                style={styles.input}
              >
                <option>Loan</option>
                <option>Grant</option>
                <option>Work-Study</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Maximum Amount ($) *</label>
              <input
                name="amount"
                type="number"
                placeholder="e.g., 10000"
                value={aidFormData.amount}
                onChange={(e) => setAidFormData({...aidFormData, amount: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Interest Rate (%) {aidFormData.type === "Loan" && "*"}</label>
              <input
                name="interestRate"
                type="number"
                step="0.01"
                placeholder="e.g., 4.5"
                value={aidFormData.interestRate}
                onChange={(e) => setAidFormData({...aidFormData, interestRate: e.target.value})}
                style={styles.input}
                required={aidFormData.type === "Loan"}
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Deadline</label>
              <input
                name="deadline"
                type="date"
                value={aidFormData.deadline}
                onChange={(e) => setAidFormData({...aidFormData, deadline: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                placeholder="Describe the financial aid program"
                value={aidFormData.description}
                onChange={(e) => setAidFormData({...aidFormData, description: e.target.value})}
                style={{...styles.input, minHeight: "80px", resize: "vertical"}}
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Requirements</label>
            <textarea
              name="requirements"
              placeholder="Specific requirements or eligibility criteria"
              value={aidFormData.requirements}
              onChange={(e) => setAidFormData({...aidFormData, requirements: e.target.value})}
              style={{...styles.input, minHeight: "60px", resize: "vertical"}}
            />
          </div>
          <button type="submit" style={styles.submitBtn}>
            {aidEditId ? "✏️ Update Financial Aid" : "➕ Add Financial Aid"}
          </button>
        </form>
      </div>

      <div style={styles.aidGrid}>
        {financialAid.map((aid) => (
          <div key={aid.id} style={styles.aidCard}>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={{margin: "0 0 8px 0", color: "white"}}>{aid.title}</h3>
                <span style={styles.typeBadge}>{aid.type}</span>
              </div>
              <div style={styles.amountBox}>
                <span style={styles.amountLabel}>Max Amount:</span>
                <span style={styles.amountValue}>${aid.amount}</span>
              </div>
            </div>

            {aid.interestRate && (
              <div style={styles.cardSection}>
                <h4 style={styles.sectionTitle}>💰 Interest Rate: <strong>{aid.interestRate}%</strong></h4>
              </div>
            )}

            {aid.type === "Loan" && (
              <div style={styles.warningSection}>
                <span>⚠️ This is a loan with repayment terms</span>
              </div>
            )}

            {aid.description && (
              <div style={styles.cardSection}>
                <h4 style={styles.sectionTitle}>📝 Description</h4>
                <p style={styles.cardText}>{aid.description}</p>
              </div>
            )}

            {aid.requirements && (
              <div style={styles.cardSection}>
                <h4 style={styles.sectionTitle}>📋 Requirements</h4>
                <p style={styles.cardText}>{aid.requirements}</p>
              </div>
            )}

            {aid.deadline && (
              <div style={styles.deadlineSection}>
                <span style={styles.deadlineIcon}>📅</span> Deadline: <strong>{aid.deadline}</strong>
              </div>
            )}

            <div style={styles.cardActions}>
              <button style={styles.editBtn} onClick={() => editFinancialAid(aid)}>
                ✏️ Edit
              </button>
              <button style={styles.deleteBtn} onClick={() => deleteFinancialAid(aid.id)}>
                🗑️ Delete
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
  aidGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px"
  },
  aidCard: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
    padding: "0",
    border: "1px solid #e2e8f0",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)"
    }
  },
  cardHeader: {
    padding: "20px",
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  typeBadge: {
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
    background: "linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)",
    borderBottom: "1px solid #e2e8f0",
    textAlign: "center"
  },
  amountLabel: {
    display: "block",
    fontSize: "12px",
    color: "#6d28d9",
    marginBottom: "4px"
  },
  amountValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#6d28d9"
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
  warningSection: {
    padding: "15px 20px",
    background: "#fef3c7",
    borderBottom: "1px solid #fcd34d",
    fontSize: "13px",
    fontWeight: "500",
    color: "#92400e"
  },
  deadlineSection: {
    padding: "15px 20px",
    background: "#fffbeb",
    borderBottom: "1px solid #fcd34d",
    fontSize: "13px",
    fontWeight: "500",
    color: "#92400e"
  },
  deadlineIcon: {
    marginRight: "8px"
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

export default FinancialAidManagement;