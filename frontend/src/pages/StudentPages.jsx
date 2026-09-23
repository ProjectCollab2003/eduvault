import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Bookmark, Megaphone, Search } from "lucide-react";
import { announcementsApi, gradesApi, materialsApi, studentApi, subjectsApi } from "../services/api";
import StudentMaterialCard from "../components/StudentMaterialCard";
import { useAuth } from "../context/AuthContext";
import "./StudentPages.css";

const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#f97316"];
const gradeNumber = (grade) => String(grade?.name || "").match(/\d+/)?.[0] || grade?.name;
const useLoad = (loader, deps = []) => {
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  useEffect(() => { let live = true; loader().then(data => live && setState({ loading: false, data, error: "" })).catch(error => live && setState({ loading: false, data: null, error: error.message })); return () => { live = false; }; }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
};
const Status = ({ state, children }) => state.loading ? <div className="loading-state">Loading…</div> : state.error ? <div className="error-state">{state.error}</div> : children;
const MaterialGrid = ({ initial = [] }) => {
  const [bookmarkOverrides, setBookmarkOverrides] = useState({});
  if (!initial.length) return <div className="empty-state">No study materials found.</div>;
  return <div className="student-grid">{initial.map(m => <StudentMaterialCard key={m.material_id} material={{...m, is_bookmarked: bookmarkOverrides[m.material_id] ?? m.is_bookmarked}} onBookmarkChange={(id, value) => setBookmarkOverrides(current => ({...current, [id]: value}))}/>)}</div>;
};

function SubjectCard({ subject, color = colors[0], onRemoved }) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(Boolean(subject.is_bookmarked));
  const toggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (bookmarked) await studentApi.removeSubjectBookmark(subject.subject_id);
    else await studentApi.addSubjectBookmark(subject.subject_id);
    setBookmarked(!bookmarked);
    if (bookmarked) onRemoved?.(subject.subject_id);
  };
  return <Link className="subject-card" to={`/subjects/${subject.subject_id}`}>
    <span className="subject-dot" style={{background: color}}/>
    <div><h3>{subject.name}</h3><p>{subject.description}</p><small>{subject.grade_name ? `${subject.grade_name} · ` : ""}{subject.material_count} materials</small></div>
    <div className="subject-card-actions">{user?.role_name === "STUDENT" && <button className={`bookmark-button ${bookmarked ? "active" : ""}`} onClick={toggle} aria-label={bookmarked ? "Remove subject bookmark" : "Bookmark subject"}><Bookmark size={17} fill={bookmarked ? "currentColor" : "none"}/></button>}<span>›</span></div>
  </Link>;
}

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const state = useLoad(async () => (await studentApi.getDashboard()).data, []);
  return <main className="student-page"><Status state={state}>{state.data && <>
    <section className="dashboard-hero"><div><p>Welcome back,</p><h1>Continue your learning journey</h1><div className="hero-actions"><button className="orange-button" onClick={() => navigate("/search")}><Search size={15}/> Search Materials</button><button className="navy-button" onClick={() => navigate("/grades")}>Browse Grades ›</button></div></div><div><strong>{state.data.stats.bookmark_count}</strong> Bookmarks · <strong>{state.data.stats.access_count}</strong> accessed</div></section>
    <div className="dashboard-layout"><div><div className="section-heading"><h2><Bookmark size={21}/> My Bookmarks</h2><Link to="/bookmarks">View all ›</Link></div><MaterialGrid initial={state.data.bookmarks}/><div className="section-heading"><h2>Recently Accessed</h2></div><MaterialGrid initial={state.data.recent}/></div>
    <aside><div className="section-heading"><h2><Megaphone size={21}/> Announcements</h2></div>{state.data.announcements.map(a => <Announcement key={a.announcement_id} item={a}/>)}<div className="section-heading"><h2>Browse Grades</h2></div><div className="grade-grid">{state.data.grades.map(g => <Link className="grade-card" key={g.grade_id} to={`/grades/${g.grade_id}`}><span className="grade-number">{gradeNumber(g)}</span><h3>{g.name}</h3></Link>)}</div></aside></div>
  </>}</Status></main>;
}

