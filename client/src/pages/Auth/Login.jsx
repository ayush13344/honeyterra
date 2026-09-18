
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

import "./Auth.css";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "https://honeyterra.onrender.com";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // NORMAL LOGIN
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
      // CHECK TOKEN
      // ==========================================

      if (!result.token) {
        setError(
          result.message ||
            "Login failed. Token was not received."
        );
        return;
      }

      // ==========================================
      // CHECK USER
      // ==========================================

      if (!result.user) {
        setError(
          "Login failed. User information was not received."
        );
        return;
      }

      // ==========================================
      // CHECK USER ROLE
      // ==========================================

      const isAdmin = result.user.role === "admin";

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      if (isAdmin) {
        localStorage.setItem(
          "adminToken",
          result.token
        );

        localStorage.removeItem("token");
      } else {
        localStorage.setItem(
          "token",
          result.token
        );

        localStorage.removeItem("adminToken");
      }

      // ==========================================
      // SAVE USER
      // ==========================================

      if (isAdmin) {
        localStorage.setItem(
          "adminUser",
          JSON.stringify(result.user)
        );

        localStorage.removeItem("user");
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify(result.user)
        );

        localStorage.removeItem("adminUser");
      }

      // ==========================================
      // DEBUG LOGS
      // ==========================================

      if (isAdmin) {
        console.log(
          "Admin Token saved:",
          localStorage.getItem("adminToken")
        );

        console.log(
          "Admin User saved:",
          localStorage.getItem("adminUser")
        );
      } else {
        console.log(
          "User Token saved:",
          localStorage.getItem("token")
        );

        console.log(
          "User saved:",
          localStorage.getItem("user")
        );
      }

      // ==========================================
      // UPDATE AUTH CONTEXT
      // ==========================================

      login(
        result.user,
        result.token
      );

      // ==========================================
      // ADMIN REDIRECT
      // ==========================================

      if (isAdmin) {
        console.log(
          "Admin login detected"
        );

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      // ==========================================
      // NORMAL USER REDIRECT
      // ==========================================

      console.log(
        "Normal user login detected"
      );

      navigate("/", {
        replace: true,
      });
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

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    setError("");
    setGoogleLoading(true);

    try {
      console.log(
        "Google credential received"
      );

      if (!credentialResponse?.credential) {
        setError(
          "Google authentication failed. Please try again."
        );

        return;
      }

      // ==========================================
      // SEND GOOGLE CREDENTIAL TO BACKEND
      // ==========================================

      const response = await fetch(
        `${API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential:
              credentialResponse.credential,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Google login response:",
        data
      );

      // ==========================================
      // CHECK BACKEND RESPONSE
      // ==========================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Google login failed."
        );
      }

      if (!data?.token) {
        throw new Error(
          "Google login failed. Token was not received."
        );
      }

      if (!data?.user) {
        throw new Error(
          "Google login failed. User information was not received."
        );
      }

      // ==========================================
      // CHECK USER ROLE
      // ==========================================

      const isAdmin =
        data.user.role === "admin";

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      if (isAdmin) {
        localStorage.setItem(
          "adminToken",
          data.token
        );

        localStorage.removeItem("token");
      } else {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.removeItem("adminToken");
      }

      // ==========================================
      // SAVE USER
      // ==========================================

      if (isAdmin) {
        localStorage.setItem(
          "adminUser",
          JSON.stringify(data.user)
        );

        localStorage.removeItem("user");
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.removeItem("adminUser");
      }

      // ==========================================
      // UPDATE AUTH CONTEXT
      // ==========================================

      login(
        data.user,
        data.token
      );

      // ==========================================
      // ADMIN REDIRECT
      // ==========================================

      if (isAdmin) {
        console.log(
          "Google admin login detected"
        );

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      // ==========================================
      // NORMAL USER REDIRECT
      // ==========================================

      console.log(
        "Google user login detected"
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Google Login Error:",
        error
      );

      setError(
        error?.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==========================================
  // GOOGLE LOGIN ERROR
  // ==========================================

  const handleGoogleError = () => {
    console.error(
      "Google Login failed"
    );

    setGoogleLoading(false);

    setError(
      "Google login was unsuccessful. Please try again."
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="auth-page">
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
            <h1>
              Welcome back
            </h1>

            <p>
              Sign in to track orders and
              check out faster.
            </p>
          </div>

          {/* ======================================
              LOGIN FORM
          ======================================= */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {/* ======================================
                EMAIL
            ======================================= */}

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@email.com"
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
              <label htmlFor="password">
                Password
              </label>

              <div className="password-input">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
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
              disabled={
                loading ||
                googleLoading
              }
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          {/* ======================================
              GOOGLE LOGIN DIVIDER
          ======================================= */}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* ======================================
              GOOGLE LOGIN
          ======================================= */}

          <div className="google-login-wrapper">
            {googleLoading ? (
              <div className="google-loading">
                Signing in with Google...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={
                  handleGoogleSuccess
                }
                onError={
                  handleGoogleError
                }
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
              />
            )}
          </div>

          {/* ======================================
              SIGNUP
          ======================================= */}

          <p className="auth-switch">
            New to HoneyTerra?{" "}

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

