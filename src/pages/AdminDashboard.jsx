import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Import API functions
import {
  getScholarshipsByAdmin,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getFinancialAidByAdmin,
  createFinancialAid,
  updateFinancialAid,
  deleteFinancialAid,
  getApplicationsByAdmin,
  updateApplicationStatusById,
  getAdminProfileByUserId,
  updateAdminProfileByUserId
} from "../services/api";

// Import decoupled components
import DashboardOverview from "../components/admin/DashboardOverview";
import ScholarshipsManagement from "../components/admin/ScholarshipsManagement";
import FinancialAidManagement from "../components/admin/FinancialAidManagement";
import ApplicationsManagement from "../components/admin/ApplicationsManagement";
import AidApplicationsManagement from "../components/admin/AidApplicationsManagement";
import Analytics from "../components/admin/Analytics";
import AdminProfile from "../components/admin/AdminProfile";

const createDefaultAdminProfile = (email = "", fullName = "", role = "Administrator") => ({
  fullName,
  email,
  phone: "",
  department: "",
  joinDate: "",
  role,
  profileImage: "👨‍💼"
});

const normalizeAdminProfile = (profile, email = "", fullName = "", role = "Administrator") => {
  const safeProfile = profile && typeof profile === "object" ? profile : {};

  return {
    fullName: safeProfile.fullName || safeProfile.name || fullName || "",
    email,
    phone: safeProfile.phone || "",
    department: safeProfile.department || "",
    joinDate: safeProfile.joinDate || "",
    role: safeProfile.role || role,
    profileImage: safeProfile.profileImage || "👨‍💼"
  };
};

