import { useEffect, useState } from "react";
import { Users, Bell } from "lucide-react";
import { usersApi } from "../services/api";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await usersApi.getStudents();
        if (res.success && res.data) setStudents(res.data);
      } catch (error) {
        console.error("Load students failed", error);
      }
    };
    load();
  }, []);

  const filtered = students.filter((student) => {
    const q = search.toLowerCase();
    return !q || student.name?.toLowerCase().includes(q) || student.email?.toLowerCase().includes(q) || String(student.grade_name || "").toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: "26px 28px 40px", background: "#f3f0ea", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", margin: 0, color: "#101b2f" }}>Students</h1>
          <div style={{ color: "#58677d", marginTop: 4 }}>{students.length} registered student accounts</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(180px, 1fr))", gap: 18, marginBottom: 24 }}>
        <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, padding: "22px 16px", display: "flex", alignItems: "center", gap: 12, minHeight: 90 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#dbeafe", color: "#123a5d" }}><Users size={20} /></div>
          <div><div style={{ fontSize: 30, fontWeight: 800 }}>{students.length}</div><div style={{ color: "#5b6476" }}>Registered Students</div></div>
        </div>

        <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, padding: "22px 16px", display: "flex", alignItems: "center", gap: 12, minHeight: 90 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#dcfce7", color: "#166534" }}><Bell size={20} /></div>
          <div><div style={{ fontSize: 30, fontWeight: 800 }}>{students.filter((s) => s.notificationsEnabled).length || 0}</div><div style={{ color: "#5b6476" }}>With Notifications</div></div>
        </div>

        <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, padding: "22px 16px", display: "flex", alignItems: "center", gap: 12, minHeight: 90 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3e8ff", color: "#7c3aed" }}><Users size={20} /></div>
          <div><div style={{ fontSize: 30, fontWeight: 800 }}>{students.reduce((sum, s) => sum + (Number(s.bookmark_count || 0)), 0)}</div><div style={{ color: "#5b6476" }}>Total Bookmarks</div></div>
        </div>
      </div>

      <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 18px" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or grade..." style={{ width: "100%", height: 42, borderRadius: 8, border: "1px solid #d1d5db", padding: "0 12px", background: "#f3f0ea" }} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eef2f7", color: "#475569", fontSize: 13, textTransform: "uppercase" }}>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Student</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Grade</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Joined</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Bookmarks</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Notifications</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.user_id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{student.name?.charAt(0).toUpperCase() || "S"}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{student.name}</div>
                      <div style={{ color: "#5b6476", fontSize: 13 }}>{student.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>{student.grade_name || "Not selected"}</td>
                <td style={{ padding: "14px 16px" }}>{student.created_at ? new Date(student.created_at).toLocaleDateString() : "—"}</td>
                <td style={{ padding: "14px 16px" }}>{student.bookmark_count || 0}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: 999, background: student.notificationsEnabled ? "#d1fae5" : "#e5e7eb", color: student.notificationsEnabled ? "#166534" : "#374151", fontWeight: 700, fontSize: 13 }}>
                    {student.notificationsEnabled ? "Active" : "Off"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
