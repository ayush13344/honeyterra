import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./Auth.css";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginUser({
        email: email.trim(),
        password,
      });

      console.log("Login response:", result);

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
      // CHECK TOKEN + USER
      // ==========================================

      if (!result.token) {
        setError(
          result.message ||
            "Login failed. Token was not received."
        );
        return;
      }

      if (!result.user) {
        setError(
          "Login failed. User information was not received."
        );
        return;
      }

      // ==========================================
      // SAVE LOGIN DATA
      // AuthContext handles:
      // localStorage + React state
      // ==========================================

      login(result.user, result.token);

      // ==========================================
      // REDIRECT BASED ON ROLE
      // ==========================================

      if (result.user.role === "admin") {
        console.log("Admin login detected");

        navigate("/admin", {
          replace: true,
        });
      } else {
        console.log("Normal user login detected");

        navigate("/", {
          replace: true,
        });
      }

    } catch (error) {
      console.error(
        "Login Error:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-content">

          {/* ======================================
              EYEBROW
          ======================================= */}

          <span className="auth-eyebrow">
            WELCOME BACK
          </span>

          <h1>
            Good to see you again.
          </h1>

          <p className="auth-description">
            Sign in to your HoneyTerra account and
            continue your journey.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* ======================================
                EMAIL
            ======================================= */}

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
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

              <div className="form-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-password"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="password-input">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
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
                ? "Signing In..."
                : "Sign In"}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>

          {/* ======================================
              DIVIDER
          ======================================= */}

          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* ======================================
              SIGNUP
          ======================================= */}

          <p className="auth-switch">
            Don't have an account?{" "}

            <Link to="/signup">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default Login;