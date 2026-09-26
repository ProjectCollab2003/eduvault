import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { materialsApi, gradesApi, subjectsApi } from "../services/api";
import "./AdminMaterialsPage.css";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    grade_id: "",
    subject_id: "",
    category_id: "",
    term: "",
    academic_year: "2025",
  });

  const loadSubjectsForGrade = async (gradeId) => {
    if (!gradeId) {
      setSubjects([]);
      return;
    }

    try {
      const res = await subjectsApi.getAll({ grade_id: Number(gradeId) });
      if (res.success && res.data) {
        setSubjects(res.data);
        setForm((prev) => ({ ...prev, subject_id: prev.subject_id && res.data.some((s) => String(s.subject_id) === String(prev.subject_id)) ? prev.subject_id : "" }));
      }
    } catch (error) {
      console.error("Load subjects failed", error);
      setSubjects([]);
    }
  };

  const loadData = async () => {
    try {
      const [materialsRes, gradesRes] = await Promise.all([
        materialsApi.getAll(selectedGrade !== "all" ? { grade_id: Number(selectedGrade) } : {}),
        gradesApi.getAll(),
      ]);

      if (materialsRes.success && materialsRes.data) setMaterials(materialsRes.data);
      if (gradesRes.success && gradesRes.data) setGrades(gradesRes.data);
    } catch (error) {
      console.error("Load materials failed", error);
    }
  };

  useEffect(() => { loadData(); }, [selectedGrade]);

  useEffect(() => {
    if (form.grade_id) {
      loadSubjectsForGrade(form.grade_id);
    } else {
      setSubjects([]);
    }
  }, [form.grade_id]);

  const filtered = materials.filter((item) => {
    const q = search.toLowerCase();
    const gradeMatch = item.grade_name || item.grade_id || "";
    const subjectMatch = item.subject_name || item.subject_id || "";
    return !q || item.title?.toLowerCase().includes(q) || String(subjectMatch).toLowerCase().includes(q) || String(gradeMatch).toLowerCase().includes(q);
  });

  const resetForm = () => {
    setSelectedFile(null);
    setEditingMaterial(null);
    setForm({ title: "", description: "", grade_id: "", subject_id: "", category_id: "", term: "", academic_year: "2025" });
    setSubjects([]);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (material) => {
    setEditingMaterial(material);
    setForm({
      title: material.title || "",
      description: material.description || "",
      grade_id: String(material.grade_id || ""),
      subject_id: String(material.subject_id || ""),
      category_id: String(material.category_id || ""),
      term: String(material.term || ""),
      academic_year: String(material.academic_year || "2025"),
    });
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.grade_id || !form.subject_id) {
      alert("Please choose both grade and subject before uploading the material.");
      return;
    }

    try {
      let fileUrl = editingMaterial?.file_url || null;
      let payloadPublicId = editingMaterial?.public_id || null;
      let payloadResourceType = editingMaterial?.resource_type || "raw";

      if (selectedFile) {
        const uploadRes = await materialsApi.upload(selectedFile);
        fileUrl = uploadRes.data.file_url;
        payloadPublicId = uploadRes.data.public_id;
        payloadResourceType = uploadRes.data.resource_type;
      }

      const payload = {
        title: form.title,
        description: form.description,
        subject_id: Number(form.subject_id),
        category_id: Number(form.category_id || 1),
        grade_id: Number(form.grade_id),
        term: form.term ? Number(form.term) : null,
        academic_year: form.academic_year ? Number(form.academic_year) : null,
        file_url: fileUrl,
        public_id: payloadPublicId || editingMaterial?.public_id || null,
        resource_type: payloadResourceType || editingMaterial?.resource_type || "raw",
      };

      if (editingMaterial) {
        await materialsApi.update(editingMaterial.material_id, payload);
      } else {
        if (!selectedFile) {
          alert("Please choose a file from your device to upload.");
          return;
        }
        await materialsApi.create(payload);
      }

      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      alert(error.message || (editingMaterial ? "Failed to update material" : "Failed to upload material"));
    }
  };

  return (
    <div style={{ padding: "26px 28px 40px", background: "#f3f0ea", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", margin: 0, color: "#101b2f" }}>Materials</h1>
          <div style={{ color: "#58677d", marginTop: 4 }}>{materials.length} study materials on the platform</div>
        </div>
        <button onClick={handleOpenAdd} style={{ background: "#123a5d", color: "white", borderRadius: 10, padding: "14px 18px", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={18} />
          Upload Material
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#64748b" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or subject..." style={{ width: "100%", height: 42, borderRadius: 8, border: "1px solid #d1d5db", padding: "0 12px 0 36px", background: "#f3f0ea" }} />
          </div>
        </div>
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} style={{ height: 42, borderRadius: 8, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 12px" }}>
          <option value="all">All Grades</option>
          {grades.map((grade) => (<option key={grade.grade_id} value={grade.grade_id}>{grade.name}</option>))}
        </select>
      </div>

      <div style={{ background: "#f7f6f3", border: "1px solid #d9d1c9", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eef2f7", color: "#475569", fontSize: 13, textTransform: "uppercase" }}>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Title</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Grade</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Subject</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Type</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Views</th>
              <th style={{ textAlign: "left", padding: "14px 16px" }}>Downloads</th>
              <th style={{ textAlign: "right", padding: "14px 16px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.material_id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "14px 16px", fontWeight: 700 }}>{item.title}</td>
                <td style={{ padding: "14px 16px", color: "#475569" }}>{item.grade_name || `Grade ${item.grade_id || "N/A"}`}</td>
                <td style={{ padding: "14px 16px", color: "#475569" }}>{item.subject_name || "General"}</td>
                <td style={{ padding: "14px 16px", color: "#475569" }}>{item.category_name || "Notes"}</td>
                <td style={{ padding: "14px 16px", color: "#475569" }}>{Number(item.view_count || 0).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", color: "#475569" }}>{Number(item.download_count || 0).toLocaleString()}</td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <button type="button" onClick={() => handleOpenEdit(item)} style={{ background: "transparent", color: "#374151", marginRight: 8 }}><Pencil size={17} /></button>
                  <button type="button" onClick={() => { if (window.confirm("This material will be deleted. Continue?")) materialsApi.remove(item.material_id).then(loadData); }} style={{ background: "transparent", color: "#b91c1c" }}><Trash2 size={17} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="material-modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div className="material-modal" style={{ width: 780, background: "#f3f0ea", border: "1px solid #d9d1c9", borderRadius: 12, padding: "22px 28px 18px" }}>
            <div className="material-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>{editingMaterial ? "Edit Material" : "Upload New Material"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} style={{ background: "transparent", fontSize: 30, color: "#374151" }}>×</button>
            </div>

            <form onSubmit={handleCreate} className="material-modal-form">
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. O/L Mathematics Past Paper 2025" style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the material..." rows={3} style={{ width: "100%", borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "12px 14px", fontSize: 16, resize: "vertical" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(220px, 1fr))", gap: 18, marginBottom: 18 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Grade</label>
                  <select value={form.grade_id} onChange={(e) => setForm({ ...form, grade_id: e.target.value, subject_id: "" })} style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }}>
                    <option value="">Select grade</option>
                    {grades.map((grade) => (<option key={grade.grade_id} value={grade.grade_id}>{grade.name}</option>))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Subject</label>
                  <select value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }} disabled={!form.grade_id || !subjects.length}>
                    <option value="">{form.grade_id ? "Select subject" : "Choose grade first"}</option>
                    {subjects.map((subject) => (<option key={subject.subject_id} value={subject.subject_id}>{subject.name}</option>))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(220px, 1fr))", gap: 18, marginBottom: 18 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Material Type</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }}>
                    <option value="">Select type</option>
                    <option value="1">Notes</option>
                    <option value="2">Past Papers</option>
                    <option value="3">Model Papers</option>
                    <option value="4">Revision Papers</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Term</label>
                  <select value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }}>
                    <option value="">Select term</option>
                    <option value="1">Term 1</option>
                    <option value="2">Term 2</option>
                    <option value="3">Term 3</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>{editingMaterial ? "Replace file from this device (optional)" : "Upload file from this device"}</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "10px 14px", fontSize: 16 }}
                />
                {selectedFile && <div style={{ marginTop: 8, color: "#475569", fontSize: 14 }}>Selected: {selectedFile.name}</div>}
                {editingMaterial && !selectedFile && editingMaterial.file_url && (
                  <div style={{ marginTop: 8, color: "#475569", fontSize: 14 }}>Current file: {editingMaterial.file_url.split("/").pop()}</div>
                )}
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Academic Year</label>
                <select value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} style={{ width: "100%", height: 52, borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f0ea", padding: "0 14px", fontSize: 16 }}>
                  {[2025, 2024, 2023, 2022].map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>

              <div className="material-modal-actions" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} style={{ flex: 1, height: 52, borderRadius: 12, background: "#f7f6f3", border: "1px solid #d1d5db", fontWeight: 700, color: "#1f2937" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, height: 52, borderRadius: 12, background: "#123a5d", color: "white", fontWeight: 700 }}>{editingMaterial ? "Save Changes" : "Upload Material"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
