import { Bookmark, Download, Eye } from "lucide-react";
import { materialsApi, studentApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function StudentMaterialCard({ material, onBookmarkChange, compact = false }) {
  const { user } = useAuth();
  const bookmarked = Boolean(material.is_bookmarked);

  const toggleBookmark = async (event) => {
    event.stopPropagation();
    if (!user) return;
    if (bookmarked) await studentApi.removeBookmark(material.material_id);
    else await studentApi.addBookmark(material.material_id);
    onBookmarkChange?.(material.material_id, !bookmarked);
  };

  const openMaterial = async () => {
    await materialsApi.incrementView(material.material_id).catch(() => {});
    if (user?.role_name === "STUDENT") await studentApi.recordAccess(material.material_id).catch(() => {});
    if (material.file_url) window.open(material.file_url, "_blank", "noopener,noreferrer");
  };

  return <article className={`student-material-card ${compact ? "compact" : ""}`} onClick={openMaterial}>
    <div className="student-material-top">
      <span className="category-pill">{material.category_name}</span>
      <span className="material-year">{material.academic_year || material.grade_name}</span>
      {user?.role_name === "STUDENT" && <button className={`bookmark-button ${bookmarked ? "active" : ""}`} onClick={toggleBookmark} aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}><Bookmark size={17} fill={bookmarked ? "currentColor" : "none"}/></button>}
    </div>
    <h3>{material.title}</h3>
    {!compact && <p>{material.description}</p>}
    <div className="material-meta"><span><Download size={14}/>{Number(material.download_count || 0).toLocaleString()}</span><span><Eye size={14}/>{Number(material.view_count || 0).toLocaleString()}</span><span className="material-subject">{material.subject_name}{material.term ? ` · Term ${material.term}` : ""}</span></div>
  </article>;
}
