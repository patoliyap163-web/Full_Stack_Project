import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <div style={{ marginTop: "80px" }}><Home /></div>
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <div style={{ marginTop: "80px" }}><Login /></div>
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <div style={{ marginTop: "80px" }}><Register /></div>
          </PublicRoute>
        } />

        {/* Protected Student Route */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
