import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Check, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { gradesApi } from "../services/api";
import "./AuthPages.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [grades, setGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [gradesError, setGradesError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { register } = useAuth();
  useEffect(() => {
    gradesApi
      .getAll()
      .then((res) => {
        setGrades(res.success && Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setGradesError("Grades could not be loaded."))
      .finally(() => setGradesLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        grade_id: gradeId ? Number(gradeId) : null,
      });
      setRegistered(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Left Benefits Hero */}
      <div className="auth-hero-col">
        <Link to="/" className="auth-brand-badge">
          <div className="brand-icon">
            <BookOpen size={20} strokeWidth={2.5} color="#ffffff" />
          </div>
          <span className="brand-name">EduVault</span>
        </Link>

        <div className="auth-hero-main">
          <h2 className="auth-hero-quote font-serif">Study smarter.</h2>

          <p className="auth-hero-intro">
            A free account unlocks personalized features. Browse, bookmark, and get notified — all in one place.
          </p>

          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <div className="feature-check-icon">
                <Check size={13} strokeWidth={3} />
              </div>
              <span>Bookmark study materials for quick access</span>
            </li>
            <li className="auth-feature-item">
              <div className="feature-check-icon">
                <Check size={13} strokeWidth={3} />
              </div>
              <span>Get notified when new resources are uploaded</span>
            </li>
            <li className="auth-feature-item">
              <div className="feature-check-icon">
                <Check size={13} strokeWidth={3} />
              </div>
              <span>Choose which subjects to follow</span>
            </li>
            <li className="auth-feature-item">
              <div className="feature-check-icon">
                <Check size={13} strokeWidth={3} />
              </div>
              <span>Free forever — no credit card needed</span>
            </li>
          </ul>
        </div>

        <div className="auth-hero-footer">
          Free for all school students in Sri Lanka
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="auth-form-col">
        <div className="auth-card">
          <h1 className="auth-card-title font-serif">Create account</h1>
          <p className="auth-card-subtitle">Free student registration</p>

          {error && <div className="auth-alert-error">{error}</div>}

          {registered ? (
            <div className="auth-success-message">
              <h2>Check your email</h2>
              <p>We sent a verification link to <strong>{email}</strong>.</p>
              <p>Accept the link before signing in to your student account.</p>
              <Link to="/login" className="btn-auth-submit" style={{ display: "flex", textDecoration: "none", justifyContent: "center" }}>
                Go to Sign In
              </Link>
            </div>
          ) : (
          <>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name-input">
                Full name
              </label>
              <input
                id="name-input"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>

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
              <label className="form-label" htmlFor="grade-select">
                Your grade
              </label>
              <select
                id="grade-select"
                value={gradeId}
                onChange={(e) => setGradeId(e.target.value)}
                className="form-select"
                disabled={gradesLoading || grades.length === 0}
              >
                <option value="">{gradesLoading ? "Loading grades..." : grades.length ? "Select your grade" : "No grades available"}</option>
                {grades.map((g) => (
                  <option key={g.grade_id} value={g.grade_id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {gradesError && <span className="form-field-error">{gradesError}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">
                Password
              </label>
              <div className="form-input-wrap">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
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
              <span>{loading ? "Creating account..." : "Create Account"}</span>
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
          </>)}

          <div className="auth-card-footer">
            <p>
              Already have an account?
              <Link to="/login" className="auth-switch-link">
                Sign in
              </Link>
            </p>
            <p>
              No account needed to <Link to="/" className="browse-freely-link">browse materials</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
