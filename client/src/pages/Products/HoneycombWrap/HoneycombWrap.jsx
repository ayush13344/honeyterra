import {
  ArrowRight,
  Check,
  Expand,
  Gift,
  Package,
  Recycle,
  Star,
  Truck,
} from "lucide-react";

import { useState } from "react";

import { Link } from "react-router-dom";

import ProductGallery from "../../../components/ProductGallery/ProductGallery";

import { productDetails } from "../../../data/products";

import "./HoneycombWrap.css";

import { useCart } from "../../../context/CartContext";


// =====================================================
// HONEYCOMB PACK OPTIONS
// =====================================================

const packOptions = [
  {
    id: "starter",
    name: "Starter Roll",
    price: 249,
    unit: "1 roll",
    description: "For home & occasional packing",
    badge: "",
  },

  {
    id: "standard",
    name: "Standard Roll",
    price: 399,
    unit: "2 rolls",
    description: "Best for regular packaging",
    badge: "Bestseller",
  },

  {
    id: "business",
    name: "Business Pack",
    price: 799,
    unit: "5 rolls",
    description: "For shops & small businesses",
    badge: "Best Value",
  },
];


// =====================================================
// COMPONENT
// =====================================================

function HoneycombWrap() {

  const { addToCart } = useCart();

  const baseProduct =
    productDetails?.honeycombWrap || {};


  // ===================================================
  // SAFE PRODUCT DATA
  // Prevents undefined / NaN problems
  // ===================================================

  const product = {
    ...baseProduct,

    _id:
      baseProduct._id ||
      "honeycomb-wrap",

    name:
      baseProduct.name ||
      "Honeycomb Wrap",

    description:
      baseProduct.description ||
      "Expandable paper cushioning designed to protect fragile products while reducing unnecessary plastic packaging.",

    images:
      Array.isArray(baseProduct.images) &&
      baseProduct.images.length > 0
        ? baseProduct.images
        : ["/images/honeycomb-wrap.jpg"],

    benefits:
      Array.isArray(baseProduct.benefits) &&
      baseProduct.benefits.length > 0
        ? baseProduct.benefits
        : [
            "Plastic-free cushioning",
            "Lightweight and practical",
            "Compact when stored",
            "Suitable for fragile products",
          ],

    useCases:
      Array.isArray(baseProduct.useCases) &&
      baseProduct.useCases.length > 0
        ? baseProduct.useCases
        : [
            "Glass bottles",
            "Ceramics & crockery",
            "Electronics",
            "Cosmetics",
            "Gifts",
            "E-commerce orders",
          ],
  };


  // ===================================================
  // SELECTED PACK
  // ===================================================

  const [selectedPackId, setSelectedPackId] =
    useState("standard");


  const selectedPack =
    packOptions.find(
      (pack) =>
        pack.id === selectedPackId
    ) || packOptions[1];


  // ===================================================
  // HOW IT WORKS
  // ===================================================

  const steps = [
    {
      number: "01",
      title: "Roll",
      description:
        "Starts as a compact roll that is easy to store, carry and ship.",
      icon: <Package size={23} />,
    },

    {
      number: "02",
      title: "Expand",
      description:
        "Pull the material gently and the honeycomb structure expands into cushioning.",
      icon: <Expand size={23} />,
    },

    {
      number: "03",
      title: "Wrap",
      description:
        "Wrap it around glass, ceramics, electronics, gifts and other fragile items.",
      icon: <Gift size={23} />,
    },

    {
      number: "04",
      title: "Pack",
      description:
        "Place the protected item inside your box and pack it without unnecessary plastic.",
      icon: <Truck size={23} />,
    },
  ];


  // ===================================================
  // ADD TO CART
  // ===================================================

  const handleAddToCart = () => {

    const cartProduct = {
      ...product,

      _id:
        `${product._id}-${selectedPack.id}`,

      name:
        `${product.name} — ${selectedPack.name}`,

      price:
        Number(selectedPack.price),

      unit:
        selectedPack.unit,

      quantity: 1,

      selectedPack:
        selectedPack.name,
    };


    addToCart(cartProduct);
  };


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <main className="wrap-page">


      {/* =================================================
          PRODUCT HERO
      ================================================= */}

      <section className="wrap-product-section">

        <div className="wrap-container">

          <div className="wrap-product-grid">


            {/* =================================================
                PRODUCT GALLERY
            ================================================= */}

            <div className="wrap-gallery-wrapper">

              <ProductGallery
                images={product.images}
              />


              <div className="wrap-gallery-badge">

                <span />

                Plastic-free packaging

              </div>


              <div className="wrap-sold-badge">

                <span className="wrap-sold-dot" />

                Sustainable choice

              </div>

            </div>


            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div className="wrap-product-info">

              {/* =================================================
                  MAIN HEADING
              ================================================= */}

              <h1>

                Protect more.

                <br />

                <span>
                  Plastic less.
                </span>

              </h1>


              <p className="wrap-description">
                {product.description}
              </p>


              {/* =================================================
                  BENEFITS
              ================================================= */}

              <div className="wrap-benefits">

                {product.benefits
                  .slice(0, 4)
                  .map((benefit) => (

                    <div
                      className="wrap-benefit"
                      key={benefit}
                    >

                      <Check size={17} />

                      <span>
                        {benefit}
                      </span>

                    </div>

                  ))}

              </div>


              {/* =================================================
                  CHOOSE PACK
              ================================================= */}

              <div className="wrap-pack-section">


                <div className="wrap-pack-heading">

                  <div>

                    <h2>
                      Choose your pack
                    </h2>

                    <p>
                      Pick the right amount for your needs.
                    </p>

                  </div>


                  <span className="wrap-pack-current">

                    {selectedPack.name}

                  </span>

                </div>


                <div className="wrap-pack-grid">

                  {packOptions.map(
                    (pack) => {

                      const isSelected =
                        selectedPackId ===
                        pack.id;


                      return (

                        <button
                          type="button"
                          key={pack.id}
                          className={`wrap-pack-card ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedPackId(
                              pack.id
                            )
                          }
                        >

                          {pack.badge && (

                            <span className="wrap-pack-badge">
                              {pack.badge}
                            </span>

                          )}


                          <span className="wrap-pack-name">
                            {pack.name}
                          </span>


                          <strong className="wrap-pack-price">
                            ₹
                            {pack.price.toLocaleString(
                              "en-IN"
                            )}
                          </strong>


                          <span className="wrap-pack-unit">
                            {pack.unit}
                          </span>


                          <small>
                            {pack.description}
                          </small>

                        </button>

                      );

                    }
                  )}

                </div>

              </div>


              {/* =================================================
                  PURCHASE BOX
              ================================================= */}

              <div className="wrap-buy-box">


                <div className="wrap-product-details">

                  <span className="wrap-price-label">
                    SELECTED PACK
                  </span>


                  <h3>
                    {selectedPack.name}
                  </h3>


                  <p className="wrap-product-subtitle">
                    {selectedPack.description}
                  </p>

                </div>


                <div className="wrap-price-area">

                  <span className="wrap-price-label">
                    PRICE
                  </span>


                  <strong>
                    ₹
                    {selectedPack.price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>


                  <span className="wrap-unit">
                    / {selectedPack.unit}
                  </span>

                </div>


                <button
                  type="button"
                  className="wrap-add-cart"
                  onClick={handleAddToCart}
                >

                  Add to Cart

                  <ArrowRight
                    size={18}
                  />

                </button>

              </div>


              <p className="wrap-note">

                Lightweight cushioning designed
                for safe and sustainable packaging.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          WHY HONEYCOMB
      ================================================= */}

      <section className="wrap-intro">

        <div className="wrap-container">

          <div className="wrap-intro-grid">


            <div>

              <span className="wrap-eyebrow">
                WHY HONEYCOMB?
              </span>


              <h2>

                Protection that

                <br />

                <span>
                  works differently.
                </span>

              </h2>

            </div>


            <p>

              Traditional protective packaging
              often depends on plastic. Honeycomb
              Wrap creates a protective layer using
              an expandable paper structure —
              giving your products cushioning
              without adding unnecessary plastic
              to the package.

            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <section className="wrap-how">

        <div className="wrap-container">


          <div className="wrap-heading">

            <span className="wrap-eyebrow">
              HOW IT WORKS
            </span>


            <h2>

              From roll to protection.

              <br />

              In four simple steps.

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


      {/* =================================================
          WHERE CAN YOU USE IT
      ================================================= */}

      <section className="wrap-use">

        <div className="wrap-container">


          <div className="wrap-heading">

            <span className="wrap-eyebrow">
              WHERE CAN YOU USE IT?
            </span>


            <h2>

              One wrap.

              <br />

              Many possibilities.

            </h2>


            <p className="wrap-section-description">

              From everyday home packing to
              professional e-commerce shipping,
              Honeycomb Wrap fits wherever
              protection matters.

            </p>

          </div>


          <div className="wrap-use-grid">

            {product.useCases.map(
              (useCase, index) => (

                <div
                  className="wrap-use-card"
                  key={useCase}
                >

                  <div className="wrap-use-number">

                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}

                  </div>


                  <div className="wrap-use-icon">

                    <Recycle size={20} />

                  </div>


                  <span>

                    {useCase}

                  </span>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          BEFORE VS AFTER
      ================================================= */}

      <section className="wrap-comparison">

        <div className="wrap-container">


          <div className="wrap-heading">

            <span className="wrap-eyebrow">
              A BETTER ALTERNATIVE
            </span>


            <h2>
              Rethink your packaging.
            </h2>

          </div>


          <div className="wrap-comparison-grid">


            {/* TRADITIONAL */}

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
                  Adds plastic waste
                </li>

                <li>
                  Less aligned with
                  plastic-free packaging
                </li>

              </ul>

            </div>


            {/* HONEYTERRA */}

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
                  Compact when stored
                </li>

                <li>
                  Designed for modern packaging
                </li>

              </ul>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="wrap-cta">

        <span className="wrap-eyebrow">
          HONEYTERRA
        </span>


        <h2>

          Protect what matters.

          <br />

          Without unnecessary plastic.

        </h2>


        <p>

          Make your next package safer,
          cleaner and more thoughtful.

        </p>


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