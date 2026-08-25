import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
      setError(
        "Passwords do not match"
      );

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
      // BACKEND RETURNS TOKEN + USER
      // ==========================================

      if (
        result.token &&
        result.user
      ) {

        login(
          result.user,
          result.token
        );

        navigate("/", {
          replace: true,
        });

        return;
      }


      // ==========================================
      // BACKEND RETURNS ONLY USER
      // ==========================================

      if (result.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(result.user)
        );

      }


      // ==========================================
      // NO TOKEN
      // ==========================================

      navigate("/login", {
        replace: true,
      });


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
              Save your details and track
              every order.
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