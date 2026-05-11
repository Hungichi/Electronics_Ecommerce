import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Register.css";

const Register = () => {
  // Controlled inputs for every form field.
  const [username, setUsername]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  // Per-field error messages produced by client-side validate().
  const [errors, setErrors]             = useState({});
  // Toggles between "password" and "text" input types so the user can peek at their password.
  const [showPw, setShowPw]             = useState(false);
  const [showCf, setShowCf]             = useState(false);
  // Error coming back from the server (e.g. "username already exists").
  const [submitError, setSubmitError]   = useState("");
  const [loading, setLoading]           = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  /* ── Client-side validation ── */
  // Runs before we even hit the API to give instant feedback.
  const validate = () => {
    const e = {};
    if (username.trim().length < 3)
      e.username = "Tên tài khoản phải có ít nhất 3 ký tự.";
    // Simple email regex: anything @ anything . anything (no spaces).
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Vui lòng nhập địa chỉ e-mail hợp lệ.";
    if (password.length < 6)
      e.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    if (confirmPassword !== password || confirmPassword === "")
      e.confirmPassword = "Mật khẩu nhập lại không khớp.";
    return e;
  };

  /* ── Submit handler ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitError("");
    // Run validation; if any error exists, stop here and let the UI show them.
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      // Calls POST /auth/register; AuthContext auto-logs the new user in.
      const user = await register({ username, email, password });
      toast.success(`Tạo tài khoản thành công. Chào mừng ${user?.username || ''}!`);
      // After signing up, send the user to the homepage as a logged-in customer.
      navigate("/");
    } catch (err) {
      // Backend rejected the request (duplicate username, server error, ...).
      const msg = err.message || "Đăng ký thất bại";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span>›</span>
        <span>Register</span>
      </div>

      {/* Title */}
      <h1 className="page-title">Create Account</h1>

      {/* Cards */}
      <div className="cards-row">

        {/* Register form */}
        <div className="card">
          <h2 className="card-title">Account Information</h2>
          <p className="card-subtitle">
            Fill in the details below to create your new account.
          </p>

          <form onSubmit={handleRegister} noValidate>

            {/* Username */}
            <div className="form-group">
              <label className="form-label">
                Username <span className="required">*</span>
              </label>
              <input
                className={`form-input${errors.username ? " input-error" : ""}`}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="error-msg">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                className={`form-input${errors.email ? " input-error" : ""}`}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="error-msg">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <input
                  className={`form-input${errors.password ? " input-error" : ""}`}
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="Toggle password"
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-msg">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <input
                  className={`form-input${errors.confirmPassword ? " input-error" : ""}`}
                  type={showCf ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowCf((v) => !v)}
                  aria-label="Toggle confirm password"
                >
                  {showCf ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-msg">{errors.confirmPassword}</p>
              )}
            </div>

            {submitError && (
              <p className="error-msg" style={{ color: '#d22', marginTop: 8 }}>{submitError}</p>
            )}

            <div className="signin-row">
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create An Account"}
              </button>
            </div>
          </form>
        </div>

        {/* Benefits */}
        <div className="card">
          <h2 className="card-title">Already a Customer?</h2>
          <p className="card-subtitle">
            Creating an account has many benefits:
          </p>

          <ul className="benefits-list">
            <li>Check out faster</li>
            <li>Keep more than one address</li>
            <li>Track orders and more</li>
            <li>Exclusive member discounts</li>
            <li>Manage your order history</li>
          </ul>

          <Link
            to="/login"
            className="btn-outline-primary"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            Sign In
          </Link>
        </div>

      </div>

      {/* Features */}
      <div className="features-strip">

        <div className="feature-item">
          <div className="feature-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M12 1C7.03 1 3 5.03 3 10v1H1v4a2 2 0 0 0 2 2h1v-6a8 8 0 0 1 16 0v6h1a2 2 0 0 0 2-2v-4h-2v-1c0-4.97-4.03-9-9-9zm-3 9a1 1 0 1 0 0 2v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-2zm6 0a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1z"/>
            </svg>
          </div>
          <div className="feature-title">Product Support</div>
          <div className="feature-desc">
            Up to 3 years on site warranty available for your peace of mind.
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div className="feature-title">Personal Account</div>
          <div className="feature-desc">
            With big discounts, free delivery and a dedicated support specialist.
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42zM6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5 8 5.67 8 6.5 7.33 8 6.5 8z"/>
            </svg>
          </div>
          <div className="feature-title">Amazing Savings</div>
          <div className="feature-desc">
            Up to 70% off new Products, you can be sure of the best price.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;