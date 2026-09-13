import React from "react";
import { ChevronRight } from "lucide-react";
import "./GradeCard.css";

export default function GradeCard({ grade, onClick }) {
  // Extract number from grade name e.g. "Grade 10" -> 10, or use index
  const gradeNumber = grade.name.replace(/\D/g, "") || grade.grade_id;

  return (
    <div className="grade-card" onClick={onClick}>
      <div className="grade-card-bg-glow"></div>
      <div className="grade-card-number">{gradeNumber}</div>
      <div className="grade-card-content">
        <h3 className="grade-card-title">{grade.name}</h3>
        <p className="grade-card-meta">
          {grade.subject_count || 0} subjects · {grade.material_count || 0} files
        </p>
      </div>
      <div className="grade-card-arrow">
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