export function GradesPage() {
  const state = useLoad(async () => (await gradesApi.getAll()).data, []);
  return <main className="student-page"><div className="crumbs"><Link to="/">Home</Link> › <b>All Grades</b></div><h1>All Grades</h1><p className="page-subtitle">Select your grade to browse subjects and download study materials.</p><Status state={state}>{state.data && <div className="grade-grid" style={{marginTop:42}}>{state.data.map(g => <Link className={`grade-card ${Number(gradeNumber(g)) >= 12 ? "large" : ""}`} key={g.grade_id} to={`/grades/${g.grade_id}`}><span className="grade-number">{gradeNumber(g)}</span><h3>{g.name}</h3><p>{g.description}</p><small>{g.subject_count} subjects · {g.material_count} files</small></Link>)}</div>}</Status></main>;
}

export function GradeSubjectsPage() {
  const { gradeId } = useParams();
  const state = useLoad(async () => { const [grade, subjects] = await Promise.all([gradesApi.getById(gradeId), subjectsApi.getAll({ grade_id: gradeId })]); return { grade: grade.data, subjects: subjects.data }; }, [gradeId]);
  return <main className="student-page"><Status state={state}>{state.data && <><div className="crumbs"><Link to="/">Home</Link> › <Link to="/grades">Grades</Link> › <b>{state.data.grade.name}</b></div><div style={{display:"flex",gap:24,alignItems:"center"}}><div className="grade-card" style={{minHeight:64,padding:18}}><span className="grade-number">{gradeNumber(state.data.grade)}</span></div><div><h1>{state.data.grade.name}</h1><p className="page-subtitle">{state.data.grade.description}</p><small>{state.data.grade.subject_count} subjects · {state.data.grade.material_count} study materials</small></div></div><div className="subject-grid">{state.data.subjects.map((s,i) => <SubjectCard key={s.subject_id} subject={s} color={colors[i%colors.length]}/>)}</div></>}</Status></main>;
}

export function SubjectMaterialsPage() {
  const { subjectId } = useParams(); const [term, setTerm] = useState(""); const [category, setCategory] = useState("");
  const { user } = useAuth();
  const [subjectBookmark, setSubjectBookmark] = useState(null);
  const state = useLoad(async () => { const [subject, materials, categories] = await Promise.all([subjectsApi.getById(subjectId), materialsApi.getAll({ subject_id: subjectId, ...(term && {term}), ...(category && {category_id:category}) }), materialsApi.getCategories()]); return { subject: subject.data, materials: materials.data, categories: categories.data }; }, [subjectId, term, category]);
  const isBookmarked = subjectBookmark ?? Boolean(state.data?.subject?.is_bookmarked);
  const toggle = async () => { if (isBookmarked) await studentApi.removeSubjectBookmark(subjectId); else await studentApi.addSubjectBookmark(subjectId); setSubjectBookmark(!isBookmarked); };
  return <main className="student-page"><Status state={state}>{state.data && <><div className="crumbs"><Link to="/">Home</Link> › <Link to="/grades">Grades</Link> › <b>{state.data.subject?.name}</b></div><div className="subject-page-title"><div><h1>{state.data.subject?.name}</h1><p className="page-subtitle">{state.data.subject?.description}</p></div>{user?.role_name === "STUDENT" && <button className={`subject-bookmark-button ${isBookmarked ? "active" : ""}`} onClick={toggle}><Bookmark size={17} fill={isBookmarked ? "currentColor" : "none"}/>{isBookmarked ? "Bookmarked" : "Bookmark subject"}</button>}</div><div className="filters"><select value={term} onChange={e=>setTerm(e.target.value)}><option value="">All terms</option><option value="1">Term 1</option><option value="2">Term 2</option><option value="3">Term 3</option></select><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All material types</option>{state.data.categories.map(c=><option key={c.category_id} value={c.category_id}>{c.name}</option>)}</select></div><p className="page-subtitle" style={{marginBottom:16}}>{state.data.materials.length} materials found</p><MaterialGrid initial={state.data.materials}/></>}</Status></main>;
}

