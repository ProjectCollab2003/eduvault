import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { StudentDashboardPage, GradesPage, GradeSubjectsPage, SubjectMaterialsPage, SearchMaterialsPage, BookmarksPage, AnnouncementsPage } from "./pages/StudentPages";

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

function ProtectedStudentRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{minHeight:"60vh",display:"grid",placeItems:"center"}}>Loading…</div>;
  return user?.role_name === "STUDENT" ? children : <Navigate to="/login" replace />;
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/grades/:gradeId" element={<GradeSubjectsPage />} />
          <Route path="/subjects/:subjectId" element={<SubjectMaterialsPage />} />
          <Route path="/search" element={<SearchMaterialsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/student" element={<ProtectedStudentRoute><StudentDashboardPage /></ProtectedStudentRoute>} />
          <Route path="/bookmarks" element={<ProtectedStudentRoute><BookmarksPage /></ProtectedStudentRoute>} />

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
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
