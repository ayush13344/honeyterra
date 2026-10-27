import { ArrowRight, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { useProducts } from "../../context/ProductContext.jsx";

import "./UProducts.css";

// ==========================================
// PRODUCTS PAGE
// ==========================================

function UProducts() {
  const { products, loading, error } = useProducts();

  // ==========================================
  // CATEGORY PRODUCTS
  // ==========================================

  const gelAshTrays = products.filter(
    (product) =>
      product.category === "Gel Ash Trays"
  );

  const honeycombWraps = products.filter(
    (product) =>
      product.category === "Honeycomb Wraps"
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="products-page">
        <section className="products-loading">
          <div className="products-loading-spinner" />

          <p>Loading HoneyTerra products...</p>
        </section>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="products-page">
        <section className="products-error">
          <div className="products-empty-icon">
            <PackageOpen size={32} />
          </div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            type="button"
            className="products-retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="products-page">

      {/* ==========================================
          PAGE HERO
      ========================================== */}

      <section className="products-hero">

        <div className="products-hero-content">

          <p className="eyebrow">
            THE HONEYTERRA COLLECTION
          </p>

          <h1>
            Products made
            <br />
            for everyday use.
          </h1>

          <p className="products-hero-description">
            Explore the HoneyTerra collection of
            practical products designed for homes,
            businesses and everyday spaces.
          </p>

        </div>

      </section>


      {/* ==========================================
          CATEGORY NAVIGATION
      ========================================== */}

      <section className="products-category-nav">

        <a href="#gel-ash-trays">
          Gel Ash Trays
          <ArrowRight size={16} />
        </a>

        <a href="#honeycomb-wraps">
          Honeycomb Wraps
          <ArrowRight size={16} />
        </a>

      </section>


      {/* ==========================================
          GEL ASH TRAYS
      ========================================== */}

      <section
        className="products-category-section"
        id="gel-ash-trays"
      >

        <div className="products-section-heading">

          <div>

            <p className="eyebrow">
              GEL ASH TRAYS
            </p>

            <h2>
              Clean.
              <br />
              Practical.
              <br />
              Everyday.
            </h2>

          </div>

          <div className="products-section-description">

            <p>
              Designed for everyday use at home,
              cafés, offices and outdoor spaces.
            </p>

          </div>

        </div>


        {gelAshTrays.length > 0 ? (

          <div className="products-grid">

            {gelAshTrays.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            ))}

          </div>

        ) : (

          <div className="products-empty">

            <PackageOpen size={30} />

            <h3>
              No Gel Ash Trays available
            </h3>

            <p>
              New products will appear here soon.
            </p>

          </div>

        )}

      </section>


      {/* ==========================================
          HONEYCOMB WRAPS
      ========================================== */}

      <section
        className="products-category-section honeycomb-products-section"
        id="honeycomb-wraps"
      >

        <div className="products-section-heading">

          <div>

            <p className="eyebrow gold">
              HONEYCOMB WRAPS
            </p>

            <h2>
              Protect better.
              <br />
              Pack smarter.
            </h2>

          </div>

          <div className="products-section-description">

            <p>
              Flexible honeycomb protection that
              expands when you need it and stores
              compactly when you don't.
            </p>

          </div>

        </div>


        {honeycombWraps.length > 0 ? (

          <div className="products-grid">

            {honeycombWraps.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            ))}

          </div>

        ) : (

          <div className="products-empty">

            <PackageOpen size={30} />

            <h3>
              No Honeycomb Wraps available
            </h3>

            <p>
              New products will appear here soon.
            </p>

          </div>

        )}

      </section>


      {/* ==========================================
          BOTTOM CTA
      ========================================== */}

      <section className="products-bottom-cta">

        <div>

          <p className="eyebrow">
            HONEYTERRA
          </p>

          <h2>
            Find the product
            <br />
            that fits your needs.
          </h2>

          <p>
            Have a question about a product,
            quantity or business requirement?
          </p>

        </div>

        <Link
          to="/contact"
          className="products-contact-btn"
        >
          Talk to us
          <ArrowRight size={17} />
        </Link>

      </section>

    </main>
  );
}

export default UProducts;