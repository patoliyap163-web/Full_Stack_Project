import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  // Get the user object
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    // User is logged in, redirect to appropriate dashboard
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/student" replace />;
    }
  }

  // User is not logged in, allow access to public routes
  return children;
}

export default PublicRoute;