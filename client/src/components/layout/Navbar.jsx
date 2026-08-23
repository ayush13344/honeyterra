import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import Logo from "./Logo";

import "./Navbar.css";

import { useCart } from "../../context/CartContext";

import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  {
    label: "Honeycomb Wrap",
    to: "/shop/wrap",
  },
  {
    label: "Gel Ash Tray",
    to: "/shop/ash-tray",
  },
  {
    label: "About Us",
    to: "/about",
  },
  {
    label: "Contact",
    to: "/contact",
  },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const navigate = useNavigate();

  const { cartCount, openCart } = useCart();

  const {
    user,
    logout,
  } = useAuth();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    closeMenu();

    navigate("/");
  };

  // ==========================================
  // GET USER NAME
  // ==========================================

  const getFirstName = () => {
    if (!user?.name) {
      return "";
    }

    return user.name
      .trim()
      .split(" ")[0];
  };

  return (
    <header className="site-header">

      <div className="navbar">

        {/* ======================================
            LOGO
        ======================================= */}

        <Logo />

        {/* ======================================
            NAVIGATION
        ======================================= */}

        <nav
          className={`desktop-nav ${
            open ? "mobile-open" : ""
          }`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ======================================
            ACTIONS
        ======================================= */}

        <div className="nav-actions">

          {/* SEARCH */}

          <Link
            to="/search"
            aria-label="Search"
            className="nav-icon"
            onClick={closeMenu}
          >
            <Search
              size={22}
              strokeWidth={1.8}
            />
          </Link>


          {/* ====================================
              ACCOUNT
          ==================================== */}

          {user ? (
            <div
              className="nav-user"
              title={`Logged in as ${user.name}`}
            >
              <Link
                to="/profile"
                className="nav-user-link"
                onClick={closeMenu}
              >
                <UserRound
                  size={22}
                  strokeWidth={1.8}
                />

                <span className="nav-user-name">
                  Hi, {getFirstName()}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Account"
              className="nav-icon desktop-only"
              onClick={closeMenu}
            >
              <UserRound
                size={22}
                strokeWidth={1.8}
              />
            </Link>
          )}


          {/* ====================================
              CART
          ==================================== */}

          <button
            className="navbar-cart-btn"
            onClick={openCart}
            aria-label="Open cart"
          >
            <ShoppingBag size={22} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </button>


          {/* ====================================
              MOBILE MENU
          ==================================== */}

          <button
            className="menu-button"
            onClick={() =>
              setOpen((value) => !value)
            }
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
          >
            {open ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>
      </div>


      {/* ========================================
          MOBILE USER SECTION
      ======================================== */}

      {open && (
        <div className="mobile-account-section">

          {user ? (
            <>
              <div className="mobile-user-info">

                <UserRound
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  Hi, {getFirstName()}
                </span>

              </div>

              <Link
                to="/profile"
                onClick={closeMenu}
              >
                My Account
              </Link>

              <button
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
            >
              <UserRound size={18} />
              Login
            </Link>
          )}

        </div>
      )}
    </header>
  );
}

export default Navbar;