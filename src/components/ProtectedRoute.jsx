import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  // Get the user object
  const stored = sessionStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  if (!user) {
    // Not logged in
    return <Navigate to="/" />;
  }

  if (role && String(user.role || "").toLowerCase() !== String(role || "").toLowerCase()) {
    // Logged in but wrong role
    return <Navigate to="/" />;
  }

  // All good, render children
  return children;
}

export default ProtectedRoute;