function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [adminRole, setAdminRole] = useState("Administrator");
  const [scholarships, setScholarships] = useState([]);
  const [scholarshipsLoading, setScholarshipsLoading] = useState(false);
  const [scholarshipsError, setScholarshipsError] = useState("");
  const [financialAid, setFinancialAid] = useState([]);
  const [financialAidLoading, setFinancialAidLoading] = useState(false);
  const [financialAidError, setFinancialAidError] = useState("");
  const [applications, setApplications] = useState([]);
  const [aidApplications, setAidApplications] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@scholarship.com",
    phone: "",
    joinDate: new Date().toLocaleDateString(),
    department: "Finance & Scholarships",
    profileImage: "👨‍💼"
  });

  // Initialize profile from localStorage or logged-in user
  useEffect(() => {
    // Get logged-in admin from sessionStorage
    const stored = sessionStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    
    if (user && user.role === "admin") {
      setAdminEmail(user.email);
      setAdminId(user.id || null);
      setAdminName(user.name || "Admin");
      setAdminRole(
        user.role
          ? `${String(user.role).charAt(0).toUpperCase()}${String(user.role).slice(1)}`
          : "Administrator"
      );
      
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
    }
  }, []);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!adminId) {
        return;
      }

      const stored = sessionStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      const resolvedRole = user?.role
        ? `${String(user.role).charAt(0).toUpperCase()}${String(user.role).slice(1)}`
        : "Administrator";

      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await getAdminProfileByUserId(adminId);
        const backendProfile = response?.data;
        const hasProfileData =
          backendProfile &&
          typeof backendProfile === "object" &&
          Object.keys(backendProfile).length > 0;

        setAdminProfile(
          hasProfileData
            ? normalizeAdminProfile(backendProfile, user?.email || "", user?.name || "Admin", resolvedRole)
            : createDefaultAdminProfile(user?.email || "", user?.name || "Admin", resolvedRole)
        );
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        setProfileError(err.message || "Failed to load admin profile");
        setAdminProfile(createDefaultAdminProfile(user?.email || "", user?.name || "Admin", resolvedRole));
      } finally {
        setProfileLoading(false);
      }
    };

    fetchAdminProfile();
  }, [adminId]);

  // Fetch scholarships for the logged-in admin
  useEffect(() => {
    const fetchAdminScholarships = async () => {
      try {
        setScholarshipsLoading(true);
        setScholarshipsError("");
        const stored = sessionStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : null;
        
        if (user && user.role === "admin" && user.id) {
          const response = await getScholarshipsByAdmin(user.id);
          if (response.success) {
            setScholarships(response.data || []);
          } else {
            setScholarshipsError(response.message || "Failed to load scholarships");
          }
        } else {
          setScholarshipsError("Admin user not found");
        }
      } catch (err) {
        console.error("Error fetching admin scholarships:", err);
        if (err.message.includes("<!DOCTYPE")) {
          setScholarshipsError("Backend service is currently unavailable. Please try again later.");
        } else {
          setScholarshipsError(err.message || "Failed to load scholarships");
        }
      } finally {
        setScholarshipsLoading(false);
      }
    };

    fetchAdminScholarships();
  }, []);

  useEffect(() => {
    const fetchAdminFinancialAid = async () => {
      try {
        setFinancialAidLoading(true);
        setFinancialAidError("");
        const stored = sessionStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : null;

        if (user && user.role === "admin" && user.id) {
          const response = await getFinancialAidByAdmin(user.id);
          if (response.success) {
            setFinancialAid(response.data || []);
          } else {
            setFinancialAidError(response.message || "Failed to load financial aid");
          }
        } else {
          setFinancialAidError("Admin user not found");
        }
      } catch (err) {
        console.error("Error fetching admin financial aid:", err);
        if (err.message.includes("<!DOCTYPE")) {
          setFinancialAidError("Backend service is currently unavailable. Please try again later.");
        } else {
          setFinancialAidError(err.message || "Failed to load financial aid");
        }
      } finally {
        setFinancialAidLoading(false);
      }
    };

    fetchAdminFinancialAid();
  }, []);

  const [aidFormData, setAidFormData] = useState({
    title: "",
    type: "Loan",
    amount: "",
    interestRate: "",
    deadline: "",
    description: "",
    requirements: ""
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

  const [aidSearchTerm, setAidSearchTerm] = useState("");
  const [aidFilterStatus, setAidFilterStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [aidCurrentPage, setAidCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sync localStorage when data changes
  useEffect(() => {
    localStorage.setItem("scholarships", JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem("financialAid", JSON.stringify(financialAid));
  }, [financialAid]);

  useEffect(() => {
    const fetchAdminApplications = async () => {
      try {
        const stored = sessionStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : null;

        if (!user || user.role !== "admin" || !user.id) {
          return;
        }

        const response = await getApplicationsByAdmin(user.id);
        if (response.success) {
          setApplications(response.data?.scholarshipApplications || []);
          setAidApplications(response.data?.financialAidApplications || []);
        }
      } catch (err) {
        console.error("Error fetching admin applications:", err);
      }
    };

    fetchAdminApplications();
  }, []);



  const updateAdminProfile = async (newProfileData) => {
    if (!adminId) {
      throw new Error("Admin user not found. Please login again.");
    }

    try {
      setProfileSaving(true);
      setProfileError("");

      const payload = {
        fullName: newProfileData.fullName?.trim() || "",
        phone: newProfileData.phone?.trim() || "",
        department: newProfileData.department?.trim() || "",
        joinDate: newProfileData.joinDate || ""
      };

      const response = await updateAdminProfileByUserId(adminId, payload);
      const updatedProfile = normalizeAdminProfile(
        response?.data && typeof response.data === "object" && Object.keys(response.data).length > 0
          ? response.data
          : payload,
        adminEmail,
        adminName,
        adminRole
      );

      setAdminProfile(updatedProfile);
      return response;
    } catch (err) {
      console.error("Error updating admin profile:", err);
      setProfileError(err.message || "Failed to save admin profile");
      throw err;
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAidFormChange = (e) => {
    setAidFormData({ ...aidFormData, [e.target.name]: e.target.value });
  };

  const resetFinancialAidForm = () => {
    setAidFormData({
      title: "",
      type: "Loan",
      amount: "",
      interestRate: "",
      deadline: "",
      description: "",
      requirements: ""
    });
    setAidEditId(null);
  };

  const addFinancialAid = async (e) => {
    e.preventDefault();
    if (!aidFormData.title || !aidFormData.amount) {
      alert("Please fill in required fields");
      return;
    }

    try {
      const stored = sessionStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      if (!user || !user.id) {
        alert("Admin user not found. Please login again.");
        return;
      }

      if (aidEditId) {
        const currentAid = financialAid.find((item) => item.id === aidEditId);

        if (!currentAid) {
          throw new Error("Financial aid not found for update");
        }

        const normalizedAidData = {
          title: aidFormData.title,
          type: aidFormData.type || "Loan",
          amount: parseFloat(aidFormData.amount),
          interestRate: aidFormData.interestRate === "" ? 0 : parseFloat(aidFormData.interestRate),
          deadline: aidFormData.deadline || "",
          description: aidFormData.description || "",
          requirements: aidFormData.requirements || ""
        };

        const updatePayload = Object.entries(normalizedAidData).reduce((acc, [key, value]) => {
          const existingValue = currentAid[key] ?? "";
          if (existingValue !== value) {
            acc[key] = value;
          }
          return acc;
        }, {});

        if (Object.keys(updatePayload).length === 0) {
          alert("No changes detected to update.");
          return;
        }

        const response = await updateFinancialAid(aidEditId, updatePayload);
        if (response.success) {
          setFinancialAid(
            financialAid.map((item) => (item.id === aidEditId ? response.data : item))
          );
          alert(response.message || "Financial aid updated successfully!");
        } else {
          alert(response.message || "Failed to update financial aid");
          return;
        }
      } else {
        const payload = {
          title: aidFormData.title,
          type: aidFormData.type || "Loan",
          amount: parseFloat(aidFormData.amount),
          interestRate: aidFormData.interestRate === "" ? 0 : parseFloat(aidFormData.interestRate),
          deadline: aidFormData.deadline || "",
          description: aidFormData.description || "",
          requirements: aidFormData.requirements || "",
          admin: {
            id: user.id
          }
        };

        const response = await createFinancialAid(payload);
        if (response.success) {
          const updatedResponse = await getFinancialAidByAdmin(user.id);
          if (updatedResponse.success) {
            setFinancialAid(updatedResponse.data || []);
          }
          alert(response.message || "Financial aid created successfully!");
        } else {
          alert(response.message || "Failed to create financial aid");
          return;
        }
      }

      resetFinancialAidForm();
      setFinancialAidError("");
    } catch (err) {
      console.error("Error handling financial aid:", err);
      alert(err.message || "Failed to save financial aid");
    }
  };

  const deleteFinancialAidItem = async (id) => {
    try {
      const response = await deleteFinancialAid(id);

      if (!response.success) {
        alert(response.message || "Failed to delete financial aid");
        return;
      }

      setFinancialAid(financialAid.filter((item) => item.id !== id));

      if (id === aidEditId) {
        resetFinancialAidForm();
      }

      alert(response.message || "Financial aid deleted successfully!");
    } catch (err) {
      console.error("Error deleting financial aid:", err);
      alert(err.message || "Failed to delete financial aid");
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

  const resetScholarshipForm = () => {
    setFormData({
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
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.deadline || !formData.description || !formData.eligibility) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const stored = sessionStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      if (!user || !user.id) {
        alert("Admin user not found. Please login again.");
        return;
      }

      if (editId) {
        const currentScholarship = scholarships.find((item) => item.id === editId);

        if (!currentScholarship) {
          throw new Error("Scholarship not found for update");
        }

        const normalizedFormData = {
          title: formData.title,
          category: formData.category || "Academic",
          amount: parseFloat(formData.amount),
          gpa: formData.gpa ? parseFloat(formData.gpa) : null,
          deadline: formData.deadline,
          description: formData.description,
          eligibility: formData.eligibility,
          benefits: formData.benefits || "",
          requirements: formData.requirements || ""
        };

        const updatePayload = Object.entries(normalizedFormData).reduce((acc, [key, value]) => {
          const existingValue = currentScholarship[key] ?? (key === "gpa" ? null : "");

          if (existingValue !== value) {
            acc[key] = value;
          }

          return acc;
        }, {});

        if (Object.keys(updatePayload).length === 0) {
          alert("No changes detected to update.");
          return;
        }

        const response = await updateScholarship(editId, updatePayload);

        if (response.success) {
          setScholarships(
            scholarships.map((item) => (item.id === editId ? response.data : item))
          );
          alert(response.message || "Scholarship updated successfully!");
        } else {
          alert(response.message || "Failed to update scholarship");
          return;
        }
      } else {
        // Create new scholarship via API
        const scholarshipData = {
          title: formData.title,
          category: formData.category || "Academic",
          amount: parseFloat(formData.amount),
          gpa: formData.gpa ? parseFloat(formData.gpa) : null,
          deadline: formData.deadline,
          description: formData.description,
          eligibility: formData.eligibility,
          benefits: formData.benefits || "",
          requirements: formData.requirements || "",
          admin: {
            id: user.id
          }
        };

        const response = await createScholarship(scholarshipData);
        if (response.success) {
          // Refresh scholarships list
          const updatedResponse = await getScholarshipsByAdmin(user.id);
          if (updatedResponse.success) {
            setScholarships(updatedResponse.data || []);
          }
          alert("Scholarship created successfully!");
        } else {
          alert(response.message || "Failed to create scholarship");
        }
      }

      resetScholarshipForm();
      setScholarshipsError("");
    } catch (err) {
      console.error("Error handling scholarship:", err);
      if (err.message.includes("<!DOCTYPE")) {
        alert("Backend service is currently unavailable. Please try again later.");
      } else {
        alert(err.message || "Failed to save scholarship");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteScholarship(id);

      if (!response.success) {
        alert(response.message || "Failed to delete scholarship");
        return;
      }

      setScholarships(scholarships.filter((item) => item.id !== id));

      if (editId === id) {
        resetScholarshipForm();
      }

      alert(response.message || "Scholarship deleted successfully!");
    } catch (err) {
      console.error("Error deleting scholarship:", err);
      alert(err.message || "Failed to delete scholarship");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      amount: item.amount ?? "",
      deadline: item.deadline || "",
      description: item.description || "",
      eligibility: item.eligibility || "",
      category: item.category || "",
      gpa: item.gpa ?? "",
      benefits: item.benefits || "",
      requirements: item.requirements || ""
    });
    setEditId(item.id);
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const response = await updateApplicationStatusById(id, status.toUpperCase());

      if (!response.success) {
        alert(response.message || "Failed to update application status");
        return;
      }

      setApplications(applications.map((app) => (app.id === id ? response.data : app)));
      alert(response.message || "Application status updated successfully!");
    } catch (err) {
      console.error("Error updating application status:", err);
      alert(err.message || "Failed to update application status");
    }
  };

  const updateAidApplicationStatus = async (id, status) => {
    try {
      const response = await updateApplicationStatusById(id, status.toUpperCase());

      if (!response.success) {
        alert(response.message || "Failed to update aid application status");
        return;
      }

      setAidApplications(aidApplications.map((app) => (app.id === id ? response.data : app)));
      alert(response.message || "Aid application status updated successfully!");
    } catch (err) {
      console.error("Error updating aid application status:", err);
      alert(err.message || "Failed to update aid application status");
    }
  };

  // ===== Filter Logic =====
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = (app.student?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || app.status === filterStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const filteredAidApplications = aidApplications.filter((app) => {
    const matchesSearch = (app.student?.name || "")
      .toLowerCase()
      .includes(aidSearchTerm.toLowerCase());

    const matchesStatus =
      aidFilterStatus === "All" || app.status === aidFilterStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // ===== Pagination =====
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirst,
    indexOfLast
  );

  const aidIndexOfLast = aidCurrentPage * itemsPerPage;
  const aidIndexOfFirst = aidIndexOfLast - itemsPerPage;
  const currentAidApplications = filteredAidApplications.slice(
    aidIndexOfFirst,
    aidIndexOfLast
  );

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const aidTotalPages = Math.ceil(filteredAidApplications.length / itemsPerPage);

  // ===== Export PDF =====
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Scholarship Applications Report", 14, 15);

    const tableColumn = ["Student Name", "Scholarship", "Status"];
    const tableRows = [];

    filteredApplications.forEach((app) => {
      tableRows.push([app.student?.name || "", app.scholarship?.title || "", app.status]);
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
    if (app.status === "PENDING") overallStatusCounts.Pending++;
    if (app.status === "APPROVED") overallStatusCounts.Approved++;
    if (app.status === "REJECTED") overallStatusCounts.Rejected++;
  });

  const aidStatusCounts = {
    Pending: 0,
    Approved: 0,
    Rejected: 0
  };

  aidApplications.forEach((app) => {
    if (app.status === "PENDING") aidStatusCounts.Pending++;
    if (app.status === "APPROVED") aidStatusCounts.Approved++;
    if (app.status === "REJECTED") aidStatusCounts.Rejected++;
  });

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={{margin: 0, fontSize: "24px"}}> Admin</h2>
          <p style={{margin: "5px 0 0 0", fontSize: "12px", opacity: 0.7}}>Control Panel</p>
        </div>

        <div style={styles.menuDivider}></div>

        {["dashboard", "scholarships", "financial-aid", "applications", "aid-applications", "analytics", "profile"].map(
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
                {item === "aid-applications" && "💳"}
                {item === "analytics" && "📈"}
                {item === "profile" && "👤"}
              </span>
              {item === "financial-aid" ? "Financial Aid" : 
               item === "aid-applications" ? "Aid Applications" :
               item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
            </div>
          )
        )}
      </div>

      <div style={styles.main}>
        {/* DASHBOARD */}
        {active === "dashboard" && (
          <DashboardOverview
            scholarships={scholarships}
            financialAid={financialAid}
            applications={applications}
            aidApplications={aidApplications}
            overallStatusCounts={overallStatusCounts}
            setActive={setActive}
          />
        )}

        {/* SCHOLARSHIPS */}
        {active === "scholarships" && (
          <ScholarshipsManagement
            scholarships={scholarships}
            formData={formData}
            editId={editId}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            scholarshipsLoading={scholarshipsLoading}
            scholarshipsError={scholarshipsError}
          />
        )}

        {/* APPLICATIONS */}
        {active === "applications" && (
          <ApplicationsManagement
            applications={applications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            updateApplicationStatus={updateApplicationStatus}
            currentApplications={currentApplications}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            exportToPDF={exportToPDF}
            exportToExcel={exportToExcel}
          />
        )}

        {/* AID APPLICATIONS */}
        {active === "aid-applications" && (
          <AidApplicationsManagement
            aidApplications={aidApplications}
            aidSearchTerm={aidSearchTerm}
            setAidSearchTerm={setAidSearchTerm}
            aidFilterStatus={aidFilterStatus}
            setAidFilterStatus={setAidFilterStatus}
            updateAidApplicationStatus={updateAidApplicationStatus}
            currentAidApplications={currentAidApplications}
            aidTotalPages={aidTotalPages}
            aidCurrentPage={aidCurrentPage}
            setAidCurrentPage={setAidCurrentPage}
          />
        )}

        {/* FINANCIAL AID */}
        {active === "financial-aid" && (
          <FinancialAidManagement
            financialAid={financialAid}
            aidFormData={aidFormData}
            aidEditId={aidEditId}
            handleAidFormChange={handleAidFormChange}
            addFinancialAid={addFinancialAid}
            editFinancialAid={editFinancialAid}
            deleteFinancialAid={deleteFinancialAidItem}
            financialAidLoading={financialAidLoading}
            financialAidError={financialAidError}
          />
        )}

        {/* ADMIN PROFILE */}
        {active === "profile" && (
          <AdminProfile
            adminUser={adminProfile}
            updateAdminProfile={updateAdminProfile}
            profileLoading={profileLoading}
            profileError={profileError}
            profileSaving={profileSaving}
          />
        )}
        {/* ANALYTICS */}
        {active === "analytics" && (
          <Analytics
            scholarships={scholarships}
            applications={applications}
            aidApplications={aidApplications}
            users={[]} // You might want to pass users data if available
          />
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
  appDescription: {
    padding: "15px",
    background: "#f8f9fb",
    borderRadius: "8px",
    marginBottom: "15px",
    border: "1px solid #e2e8f0"
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
