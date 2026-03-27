import React, { useState, useEffect } from 'react';

const MAJOR_OPTIONS = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Data Science",
  "Business Administration",
  "Finance",
  "Economics",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Medicine",
  "Law",
  "Psychology",
  "English",
  "Other"
];

const UNIVERSITY_OPTIONS = [
  "Harvard University",
  "Stanford University",
  "Massachusetts Institute of Technology",
  "University of California, Berkeley",
  "University of Oxford",
  "University of Cambridge",
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "Delhi University",
  "Jawaharlal Nehru University",
  "Anna University",
  "Other"
];

const Profile = ({
  studentProfile,
  setStudentProfile,
  studentEmail,
  applications,
  scholarships,
  setActive,
  updateStudentProfile,
  profileLoading,
  profileError,
  profileSaving
}) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editData, setEditData] = useState(studentProfile);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setEditData(studentProfile);
  }, [studentProfile]);

  const myApplications = applications || [];

  const getApprovedCount = () => myApplications.filter(a => a.status === "APPROVED").length;
  const getPendingCount = () => myApplications.filter(a => a.status === "PENDING").length;
  const getRejectedCount = () => myApplications.filter(a => a.status === "REJECTED").length;

  const getDisplayValue = (value) => value ? value : "Not provided";
  const getDisplayGpa = () => {
    if (studentProfile.gpa === "" || studentProfile.gpa === null || studentProfile.gpa === undefined) {
      return "None";
    }

    return `${studentProfile.gpa} / 4.0`;
  };

  const updateProfile = async () => {
    setSaveError("");

    const updatedProfile = {
      ...editData,
      email: studentEmail // Keep email synchronized
    };

    try {
      await updateStudentProfile(updatedProfile);
      setStudentProfile(updatedProfile);
      setEditingProfile(false);
    } catch (error) {
      setSaveError(error.message || "Failed to save profile");
    }
  };

  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>👤 My Profile</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Complete student account information</p>
      </div>

      {profileError && !editingProfile && (
        <div style={styles.errorBanner}>{profileError}</div>
      )}

      {profileLoading ? (
        <div style={styles.profileCard}>
          <p style={{margin: 0, color: "#64748b"}}>Loading profile...</p>
        </div>
      ) : !editingProfile ? (
        <div style={styles.profileCard}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px"}}>
            <div>
              <h2 style={{margin: "0 0 8px 0", fontSize: "32px", fontWeight: "700", color: "#1e293b"}}>
                👋 {studentProfile.fullName || "Student"}
              </h2>
              <p style={{margin: "0 0 3px 0", color: "#64748b", fontSize: "14px"}}>
                📧 {getDisplayValue(studentProfile.email)}
              </p>
              <p style={{margin: "8px 0 0 0", color: "#94a3b8", fontSize: "13px"}}>
                📚 {studentProfile.major || "Major not specified"}
              </p>
            </div>
            <button
              style={styles.editProfileBtn}
              onClick={() => {setEditingProfile(true); setEditData(studentProfile);}}
            >
              ✏️ Edit Profile
            </button>
          </div>

          {/* Detailed Information Grid - All in Single Card */}
          <div style={styles.singleCardInfoGrid}>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>👤 Full Name</div>
              <div style={styles.infoValue}>{getDisplayValue(studentProfile.fullName)}</div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>📧 Email Address</div>
              <div style={styles.infoValue}>{getDisplayValue(studentProfile.email)}</div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>📱 Phone Number</div>
              <div style={styles.infoValue}>{getDisplayValue(studentProfile.phone)}</div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>📚 Major/Field of Study</div>
              <div style={styles.infoValue}>{getDisplayValue(studentProfile.major)}</div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>📊 Grade Point Average (GPA)</div>
              <div style={styles.infoValue}>{getDisplayGpa()}</div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>🏫 University/Institute</div>
              <div style={styles.infoValue}>{getDisplayValue(studentProfile.university)}</div>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>📅 Member Since</div>
              <div style={styles.infoValue}>{getDisplayValue(studentProfile.enrollmentDate)}</div>
            </div>
          </div>

          <div style={styles.statsSection}>
            <h2 style={{marginTop: "30px", marginBottom: "30px", fontSize: "26px", fontWeight: "700"}}>📈 Your Application Statistics</h2>

            <div style={styles.detailedStatsContainer}>
              <div style={styles.detailedStatCard}>
                <div style={{fontSize: "40px", marginBottom: "15px"}}>📝</div>
                <h4 style={{margin: "0 0 10px 0", color: "#64748b"}}>Total Applications</h4>
                <p style={{fontSize: "36px", fontWeight: "700", color: "#1e293b", margin: 0}}>
                  {myApplications.length}
                </p>
                <p style={{margin: "10px 0 0 0", fontSize: "13px", color: "#999"}}>Applications submitted</p>
              </div>

              <div style={styles.detailedStatCard}>
                <div style={{fontSize: "40px", marginBottom: "15px"}}>✅</div>
                <h4 style={{margin: "0 0 10px 0", color: "#64748b"}}>Scholarships Won</h4>
                <p style={{fontSize: "36px", fontWeight: "700", color: "#10b981", margin: 0}}>
                  {getApprovedCount()}
                </p>
                <p style={{margin: "10px 0 0 0", fontSize: "13px", color: "#999"}}>Approved applications</p>
              </div>

              <div style={styles.detailedStatCard}>
                <div style={{fontSize: "40px", marginBottom: "15px"}}>⏳</div>
                <h4 style={{margin: "0 0 10px 0", color: "#64748b"}}>Pending Review</h4>
                <p style={{fontSize: "36px", fontWeight: "700", color: "#f59e0b", margin: 0}}>
                  {getPendingCount()}
                </p>
                <p style={{margin: "10px 0 0 0", fontSize: "13px", color: "#999"}}>Awaiting decisions</p>
              </div>

              <div style={styles.detailedStatCard}>
                <div style={{fontSize: "40px", marginBottom: "15px"}}>❌</div>
                <h4 style={{margin: "0 0 10px 0", color: "#64748b"}}>Not Selected</h4>
                <p style={{fontSize: "36px", fontWeight: "700", color: "#ef4444", margin: 0}}>
                  {getRejectedCount()}
                </p>
                <p style={{margin: "10px 0 0 0", fontSize: "13px", color: "#999"}}>Rejected applications</p>
              </div>

              <div style={styles.detailedStatCard}>
                <div style={{fontSize: "40px", marginBottom: "15px"}}>💰</div>
                <h4 style={{margin: "0 0 10px 0", color: "#64748b"}}>Avg. Scholarship</h4>
                <p style={{fontSize: "36px", fontWeight: "700", color: "#3b82f6", margin: 0}}>
                  ${scholarships.length > 0 ? Math.round(scholarships.reduce((acc, s) => acc + parseInt(s.amount || 0), 0) / scholarships.length) : 0}
                </p>
                <p style={{margin: "10px 0 0 0", fontSize: "13px", color: "#999"}}>Average amount</p>
              </div>

              <div style={styles.detailedStatCard}>
                <div style={{fontSize: "40px", marginBottom: "15px"}}>🎯</div>
                <h4 style={{margin: "0 0 10px 0", color: "#64748b"}}>Success Rate</h4>
                <p style={{fontSize: "36px", fontWeight: "700", color: "#8b5cf6", margin: 0}}>
                  {myApplications.length > 0 ? Math.round((getApprovedCount() / myApplications.length) * 100) : 0}%
                </p>
                <p style={{margin: "10px 0 0 0", fontSize: "13px", color: "#999"}}>Approval percentage</p>
              </div>
            </div>
          </div>

          <div style={styles.quickActionsSection}>
            <h2 style={{marginTop: "40px", marginBottom: "25px", fontSize: "26px", fontWeight: "700"}}>🚀 Quick Actions</h2>

            <div style={styles.profileActions}>
              <button style={styles.actionBtn} onClick={() => setActive("explore")}>
                🔍 Explore More Scholarships
              </button>
              <button style={styles.actionBtn} onClick={() => setActive("financial-aid")}>
                💰 View Financial Aid
              </button>
              <button style={styles.actionBtn} onClick={() => setActive("applications")}>
                📋 Check My Applications
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.profileCard}>
          <h2 style={{marginTop: 0}}>✏️ Edit Your Profile</h2>

          {(saveError || profileError) && (
            <div style={styles.errorBanner}>{saveError || profileError}</div>
          )}

          <div style={styles.editProfileForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={editData.fullName || ""}
                onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                style={styles.profileInput}
                placeholder="Enter your full name"
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email <span style={{fontSize: "11px", color: "#999"}}>(linked to login)</span></label>
                <input
                  type="email"
                  value={editData.email || studentEmail || ""}
                  style={{...styles.profileInput, backgroundColor: "#f0f0f0", cursor: "not-allowed"}}
                  disabled
                  title="Email is linked to your login credentials and cannot be changed here"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={editData.phone || ""}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  style={styles.profileInput}
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Major/Field of Study</label>
                <select
                  value={editData.major || ""}
                  onChange={(e) => setEditData({...editData, major: e.target.value})}
                  style={styles.profileInput}
                >
                  <option value="">Select major</option>
                  {MAJOR_OPTIONS.map((major) => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>GPA</label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={editData.gpa || ""}
                  onChange={(e) => setEditData({...editData, gpa: e.target.value})}
                  style={styles.profileInput}
                  placeholder="e.g., 3.8"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>University/Institute Name</label>
              <select
                value={editData.university || ""}
                onChange={(e) => setEditData({...editData, university: e.target.value})}
                style={styles.profileInput}
              >
                <option value="">Select university</option>
                {UNIVERSITY_OPTIONS.map((university) => (
                  <option key={university} value={university}>{university}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Enrollment Date</label>
              <input
                type="date"
                value={editData.enrollmentDate || ""}
                onChange={(e) => setEditData({...editData, enrollmentDate: e.target.value})}
                style={styles.profileInput}
              />
            </div>

            <div style={{display: "flex", gap: "15px", marginTop: "30px"}}>
              <button
                style={{...styles.submitBtn, flex: 1}}
                onClick={updateProfile}
                disabled={profileSaving}
              >
                {profileSaving ? "Saving..." : "✓ Save Changes"}
              </button>
              <button
                style={{...styles.submitBtn, flex: 1, background: "#6b7280"}}
                onClick={() => {
                  setEditingProfile(false);
                  setSaveError("");
                  setEditData(studentProfile);
                }}
                disabled={profileSaving}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  errorBanner: {
    marginBottom: "20px",
    padding: "12px 14px",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    fontSize: "14px"
  },
  profileCard: {
    background: "white",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0"
  },
  editProfileBtn: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "15px",
    whiteSpace: "nowrap",
    transition: "all 0.3s ease"
  },
  singleCardInfoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0"
  },
  infoRow: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: "30px",
    padding: "18px 0",
    borderBottom: "1px solid #e2e8f0",
    alignItems: "center"
  },
  infoLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569"
  },
  infoValue: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#1e293b"
  },
  statsSection: {
    marginTop: "40px"
  },
  detailedStatsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  detailedStatCard: {
    background: "white",
    borderRadius: "12px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    textAlign: "center",
    transition: "all 0.3s ease"
  },
  quickActionsSection: {
    marginTop: "40px",
    paddingTop: "40px",
    borderTop: "2px solid #e2e8f0"
  },
  profileActions: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  actionBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  editProfileForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b"
  },
  profileInput: {
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.3s ease"
  },
  submitBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease"
  }
};

export default Profile;
