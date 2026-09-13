import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LogIn, UserPlus, LogOut, User, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [quickSearch, setQuickSearch] = useState("");
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <BookOpen size={20} strokeWidth={2.5} color="#ffffff" />
          </div>
          <span className="brand-name">EduVault</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">Browse</Link>
          <a href="#search-section" className="nav-link">Search</a>
        </nav>

        {/* Right Search & Auth Actions */}
        <div className="nav-actions">
          <form onSubmit={handleQuickSearch} className="quick-search-form">
            <Search size={16} className="quick-search-icon" />
            <input
              type="text"
              placeholder="Quick search..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="quick-search-input"
            />
          </form>

          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-badge">
                <User size={15} />
                <span className="user-name">{user?.name}</span>
                {user?.role_name === "ADMIN" && <span className="admin-tag">ADMIN</span>}
              </div>
              <button onClick={logout} className="btn-signout" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-signin">
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
