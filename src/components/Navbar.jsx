import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [hover, setHover] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    // Update user state when localStorage changes
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    // Listen for custom event from login/register
    window.addEventListener("userChanged", handleStorageChange);

    // Listen for storage changes (works across tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Also check localStorage on window focus (in case user logs in from another tab)
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("userChanged", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear the user object from localStorage
    localStorage.removeItem("user");
    // Update the user state immediately
    setUser(null);
    // Force full navigation to home to ensure landing on Home
    window.location.href = "/";
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🎓 ScholarTrack</h2>

      <div>
        <Link
          to="/"
          style={{ ...styles.link, color: hover === "home" ? "#dbeafe" : styles.link.color }}
          onMouseEnter={() => setHover("home")}
          onMouseLeave={() => setHover(null)}
        >
          Home
        </Link>

        {!user && ( // Show login and register only if not logged in
          <>
            <Link
              to="/login"
              style={{ ...styles.link, color: hover === "login" ? "#dbeafe" : styles.link.color }}
              onMouseEnter={() => setHover("login")}
              onMouseLeave={() => setHover(null)}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ ...styles.link, color: hover === "register" ? "#dbeafe" : styles.link.color }}
              onMouseEnter={() => setHover("register")}
              onMouseLeave={() => setHover(null)}
            >
              Register
            </Link>
          </>
        )}

        {user && user.role === "student" && ( // Show dashboard link if user is a student
          <Link to="/student" style={styles.link}>Student Dashboard</Link>
        )}

        {user && user.role === "admin" && ( // Show admin link if user is an admin
          <Link to="/admin" style={styles.link}>Admin Dashboard</Link>
        )}

        {user && ( // Show logout button if user is logged in
          <button
            onClick={handleLogout}
            style={{
              ...styles.logoutBtn,
              backgroundColor: hover === "logout" ? "#7f1d1d" : "#dc2626"
            }}
            onMouseEnter={() => setHover("logout")}
            onMouseLeave={() => setHover(null)}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#1e3a8a",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    boxSizing: "border-box"
  },
  logo: { margin: 0 },
  link: {
    color: "white",
    textDecoration: "none",
    marginLeft: "20px",
    fontWeight: "bold"
  },
  logoutBtn: {
    marginLeft: "20px",
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "2px solid #dc2626",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "all 0.3s ease"
  }
};

export default Navbar;