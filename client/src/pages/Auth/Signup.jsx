import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

import { useState } from "react";

import "./Auth.css";

import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // SIGNUP
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // ==========================================
    // PASSWORD LENGTH
    // ==========================================

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      console.log(
        "Signup response:",
        result
      );

      // ==========================================
      // CHECK RESPONSE
      // ==========================================

      if (!result) {
        setError(
          "Something went wrong. Please try again."
        );
        return;
      }

      // ==========================================
      // IF BACKEND RETURNS TOKEN + USER
      // ==========================================

      if (
        result.token &&
        result.user
      ) {
        // This will update:
        // localStorage
        // AuthContext
        // Navbar

        login(
          result.user,
          result.token
        );

        // Go directly to homepage

        navigate("/");
        return;
      }

      // ==========================================
      // IF BACKEND RETURNS ONLY USER
      // ==========================================

      if (result.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(result.user)
        );
      }

      // ==========================================
      // IF BACKEND DOES NOT RETURN TOKEN
      // ==========================================

      navigate("/login");

    } catch (error) {
      console.error(
        "Signup Error:",
        error.response?.data ||
          error.message
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to create account";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        <div className="auth-content">

          <span className="auth-eyebrow">
            JOIN HONEYTERRA
          </span>

          <h1>
            Create your account.
          </h1>

          <p className="auth-description">
            Create an account to make your
            HoneyTerra shopping experience easier.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* ======================================
                NAME
            ======================================= */}

            <div className="form-group">

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>

            {/* ======================================
                EMAIL
            ======================================= */}

            <div className="form-group">

              <label htmlFor="signup-email">
                Email address
              </label>

              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
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
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* ======================================
                ERROR
            ======================================= */}

            {error && (
              <p
                style={{
                  color: "#c0392b",
                  marginTop: "8px",
                  fontSize: "14px",
                }}
              >
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
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <ArrowRight size={18} />
              )}

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