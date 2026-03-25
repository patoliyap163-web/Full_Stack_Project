import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@scholarship.com",
    phone: "",
    joinDate: new Date().toLocaleDateString(),
    department: "Finance & Scholarships",
    profileImage: "👨‍💼"
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(adminProfile);

  // Initialize profile from localStorage or logged-in user
  useEffect(() => {
    // Get logged-in admin from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user && user.role === "admin") {
      setAdminEmail(user.email);
      
      // Get saved admin profile or create new one
      let profile = JSON.parse(localStorage.getItem("adminProfile")) || {};
      
      // Always sync with logged-in user's name and email for real-time updates
      profile.name = user.name || "Admin";
      profile.email = user.email;
      
      // Set default values for other fields if not already set
      if (!profile.phone) profile.phone = "";
      if (!profile.joinDate) profile.joinDate = new Date().toLocaleDateString();
      if (!profile.department) profile.department = "Finance & Scholarships";
      if (!profile.profileImage) profile.profileImage = "👨‍💼";
      
      // Save to localStorage to persist
      localStorage.setItem("adminProfile", JSON.stringify(profile));
      setAdminProfile(profile);
      setProfileData(profile);
    }
  }, []);

  const [scholarships, setScholarships] = useState(() => {
    const saved = localStorage.getItem("scholarships");
    return saved ? JSON.parse(saved) : [];
  });

  const [financialAid, setFinancialAid] = useState(() => {
    const saved = localStorage.getItem("financialAid");
    return saved ? JSON.parse(saved) : [];
  });

  const [aidFormData, setAidFormData] = useState({
    title: "",
    type: "Loan",
    amount: "",
    interestRate: "",
    deadline: "",
    description: "",
    requirements: ""
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    deadline: "",
    description: "",
    eligibility: "",
    category: "",
    gpa: "",
    benefits: "",
    requirements: ""
  });

  const [editId, setEditId] = useState(null);
  const [aidEditId, setAidEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sync localStorage when data changes
  useEffect(() => {
    localStorage.setItem("scholarships", JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("financialAid", JSON.stringify(financialAid));
  }, [financialAid]);

  useEffect(() => {
    localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
  }, [adminProfile]);

  // Keep profileData in sync when editing
  useEffect(() => {
    setProfileData(adminProfile);
  }, [adminProfile]);

  const updateAdminProfile = () => {
    const updatedProfile = {
      ...profileData,
      email: adminEmail || profileData.email // Keep email synchronized
    };
    setAdminProfile(updatedProfile);
    setEditingProfile(false);
  };

  const handleAidFormChange = (e) => {
    setAidFormData({ ...aidFormData, [e.target.name]: e.target.value });
  };

  const addFinancialAid = (e) => {
    e.preventDefault();
    if (!aidFormData.title || !aidFormData.amount) {
      alert("Please fill in required fields");
      return;
    }

    if (aidEditId) {
      setFinancialAid(
        financialAid.map((item) =>
          item.id === aidEditId ? { ...item, ...aidFormData } : item
        )
      );
      setAidEditId(null);
    } else {
      const newAid = {
        id: Date.now(),
        ...aidFormData
      };
      setFinancialAid([...financialAid, newAid]);
    }

    setAidFormData({ title: "", type: "Loan", amount: "", interestRate: "", deadline: "", description: "", requirements: "" });
  };

  const deleteFinancialAid = (id) => {
    setFinancialAid(financialAid.filter((item) => item.id !== id));
    if (id === aidEditId) {
      setAidEditId(null);
      setAidFormData({ title: "", type: "Loan", amount: "", interestRate: "", deadline: "", description: "", requirements: "" });
    }
  };

  const editFinancialAid = (aid) => {
    setAidEditId(aid.id);
    setAidFormData({
      title: aid.title || "",
      type: aid.type || "Loan",
      amount: aid.amount || "",
      interestRate: aid.interestRate || "",
      deadline: aid.deadline || "",
      description: aid.description || "",
      requirements: aid.requirements || ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.deadline || !formData.description || !formData.eligibility) {
      alert("Please fill in all required fields");
      return;
    }

    if (editId) {
      setScholarships(
        scholarships.map((item) =>
          item.id === editId ? { ...item, ...formData } : item
        )
      );
      setEditId(null);
    } else {
      const newScholarship = {
        id: Date.now(),
        ...formData
      };
      setScholarships([...scholarships, newScholarship]);
    }

    setFormData({ title: "", amount: "", deadline: "", description: "", eligibility: "", category: "", gpa: "", benefits: "", requirements: "" });
  };

  const handleDelete = (id) => {
    setScholarships(scholarships.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
  };

  const updateApplicationStatus = (id, status) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status } : app
    );
    setApplications(updated);
  };

  // ===== Filter Logic =====
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = (app.studentName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || app.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ===== Pagination =====
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // ===== Export PDF =====
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Scholarship Applications Report", 14, 15);

    const tableColumn = ["Student Name", "Scholarship", "Status"];
    const tableRows = [];

    filteredApplications.forEach((app) => {
      tableRows.push([app.studentName, app.scholarshipTitle, app.status]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("applications_report.pdf");
  };

  // ===== Export Excel =====
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplications);
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

  // ===== Analytics =====
  const overallStatusCounts = {
    Pending: 0,
    Approved: 0,
    Rejected: 0
  };

  applications.forEach((app) => {
    if (overallStatusCounts[app.status] !== undefined) {
      overallStatusCounts[app.status]++;
    }
  });

  const overallPieData = [
    { name: "Pending", value: overallStatusCounts.Pending },
    { name: "Approved", value: overallStatusCounts.Approved },
    { name: "Rejected", value: overallStatusCounts.Rejected }
  ];

  const scholarshipWiseData = scholarships.map((sch) => {
    const counts = { Pending: 0, Approved: 0, Rejected: 0 };

    applications.forEach((app) => {
      if (app.scholarshipTitle === sch.title) {
        counts[app.status]++;
      }
    });

    return { scholarship: sch.title, ...counts };
  });

  // ===== Applications Over Time =====
  const groupedByDate = {};
  applications.forEach((app) => {
    const date = new Date(app.id).toLocaleDateString();
    groupedByDate[date] = (groupedByDate[date] || 0) + 1;
  });
  const lineData = Object.keys(groupedByDate).map((date) => ({
    date,
    applications: groupedByDate[date]
  }));

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={{margin: 0, fontSize: "24px"}}> Admin</h2>
          <p style={{margin: "5px 0 0 0", fontSize: "12px", opacity: 0.7}}>Control Panel</p>
        </div>

        <div style={styles.menuDivider}></div>

        {["dashboard", "scholarships", "financial-aid", "applications", "analytics", "profile"].map(
          (item) => (
            <div
              key={item}
              style={active === item ? styles.activeItem : styles.menuItem}
              onClick={() => setActive(item)}
            >
              <span style={{fontSize: "18px", marginRight: "10px"}}>
                {item === "dashboard" && "📊"}
                {item === "scholarships" && "📚"}
                {item === "financial-aid" && "💰"}
                {item === "applications" && "📋"}
                {item === "analytics" && "📈"}
                {item === "profile" && "👤"}
              </span>
              {item === "financial-aid" ? "Financial Aid" : item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
            </div>
          )
        )}
      </div>

      <div style={styles.main}>
        {/* DASHBOARD */}
        {active === "dashboard" && (
          <>
            <div style={styles.headerSection}>
              <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>Dashboard</h1>
              <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Welcome back, Admin</p>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📚</div>
                <div style={styles.statContent}>
                  <p style={styles.statLabel}>Total Scholarships</p>
                  <p style={styles.statValue}>{scholarships.length}</p>
                </div>
                <div style={styles.statTrend}>↑ Active</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>💰</div>
                <div style={styles.statContent}>
                  <p style={styles.statLabel}>Financial Aid</p>
                  <p style={styles.statValue}>{financialAid.length}</p>
                </div>
                <div style={styles.statTrend}>Programs</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>📋</div>
                <div style={styles.statContent}>
                  <p style={styles.statLabel}>Applications</p>
                  <p style={styles.statValue}>{applications.length}</p>
                </div>
                <div style={styles.statTrend}>↑ Growing</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statContent}>
                  <p style={styles.statLabel}>Approved</p>
                  <p style={styles.statValue}>{overallStatusCounts.Approved}</p>
                </div>
                <div style={styles.statTrend}>Success</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>⏳</div>
                <div style={styles.statContent}>
                  <p style={styles.statLabel}>Pending</p>
                  <p style={styles.statValue}>{overallStatusCounts.Pending}</p>
                </div>
                <div style={styles.statTrend}>Review</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>❌</div>
                <div style={styles.statContent}>
                  <p style={styles.statLabel}>Rejected</p>
                  <p style={styles.statValue}>{overallStatusCounts.Rejected}</p>
                </div>
                <div style={styles.statTrend}>Processed</div>
              </div>
            </div>

            <div style={styles.quickActions}>
              <h3>Quick Actions</h3>
              <div style={styles.actionsGrid}>
                <button style={styles.actionBtn} onClick={() => setActive("scholarships")}>
                  ➕ Add Scholarship
                </button>
                <button style={styles.actionBtn} onClick={() => setActive("financial-aid")}>
                  💰 Add Financial Aid
                </button>
                <button style={styles.actionBtn} onClick={() => setActive("applications")}>
                  📋 View Applications
                </button>
                <button style={styles.actionBtn} onClick={() => setActive("analytics")}>
                  📊 Analytics
                </button>
                <button style={styles.actionBtn} onClick={() => setActive("profile")}>
                  👤 My Profile
                </button>
              </div>
            </div>
          </>
        )}

        {/* SCHOLARSHIPS */}
        {active === "scholarships" && (
          <>
            <div style={styles.headerSection}>
              <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>📚 Manage Scholarships</h1>
              <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Create and manage scholarship programs</p>
            </div>

            <div style={styles.formContainer}>
              <h2 style={{marginTop: 0}}>{editId ? "✏️ Edit Scholarship" : "➕ Add New Scholarship"}</h2>
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
                      placeholder="e.g., 5000"
                      value={formData.amount}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Minimum GPA</label>
                    <input
                      name="gpa"
                      placeholder="e.g., 3.5"
                      value={formData.gpa}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Deadline *</label>
                  <input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description *</label>
                  <textarea
                    name="description"
                    placeholder="Detailed scholarship description..."
                    value={formData.description}
                    onChange={handleChange}
                    style={{...styles.input, minHeight: "100px", fontFamily: "Arial", resize: "vertical"}}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Eligibility Criteria *</label>
                  <textarea
                    name="eligibility"
                    placeholder="List all eligibility requirements..."
                    value={formData.eligibility}
                    onChange={handleChange}
                    style={{...styles.input, minHeight: "100px", fontFamily: "Arial", resize: "vertical"}}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Benefits</label>
                  <textarea
                    name="benefits"
                    placeholder="Benefits offered to the student (stipend, mentorship, internship, etc.)"
                    value={formData.benefits}
                    onChange={handleChange}
                    style={{...styles.input, minHeight: "100px", fontFamily: "Arial", resize: "vertical"}}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Requirements</label>
                  <textarea
                    name="requirements"
                    placeholder="Student requirements (eligibility, documents, GPA, repayment terms, etc.)"
                    value={formData.requirements}
                    onChange={handleChange}
                    style={{...styles.input, minHeight: "100px", fontFamily: "Arial", resize: "vertical"}}
                  />
                </div>
                <button type="submit" style={styles.submitBtn}>
                  {editId ? "💾 Update Scholarship" : "➕ Create Scholarship"}
                </button>
              </form>
            </div>

            <h2 style={{marginTop: "50px", marginBottom: "20px", fontSize: "24px"}}>Active Scholarships ({scholarships.length})</h2>
            <div style={styles.scholarshipsGrid}>
              {scholarships.map((item) => (
                <div key={item.id} style={styles.scholarshipCard}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={{margin: "0 0 8px 0"}}>{item.title}</h3>
                      <span style={styles.categoryBadge}>{item.category || "Scholarship"}</span>
                    </div>
                  </div>
                  
                  <div style={styles.amountBox}>
                    <span style={styles.currencySymbol}>$</span>
                    <span style={styles.amountValue}>{item.amount}</span>
                  </div>

                  {item.description && (
                    <div style={styles.cardSection}>
                      <h4 style={styles.sectionTitle}>📝 Description</h4>
                      <p style={styles.cardText}>{item.description}</p>
                    </div>
                  )}

                  {item.eligibility && (
                    <div style={styles.cardSection}>
                      <h4 style={styles.sectionTitle}>✓ Eligibility</h4>
                      <p style={styles.cardText}>{item.eligibility}</p>
                    </div>
                  )}

                  {item.gpa && (
                    <div style={styles.cardSection}>
                      <h4 style={styles.sectionTitle}>📊 Min GPA: <strong>{item.gpa}</strong></h4>
                    </div>
                  )}

                  {item.benefits && (
                    <div style={styles.cardSection}>
                      <h4 style={styles.sectionTitle}>🎁 Benefits</h4>
                      <p style={styles.cardText}>{item.benefits}</p>
                    </div>
                  )}

                  {item.requirements && (
                    <div style={styles.cardSection}>
                      <h4 style={styles.sectionTitle}>📋 Requirements</h4>
                      <p style={styles.cardText}>{item.requirements}</p>
                    </div>
                  )}

                  <div style={styles.deadlineSection}>
                    <span>📅 Deadline: <strong>{item.deadline}</strong></span>
                  </div>

                  <div style={styles.cardActions}>
                    <button style={styles.editBtn} onClick={() => handleEdit(item)}>
                      ✏️ Edit
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* APPLICATIONS */}
        {active === "applications" && (
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
        )}

        {/* FINANCIAL AID */}
        {active === "financial-aid" && (
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
                      onChange={handleAidFormChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Type</label>
                    <select
                      name="type"
                      value={aidFormData.type}
                      onChange={handleAidFormChange}
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
                      placeholder="e.g., 10000"
                      value={aidFormData.amount}
                      onChange={handleAidFormChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Interest Rate (%) {aidFormData.type === "Loan" && "*"}</label>
                    <input
                      name="interestRate"
                      placeholder="e.g., 4.5"
                      value={aidFormData.interestRate}
                      onChange={handleAidFormChange}
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Application Deadline</label>
                  <input
                    name="deadline"
                    type="date"
                    value={aidFormData.deadline}
                    onChange={handleAidFormChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    placeholder="Detailed description of the financial aid..."
                    value={aidFormData.description}
                    onChange={handleAidFormChange}
                    style={{...styles.input, minHeight: "80px", resize: "vertical"}}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Requirements</label>
                  <textarea
                    name="requirements"
                    placeholder="Eligibility and repayment requirements..."
                    value={aidFormData.requirements}
                    onChange={handleAidFormChange}
                    style={{...styles.input, minHeight: "80px", resize: "vertical"}}
                  />
                </div>
                <button type="submit" style={styles.submitBtn}>
                  {aidEditId ? "💾 Save Changes" : "💰 Add Financial Aid"}
                </button>
              </form>
            </div>

            <h2 style={{marginTop: "40px", marginBottom: "20px", fontSize: "24px"}}>Available Aid Programs ({financialAid.length})</h2>
            <div style={styles.scholarshipsGrid}>
              {financialAid.map((aid) => (
                <div key={aid.id} style={styles.aidCard}>
                  <div style={styles.aidCardHeader}>
                    <h3 style={{margin: 0}}>{aid.title}</h3>
                    <span style={styles.aidTypeBadge}>{aid.type}</span>
                  </div>

                  <div style={styles.aidAmountBox}>
                    <span>Max: </span>
                    <span style={styles.aidAmount}>${aid.amount}</span>
                  </div>

                  {aid.interestRate && (
                    <div style={styles.aidInfo}>
                      <strong>Interest Rate:</strong> {aid.interestRate}%
                    </div>
                  )}

                  {aid.deadline && (
                    <div style={styles.aidInfo}>
                      📅 Deadline: {aid.deadline}
                    </div>
                  )}

                  {aid.description && (
                    <div style={styles.aidInfo}>
                      <strong>Details:</strong> {aid.description}
                    </div>
                  )}

                  {aid.requirements && (
                    <div style={styles.aidInfo}>
                      <strong>Requirements:</strong> {aid.requirements}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button
                      style={styles.editBtn}
                      onClick={() => editFinancialAid(aid)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteFinancialAid(aid.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ADMIN PROFILE */}
        {active === "profile" && (
          <>
            <div style={styles.headerSection}>
              <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>👤 Admin Profile</h1>
              <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Manage your admin account and settings</p>
            </div>

            <div style={styles.profileContainer}>
              {!editingProfile ? (
                <div style={styles.profileCard}>
                  <div style={styles.profileHeader}>
                    <div style={styles.profileImage}>{adminProfile.profileImage}</div>
                    <div style={styles.profileInfo}>
                      <h2 style={{margin: "0 0 8px 0", fontSize: "28px", fontWeight: "700", color: "#1e293b"}}>
                        {adminProfile.name || "Admin"}
                      </h2>
                      <p style={{margin: "0 0 3px 0", color: "#64748b", fontSize: "14px"}}>
                        📧 {adminProfile.email}
                      </p>
                      <p style={{margin: "8px 0 0 0", color: "#94a3b8", fontSize: "13px"}}>
                        🏢 {adminProfile.department}
                      </p>
                    </div>
                    <button style={styles.editProfileBtn} onClick={() => {setEditingProfile(true); setProfileData(adminProfile);}}>
                      ✏️ Edit Profile
                    </button>
                  </div>

                  <div style={styles.profileDetails}>
                    <div style={styles.profileDetail}>
                      <strong>Email:</strong>
                      <p>{adminProfile.email}</p>
                    </div>
                    <div style={styles.profileDetail}>
                      <strong>Phone:</strong>
                      <p>{adminProfile.phone}</p>
                    </div>
                    <div style={styles.profileDetail}>
                      <strong>Department:</strong>
                      <p>{adminProfile.department}</p>
                    </div>
                    <div style={styles.profileDetail}>
                      <strong>Member Since:</strong>
                      <p>{adminProfile.joinDate}</p>
                    </div>
                  </div>

                  <div style={styles.adminStats}>
                    <div style={styles.statItem}>
                      <span style={{fontSize: "24px"}}>📚</span>
                      <p>Total Scholarships</p>
                      <h3>{scholarships.length}</h3>
                    </div>
                    <div style={styles.statItem}>
                      <span style={{fontSize: "24px"}}>💰</span>
                      <p>Financial Aid Programs</p>
                      <h3>{financialAid.length}</h3>
                    </div>
                    <div style={styles.statItem}>
                      <span style={{fontSize: "24px"}}>📋</span>
                      <p>Applications</p>
                      <h3>{applications.length}</h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={styles.profileCard}>
                  <h2>Edit Profile</h2>
                  <div style={styles.editForm}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Email <span style={{fontSize: "11px", color: "#999"}}>(linked to login)</span></label>
                      <input
                        type="email"
                        value={profileData.email}
                        style={{...styles.input, backgroundColor: "#f0f0f0", cursor: "not-allowed"}}
                        disabled
                        title="Email is linked to your login credentials and cannot be changed here"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Department</label>
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        style={styles.input}
                      />
                    </div>
                    <div style={{display: "flex", gap: "10px", marginTop: "20px"}}>
                      <button
                        style={{...styles.submitBtn, flex: 1}}
                        onClick={updateAdminProfile}
                      >
                        ✓ Save Changes
                      </button>
                      <button
                        style={{...styles.submitBtn, flex: 1, background: "#6b7280"}}
                        onClick={() => setEditingProfile(false)}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {active === "analytics" && (
          <>
            <div style={styles.headerSection}>
              <h1 style={{margin: 0, fontSize: "32px", fontWeight: "700"}}>📊 Analytics Dashboard</h1>
              <p style={{margin: "5px 0 0 0", color: "#666", fontSize: "14px"}}>Real-time insights and statistics</p>
            </div>

            <div style={styles.analyticsCards}>
              <div style={{...styles.analyticsCard, borderLeft: "5px solid #10b981"}}>
                <div style={{fontSize: "28px", marginBottom: "10px"}}>✅</div>
                <p style={styles.analyticsLabel}>Approved</p>
                <p style={styles.analyticsValue}>{overallStatusCounts.Approved}</p>
                <p style={{fontSize: "12px", color: "#10b981", margin: "8px 0 0 0"}}>✓ Success rate</p>
              </div>
              <div style={{...styles.analyticsCard, borderLeft: "5px solid #f59e0b"}}>
                <div style={{fontSize: "28px", marginBottom: "10px"}}>⏳</div>
                <p style={styles.analyticsLabel}>Pending</p>
                <p style={styles.analyticsValue}>{overallStatusCounts.Pending}</p>
                <p style={{fontSize: "12px", color: "#f59e0b", margin: "8px 0 0 0"}}>⚠ Needs review</p>
              </div>
              <div style={{...styles.analyticsCard, borderLeft: "5px solid #ef4444"}}>
                <div style={{fontSize: "28px", marginBottom: "10px"}}>❌</div>
                <p style={styles.analyticsLabel}>Rejected</p>
                <p style={styles.analyticsValue}>{overallStatusCounts.Rejected}</p>
                <p style={{fontSize: "12px", color: "#ef4444", margin: "8px 0 0 0"}}>Reviewed</p>
              </div>
            </div>

            <div style={styles.chartsContainer}>
              <div style={styles.chartCard}>
                <h3 style={{marginTop: 0}}>Application Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={overallPieData}
                      dataKey="value"
                      outerRadius={100}
                      label
                    >
                      {overallPieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.name === "Approved"
                              ? "#10b981"
                              : entry.name === "Pending"
                              ? "#f59e0b"
                              : "#ef4444"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {lineData.length > 0 && (
              <div style={styles.chartCard}>
                <h3>Applications Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {scholarshipWiseData.length > 0 && (
              <>
                <h2 style={{marginTop: "40px", marginBottom: "20px"}}>Scholarship-wise Status</h2>
                <div style={styles.analyticsGrid}>
                  {scholarshipWiseData.map((data, index) => (
                    <div key={index} style={styles.chartCard}>
                      <h4 style={{marginTop: 0, color: "#1e293b"}}>{data.scholarship}</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[data]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="scholarship" hide />
                          <YAxis stroke="#64748b" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="Approved" fill="#10b981" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="Rejected" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "100vh", overflow: "hidden", width: "100%", background: "#f8f9fb" },
  sidebar: { 
    width: "280px", 
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", 
    color: "white", 
    padding: "30px 20px", 
    position: "fixed", 
    left: 0, 
    top: "60px", 
    height: "calc(100vh - 60px)", 
    overflow: "auto", 
    boxSizing: "border-box",
    borderRight: "1px solid rgba(255,255,255,0.1)"
  },
  sidebarHeader: { paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.2)" },
  menuDivider: { height: "1px", background: "rgba(255,255,255,0.1)", margin: "15px 0" },
  menuItem: { 
    padding: "15px 15px", 
    cursor: "pointer", 
    margin: "8px 0",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    color: "rgba(255,255,255,0.7)",
    "&:hover": { background: "rgba(255,255,255,0.1)" }
  },
  activeItem: { 
    padding: "15px 15px", 
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
    cursor: "pointer",
    margin: "8px 0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
    color: "white",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
  },
  main: { 
    marginLeft: "280px", 
    marginTop: "60px", 
    width: "calc(100% - 280px)", 
    height: "calc(100vh - 60px)", 
    padding: "40px", 
    background: "#f8f9fb", 
    overflow: "auto", 
    boxSizing: "border-box" 
  },
  headerSection: { marginBottom: "40px", paddingBottom: "20px", borderBottom: "2px solid #e2e8f0" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  statCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": { 
      transform: "translateY(-5px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)"
    }
  },
  statIcon: { fontSize: "40px" },
  statContent: { flex: 1 },
  statLabel: { margin: "0", color: "#64748b", fontSize: "13px", fontWeight: "500" },
  statValue: { margin: "5px 0", fontSize: "32px", fontWeight: "700", color: "#1e293b" },
  statTrend: { fontSize: "12px", color: "#10b981", fontWeight: "600", padding: "4px 8px", background: "#d1fae5", borderRadius: "6px" },
  quickActions: { background: "white", padding: "30px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #e2e8f0" },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginTop: "15px" },
  actionBtn: { 
    padding: "12px 20px", 
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontSize: "13px"
  },
  card: { background: "white", padding: "20px", marginBottom: "20px" },
  number: { fontSize: "24px", fontWeight: "bold" },
  form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" },
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
  addBtn: { 
    padding: "12px", 
    background: "#2563eb", 
    color: "white", 
    border: "none", 
    cursor: "pointer", 
    borderRadius: "6px", 
    fontWeight: "bold", 
    fontSize: "16px" 
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
    border: "1px solid #e2e8f0",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)"
    }
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
  },
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
  },
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
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
  listCard: { background: "white", padding: "15px", marginBottom: "15px" },
  approveBtn: { marginRight: "10px", background: "green", color: "white", border: "none", padding: "5px", cursor: "pointer" },
  rejectBtn: { background: "red", color: "white", border: "none", padding: "5px", cursor: "pointer" },
  analyticsCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },
  analyticsCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0"
  },
  analyticsLabel: { 
    margin: "0", 
    color: "#64748b", 
    fontSize: "13px", 
    fontWeight: "600"
  },
  analyticsValue: { 
    margin: "10px 0 0 0", 
    fontSize: "36px", 
    fontWeight: "700", 
    color: "#1e293b"
  },
  statusCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
    fontWeight: "bold"
  },
  chartCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    marginBottom: "25px",
    border: "1px solid #e2e8f0"
  },
  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px"
  },
  aidCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease"
  },
  aidCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "2px solid #e2e8f0"
  },
  aidTypeBadge: {
    padding: "4px 12px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    color: "white",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600"
  },
  aidAmountBox: {
    padding: "15px",
    background: "#f0fdf4",
    borderRadius: "8px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "4px solid #10b981"
  },
  aidAmount: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#10b981"
  },
  aidInfo: {
    padding: "10px 0",
    fontSize: "13px",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0"
  },
  profileContainer: {
    maxWidth: "1000px"
  },
  profileCard: {
    background: "white",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0"
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    paddingBottom: "30px",
    borderBottom: "2px solid #e2e8f0",
    marginBottom: "30px"
  },
  profileImage: {
    fontSize: "80px",
    minWidth: "100px",
    textAlign: "center"
  },
  profileInfo: {
    flex: 1
  },
  editProfileBtn: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    whiteSpace: "nowrap"
  },
  profileDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  profileDetail: {
    padding: "15px",
    background: "#f8f9fb",
    borderRadius: "8px"
  },
  adminStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "30px"
  },
  statItem: {
    textAlign: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    borderRadius: "10px",
    border: "1px solid #bae6fd"
  },
  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  }
};

export default AdminDashboard;