import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    /*
      TEMPORARY LOGIN

      Later this will become:

      POST /api/admin/login

      and the backend will authenticate
      the admin using MongoDB + JWT.
    */

    navigate("/admin");
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        {/* Logo */}
        <div className="admin-login-brand">
          <div className="admin-login-logo">
            H
          </div>

          <div>
            <h1>HoneyTerra</h1>
            <span>Admin Panel</span>
          </div>
        </div>

        {/* Heading */}
        <div className="admin-login-heading">
          <div className="admin-login-icon">
            <ShieldCheck size={25} />
          </div>

          <h2>Welcome back</h2>

          <p>
            Sign in to manage your HoneyTerra store.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* Email */}
          <div className="admin-input-group">

            <label htmlFor="email">
              Email address
            </label>

            <div className="admin-input-wrapper">

              <Mail size={18} />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@honeyterra.com"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* Password */}
          <div className="admin-input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="admin-input-wrapper">

              <Lock size={18} />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* Options */}
          <div className="admin-login-options">

            <label className="admin-remember">

              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />

              <span>Remember me</span>

            </label>

            <button
              type="button"
              className="admin-forgot"
            >
              Forgot password?
            </button>

          </div>

          {/* Login */}
          <button
            type="submit"
            className="admin-login-button"
          >
            Sign in
          </button>

        </form>

        <p className="admin-login-footer">
          HoneyTerra Admin Dashboard
        </p>

      </div>
    </main>
  );
}

export default AdminLogin;