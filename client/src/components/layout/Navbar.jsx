import {
  UserRound,
  ShoppingBag,
  ChevronDown,
  Package,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState, useEffect, useRef } from "react";

import { useCart } from "../../context/CartContext";

import "./Navbar.css";

function Navbar({ isAuthPage = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    openCart,
    cartItems = [],
  } = useCart();

  // ==========================================
  // USER
  // ==========================================

  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);

  // ==========================================
  // MOBILE MENU
  // ==========================================

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, [location.pathname]);

  // ==========================================
  // CLOSE USER DROPDOWN OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // CLOSE MOBILE MENU ON ROUTE CHANGE
  // ==========================================

  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // ==========================================
  // CHECKOUT PAGE
  // ==========================================

  const isCheckoutPage =
    location.pathname === "/checkout";

  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ==========================================
  // NAV LINKS
  // ==========================================

  const navLinks = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Shop",
      path: "/shop",
    },
    {
      label: "Honey Comb Wrap",
      path: "/shop/wrap",
    },
    {
      label: "Gel Ash Tray",
      path: "/shop/ash-tray",
    },
    {
      label: "About Us",
      path: "/about",
    },
    {
      label: "Contact",
      path: "/contact",
    },
  ];

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setShowUserMenu(false);
    setShowMobileMenu(false);
    setUser(null);

    navigate("/");
  };

  // ==========================================
  // USER DISPLAY NAME
  // ==========================================

  const getFirstName = () => {
    if (!user?.name) {
      return "Account";
    }

    return user.name.split(" ")[0];
  };

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const handleMobileNavigation = (path) => {
    setShowMobileMenu(false);
    navigate(path);
  };

  // ==========================================
  // AUTH NAVBAR
  // ==========================================

  if (isAuthPage) {
    return (
      <header className="site-navbar site-navbar-auth">
        <div className="navbar-container">

          {/* LOGO */}

          <Link
            to="/"
            className="navbar-logo"
            aria-label="HoneyTerra Home"
          >
            <span className="navbar-logo-mark">
              <span className="logo-leaf logo-leaf-one" />
              <span className="logo-leaf logo-leaf-two" />
            </span>

            <span className="navbar-logo-text">
              Honey<span>Terra</span>
            </span>
          </Link>

          {/* BACK TO HOME */}

          <Link
            to="/"
            className="navbar-auth-back"
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.8}
            />

            <span>
              Back to Home
            </span>
          </Link>

        </div>
      </header>
    );
  }

  // ==========================================
  // NORMAL NAVBAR
  // ==========================================

  return (
    <header
      className={`site-navbar ${
        isCheckoutPage
          ? "site-navbar-dark"
          : ""
      }`}
    >
      <div className="navbar-container">

        {/* ==========================================
            LOGO
        ========================================== */}

        <Link
          to="/"
          className="navbar-logo"
          aria-label="HoneyTerra Home"
        >
          <span className="navbar-logo-mark">
            <span className="logo-leaf logo-leaf-one" />
            <span className="logo-leaf logo-leaf-two" />
          </span>

          <span className="navbar-logo-text">
            Honey<span>Terra</span>
          </span>
        </Link>

        {/* ==========================================
            DESKTOP NAVIGATION
        ========================================== */}

        <nav className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar-link ${
                  isActive
                    ? "navbar-link-active"
                    : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ==========================================
            ACTIONS
        ========================================== */}

        <div className="navbar-actions">

          {/* ==========================================
              ACCOUNT
          ========================================== */}

          {!user ? (
            <Link
              to="/login"
              className="navbar-icon-btn"
              aria-label="Login"
            >
              <UserRound
                size={22}
                strokeWidth={1.8}
              />
            </Link>
          ) : (
            <div
              className="navbar-user-wrapper"
              ref={userMenuRef}
            >
              <button
                type="button"
                className="navbar-user-btn"
                onClick={() =>
                  setShowUserMenu(
                    (previous) => !previous
                  )
                }
                aria-label="User account menu"
                aria-expanded={showUserMenu}
              >
                <span className="navbar-user-avatar">
                  {user.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </span>

                <span className="navbar-user-name">
                  {getFirstName()}
                </span>

                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={
                    showUserMenu
                      ? "navbar-chevron-open"
                      : ""
                  }
                />
              </button>

              {/* USER DROPDOWN */}

              {showUserMenu && (
                <div className="navbar-user-dropdown">

                  <div className="navbar-dropdown-user">

                    <div className="navbar-dropdown-avatar">
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="navbar-dropdown-user-info">

                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email}
                      </span>

                    </div>

                  </div>

                  <div className="navbar-dropdown-divider" />

                  {/* MY ORDERS */}

                  <button
                    type="button"
                    className="navbar-dropdown-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/my-orders");
                    }}
                  >
                    <Package size={18} />

                    <span>
                      My Orders
                    </span>
                  </button>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="navbar-dropdown-item navbar-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />

                    <span>
                      Logout
                    </span>
                  </button>

                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CART
          ========================================== */}

          <button
            type="button"
            className="navbar-cart-btn"
            onClick={openCart}
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingBag
              size={22}
              strokeWidth={1.8}
            />

            {cartCount > 0 && (
              <span className="navbar-cart-count">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}
          </button>

          {/* ==========================================
              MOBILE MENU BUTTON
          ========================================== */}

          <button
            type="button"
            className="navbar-mobile-menu-btn"
            onClick={() =>
              setShowMobileMenu(
                (previous) => !previous
              )
            }
            aria-label={
              showMobileMenu
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? (
              <X
                size={23}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={23}
                strokeWidth={1.8}
              />
            )}
          </button>

        </div>
      </div>

      {/* ==================================================
          MOBILE NAVIGATION
      ================================================== */}

      <div
        className={`mobile-navigation ${
          showMobileMenu
            ? "mobile-navigation-open"
            : ""
        }`}
      >

        <div className="mobile-navigation-inner">

          {/* MOBILE LINKS */}

          <nav className="mobile-nav-links">

            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                className={`mobile-nav-link ${
                  location.pathname === link.path
                    ? "mobile-nav-link-active"
                    : ""
                }`}
                onClick={() =>
                  handleMobileNavigation(
                    link.path
                  )
                }
              >
                <span>
                  {link.label}
                </span>

                <span className="mobile-nav-arrow">
                  →
                </span>
              </button>
            ))}

          </nav>

          {/* MOBILE ACCOUNT SECTION */}

          <div className="mobile-navigation-divider" />

          {!user ? (
            <button
              type="button"
              className="mobile-account-link"
              onClick={() =>
                handleMobileNavigation("/login")
              }
            >
              <UserRound
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Login / Account
              </span>
            </button>
          ) : (
            <>

              <button
                type="button"
                className="mobile-account-link"
                onClick={() =>
                  handleMobileNavigation(
                    "/my-orders"
                  )
                }
              >
                <Package
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  My Orders
                </span>
              </button>

              <button
                type="button"
                className="mobile-account-link mobile-account-logout"
                onClick={handleLogout}
              >
                <LogOut
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Logout
                </span>
              </button>

            </>
          )}

        </div>
      </div>

    </header>
  );
}

export default Navbar;