import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Get existing users or empty array
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const userExists = users.find(
      (user) => user.email === formData.email
    );

    if (userExists) {
      setErrors({ email: "This email is already registered!" });
      setLoading(false);
      return;
    }

    // Add new user with proper data structure
    const newUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      registeredDate: new Date().toLocaleDateString()
    };
    
    users.push(newUser);

    // Save updated users array
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message
    alert(`✅ Welcome ${formData.name}! Registration successful. Please login now.`);
    
    setLoading(false);
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🎓</h2>
        <p style={styles.subtitle}>Join our scholarship platform</p>

        <form onSubmit={handleSubmit}>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              style={{...styles.input, borderColor: errors.name ? "#ef4444" : "#ccc"}}
              required
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{...styles.input, borderColor: errors.email ? "#ef4444" : "#ccc"}}
              required
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              style={{...styles.input, borderColor: errors.password ? "#ef4444" : "#ccc"}}
              required
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{...styles.input, borderColor: errors.confirmPassword ? "#ef4444" : "#ccc"}}
              required
            />
            {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p style={styles.loginLink}>
          Already have an account? <a href="/login" style={styles.link}>Login here</a>
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
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    animation: "slideUp 0.5s ease-out"
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "4px",
    color: "#333",
    textAlign: "center"
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
    fontSize: "13px"
  },
  formGroup: {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontSize: "12px",
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
    textAlign: "center",
    margin: "8px 0 0 0"
  },
  button: {
    width: "100%",
    padding: "10px 16px",
    marginTop: "8px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease"
  },
  loginLink: {
    textAlign: "center",
    marginTop: "12px",
    fontSize: "13px",
    color: "#666"
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600"
  }
};

export default Register;
