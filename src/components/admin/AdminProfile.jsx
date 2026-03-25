import React, { useState } from 'react';

const AdminProfile = ({
  adminUser,
  updateAdminProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: adminUser?.name || '',
    email: adminUser?.email || '',
    phone: adminUser?.phone || '',
    department: adminUser?.department || '',
    role: adminUser?.role || 'Administrator'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateAdminProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: adminUser?.name || '',
      email: adminUser?.email || '',
      phone: adminUser?.phone || '',
      department: adminUser?.department || '',
      role: adminUser?.role || 'Administrator'
    });
    setIsEditing(false);
  };

  return (
    <>
      <div style={styles.headerSection}>
        <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>👤 Admin Profile</h1>
        <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Manage your account information</p>
      </div>

      <div style={styles.profileContainer}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            <span style={{fontSize: "48px"}}>👨‍💼</span>
          </div>
          <div style={styles.profileInfo}>
            <h2 style={{margin: "0 0 5px 0", fontSize: "24px"}}>{adminUser?.name || 'Administrator'}</h2>
            <p style={{margin: 0, color: "#666", fontSize: "16px"}}>{adminUser?.role || 'Administrator'}</p>
            <p style={{margin: "5px 0 0 0", color: "#64748b", fontSize: "14px"}}>Member since {adminUser?.joinDate || '2024'}</p>
          </div>
          {!isEditing && (
            <button
              style={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        <div style={styles.profileDetails}>
          <div style={styles.detailSection}>
            <h3 style={{margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600"}}>Personal Information</h3>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                ) : (
                  <p style={styles.value}>{adminUser?.name || 'Not provided'}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                ) : (
                  <p style={styles.value}>{adminUser?.email || 'Not provided'}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                ) : (
                  <p style={styles.value}>{adminUser?.phone || 'Not provided'}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                ) : (
                  <p style={styles.value}>{adminUser?.department || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          <div style={styles.detailSection}>
            <h3 style={{margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600"}}>Account Information</h3>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <p style={styles.value}>{adminUser?.role || 'Administrator'}</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Account Status</label>
                <span style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: "600",
                  fontSize: "12px",
                  background: "#d1fae5",
                  color: "#065f46"
                }}>
                  Active
                </span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Last Login</label>
                <p style={styles.value}>{adminUser?.lastLogin || 'Today'}</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Account Created</label>
                <p style={styles.value}>{adminUser?.joinDate || 'January 2024'}</p>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div style={styles.actionButtons}>
            <button
              style={styles.saveBtn}
              onClick={handleSave}
            >
              💾 Save Changes
            </button>
            <button
              style={styles.cancelBtn}
              onClick={handleCancel}
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  headerSection: { marginBottom: "40px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  profileContainer: {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    overflow: "hidden"
  },
  profileHeader: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    padding: "30px",
    display: "flex",
    alignItems: "center",
    gap: "25px"
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px"
  },
  profileInfo: {
    flex: 1
  },
  editBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  profileDetails: {
    padding: "30px"
  },
  detailSection: {
    marginBottom: "40px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151"
  },
  value: {
    margin: 0,
    fontSize: "16px",
    color: "#64748b",
    padding: "8px 0"
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease"
  },
  actionButtons: {
    padding: "20px 30px",
    background: "#f8f9fb",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    gap: "15px",
    justifyContent: "flex-end"
  },
  saveBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease"
  },
  cancelBtn: {
    padding: "12px 24px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease"
  }
};

export default AdminProfile;