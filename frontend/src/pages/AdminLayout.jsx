import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, GraduationCap, BookOpenText, Users, Megaphone, ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/materials", label: "Materials", icon: FileText },
  { to: "/admin/grades", label: "Grades", icon: GraduationCap },
  { to: "/admin/subjects", label: "Subjects", icon: BookOpenText },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 120px)", background: "#efeee8" }}>
      <aside style={{ width: 260, background: "#123a5d", color: "#eff6ff", padding: "18px 14px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 8px 18px", marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white" }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>EduVault</div>
            <div style={{ fontSize: 12, letterSpacing: "0.12em", opacity: 0.8, textTransform: "uppercase" }}>Admin Portal</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 8,
                color: isActive ? "#0f172a" : "#dbeafe",
                background: isActive ? "rgba(255,255,255,0.9)" : "transparent",
                fontWeight: 600,
                transition: "all 0.2s ease",
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#dbeafe", padding: "10px 10px" }}>
            <button style={{ width: 28, height: 28, borderRadius: "50%", background: "#f97316", color: "white", fontWeight: 700 }}>
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </button>
            <div>
              <div style={{ fontWeight: 700 }}>{user?.name || "Administrator"}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{user?.email || "admin@eduvault.lk"}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, color: "#dbeafe", padding: "10px 12px", borderRadius: 8, opacity: 0.9 }}>
              <ArrowLeft size={16} />
              View Site
            </button>
            <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: 8, color: "#dbeafe", padding: "10px 12px", borderRadius: 8, opacity: 0.9 }}>
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, background: "#f3f0ea", padding: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
