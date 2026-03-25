import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ExploreScholarships from "../components/ExploreScholarships";
import FinancialAid from "../components/FinancialAid";
import MyApplications from "../components/MyApplications";
import Profile from "../components/Profile";

function StudentDashboard() {
  const [active, setActive] = useState("explore");
  const [scholarships, setScholarships] = useState([]);
  const [financialAid, setFinancialAid] = useState([]);
  const [applications, setApplications] = useState([]);
  const [aidApplications, setAidApplications] = useState([]);
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

  useEffect(() => {
    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setStudentName(user.name || user.email);
      setStudentEmail(user.email);

      // Get or create student profile with registration data
      let profile = JSON.parse(localStorage.getItem("studentProfile")) || {};

      // Merge registration data with profile if not already set
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

    const savedScholarships = localStorage.getItem("scholarships");
    if (savedScholarships) {
      setScholarships(JSON.parse(savedScholarships));
    }

    const savedFinancialAid = localStorage.getItem("financialAid");
    if (savedFinancialAid) {
      setFinancialAid(JSON.parse(savedFinancialAid));
    }

    const savedApplications = localStorage.getItem("applications");
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }

    const savedAidApplications = localStorage.getItem("aidApplications");
    if (savedAidApplications) {
      setAidApplications(JSON.parse(savedAidApplications));
    }
  }, []);

  const handleApply = (scholarship, description) => {
    const alreadyApplied = applications.find(
      (app) =>
        app.scholarshipId === scholarship.id &&
        app.studentName === studentName
    );

    if (alreadyApplied) {
      alert("You already applied for this scholarship!");
      return;
    }

    const newApplication = {
      id: Date.now(),
      scholarshipId: scholarship.id,
      scholarshipTitle: scholarship.title,
      studentName,
      status: "Pending",
      appliedDate: new Date().toLocaleDateString(),
      description: description
    };

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem("applications", JSON.stringify(updatedApplications));
    alert("✅ Application submitted successfully!");
  };

  const handleInterestedAid = (aid, description) => {
    const alreadyInterested = aidApplications.find(
      (app) =>
        app.aidId === aid.id &&
        app.studentName === studentName
    );

    if (alreadyInterested) {
      alert("You already expressed interest in this financial aid!");
      return;
    }

    const newAidApplication = {
      id: Date.now(),
      aidId: aid.id,
      aidTitle: aid.title,
      studentName,
      status: "Pending",
      appliedDate: new Date().toLocaleDateString(),
      description: description
    };

    const updatedAidApplications = [...aidApplications, newAidApplication];
    setAidApplications(updatedAidApplications);
    localStorage.setItem("aidApplications", JSON.stringify(updatedAidApplications));
    alert("💰 Interest expressed successfully!");
  };

  const renderActiveComponent = () => {
    switch (active) {
      case "explore":
        return (
          <ExploreScholarships
            scholarships={scholarships}
            applications={applications}
            studentName={studentName}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            handleApply={handleApply}
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
            applications={applications}
            studentName={studentName}
          />
        );
      case "profile":
        return (
          <Profile
            studentProfile={studentProfile}
            setStudentProfile={setStudentProfile}
            studentEmail={studentEmail}
            applications={applications}
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
