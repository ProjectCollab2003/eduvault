import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { gradesApi, subjectsApi } from "../services/api";

export default function AdminSubjectsPage() {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form, setForm] = useState({ grade_id: "", name: "", description: "", color: "#3B82F6" });

  const loadData = async () => {
    try {
      const [gradeRes, subjectRes] = await Promise.all([
        gradesApi.getAll(),
        subjectsApi.getAll(selectedGrade !== "all" ? { grade_id: selectedGrade } : {}),
      ]);
      if (gradeRes.success && gradeRes.data) setGrades(gradeRes.data);
      if (subjectRes.success && subjectRes.data) setSubjects(subjectRes.data);
    } catch (error) {
      console.error("Load subjects failed", error);
    }
  };

  useEffect(() => { loadData(); }, [selectedGrade]);

  const resetForm = () => {
    setForm({ grade_id: "", name: "", description: "", color: "#3B82F6" });
    setEditingSubject(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setForm({
      grade_id: String(subject.grade_id || ""),
      name: subject.name || "",
      description: subject.description || "",
      color: subject.color || "#3B82F6",
    });
    setShowAddModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await subjectsApi.update(editingSubject.subject_id, {
          grade_id: Number(form.grade_id),
          name: form.name,
          description: form.description,
        });
      } else {
        await subjectsApi.create({ grade_id: Number(form.grade_id), name: form.name, description: form.description });
      }
      setShowAddModal(false);
      resetForm();
      loadData();
    } catch (error) {
      alert(error.message || (editingSubject ? "Failed to update subject" : "Failed to create subject"));
    }
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm("This subject will be deleted. Continue?")) return;

    try {
      await subjectsApi.remove(subjectId);
      loadData();
    } catch (error) {
      alert(error.message || "Failed to delete subject");
    }
  };

  return (
    <div style={{ padding: "26px 28px 40px", background: "#f3f0ea", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", margin: 0, color: "#101b2f" }}>Subjects</h1>
          <div style={{ color: "#58677d", marginTop: 4 }}>{subjects.length} subjects across all grades</div>
        </div>
        <button onClick={openAddModal} style={{ background: "#123a5d", color: "white", borderRadius: 10, padding: "14px 18px", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={18} />
          Add Subject
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <button onClick={() => setSelectedGrade("all")} style={{ background: "#e5e7eb", borderRadius: 8, padding: "8px 12px", fontWeight: 600 }}>All Grades</button>
        {grades.map((grade) => (
          <button key={grade.grade_id} onClick={() => setSelectedGrade(String(grade.grade_id))} style={{ background: selectedGrade === String(grade.grade_id) ? "#123a5d" : "#e5e7eb", color: selectedGrade === String(grade.grade_id) ? "white" : "#111827", borderRadius: 8, padding: "8px 12px", fontWeight: 600 }}>
            {grade.name}
          </button>
        ))}
      </div>

      <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eef2f7", color: "#475569", fontSize: 13, textTransform: "uppercase" }}>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Subject</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Grade</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Materials</th>
              <th style={{ textAlign: "right", padding: "14px 16px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.subject_id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "14px 16px", fontWeight: 700 }}><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: subject.color || "#3B82F6", marginRight: 8 }} />{subject.name}</td>
                <td style={{ padding: "14px 16px", color: "#475569" }}>{subject.grade_name || "Grade"}</td>
                <td style={{ padding: "14px 16px", color: "#475569" }}>{subject.material_count || 0}</td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <button type="button" onClick={() => openEditModal(subject)} style={{ background: "transparent", color: "#374151", marginRight: 8 }}><Pencil size={17} /></button>
                  <button type="button" onClick={() => handleDelete(subject.subject_id)} style={{ background: "transparent", color: "#b91c1c" }}><Trash2 size={17} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ width: 700, background: "#f3f0ea", border: "1px solid #d9d1c9", borderRadius: 12, padding: "22px 28px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>{editingSubject ? "Edit Subject" : "Add New Subject"}</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} style={{ background: "transparent", fontSize: 30, color: "#374151" }}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Subject Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics" style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Grade</label>
                <select value={form.grade_id} onChange={(e) => setForm({ ...form, grade_id: e.target.value })} style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }}>
                  <option value="">Select grade</option>
                  {grades.map((grade) => (<option key={grade.grade_id} value={grade.grade_id}>{grade.name}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} style={{ flex: 1, height: 52, borderRadius: 12, background: "#f7f6f3", border: "1px solid #d1d5db", fontWeight: 700, color: "#1f2937" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, height: 52, borderRadius: 12, background: "#123a5d", color: "white", fontWeight: 700 }}>{editingSubject ? "Save Changes" : "Add Subject"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
