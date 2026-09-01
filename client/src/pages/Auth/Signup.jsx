import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import "./Auth.css";
import { useAuth } from "../../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // SIGNUP
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ==========================================
    // START LOADING
    // ==========================================

    setLoading(true);

    try {
      console.log("Sending signup request...");

      // ==========================================
      // REGISTER API
      // ==========================================

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password,
          }),
        }
      );

      // ==========================================
      // READ RESPONSE SAFELY
      // ==========================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Signup status:", response.status);
      console.log("Signup response:", data);

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to create account."
        );
      }

      // ==========================================
      // GET USER + TOKEN
      // ==========================================

      const user = data.user;
      const token = data.token;

      // ==========================================
      // SUCCESS WITH TOKEN
      // ==========================================

      if (user && token) {
        console.log(
          "Signup successful. Logging user in..."
        );

        login(user, token);

        navigate("/", {
          replace: true,
        });

        return;
      }

      // ==========================================
      // SUCCESS WITHOUT TOKEN
      // ==========================================

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      // Backend successfully created account
      // but did not return a token.
      navigate("/login", {
        replace: true,
      });
    } catch (err) {
      console.error("Signup Error:", err);

      // ==========================================
      // NETWORK ERROR
      // ==========================================

      if (
        err instanceof TypeError &&
        err.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Unable to connect to the server. Make sure your backend is running on port 3000."
        );

        return;
      }

      // ==========================================
      // NORMAL ERROR
      // ==========================================

      setError(
        err.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="auth-page signup-page">
      <div className="auth-container">
        <div className="auth-content">

          {/* ======================================
              BRAND
          ======================================= */}

          <Link
            to="/"
            className="auth-brand"
          >
            <span className="auth-brand-mark">
              <span />
            </span>

            <span className="auth-brand-name">
              Honey<span>Terra</span>
            </span>
          </Link>

          {/* ======================================
              HEADING
          ======================================= */}

          <div className="auth-heading">
            <h1>Create your account</h1>

            <p>
              Save your details and track every
              order.
            </p>
          </div>

          {/* ======================================
              SIGNUP FORM
          ======================================= */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* ======================================
                FULL NAME
            ======================================= */}

            <div className="form-group">
              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Priya Sharma"
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                disabled={loading}
                required
              />
            </div>

            {/* ======================================
                EMAIL
            ======================================= */}

            <div className="form-group">
              <label htmlFor="signup-email">
                Email
              </label>

              <input
                id="signup-email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={loading}
                required
              />
            </div>

            {/* ======================================
                PASSWORD
            ======================================= */}

            <div className="form-group">
              <label htmlFor="signup-password">
                Password
              </label>

              <div className="password-input">
                <input
                  id="signup-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  disabled={loading}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* ======================================
                CONFIRM PASSWORD
            ======================================= */}

            <div className="form-group">
              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div className="password-input">
                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* ======================================
                ERROR
            ======================================= */}

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            {/* ======================================
                SUBMIT
            ======================================= */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          {/* ======================================
              LOGIN
          ======================================= */}

          <p className="auth-switch">
            Already have an account?{" "}

            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default Signup;