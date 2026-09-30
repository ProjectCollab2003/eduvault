import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, GraduationCap, BookOpenText, Users, Megaphone, LogOut, ShieldCheck } from "lucide-react";
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
    <div style={{ display: "flex", width: "100%", height: "100dvh", minHeight: 0, overflow: "hidden", background: "#f3f0ea" }}>
      <aside
        style={{
          width: "min(260px, 26vw)",
          minWidth: 220,
          background: "linear-gradient(180deg, #123a5d 0%, #0f2f4a 100%)",
          color: "#eff6ff",
          padding: "22px 16px 18px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flexShrink: 0,
          overflow: "hidden",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 8px 20px", marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white" }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: "clamp(1.2rem, 1vw + 0.8rem, 1.7rem)", fontWeight: 700, lineHeight: 1.2 }}>EduVault</div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", opacity: 0.82, textTransform: "uppercase" }}>Admin Portal</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
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
                borderRadius: 10,
                color: isActive ? "#0f172a" : "#dbeafe",
                background: isActive ? "rgba(255,255,255,0.95)" : "transparent",
                boxShadow: isActive ? "0 8px 20px rgba(15, 23, 42, 0.08)" : "none",
                fontWeight: 600,
                transition: "all 0.2s ease",
              })}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#dbeafe", padding: "10px 10px 4px" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "Administrator"}</div>
              {user?.email && <div style={{ fontSize: 12, opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <button
              onClick={handleSignOut}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#dbeafe",
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, height: "100%", background: "#f3f0ea", minWidth: 0, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}>
        <Outlet />
      </main>
    </div>
  );
}
