import {
  ArrowRight,
  Check,
  ChevronDown,
  Expand,
  PackageCheck,
  Truck,
  CircleDot,
  Home as HomeIcon,
  Coffee,
  Building2,
  Gift,
  PartyPopper,
  HelpCircle,
  Wine,
  Smartphone,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../../data/products";
import "./Home.css";

const useCases = [
  { icon: Wine, title: "Glass Bottles", text: "Protect bottles during storage and shipping." },
  { icon: Sparkles, title: "Ceramics", text: "Cushion delicate ceramic pieces." },
  { icon: Smartphone, title: "Electronics", text: "Add a soft protective layer." },
  { icon: Sparkles, title: "Cosmetics", text: "Keep beauty products protected." },
  { icon: Gift, title: "Gifts", text: "Wrap special products with care." },
  { icon: ShoppingBag, title: "E-commerce & Retail", text: "A practical packaging choice for orders." },
];

const fitCards = [
  {
    image: "/images/lifestyle-home.jpg",
    title: "At home",
    text: "Fits easily on a coffee table, desk or balcony.",
  },
  {
    image: "/images/lifestyle-tabletop.jpg",
    title: "Any tabletop",
    text: "Sturdy and stable — no tipping or rolling off the edge.",
  },
  {
    image: "/images/lifestyle-business.jpg",
    title: "Cafés, lounges & hotels",
    text: "Pack sizes built for businesses that go through a lot of trays.",
  },
];

function Home() {
  const gelProducts = products.filter((product) => product.category === "Gel Ash Tray");

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">DESIGNED FOR REAL LIFE</p>
          <h1>Simple products.<br />Thoughtfully designed.</h1>
          <p className="hero-text">
            Discover practical everyday products made to look good, work well,
            and fit naturally into your space.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">Shop now <ArrowRight size={17} /></Link>
            <Link to="/about" className="btn btn-secondary">Learn more</Link>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img src="/images/hero.jpg" alt="HoneyTerra products" />
          <div className="hero-float-card">
            <span className="hero-dot" />
            Made for everyday use
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="section-heading center">
          <p className="eyebrow">SEE IT IN REAL LIFE</p>
          <h2>Designed for real life</h2>
        </div>

        <div className="fit-grid">
          {fitCards.map((card) => (
            <article className="fit-card" key={card.title}>
              <div className="fit-image">
                <img src={card.image} alt={card.title} />
              </div>
              <div className="fit-content">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section catalog-section">
        <div className="section-heading center">
          <p className="eyebrow">OUR PRODUCTS</p>
          <h2>Simple things, done better.</h2>
          <p>Explore HoneyTerra's current collection.</p>
        </div>

        <div className="product-grid">
          {gelProducts.map((product) => (
            <article className="product-card" key={product.id}>
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <Link to={`/products/${product.id}`} className="product-image">
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="product-content">
                <p className="product-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-feature">
                  <Check size={15} /> Cigarette-extinguishing gel core
                </div>
                <div className="product-bottom">
                  <strong>₹{product.price}</strong>
                  <Link to={`/products/${product.id}`} className="round-plus" aria-label={`View ${product.name}`}>
                    +
                  </Link>
                </div>
                <Link to={`/products/${product.id}`} className="details-link">
                  View details <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="center">
          <Link to="/products" className="btn btn-primary">View all products <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="choice-section">
        <div className="choice-card">
          <p className="eyebrow">NOT SURE WHICH PACK?</p>
          <h2>Where will you use it?</h2>
          <div className="choice-grid">
            {[
              [HomeIcon, "Home"],
              [Coffee, "Café"],
              [Building2, "Hotel"],
              [Building2, "Business"],
              [PartyPopper, "Event"],
              [HelpCircle, "Other"],
            ].map(([Icon, label]) => (
              <button className="choice-item" key={label}>
                <span><Icon size={21} /></span>
                <small>{label}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="honeycomb-banner">
        <div className="honeycomb-pattern" />
        <div className="banner-content">
          <p className="eyebrow">SUSTAINABLE PACKAGING</p>
          <h2>Rethink your packaging.</h2>
          <p>
            Honeycomb Wrap expands from a compact roll into protective
            cushioning, helping replace unnecessary plastic packaging.
          </p>
          <Link to="/products/honeycomb-wrap" className="btn btn-dark">
            Explore Honeycomb Wrap <ArrowRight size={17} />
          </Link>
        </div>
        <div className="banner-image">
          <img src="/images/honeycomb-wrap.jpg" alt="Honeycomb Wrap" />
        </div>
      </section>

      <section className="section how-section">
        <div className="section-heading center">
          <p className="eyebrow gold">HOW IT WORKS</p>
          <h2>How does Honeycomb Wrap work?</h2>
        </div>

        <div className="steps">
          {[
            [CircleDot, "01 — Roll", "Starts as a compact, flat roll — easy to store and ship."],
            [Expand, "02 — Expand", "Pull it open and the honeycomb structure springs into a cushioned pad."],
            [PackageCheck, "03 — Wrap", "Wrap it around glass, ceramics, electronics or gifts for protective cushioning."],
            [Truck, "04 — Pack", "Box it up — plastic-free protection, ready to ship."],
          ].map(([Icon, title, text]) => (
            <article className="step" key={title}>
              <div className="step-icon"><Icon size={27} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="use-cases">
        <div className="section-heading center">
          <p className="eyebrow">USE CASES</p>
          <h2>What can you wrap?</h2>
        </div>

        <div className="use-case-grid">
          {useCases.map(({ icon: Icon, title, text }) => (
            <button className="use-case-card" key={title}>
              <span className="use-case-icon"><Icon size={21} /></span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <ChevronDown size={19} />
            </button>
          ))}
        </div>
      </section>

      <section className="before-after">
        <div className="section-heading center">
          <p className="eyebrow">BEFORE VS AFTER</p>
          <h2>Rethink your packaging</h2>
        </div>

        <div className="comparison">
          <div className="comparison-card">
            <div className="comparison-image">
              <img src="/images/traditional-packaging.jpg" alt="Traditional packaging" />
            </div>
            <div className="comparison-content">
              <h3>Traditional packaging</h3>
              <p>Bulky, plastic-heavy and often harder to store.</p>
            </div>
          </div>

          <div className="comparison-card highlight">
            <div className="comparison-image">
              <img src="/images/honeycomb-wrap.jpg" alt="HoneyTerra Honeycomb Wrap" />
            </div>
            <div className="comparison-content">
              <h3>HoneyTerra Honeycomb Wrap</h3>
              <p>Compact, flexible cushioning designed for modern packaging.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <p className="eyebrow">READY TO EXPLORE?</p>
          <h2>Find something made for your everyday.</h2>
        </div>
        <Link to="/products" className="btn btn-primary">Shop HoneyTerra <ArrowRight size={17} /></Link>
      </section>
    </div>
  );
}

export default Home;
