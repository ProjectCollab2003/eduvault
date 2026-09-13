import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Megaphone, ArrowRight, BookOpen, Layers, Users, Download } from "lucide-react";
import GradeCard from "../components/GradeCard";
import MaterialCard from "../components/MaterialCard";
import { statsApi, gradesApi, announcementsApi, materialsApi } from "../services/api";
import "./LandingPage.css";

// Default grade data matching the UI mockup (used if database has not yet been populated by admin)
const DEFAULT_GRADES = [
  { grade_id: 6, name: "Grade 6", subject_count: 9, material_count: 44 },
  { grade_id: 7, name: "Grade 7", subject_count: 9, material_count: 72 },
  { grade_id: 8, name: "Grade 8", subject_count: 9, material_count: 88 },
  { grade_id: 9, name: "Grade 9", subject_count: 9, material_count: 104 },
  { grade_id: 10, name: "Grade 10", subject_count: 9, material_count: 136 },
  { grade_id: 11, name: "Grade 11", subject_count: 9, material_count: 152 },
  { grade_id: 12, name: "Grade 12", subject_count: 6, material_count: 98 },
  { grade_id: 13, name: "Grade 13", subject_count: 6, material_count: 116 },
];

// Default sample materials matching the UI mockup (used if database has not yet been populated by admin)
const DEFAULT_RECENT_MATERIALS = [
  {
    material_id: 1,
    title: "Final Countdown — Last 30 Days Revision",
    description: "Convenient revision plan covering every O/L Mathematics topic in structured 30-day plan.",
    category_name: "Revision Papers",
    grade_name: "Grade 11",
    subject_name: "Mathematics",
    term: 3,
    download_count: 2450,
  },
  {
    material_id: 2,
    title: "Final Revision — Complete Syllabus Summary",
    description: "Full O/L Mathematics syllabus condensed into essential points, formulas, and key concepts.",
    category_name: "Revision Papers",
    grade_name: "Grade 10",
    subject_name: "Mathematics",
    term: 3,
    download_count: 3101,
  },
  {
    material_id: 3,
    title: "Statistics and Probability — Revision Notes",
    description: "Comprehensive summary on statistics topics: mean, median, mode, probability trees, and data representation.",
    category_name: "Revision Papers",
    grade_name: "Grade 10",
    subject_name: "Mathematics",
    term: 2,
    download_count: 1849,
  },
  {
    material_id: 4,
    title: "Statistics — Probability Distributions",
    description: "Normal distribution, binomial, Poisson, and hypothesis testing with worked examples.",
    category_name: "Notes",
    grade_name: "Grade 13",
    subject_name: "Combined Maths",
    term: 2,
    download_count: 987,
  },
  {
    material_id: 5,
    title: "Genetics — Mendelian and Molecular",
    description: "From monohybrid crosses to DNA structure, transcription, translation, and gene expression.",
    category_name: "Notes",
    grade_name: "Grade 12",
    subject_name: "Biology",
    term: 2,
    download_count: 1322,
  },
  {
    material_id: 6,
    title: "Organic Chemistry — Functional Groups",
    description: "Comprehensive A/L organic chemistry: alkenes, alkanes, alkynes, alcohols, and carbonyl compounds.",
    category_name: "Notes",
    grade_name: "Grade 12",
    subject_name: "Chemistry",
    term: 1,
    download_count: 765,
  },
];

// Default announcements matching the UI mockup
const DEFAULT_ANNOUNCEMENTS = [
  {
    announcement_id: 1,
    title: "Revision Notes — Grade 9 Science Updated",
    message: "Grade 9 Science revision notes have been updated to align with the 2025 revised syllabus. Please review the updated term 1 & 2 modules.",
  },
  {
    announcement_id: 2,
    title: "EduVault Mobile App Coming Soon",
    message: "We are working on a mobile application for Android. Register your account to receive notifications when the app is published.",
  },
];

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalMaterials: 900,
    totalGrades: 8,
    totalSubjects: 65,
    totalDownloads: 50000,
  });
  const [grades, setGrades] = useState(DEFAULT_GRADES);
  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);
  const [materials, setMaterials] = useState(DEFAULT_RECENT_MATERIALS);
  const [activeFilterGrade, setActiveFilterGrade] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch live stats from backend
    statsApi
      .get()
      .then((res) => {
        if (res.success && res.data) {
          // If backend has non-zero items, use them; otherwise keep the mockup baseline
          setStats((prev) => ({
            totalMaterials: res.data.totalMaterials || prev.totalMaterials,
            totalGrades: res.data.totalGrades || prev.totalGrades,
            totalSubjects: res.data.totalSubjects || prev.totalSubjects,
            totalDownloads: res.data.totalDownloads || prev.totalDownloads,
          }));
        }
      })
      .catch((err) => console.log("Stats fallback:", err.message));

    // Fetch grades from backend
    gradesApi
      .getAll()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setGrades(res.data);
        }
      })
      .catch((err) => console.log("Grades fallback:", err.message));

    // Fetch announcements from backend
    announcementsApi
      .getAll()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setAnnouncements(res.data);
        }
      })
      .catch((err) => console.log("Announcements fallback:", err.message));

    // Fetch recent materials from backend
    materialsApi
      .getRecent(6)
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setMaterials(res.data);
        }
      })
      .catch((err) => console.log("Materials fallback:", err.message));
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
    setActiveFilterGrade(grade.grade_id);
    materialsApi
      .getAll({ grade_id: grade.grade_id })
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setMaterials(res.data);
        }
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
            <span>Free for all school students · Grades 6–13</span>
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
            {grades.map((grade) => (
              <GradeCard
                key={grade.grade_id}
                grade={grade}
                onClick={() => handleGradeSelect(grade)}
              />
            ))}
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
            <Link to="/register" className="section-link">
              Browse all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="materials-grid">
            {materials.map((material) => (
              <MaterialCard
                key={material.material_id}
                material={material}
              />
            ))}
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
