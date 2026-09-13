import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Left Brand / Benefits Hero */}
      <div className="auth-hero-col">
        <Link to="/" className="auth-brand-badge">
          <div className="brand-icon">
            <BookOpen size={20} strokeWidth={2.5} color="#ffffff" />
          </div>
          <span className="brand-name">EduVault</span>
        </Link>

        <div className="auth-hero-main">
          <h2 className="auth-hero-quote font-serif">
            &ldquo;All the study materials you need, in one place.&rdquo;
          </h2>

          <p className="auth-hero-intro">Create a free account to</p>

          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <span className="feature-check-icon">•</span>
              <span>Bookmark your favourite materials</span>
            </li>
            <li className="auth-feature-item">
              <span className="feature-check-icon">•</span>
              <span>Get notified when new resources are added</span>
            </li>
            <li className="auth-feature-item">
              <span className="feature-check-icon">•</span>
              <span>Manage subject notification preferences</span>
            </li>
          </ul>
        </div>

        <div className="auth-hero-footer">
          Grades 6–13 · Sri Lanka · Free for everyone
        </div>
      </div>

      {/* Right Login Form */}
      <div className="auth-form-col">
        <div className="auth-card">
          <h1 className="auth-card-title font-serif">Welcome back</h1>
          <p className="auth-card-subtitle">Sign in to your account</p>

          {error && <div className="auth-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                Email address
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="password-input">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact your administrator to reset your password."); }} className="forgot-password-link">
                  Forgot password?
                </a>
              </div>
              <div className="form-input-wrap">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-password-toggle"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-auth-submit">
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="auth-card-footer">
            <p>
              Don&apos;t have an account?
              <Link to="/register" className="auth-switch-link">
                Register free
              </Link>
            </p>
            <p>
              You can <Link to="/" className="browse-freely-link">browse all materials</Link> without signing in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
