import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LogIn, LogOut, BookOpen, Bookmark, Megaphone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [quickSearch, setQuickSearch] = useState("");
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
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
          <Link to="/grades" className="nav-link">Browse</Link>
          <Link to="/search" className="nav-link">Search</Link>
        </nav>

        {/* Right Search & Auth Actions */}
        <div className="nav-actions">
          {!isAuthenticated && <form onSubmit={handleQuickSearch} className="quick-search-form">
            <Search size={16} className="quick-search-icon" />
            <input
              type="text"
              placeholder="Quick search..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="quick-search-input"
            />
          </form>}

          {isAuthenticated ? (
            <div className="user-profile-menu">
              {user?.role_name === "STUDENT" && <><Link to="/announcements" className="nav-student-link"><Megaphone size={16}/> Announcements</Link><Link to="/bookmarks" className="nav-student-link"><Bookmark size={16}/> My Bookmarks</Link></>}
              <div className="user-badge">
                <span className="user-avatar">{user?.name?.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}</span>
                <span className="user-name">{user?.name}</span>
                <span className="role-caption">{user?.role_name === "ADMIN" ? "Admin" : "Student"}</span>
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
