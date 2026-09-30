import { ChevronRight } from "lucide-react";
import "./GradeCard.css";

export default function GradeCard({ grade, onClick }) {
  const gradeNumber = grade.name.replace(/\D/g, "") || grade.name;

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
