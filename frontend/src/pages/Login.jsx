import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  
 const handleSignIn = async (e) => {
  e.preventDefault();
  console.log("Login")
};

  return (
    <div className="login-page">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span>›</span>
        <span>Login</span>
      </div>

      {/* Title */}
      <h1 className="page-title">Customer Login</h1>

      {/* Cards */}
      <div className="cards-row">

        {/* Login */}
        <div className="card">
          <h2 className="card-title">Registered Customers</h2>
          <p className="card-subtitle">
            If you have an account, sign in with your email address.
          </p>

          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                className="form-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="signin-row">
              <button className="btn-primary" type="submit">
                Sign In
              </button>
              <a href="/forgot-password" className="forgot-link">
                Forgot Your Password?
              </a>
            </div>
          </form>
        </div>

        {/* Register */}
        <div className="card">
          <h2 className="card-title">New Customer?</h2>
          <p className="card-subtitle">
            Creating an account has many benefits:
          </p>

          <ul className="benefits-list">
            <li>Check out faster</li>
            <li>Keep more than one address</li>
            <li>Track orders and more</li>
          </ul>

        <Link to="/register" className="btn-outline-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Create An Account
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

export default CustomerLogin;