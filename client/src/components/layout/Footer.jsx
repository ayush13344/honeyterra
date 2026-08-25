import { AtSign, Mail, Phone, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo />
          <p>
            Thoughtfully designed products for everyday use, made to be simple,
            useful and better.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><AtSign size={18} /></a>
            <a href="mailto:hello@honeyterra.com" aria-label="Email"><Mail size={18} /></a>
            <a href="tel:+910000000000" aria-label="Phone"><Phone size={18} /></a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/shop/wrap">Honeycomb Wrap</Link>
          <Link to="/shop/ash-tray">Gel Ash Tray</Link>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">My Account</Link>
        </div>

        <div className="footer-column footer-contact">
          <h4>Need help?</h4>
          <p>Have a question about a product or your order?</p>
          <Link to="/contact" className="footer-link">
            Contact us <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} HoneyTerra. All rights reserved.</span>
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
