import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

function PublicRoute({ children }) {
  // Get the user object from authService
  const user = authService.getUser();

  if (user) {
    // User is logged in, redirect to appropriate dashboard
    const normalizedRole = String(user.role || "").toLowerCase();
    if (normalizedRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/student" replace />;
    }
  }

  // User is not logged in, allow access to public routes
  return children;
}

export default PublicRoute;