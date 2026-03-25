import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ExploreScholarships from "../components/ExploreScholarships";
import FinancialAid from "../components/FinancialAid";
import MyApplications from "../components/MyApplications";
import Profile from "../components/Profile";
import {
  getScholarships,
  getFinancialAid,
  getApplicationsByStudent,
  createApplication
} from "../services/api";

function StudentDashboard() {
  const [active, setActive] = useState("explore");
  const [scholarships, setScholarships] = useState([]);
  const [financialAid, setFinancialAid] = useState([]);
  const [applications, setApplications] = useState([]);
  const [aidApplications, setAidApplications] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [scholarshipsLoading, setScholarshipsLoading] = useState(false);
  const [scholarshipsError, setScholarshipsError] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem("studentProfile");
    return saved ? JSON.parse(saved) : {
      fullName: "",
      email: "",
      phone: "",
      gpa: "",
      major: "",
      enrollmentDate: new Date().toLocaleDateString(),
      university: ""
    };
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const allApplications = [...applications, ...aidApplications];

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;

    if (user) {
      setStudentId(user.id || null);
      setStudentName(user.name || user.email);
      setStudentEmail(user.email);

      const profile = JSON.parse(localStorage.getItem("studentProfile")) || {};

      if (!profile.fullName && user.name) {
        profile.fullName = user.name;
      }
      if (!profile.email && user.email) {
        profile.email = user.email;
      }
      if (!profile.enrollmentDate) {
        profile.enrollmentDate = new Date().toLocaleDateString();
      }

      localStorage.setItem("studentProfile", JSON.stringify(profile));
      setStudentProfile(profile);
    }
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setScholarshipsLoading(true);
        setScholarshipsError("");

        const scholarshipResponse = await getScholarships();
        if (scholarshipResponse.success) {
          const sortedScholarships = [...(scholarshipResponse.data || [])].sort((a, b) => {
            const dateA = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
            const dateB = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
            return dateA - dateB;
          });
          setScholarships(sortedScholarships);
        } else {
          setScholarshipsError(scholarshipResponse.message || "Failed to load scholarships");
        }

        const aidResponse = await getFinancialAid();
        if (aidResponse.success) {
          setFinancialAid(aidResponse.data || []);
        }

        if (studentId) {
          const applicationsResponse = await getApplicationsByStudent(studentId);
          if (applicationsResponse.success) {
            const allApplications = applicationsResponse.data || [];
            setApplications(allApplications.filter((app) => app.scholarship));
            setAidApplications(allApplications.filter((app) => app.financialAid));
          }
        }
      } catch (err) {
        console.error("Error fetching student dashboard data:", err);
        setScholarshipsError(err.message || "Failed to load scholarships");
      } finally {
        setScholarshipsLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleApply = async (scholarship, description) => {
    const alreadyApplied = applications.find((app) => app.scholarship?.id === scholarship.id);

    if (alreadyApplied) {
      alert("You already applied for this scholarship!");
      return;
    }

    if (!studentId) {
      alert("Student not found. Please login again.");
      return;
    }

    try {
      const response = await createApplication({
        student: { id: studentId },
        scholarship: { id: scholarship.id },
        description
      });

      if (!response.success) {
        alert(response.message || "Failed to submit application");
        return;
      }

      setApplications((prev) => [...prev, response.data]);
      alert(response.message || "Application submitted successfully!");
    } catch (err) {
      console.error("Error applying for scholarship:", err);
      alert(err.message || "Failed to submit application");
    }
  };

  const handleInterestedAid = async (aid, description) => {
    const alreadyInterested = aidApplications.find((app) => app.financialAid?.id === aid.id);

    if (alreadyInterested) {
      alert("You already expressed interest in this financial aid!");
      return;
    }

    if (!studentId) {
      alert("Student not found. Please login again.");
      return;
    }

    try {
      const response = await createApplication({
        student: { id: studentId },
        financialAid: { id: aid.id },
        description
      });

      if (!response.success) {
        alert(response.message || "Failed to submit financial aid application");
        return;
      }

      setAidApplications((prev) => [...prev, response.data]);
      alert(response.message || "Interest expressed successfully!");
    } catch (err) {
      console.error("Error applying for financial aid:", err);
      alert(err.message || "Failed to submit financial aid application");
    }
  };

  const renderActiveComponent = () => {
    switch (active) {
      case "explore":
        return (
          <ExploreScholarships
            scholarships={scholarships}
            applications={applications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            handleApply={handleApply}
            scholarshipsLoading={scholarshipsLoading}
            scholarshipsError={scholarshipsError}
          />
        );
      case "financial-aid":
        return (
          <FinancialAid
            financialAid={financialAid}
            handleInterestedAid={handleInterestedAid}
            aidApplications={aidApplications}
            studentName={studentName}
          />
        );
      case "applications":
        return (
          <MyApplications
            applications={allApplications}
            studentName={studentName}
          />
        );
      case "profile":
        return (
          <Profile
            studentProfile={studentProfile}
            setStudentProfile={setStudentProfile}
            studentEmail={studentEmail}
            applications={allApplications}
            scholarships={scholarships}
            setActive={setActive}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar active={active} setActive={setActive} />

      <div style={styles.main}>
        {renderActiveComponent()}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "100vh", overflow: "hidden", width: "100%", background: "#f8f9fb" },
  main: {
    marginLeft: "280px",
    marginTop: "60px",
    width: "calc(100% - 280px)",
    height: "calc(100vh - 60px)",
    padding: "40px",
    background: "#f8f9fb",
    overflow: "auto",
    boxSizing: "border-box"
  }
};

export default StudentDashboard;
