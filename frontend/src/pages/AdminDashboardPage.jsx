import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutGrid, Users, BookOpenText, Download, Plus } from "lucide-react";
import { statsApi, materialsApi, usersApi } from "../services/api";

const statCardStyle = {
  background: "#f7f6f3",
  border: "1px solid #d9d1c9",
  borderRadius: 14,
  padding: "22px 20px",
  display: "flex",
  alignItems: "center",
  gap: 14,
  minHeight: 110,
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalMaterials: 0, totalGrades: 0, totalSubjects: 0, totalDownloads: 0 });
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, materialRes, studentsRes] = await Promise.all([
          statsApi.get(),
          materialsApi.getRecent(5),
          usersApi.getStudents(),
        ]);

        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (materialRes.success && materialRes.data) setRecentMaterials(materialRes.data);
        if (studentsRes.success && studentsRes.data) {
          setRecentStudents(studentsRes.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const quickActions = [
    { label: "Upload New Material", path: "/admin/materials" },
    { label: "Manage Grades", path: "/admin/grades" },
    { label: "View Students", path: "/admin/students" },
    { label: "Post Announcement", path: "/admin/announcements" },
  ];

  return (
    <div style={{ padding: "26px 28px 40px", background: "#f3f0ea", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", margin: 0, color: "#101b2f" }}>Dashboard</h1>
          <div style={{ color: "#58677d", marginTop: 4 }}>{formattedDate}</div>
        </div>
        <button onClick={() => navigate("/admin/materials")} style={{ background: "#123a5d", color: "white", borderRadius: 10, padding: "14px 18px", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={18} />
          Upload Material
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(180px, 1fr))", gap: 18, marginBottom: 26 }}>
        <div style={statCardStyle}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#123a5d" }}><BookOpenText size={20} /></div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#111827" }}>{loading ? "..." : stats.totalMaterials}</div>
            <div style={{ color: "#5b6476", fontSize: 14 }}>Total Materials</div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", color: "#166534" }}><Users size={20} /></div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#111827" }}>{loading ? "..." : Number(stats.totalStudents || 0)}</div>
            <div style={{ color: "#5b6476", fontSize: 14 }}>Registered Students</div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#123a5d" }}><LayoutGrid size={20} /></div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#111827" }}>{loading ? "..." : stats.totalGrades}</div>
            <div style={{ color: "#5b6476", fontSize: 14 }}>Active Grades</div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#ffedd5", display: "flex", alignItems: "center", justifyContent: "center", color: "#b45309" }}><Download size={20} /></div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#111827" }}>{loading ? "..." : Number(stats.totalDownloads || 0).toLocaleString()}</div>
            <div style={{ color: "#5b6476", fontSize: 14 }}>Total Downloads</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: 22 }}>
        <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, padding: "18px 18px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#101b2f" }}>Recently Added Materials</h2>
            <button onClick={() => navigate("/admin/materials")} style={{ color: "#123a5d", fontWeight: 700, background: "transparent" }}>View all <ArrowRight size={16} /></button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentMaterials.length ? recentMaterials.map((item) => (
              <div key={item.material_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", paddingBottom: 8, gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#123a5d", display: "inline-block" }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div style={{ color: "#5b6476", fontSize: 13 }}>{item.grade_name || "Unassigned grade"} · {item.subject_name || "Unassigned subject"} · {item.category_name || "Uncategorized"}</div>
                  </div>
                </div>
                <div style={{ color: "#4b5563", fontSize: 13, minWidth: 70, textAlign: "right" }}>{Number(item.download_count || 0).toLocaleString()}</div>
              </div>
            )) : <div style={{ color: "#667085", padding: "12px 0" }}>No materials yet.</div>}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, padding: "18px" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#101b2f" }}>Quick Actions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
              {quickActions.map((action) => (
                <button key={action.label} onClick={() => navigate(action.path)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "1px solid rgba(0,0,0,0.02)", padding: "10px 12px", borderRadius: 10, color: "#1f2937", fontWeight: 600, textAlign: "left" }}>
                  <span>{action.label}</span>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#101b2f" }}>Recent Students</h2>
              <button onClick={() => navigate("/admin/students")} style={{ color: "#123a5d", fontWeight: 700, background: "transparent" }}>View all</button>
            </div>
            {recentStudents.length ? recentStudents.map((student) => (
              <div key={student.user_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{student.name?.charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{student.name}</div>
                  <div style={{ color: "#5b6476", fontSize: 13 }}>{student.grade_name || "No grade selected"}</div>
                </div>
              </div>
            )) : <div style={{ color: "#667085" }}>No students yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
