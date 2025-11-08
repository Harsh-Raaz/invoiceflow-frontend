import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3500/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        })
      });
      
      const data = await res.json();
      console.log("🔍 Login Response:", data);

      if (res.ok) {
        // ✅ CRITICAL: Store the token in localStorage - FIXED PATH
        if (data.data?.accessToken) {
          localStorage.setItem('authToken', data.data.accessToken);
          console.log('✅ Login accessToken stored in localStorage:', data.data.accessToken);
        } else if (data.data?.token) {
          localStorage.setItem('authToken', data.data.token);
          console.log('✅ Login token stored in localStorage:', data.data.token);
        } else if (data.accessToken) {
          localStorage.setItem('authToken', data.accessToken);
          console.log('✅ Login accessToken stored in localStorage:', data.accessToken);
        } else {
          console.log('❌ No token found in login response data:', data);
          alert('Login successful but no token received. Please contact support.');
          return;
        }
        
        // ✅ Also store user data if available
        if (data.data?.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        
        alert("Login successful!");
        window.location.href = "/home";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="login-logo">
              <i className="fas fa-file-invoice-dollar"></i>
              <span>InvoiceFlow</span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address <i className="fas fa-envelope"></i></label>
              <div className="input-with-icon">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Password <i className="fas fa-lock"></i></label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>
              <div className="input-with-icon">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-login">Sign In</button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/signup" className="login-link">Sign up</Link></p>
          </div>
        </div>

        <div className="login-graphics">
          <div className="graphics-content">
            <h2>Streamline Your Invoicing Process</h2>
            <p>Access your account to create professional invoices, track payments, and manage your business finances.</p>
            <div className="graphics-features">
              <div className="graphics-feature">
                <i className="fas fa-bolt"></i>
                <span>Instant Invoice Generation</span>
              </div>
              <div className="graphics-feature">
                <i className="fas fa-paper-plane"></i>
                <span>WhatsApp Delivery</span>
              </div>
              <div className="graphics-feature">
                <i className="fas fa-chart-line"></i>
                <span>Payment Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;