import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Megaphone, ArrowRight } from "lucide-react";
import GradeCard from "../components/GradeCard";
import MaterialCard from "../components/MaterialCard";
import { statsApi, gradesApi, announcementsApi, materialsApi } from "../services/api";
import "./LandingPage.css";

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalGrades: 0,
    totalSubjects: 0,
    totalDownloads: 0,
  });
  const [grades, setGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(true);

  useEffect(() => {
    // Fetch live stats from backend
    statsApi
      .get()
      .then((res) => {
        if (res.success && res.data) {
          setStats({
            totalMaterials: Number(res.data.totalMaterials || 0),
            totalGrades: Number(res.data.totalGrades || 0),
            totalSubjects: Number(res.data.totalSubjects || 0),
            totalDownloads: Number(res.data.totalDownloads || 0),
          });
        }
      })
      .catch((err) => console.error("Stats load failed:", err.message));

    // Fetch grades from backend
    gradesApi
      .getAll()
      .then((res) => {
        setGrades(res.success && Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Grades load failed:", err.message))
      .finally(() => setGradesLoading(false));

    // Fetch announcements from backend
    announcementsApi
      .getAll()
      .then((res) => {
        setAnnouncements(res.success && Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Announcements load failed:", err.message));

    // Fetch recent materials from backend
    materialsApi
      .getRecent(6)
      .then((res) => {
        setMaterials(res.success && Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Materials load failed:", err.message));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    materialsApi
      .getAll({ search: searchTerm.trim() })
      .then((res) => {
        if (res.success && res.data) {
          setMaterials(res.data);
          const resultsSection = document.getElementById("recently-added-section");
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleGradeSelect = (grade) => {
    materialsApi
      .getAll({ grade_id: grade.grade_id })
      .then((res) => {
        setMaterials(res.success && Array.isArray(res.data) ? res.data : []);
        const resultsSection = document.getElementById("recently-added-section");
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          {/* Tag Pill */}
          <div className="hero-tag-pill">
            <span className="hero-tag-dot"></span>
            <span>Free for all school students{grades.length ? ` · ${grades.length} grades available` : ""}</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title font-serif">
            Every resource your<br />school year needs.
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Notes, past papers, revision materials, and more — organized by grade<br />
            and subject. Browse and download freely. No account required.
          </p>

          {/* Search Box */}
          <form id="search-section" onSubmit={handleSearchSubmit} className="hero-search-box">
            <input
              type="text"
              placeholder="Search by subject, topic, or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-button">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="stats-section">
        <div className="container stats-container">
          <div className="stat-item">
            <span className="stat-value">{stats.totalMaterials.toLocaleString()}+</span>
            <span className="stat-label">Study Materials</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{stats.totalGrades}</span>
            <span className="stat-label">Grades Covered</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{stats.totalSubjects}+</span>
            <span className="stat-label">Subjects</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{stats.totalDownloads.toLocaleString()}+</span>
            <span className="stat-label">Total Downloads</span>
          </div>
        </div>
      </section>

      {/* 3. Announcements Banner */}
      {announcements.length > 0 && (
        <section className="announcements-section">
          <div className="container announcements-container">
            {announcements.map((item) => (
              <div key={item.announcement_id} className="announcement-banner">
                <div className="announcement-icon-wrap">
                  <Megaphone size={16} />
                </div>
                <div className="announcement-text">
                  <strong>{item.title}</strong>
                  <span className="announcement-divider">—</span>
                  <span>{item.message}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Browse by Grade Grid */}
      <section className="browse-grades-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title font-serif">Browse by Grade</h2>
              <p className="section-subtitle">Select your grade to see subjects and materials</p>
            </div>
            <a href="#grades-grid" className="section-link">
              All grades <ArrowRight size={15} />
            </a>
          </div>

          <div id="grades-grid" className="grades-grid">
            {gradesLoading ? <div className="landing-empty-state">Loading grades...</div> : grades.length ? grades.map((grade) => (
              <GradeCard
                key={grade.grade_id}
                grade={grade}
                onClick={() => handleGradeSelect(grade)}
              />
            )) : <div className="landing-empty-state">No grades have been added yet.</div>}
          </div>
        </div>
      </section>

      {/* 5. Recently Added Materials Grid */}
      <section id="recently-added-section" className="recently-added-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title font-serif">Recently Added</h2>
              <p className="section-subtitle">Latest materials uploaded to the platform</p>
            </div>
            <Link to="/search" className="section-link">
              Browse all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="materials-grid">
            {materials.length ? materials.map((material) => (
              <MaterialCard
                key={material.material_id}
                material={material}
              />
            )) : <div className="landing-empty-state">No materials are available yet.</div>}
          </div>
        </div>
      </section>

      {/* 6. Stay Updated CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h3 className="cta-title font-serif">Stay updated on new materials</h3>
              <p className="cta-desc">
                Create a free account to bookmark materials, set notification preferences,
                and get alerts when new resources are uploaded for your subjects.
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="btn-cta-primary">
                Create Free Account
              </Link>
              <a href="#grades-grid" className="btn-cta-secondary">
                Browse Materials
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
