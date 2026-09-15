import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminMaterialsPage from "./pages/AdminMaterialsPage";
import AdminGradesPage from "./pages/AdminGradesPage";
import AdminSubjectsPage from "./pages/AdminSubjectsPage";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminAnnouncementsPage from "./pages/AdminAnnouncementsPage";

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "#475569" }}>Loading admin portal...</div>;
  }

  if (!user || user.role_name !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="materials" element={<AdminMaterialsPage />} />
              <Route path="grades" element={<AdminGradesPage />} />
              <Route path="subjects" element={<AdminSubjectsPage />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
