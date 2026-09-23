import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowRight } from "lucide-react";
import { gradesApi } from "../services/api";

export default function AdminGradesPage() {
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const loadGrades = async () => {
    try {
      const res = await gradesApi.getAll();
      if (res.success && res.data) setGrades(res.data);
    } catch (error) {
      console.error("Load grades failed", error);
    }
  };

  useEffect(() => { loadGrades(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditingGrade(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (grade) => {
    setEditingGrade(grade);
    setForm({ name: grade.name || "", description: grade.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGrade) {
        await gradesApi.update(editingGrade.grade_id, form);
      } else {
        await gradesApi.create(form);
      }
      resetForm();
      setShowModal(false);
      loadGrades();
    } catch (error) {
      alert(error.message || (editingGrade ? "Failed to update grade" : "Failed to create grade"));
    }
  };

  const handleDelete = async (gradeId) => {
    if (!window.confirm("This grade will be deleted. Continue?")) return;

    try {
      await gradesApi.remove(gradeId);
      loadGrades();
    } catch (error) {
      alert(error.message || "Failed to delete grade");
    }
  };

  return (
    <div style={{ padding: "26px 28px 40px", background: "#f3f0ea", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", margin: 0, color: "#101b2f" }}>Grades</h1>
          <div style={{ color: "#58677d", marginTop: 4 }}>{grades.length} grades configured</div>
        </div>
        <button onClick={handleOpenAdd} style={{ background: "#123a5d", color: "white", borderRadius: 10, padding: "14px 18px", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={18} />
          Add Grade
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(260px, 1fr))", gap: 22 }}>
        {grades.map((grade) => (
          <div key={grade.grade_id} style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, padding: "20px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 72, height: 72, borderRadius: 12, background: "#123a5d", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>
                  {grade.name.replace(/\D/g, "") || grade.grade_id}
                </div>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 800 }}>{grade.name}</div>
                  <div style={{ color: "#5b6476", marginTop: 4 }}>{grade.description || "No description"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button aria-label="Edit" onClick={() => handleOpenEdit(grade)} style={{ background: "transparent", color: "#374151", padding: 6 }}><Pencil size={18} /></button>
                <button aria-label="Delete" onClick={() => handleDelete(grade.grade_id)} style={{ background: "transparent", color: "#b91c1c", padding: 6 }}><Trash2 size={18} /></button>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 16, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#475569" }}>{grade.subject_count || 0} subjects · {grade.material_count || 0} materials</div>
              <button style={{ background: "transparent", color: "#123a5d", fontWeight: 700 }}>View subjects <ArrowRight size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ width: 680, background: "#f3f0ea", border: "1px solid #d9d1c9", borderRadius: 12, padding: "22px 28px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>{editingGrade ? "Edit Grade" : "Add New Grade"}</h2>
              <button onClick={() => { resetForm(); setShowModal(false); }} style={{ background: "transparent", fontSize: 30, color: "#374151" }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Grade Number</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 10" style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. O/L examination year" style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <button type="button" onClick={() => { resetForm(); setShowModal(false); }} style={{ flex: 1, height: 52, borderRadius: 12, background: "#f7f6f3", border: "1px solid #d1d5db", fontWeight: 700, color: "#1f2937" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, height: 52, borderRadius: 12, background: "#123a5d", color: "white", fontWeight: 700 }}>{editingGrade ? "Save Changes" : "Add Grade"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
