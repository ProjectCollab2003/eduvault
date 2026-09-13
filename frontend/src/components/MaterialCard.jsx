import React from "react";
import { Download, FileText, Eye } from "lucide-react";
import "./MaterialCard.css";

export default function MaterialCard({ material, onDownload, onView }) {
  // Determine category badge theme
  const getBadgeClass = (categoryName) => {
    const name = (categoryName || "").toLowerCase();
    if (name.includes("revision") || name.includes("model")) return "badge-green";
    if (name.includes("past")) return "badge-orange";
    if (name.includes("tutorial") || name.includes("worksheet")) return "badge-purple";
    return "badge-blue"; // default for Notes / others
  };

  return (
    <div className="material-card">
      <div className="material-card-header">
        <span className={`material-category-badge ${getBadgeClass(material.category_name)}`}>
          {material.category_name || "Study Material"}
        </span>
        <span className="material-grade-badge">
          {material.grade_name || (material.grade_id ? `Grade ${material.grade_id}` : "")}
        </span>
      </div>

      <h4 className="material-card-title" title={material.title}>
        {material.title}
      </h4>

      <p className="material-card-desc">
        {material.description || "Comprehensive syllabus notes and questions to master your exam preparation."}
      </p>

      <div className="material-card-footer">
        <div className="material-card-downloads">
          <Download size={14} />
          <span>{Number(material.download_count || 0).toLocaleString()}</span>
        </div>

        <div className="material-card-subject">
          <span>{material.subject_name || "General"}</span>
          {material.term && <span> · Term {material.term}</span>}
        </div>
      </div>
    </div>
  );
}
