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
  createApplication,
  getStudentProfileByUserId,
  updateStudentProfileByUserId
} from "../services/api";

const createDefaultStudentProfile = (email = "", fullName = "") => ({
  fullName,
  email,
  phone: "",
  gpa: "",
  major: "",
  enrollmentDate: "",
  university: ""
});

const normalizeStudentProfile = (profile, email = "", fullName = "") => {
  const safeProfile = profile && typeof profile === "object" ? profile : {};

  return {
    fullName: safeProfile.fullName || fullName || "",
    email,
    phone: safeProfile.phone || "",
    gpa:
      safeProfile.gpa === 0 || safeProfile.gpa
        ? String(safeProfile.gpa)
        : "",
    major: safeProfile.major || "",
    enrollmentDate: safeProfile.enrollmentDate || "",
    university: safeProfile.university || ""
  };
};

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
  const [studentProfile, setStudentProfile] = useState(createDefaultStudentProfile());
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
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
      setStudentProfile(createDefaultStudentProfile(user.email || "", user.name || ""));
    }
  }, []);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!studentId) {
        return;
      }

      const stored = sessionStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await getStudentProfileByUserId(studentId);
        const backendProfile = response?.data;
        const hasProfileData =
          backendProfile &&
          typeof backendProfile === "object" &&
          Object.keys(backendProfile).length > 0;

        setStudentProfile(
          hasProfileData
            ? normalizeStudentProfile(backendProfile, user?.email || "", user?.name || "")
            : createDefaultStudentProfile(user?.email || "", user?.name || "")
        );
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setProfileError(err.message || "Failed to load profile");
        setStudentProfile(createDefaultStudentProfile(user?.email || "", user?.name || ""));
      } finally {
        setProfileLoading(false);
      }
    };

    fetchStudentProfile();
  }, [studentId]);

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

  const handleUpdateStudentProfile = async (profileData) => {
    if (!studentId) {
      throw new Error("Student not found. Please login again.");
    }

    try {
      setProfileSaving(true);
      setProfileError("");

      const payload = {
        fullName: profileData.fullName?.trim() || "",
        phone: profileData.phone?.trim() || "",
        major: profileData.major || "",
        gpa: profileData.gpa === "" ? 0 : Number(profileData.gpa),
        university: profileData.university || "",
        enrollmentDate: profileData.enrollmentDate || ""
      };

      const response = await updateStudentProfileByUserId(studentId, payload);
      const updatedProfile = normalizeStudentProfile(
        response?.data && typeof response.data === "object" && Object.keys(response.data).length > 0
          ? response.data
          : payload,
        studentEmail,
        studentName
      );

      setStudentProfile(updatedProfile);
      return response;
    } catch (err) {
      console.error("Error updating student profile:", err);
      setProfileError(err.message || "Failed to save profile");
      throw err;
    } finally {
      setProfileSaving(false);
    }
  };

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
            updateStudentProfile={handleUpdateStudentProfile}
            profileLoading={profileLoading}
            profileError={profileError}
            profileSaving={profileSaving}
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
