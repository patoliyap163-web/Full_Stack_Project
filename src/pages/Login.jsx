import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { authService } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData.email, formData.password);

      if (!response.success) {
        throw new Error(response.message || "Login failed. Please try again.");
      }

      // API response shape: { success: true, message, data: {id, name, email, role}}
      const userData = response.data;

      if (!userData) {
        throw new Error("Login response is missing user data.");
      }

      // Normalize role to lower-case to match the app route checks
      const user = {
        ...userData,
        role: String(userData.role || "").toLowerCase()
      };

      // User data and token are already saved in authService by loginUser function
      // Dispatch custom event to notify Navbar component
      window.dispatchEvent(new Event("userChanged"));

      setLoading(false);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 🎓</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{...styles.input, borderColor: error ? "#ef4444" : "#ccc"}}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              style={{...styles.input, borderColor: error ? "#ef4444" : "#ccc"}}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.registerLink}>
          Don't have an account? <a href="/register" style={styles.link}>Register here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    overflow: "hidden",
    zIndex: 9999
  },
  card: {
    backgroundColor: "white",
    padding: "48px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    animation: "slideUp 0.5s ease-out"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#333",
    textAlign: "center"
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
    fontSize: "14px"
  },
  formGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#333"
  },
  input: {
    padding: "12px 14px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.3s ease"
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    marginBottom: "16px",
    padding: "10px 12px",
    backgroundColor: "#fee2e2",
    borderRadius: "6px",
    textAlign: "center"
  },
  button: {
    width: "100%",
    padding: "12px 16px",
    marginTop: "10px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease"
  },
  registerLink: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#666"
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600"
  }
};

export default Login;