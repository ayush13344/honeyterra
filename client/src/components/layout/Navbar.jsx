import {
  Search,
  UserRound,
  ShoppingBag,
} from "lucide-react";
import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const {
    openCart,
    cartItems = [],
  } = useCart();

  // ==========================================
  // CHECKOUT PAGE
  // ==========================================
  const isCheckoutPage =
    location.pathname === "/checkout";

  // ==========================================
  // CART COUNT
  // ==========================================
  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
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

          {/* Account */}
          <Link
            to="/login"
            className="navbar-icon-btn"
            aria-label="Account"
          >
            <UserRound
              size={22}
              strokeWidth={1.8}
            />
          </Link>

          {/* Cart */}
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