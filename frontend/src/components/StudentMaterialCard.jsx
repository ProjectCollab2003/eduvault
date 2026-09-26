import { Bookmark, Download, Eye } from "lucide-react";
import { studentApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentMaterialCard({ material, onBookmarkChange, compact = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const bookmarked = Boolean(material.is_bookmarked);

  const toggleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (user?.role_name !== "STUDENT") return;
    try {
      if (bookmarked) await studentApi.removeBookmark(material.material_id);
      else await studentApi.addBookmark(material.material_id);
      onBookmarkChange?.(material.material_id, !bookmarked);
    } catch (error) {
      console.error("Material bookmark update failed", error);
    }
  };

  const openMaterial = () => navigate(`/materials/${material.material_id}`);

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
