import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  requestPasswordReset,
  resetPassword,
} from "../services/api";
import { authService } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [backendCode, setBackendCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    const authMessage = authService.consumeAuthMessage();
    if (authMessage) {
      setError(authMessage);
    }
  }, []);

  const resetForgotPasswordState = ({ preserveMessage = false } = {}) => {
    setForgotStep("request");
    setForgotEmail("");
    setBackendCode("");
    setEnteredCode("");
    setNewPassword("");
    setConfirmPassword("");
    if (!preserveMessage) {
      setForgotMessage("");
    }
    setForgotError("");
    setForgotLoading(false);
  };

  const toggleForgotPassword = () => {
    const nextVisible = !showForgotPassword;
    setShowForgotPassword(nextVisible);

    if (!nextVisible) {
      resetForgotPasswordState();
    } else {
      setForgotEmail(formData.email || "");
      setForgotMessage("");
      setForgotError("");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

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

      const userData = response.data;

      if (!userData) {
        throw new Error("Login response is missing user data.");
      }

      const user = {
        ...userData,
        role: String(userData.role || "").toLowerCase()
      };

      window.dispatchEvent(new Event("userChanged"));

      setLoading(false);

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

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email.");
      return;
    }

    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const response = await requestPasswordReset(forgotEmail.trim());
      const resolvedCode = response?.data?.code || "";

      if (!resolvedCode) {
        throw new Error("Reset code was not returned by the backend.");
      }

      setBackendCode(String(resolvedCode));
      setForgotStep("verify");
      setForgotMessage(response.message || "Verification code sent to your email.");
    } catch (err) {
      setForgotError(err.message || "Failed to send reset code.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!enteredCode.trim()) {
      setForgotError("Please enter the verification code.");
      return;
    }

    if (String(enteredCode).trim() !== String(backendCode).trim()) {
      setForgotError("The verification code does not match.");
      return;
    }

    if (!newPassword) {
      setForgotError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setForgotError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const response = await resetPassword(
        forgotEmail.trim(),
        enteredCode.trim(),
        newPassword
      );

      setForgotMessage(response.message || "Password updated successfully. Please log in.");
      setShowForgotPassword(false);
      resetForgotPasswordState({ preserveMessage: true });
      setFormData((prev) => ({
        ...prev,
        email: forgotEmail.trim(),
        password: ""
      }));
      setError("");
    } catch (err) {
      setForgotError(err.message || "Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {error && <p style={styles.error}>{error}</p>}
        {forgotMessage && !showForgotPassword && <p style={styles.success}>{forgotMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.input, borderColor: error ? "#ef4444" : "#ccc" }}
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
              style={{ ...styles.input, borderColor: error ? "#ef4444" : "#ccc" }}
              required
            />
          </div>

          <div style={styles.helperRow}>
            <button
              type="button"
              onClick={toggleForgotPassword}
              style={styles.textButton}
            >
              {showForgotPassword ? "Back to login" : "Forgot password?"}
            </button>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {showForgotPassword && (
          <div style={styles.forgotPanel}>
            <h3 style={styles.panelTitle}>Reset Password</h3>
            <p style={styles.panelText}>
              {forgotStep === "request"
                ? "Enter your email to receive a verification code."
                : "Enter the email code and choose a new password."}
            </p>

            {forgotError && <p style={styles.error}>{forgotError}</p>}
            {forgotMessage && showForgotPassword && <p style={styles.success}>{forgotMessage}</p>}

            {forgotStep === "request" ? (
              <form onSubmit={handleForgotPasswordRequest}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Recovery Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your account email"
                    style={styles.input}
                    required
                  />
                </div>

                <button type="submit" style={styles.secondaryButton} disabled={forgotLoading}>
                  {forgotLoading ? "Sending code..." : "Send verification code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Verification Code</label>
                  <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    placeholder="Enter the code from email"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={styles.input}
                    required
                  />
                </div>

                <button type="submit" style={styles.secondaryButton} disabled={forgotLoading}>
                  {forgotLoading ? "Updating password..." : "Reset password"}
                </button>
              </form>
            )}
          </div>
        )}

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
    overflow: "auto",
    padding: "24px",
    zIndex: 9999
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "460px",
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
    marginBottom: "24px",
    fontSize: "14px"
  },
  formGroup: {
    marginBottom: "18px",
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
  success: {
    color: "#166534",
    fontSize: "13px",
    marginBottom: "16px",
    padding: "10px 12px",
    backgroundColor: "#dcfce7",
    borderRadius: "6px",
    textAlign: "center"
  },
  helperRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "4px"
  },
  textButton: {
    background: "transparent",
    border: "none",
    color: "#667eea",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0
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
  secondaryButton: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease"
  },
  forgotPanel: {
    marginTop: "22px",
    paddingTop: "22px",
    borderTop: "1px solid #e5e7eb"
  },
  panelTitle: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#333"
  },
  panelText: {
    margin: "0 0 18px 0",
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5"
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
