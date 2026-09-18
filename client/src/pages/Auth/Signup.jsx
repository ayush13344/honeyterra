
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";

import { useState } from "react";

import "./Auth.css";

import { useAuth } from "../../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "https://honeyterra.onrender.com";

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
  const [googleLoading, setGoogleLoading] = useState(false);

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

      console.log(
        "Signup status:",
        response.status
      );

      console.log(
        "Signup response:",
        data
      );

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

        const isAdmin =
          user.role === "admin";

        // Save correct token
        if (isAdmin) {
          localStorage.setItem(
            "adminToken",
            token
          );

          localStorage.removeItem("token");
        } else {
          localStorage.setItem(
            "token",
            token
          );

          localStorage.removeItem(
            "adminToken"
          );
        }

        // Save correct user
        if (isAdmin) {
          localStorage.setItem(
            "adminUser",
            JSON.stringify(user)
          );

          localStorage.removeItem("user");
        } else {
          localStorage.setItem(
            "user",
            JSON.stringify(user)
          );

          localStorage.removeItem(
            "adminUser"
          );
        }

        // Update AuthContext
        login(user, token);

        // Admin redirect
        if (isAdmin) {
          navigate("/admin", {
            replace: true,
          });

          return;
        }

        // Normal user redirect
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

      navigate("/login", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Signup Error:",
        err
      );

      // ==========================================
      // NETWORK ERROR
      // ==========================================

      if (
        err instanceof TypeError &&
        err.message
          .toLowerCase()
          .includes("fetch")
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
  // GOOGLE SIGNUP
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

      // ==========================================
      // CHECK GOOGLE CREDENTIAL
      // ==========================================

      if (!credentialResponse?.credential) {
        throw new Error(
          "Google authentication failed. Please try again."
        );
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

      // ==========================================
      // READ RESPONSE
      // ==========================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        "Google signup status:",
        response.status
      );

      console.log(
        "Google signup response:",
        data
      );

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Google signup failed."
        );
      }

      // ==========================================
      // CHECK TOKEN
      // ==========================================

      if (!data.token) {
        throw new Error(
          "Google signup failed. Token was not received."
        );
      }

      // ==========================================
      // CHECK USER
      // ==========================================

      if (!data.user) {
        throw new Error(
          "Google signup failed. User information was not received."
        );
      }

      const user = data.user;
      const token = data.token;

      // ==========================================
      // CHECK USER ROLE
      // ==========================================

      const isAdmin =
        user.role === "admin";

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      if (isAdmin) {
        localStorage.setItem(
          "adminToken",
          token
        );

        localStorage.removeItem("token");
      } else {
        localStorage.setItem(
          "token",
          token
        );

        localStorage.removeItem(
          "adminToken"
        );
      }

      // ==========================================
      // SAVE USER
      // ==========================================

      if (isAdmin) {
        localStorage.setItem(
          "adminUser",
          JSON.stringify(user)
        );

        localStorage.removeItem("user");
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        localStorage.removeItem(
          "adminUser"
        );
      }

      // ==========================================
      // UPDATE AUTH CONTEXT
      // ==========================================

      login(user, token);

      // ==========================================
      // ADMIN REDIRECT
      // ==========================================

      if (isAdmin) {
        console.log(
          "Google admin signup/login detected"
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
        "Google user signup/login detected"
      );

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Google Signup Error:",
        err
      );

      setError(
        err?.message ||
          "Google signup failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==========================================
  // GOOGLE ERROR
  // ==========================================

  const handleGoogleError = () => {
    console.error(
      "Google Signup failed"
    );

    setGoogleLoading(false);

    setError(
      "Google signup was unsuccessful. Please try again."
    );
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
            <h1>
              Create your account
            </h1>

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
                  setName(
                    event.target.value
                  )
                }
                disabled={
                  loading ||
                  googleLoading
                }
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
                  setEmail(
                    event.target.value
                  )
                }
                disabled={
                  loading ||
                  googleLoading
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
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  disabled={
                    loading ||
                    googleLoading
                  }
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={
                    loading ||
                    googleLoading
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
                  disabled={
                    loading ||
                    googleLoading
                  }
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={
                    loading ||
                    googleLoading
                  }
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
              disabled={
                loading ||
                googleLoading
              }
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          {/* ======================================
              GOOGLE DIVIDER
          ======================================= */}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* ======================================
              GOOGLE SIGNUP
          ======================================= */}

          <div className="google-login-wrapper">
            {googleLoading ? (
              <div className="google-loading">
                Signing up with Google...
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

