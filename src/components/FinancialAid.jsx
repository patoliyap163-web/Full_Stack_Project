import React, { useState } from 'react';

const FinancialAid = ({ financialAid, handleInterestedAid, aidApplications, studentName }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAid, setSelectedAid] = useState(null);
  const [description, setDescription] = useState('');

  const getAidStatus = (aidId) => {
    const app = aidApplications.find(
      (a) => a.aidId === aidId && a.studentName === studentName
    );
    return app ? app.status : null;
  };

  const handleInterestedClick = (aid) => {
    setSelectedAid(aid);
    setShowModal(true);
  };

  const handleSubmitInterest = () => {
    if (description.trim()) {
      handleInterestedAid(selectedAid, description);
      setShowModal(false);
      setDescription('');
      setSelectedAid(null);
    } else {
      alert('Description is required');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDescription('');
    setSelectedAid(null);
  };

  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>💰 Financial Aid Programs</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Explore loans, grants, and work-study opportunities</p>
      </div>

      {financialAid.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{fontSize: "18px", color: "#666"}}>No financial aid programs available yet</p>
        </div>
      ) : (
        <div style={styles.aidGrid}>
          {financialAid.map((aid) => (
            <div key={aid.id} style={styles.aidCard}>
              <div style={styles.aidCardHeader}>
                <h3 style={{margin: "0 0 8px 0"}}>{aid.title}</h3>
                <span style={styles.typeBadge}>{aid.type}</span>
              </div>

              <div style={styles.aidAmountBox}>
                <span>Max Amount: </span>
                <span style={{fontSize: "24px", fontWeight: "700", color: "#8b5cf6"}}>${aid.amount}</span>
              </div>

              {aid.interestRate && (
                <div style={styles.aidInfo}>
                  <strong>Interest Rate:</strong> {aid.interestRate}%
                </div>
              )}

              {aid.type === "Loan" && (
                <div style={{...styles.aidInfo, background: "#fef3c7", padding: "8px", borderRadius: "4px"}}>
                  💡 This is a loan with repayment terms
                </div>
              )}

              {aid.description && (
                <div style={styles.aidInfo}>
                  <strong>Details:</strong>
                  <p style={{margin: "8px 0 0 0", fontSize: "13px"}}>{aid.description}</p>
                </div>
              )}

              {aid.requirements && (
                <div style={styles.aidInfo}>
                  <strong>Requirements:</strong>
                  <p style={{margin: "8px 0 0 0", fontSize: "13px"}}>{aid.requirements}</p>
                </div>
              )}

              {(() => {
                const status = getAidStatus(aid.id);
                return status ? (
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
                    ✓ Interest Expressed: {status}
                  </div>
                ) : (
                  <button
                    style={styles.interestedBtn}
                    onClick={() => handleInterestedClick(aid)}
                  >
                    ⭐ I'm Interested
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Express Interest in {selectedAid?.title}</h2>
            <textarea
              placeholder="Enter your interest description (required)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              rows={5}
            />
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={handleCloseModal}>Cancel</button>
              <button style={styles.submitBtn} onClick={handleSubmitInterest}>Submit Interest</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0"
  },
  aidGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  aidCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0"
  },
  aidCardHeader: {
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid #e2e8f0"
  },
  typeBadge: {
    padding: "4px 12px",
    background: "#f3e8ff",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#6d28d9",
    marginTop: "8px",
    display: "inline-block"
  },
  aidAmountBox: {
    padding: "15px",
    background: "#f5f3ff",
    borderRadius: "8px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    borderLeft: "4px solid #8b5cf6"
  },
  aidInfo: {
    padding: "10px 0",
    fontSize: "13px",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0"
  },
  interestedBtn: {
    width: "100%",
    padding: "12px",
    background: "#fbbf24",
    color: "#78350f",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "15px",
    transition: "all 0.3s ease"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    marginBottom: "15px"
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end"
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "#e2e8f0",
    color: "#64748b",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  },
  submitBtn: {
    padding: "10px 20px",
    background: "#fbbf24",
    color: "#78350f",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  }
};

export default FinancialAid;