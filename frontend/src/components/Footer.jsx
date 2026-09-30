import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail } from "lucide-react";
import { gradesApi } from "../services/api";
import "./Footer.css";

export default function Footer() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    gradesApi.getAll()
      .then((response) => setGrades(response.success && Array.isArray(response.data) ? response.data : []))
      .catch(() => setGrades([]));
  }, []);

  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col footer-brand">
            <Link to="/" className="brand-logo footer-logo">
              <div className="brand-icon">
                <BookOpen size={18} strokeWidth={2.5} color="#ffffff" />
              </div>
              <span className="brand-name">EduVault</span>
            </Link>
            <p className="footer-desc">
              A free, centralized resource platform for school students. Browse and download notes, past papers, and revision materials — no account needed.
            </p>
          </div>

          {/* Browse Column */}
          <div className="footer-col">
            <h4 className="footer-heading">BROWSE</h4>
            <ul className="footer-links">
              {grades.map((grade) => (
                <li key={grade.grade_id}>
                  <Link to={`/grades/${grade.grade_id}`}>{grade.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div className="footer-col">
            <h4 className="footer-heading">PLATFORM</h4>
            <ul className="footer-links">
              <li>
                <a href="#search-section">Search Materials</a>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Create Account</Link>
              </li>
              <li className="footer-contact">
                <Mail size={14} />
                <a href="mailto:support@eduvault.lk">support@eduvault.lk</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EduVault. All rights reserved. Free for all school students.</p>
          <p className="footer-region">{grades.length ? `${grades.length} grades available · ` : ""}Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
