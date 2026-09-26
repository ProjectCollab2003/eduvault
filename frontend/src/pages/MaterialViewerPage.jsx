import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark, Download, FileText } from "lucide-react";
import { materialsApi, studentApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./MaterialViewerPage.css";

export default function MaterialViewerPage() {
  const { materialId } = useParams();
  const { user } = useAuth();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      materialsApi.getById(materialId),
      materialsApi.incrementView(materialId).catch(() => null),
      user?.role_name === "STUDENT" ? studentApi.recordAccess(materialId).catch(() => null) : Promise.resolve(),
    ]).then(([response]) => {
      if (active) setMaterial(response.data);
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [materialId, user?.role_name]);

  const toggleBookmark = async () => {
    if (!user) return;
    if (material.is_bookmarked) await studentApi.removeBookmark(material.material_id);
    else await studentApi.addBookmark(material.material_id);
    setMaterial((current) => ({ ...current, is_bookmarked: !current.is_bookmarked }));
  };

  const download = () => {
    const anchor = document.createElement("a");
    anchor.href = `/api/materials/${material.material_id}/file`;
    anchor.download = "";
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  if (loading) return <main className="material-viewer-state">Loading material…</main>;
  if (error || !material) return <main className="material-viewer-state error-state">{error || "Material not found."}</main>;

  const previewUrl = material.file_url
    ? `${material.file_url.split("#")[0]}#toolbar=0&navpanes=0&view=FitH`
    : "";

  return <main className="material-viewer-page">
    <div className="material-viewer-crumbs"><Link to="/grades">Grades</Link><span>›</span><Link to={`/subjects/${material.subject_id}`}>{material.subject_name}</Link><span>›</span><b>{material.title}</b></div>
    <header className="material-viewer-header">
      <div className="material-viewer-title"><div className="material-file-icon"><FileText size={24}/></div><div><span>{material.category_name}</span><h1>{material.title}</h1><p>{material.grade_name} · {material.subject_name}{material.term ? ` · Term ${material.term}` : ""}</p></div></div>
      <div className="material-viewer-actions">
        {user?.role_name === "STUDENT" && <button className={material.is_bookmarked ? "active" : ""} onClick={toggleBookmark}><Bookmark size={17} fill={material.is_bookmarked ? "currentColor" : "none"}/>{material.is_bookmarked ? "Bookmarked" : "Bookmark"}</button>}
        <button className="primary" onClick={download}><Download size={17}/>Download</button>
      </div>
    </header>
    {material.description && <p className="material-viewer-description">{material.description}</p>}
    <section className="pdf-viewer-shell">
      {previewUrl ? <iframe title={material.title} src={previewUrl} className="pdf-viewer-frame"/> : <div className="material-viewer-state">Preview is unavailable for this material.</div>}
    </section>
  </main>;
}
