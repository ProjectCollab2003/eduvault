import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  const grades = [6, 7, 8, 9, 10, 11, 12, 13];

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
                <li key={grade}>
                  <Link to={`/?grade=${grade}`}>Grade {grade}</Link>
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
          <p>© 2025 EduVault. All rights reserved. Free for all school students.</p>
          <p className="footer-region">Grades 6–13 · Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
