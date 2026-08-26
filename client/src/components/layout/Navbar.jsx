import {
  Search,
  UserRound,
  ShoppingBag,
  ChevronDown,
  Package,
  LogOut,
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

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    openCart,
    cartItems = [],
  } = useCart();

  // ==========================================
  // USER DROPDOWN
  // ==========================================

  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);

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

    // Listen for login/logout changes
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, [location.pathname]);

  // ==========================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
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
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Close dropdown
    setShowUserMenu(false);

    // Update navbar immediately
    setUser(null);

    // Go to home page
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
              ACCOUNT / USER
          ========================================== */}

          {!user ? (
            // ----------------------------------------
            // NOT LOGGED IN
            // ----------------------------------------
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
            // ----------------------------------------
            // LOGGED IN
            // ----------------------------------------
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
              >
                {/* Profile Circle */}

                <span className="navbar-user-avatar">
                  {user.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </span>

                {/* Name */}

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

              {/* ==========================================
                  DROPDOWN
              ========================================== */}

              {showUserMenu && (
                <div className="navbar-user-dropdown">

                  {/* User Information */}

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

                  {/* My Orders */}

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

                  {/* Logout */}

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

        </div>
      </div>
    </header>
  );
}

export default Navbar;