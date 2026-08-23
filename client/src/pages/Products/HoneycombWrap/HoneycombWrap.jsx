import {
  ArrowRight,
  Check,
  Expand,
  Gift,
  Package,
  Recycle,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

import ProductGallery from "../../../components/ProductGallery/ProductGallery";

import { productDetails } from "../../../data/products";

import "./HoneycombWrap.css";

import { useCart } from "../../../context/CartContext";

function HoneycombWrap() {
  const product = productDetails.honeycombWrap;

  const { addToCart } = useCart();

  const steps = [
    {
      number: "01",
      title: "Roll",
      description:
        "Starts as a compact, flat roll — easy to store and ship.",
      icon: <Package size={23} />,
    },
    {
      number: "02",
      title: "Expand",
      description:
        "Pull it open and the honeycomb structure springs into a cushioned pad.",
      icon: <Expand size={23} />,
    },
    {
      number: "03",
      title: "Wrap",
      description:
        "Wrap it around glass, ceramics, electronics or gifts.",
      icon: <Gift size={23} />,
    },
    {
      number: "04",
      title: "Pack",
      description:
        "Box it up — plastic-free protection, ready to ship.",
      icon: <Truck size={23} />,
    },
  ];

  // Add Honeycomb Wrap to cart
  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <main className="wrap-page">

      {/* =========================================
          PRODUCT HERO
      ========================================= */}

      <section className="wrap-product-section">

        <div className="wrap-container">

          <div className="wrap-product-grid">

            {/* ==============================
                PRODUCT GALLERY
            ============================== */}

            <ProductGallery images={product.images} />


            {/* ==============================
                PRODUCT INFORMATION
            ============================== */}

            <div className="wrap-product-info">

              <span className="wrap-category">
                SUSTAINABLE PACKAGING
              </span>


              <h1>
                Protect more.
                <br />
                Plastic less.
              </h1>


              <p className="wrap-description">
                {product.description}
              </p>


              {/* ==============================
                  BENEFITS
              ============================== */}

              <div className="wrap-benefits">

                {product.benefits.map((benefit) => (
                  <div
                    className="wrap-benefit"
                    key={benefit}
                  >
                    <Check size={17} />
                    <span>{benefit}</span>
                  </div>
                ))}

              </div>


              {/* ==============================
                  PURCHASE BOX
              ============================== */}

              <div className="wrap-buy-box">

                <div>

                  <span className="wrap-price-label">
                    PRODUCT
                  </span>

                  <h3>
                    Honeycomb Wrap
                  </h3>

                </div>


                <div className="wrap-product-price">

                  <span className="wrap-price-label">
                    PRICE
                  </span>

                  <strong>
                    ₹{product.price}
                  </strong>

                </div>


                <button
                  type="button"
                  className="wrap-add-cart"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

              </div>


              <p className="wrap-note">
                Plastic-free cushioning designed for
                safe, sustainable packaging.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          HOW IT WORKS
      ========================================= */}

      <section className="wrap-how">

        <div className="wrap-container">

          <div className="wrap-heading">

            <span className="wrap-eyebrow">
              HOW IT WORKS
            </span>

            <h2>
              Simple protection.
              <br />
              Four easy steps.
            </h2>

          </div>


          <div className="wrap-steps">

            {steps.map((step) => (
              <article
                className="wrap-step"
                key={step.number}
              >

                <div className="wrap-step-icon">
                  {step.icon}
                </div>

                <span className="wrap-step-number">
                  {step.number}
                </span>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

              </article>
            ))}

          </div>

        </div>

      </section>


      {/* =========================================
          WHAT CAN YOU WRAP
      ========================================= */}

      <section className="wrap-use">

        <div className="wrap-container">

          <div className="wrap-heading">

            <span className="wrap-eyebrow">
              USE CASES
            </span>

            <h2>
              What can you wrap?
            </h2>

          </div>


          <div className="wrap-use-grid">

            {product.useCases.map((useCase) => (
              <div
                className="wrap-use-card"
                key={useCase}
              >

                <div className="wrap-use-icon">
                  <Recycle size={20} />
                </div>

                <span>
                  {useCase}
                </span>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =========================================
          BEFORE VS AFTER
      ========================================= */}

      <section className="wrap-comparison">

        <div className="wrap-container">

          <div className="wrap-heading">

            <span className="wrap-eyebrow">
              BEFORE VS AFTER
            </span>

            <h2>
              Rethink your packaging.
            </h2>

          </div>


          <div className="wrap-comparison-grid">

            {/* Traditional */}

            <div className="comparison-card traditional">

              <span>
                TRADITIONAL PACKAGING
              </span>

              <h3>
                Bubble Wrap
              </h3>

              <ul>
                <li>
                  Plastic-based cushioning
                </li>

                <li>
                  More plastic waste
                </li>

                <li>
                  Less sustainable disposal
                </li>
              </ul>

            </div>


            {/* HoneyTerra */}

            <div className="comparison-card honeyterra">

              <span>
                HONEYTERRA
              </span>

              <h3>
                Honeycomb Wrap
              </h3>

              <ul>
                <li>
                  Plastic-free cushioning
                </li>

                <li>
                  Lightweight and practical
                </li>

                <li>
                  Designed for modern packaging
                </li>
              </ul>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          CTA
      ========================================= */}

      <section className="wrap-cta">

        <span className="wrap-eyebrow">
          HONEYTERRA
        </span>

        <h2>
          Protect what matters.
          <br />
          Without unnecessary plastic.
        </h2>

        <Link
          to="/contact"
          className="wrap-cta-button"
        >
          Talk to us
          <ArrowRight size={18} />
        </Link>

      </section>

    </main>
  );
}

export default HoneycombWrap;