export function SearchMaterialsPage() {
  const [params, setParams] = useSearchParams(); const query = params.get("q") || ""; const grade = params.get("grade_id") || ""; const subject = params.get("subject_id") || ""; const category = params.get("category_id") || ""; const term = params.get("term") || "";
  const state = useLoad(async () => { const [materials, grades, subjects, categories] = await Promise.all([materialsApi.getAll({...(query&&{search:query}),...(grade&&{grade_id:grade}),...(subject&&{subject_id:subject}),...(category&&{category_id:category}),...(term&&{term}),limit:100}),gradesApi.getAll(),subjectsApi.getAll(grade?{grade_id:grade}:{}),materialsApi.getCategories()]); return {materials:materials.data,grades:grades.data,subjects:subjects.data,categories:categories.data}; }, [query,grade,subject,category,term]);
  const update=(key,value)=>{const next=new URLSearchParams(params);value?next.set(key,value):next.delete(key);if(key==="grade_id")next.delete("subject_id");setParams(next)};
  return <main className="student-page"><h1>Search Materials</h1><div className="filters"><input placeholder="Search by topic, subject, title..." defaultValue={query} onKeyDown={e=>{if(e.key==="Enter")update("q",e.currentTarget.value.trim())}}/><select value={grade} onChange={e=>update("grade_id",e.target.value)}><option value="">All grades</option>{state.data?.grades.map(g=><option key={g.grade_id} value={g.grade_id}>{g.name}</option>)}</select><select value={subject} onChange={e=>update("subject_id",e.target.value)}><option value="">All subjects</option>{state.data?.subjects.map(s=><option key={s.subject_id} value={s.subject_id}>{s.name}</option>)}</select><select value={category} onChange={e=>update("category_id",e.target.value)}><option value="">All types</option>{state.data?.categories.map(c=><option key={c.category_id} value={c.category_id}>{c.name}</option>)}</select><select value={term} onChange={e=>update("term",e.target.value)}><option value="">All terms</option><option value="1">Term 1</option><option value="2">Term 2</option><option value="3">Term 3</option></select></div><Status state={state}>{state.data&&<><p className="page-subtitle" style={{marginBottom:16}}>{state.data.materials.length} results</p><MaterialGrid initial={state.data.materials}/></>}</Status></main>;
}

export function BookmarksPage() {
  const state = useLoad(async () => (await studentApi.getBookmarks()).data, []);
  const [removedSubjects, setRemovedSubjects] = useState([]);
  const subjects = (state.data?.subjects || []).filter(subject => !removedSubjects.includes(subject.subject_id));
  const materials = state.data?.materials || [];
  const summary = { total: subjects.length + materials.length, grades: new Set([...subjects.map(x=>x.grade_name), ...materials.map(x=>x.grade_name)]).size };
  return <main className="student-page"><h1>My Bookmarks</h1><p className="page-subtitle">{summary.total} saved items · {summary.grades} grades</p><Status state={state}>{state.data&&<><div className="section-heading"><h2>Subjects</h2><small>{subjects.length} saved</small></div>{subjects.length ? <div className="subject-grid">{subjects.map((subject,index)=><SubjectCard key={subject.subject_id} subject={subject} color={colors[index%colors.length]} onRemoved={(id)=>setRemovedSubjects(current=>[...current,id])}/>)}</div> : <div className="empty-state">No bookmarked subjects yet.</div>}<div className="section-heading"><h2>Materials</h2><small>{materials.length} saved</small></div><MaterialGrid initial={materials}/></>}</Status></main>;
}

function Announcement({item}) { return <article className={`announcement-card ${item.is_important?"important":""}`}><h3>{item.title}</h3><p>{item.message}</p><time>{new Date(item.published_at||item.created_at).toLocaleDateString()}</time></article>; }
export function AnnouncementsPage() {
  const state=useLoad(async()=> (await announcementsApi.getAll()).data,[]);
  return <main className="student-page"><h1>Announcements</h1><p className="page-subtitle">{state.data?.length||0} announcements</p><Status state={state}>{state.data&&<><div className="section-heading"><h2>Important</h2></div>{state.data.filter(x=>x.is_important).map(x=><Announcement key={x.announcement_id} item={x}/>)}<div className="section-heading"><h2>General</h2></div>{state.data.filter(x=>!x.is_important).map(x=><Announcement key={x.announcement_id} item={x}/>)}</>}</Status></main>;
}
