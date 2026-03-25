import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  // Get the user object
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    // Logged in but wrong role
    return <Navigate to="/" />;
  }

  // All good, render children
  return children;
}

export default ProtectedRoute;