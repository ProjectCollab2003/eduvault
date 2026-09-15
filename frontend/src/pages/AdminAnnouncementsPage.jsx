import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { announcementsApi } from "../services/api";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", message: "" });

  const loadAnnouncements = async () => {
    try {
      const res = await announcementsApi.getAll();
      if (res.success && res.data) setAnnouncements(res.data);
    } catch (error) {
      console.error("Load announcements failed", error);
    }
  };

  useEffect(() => { loadAnnouncements(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await announcementsApi.create({ ...form, admin_id: 1 });
      setForm({ title: "", message: "" });
      setShowModal(false);
      loadAnnouncements();
    } catch (error) {
      alert(error.message || "Failed to create announcement");
    }
  };

  return (
    <div style={{ padding: "26px 28px 40px", background: "#f3f0ea", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", margin: 0, color: "#101b2f" }}>Announcements</h1>
          <div style={{ color: "#58677d", marginTop: 4 }}>Platform-wide notices visible on the homepage</div>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "#123a5d", color: "white", borderRadius: 10, padding: "14px 18px", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={18} />
          New Announcement
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {announcements.map((item) => (
          <div key={item.announcement_id} style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, padding: "20px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>📣</div>
                <div style={{ fontSize: 19, fontWeight: 800 }}>{item.title}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ background: "transparent", color: "#374151", padding: 6 }}><Pencil size={18} /></button>
                <button style={{ background: "transparent", color: "#b91c1c", padding: 6 }} onClick={() => announcementsApi.remove(item.announcement_id).then(loadAnnouncements)}><Trash2 size={18} /></button>
              </div>
            </div>
            <div style={{ color: "#475569", lineHeight: 1.6, marginTop: 10 }}>{item.message}</div>
            <div style={{ color: "#56657a", marginTop: 12 }}>{item.published_at ? new Date(item.published_at).toLocaleDateString() : "Recently"}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ width: 720, background: "#f3f0ea", border: "1px solid #d9d1c9", borderRadius: 12, padding: "22px 28px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>New Announcement</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", fontSize: 30, color: "#374151" }}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }} />
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Content</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your announcement..." rows={5} style={{ width: "100%", borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "12px 14px", fontSize: 16, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, height: 52, borderRadius: 12, background: "#f7f6f3", border: "1px solid #d1d5db", fontWeight: 700, color: "#1f2937" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, height: 52, borderRadius: 12, background: "#123a5d", color: "white", fontWeight: 700 }}>Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
