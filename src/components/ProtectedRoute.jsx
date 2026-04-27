import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

function ProtectedRoute({ children, role }) {
  // Get the user object from authService
  const user = authService.getUser();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && String(user.role || "").toLowerCase() !== String(role || "").toLowerCase()) {
    // Logged in but wrong role
    return <Navigate to="/login" replace />;
  }

  // All good, render children
  return children;
}

export default ProtectedRoute;
