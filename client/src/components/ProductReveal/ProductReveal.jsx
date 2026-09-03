import { useState } from "react";
import { Link } from "react-router-dom";

import "./ProductReveal.css";

const products = [
  {
    id: "ashtray",
    number: "01",
    name: "Gel Ash Tray",
    shortName: "Gel Ash Tray",
    image: "/products/gel-ashtray.png",
    description:
      "A practical everyday ash tray designed for cleaner spaces.",
  },
  {
    id: "wrap",
    number: "02",
    name: "Honeycomb Wrap",
    shortName: "Honeycomb Wrap",
    image: "/products/honeycomb-wrap.png",
    description:
      "Flexible honeycomb protection for products that need extra care.",
  },
];

function ProductReveal() {
  const [activeProduct, setActiveProduct] = useState(0);

  const product = products[activeProduct];

  const handleProductChange = (index) => {
    if (index === activeProduct) return;

    setActiveProduct(index);
  };

  return (
    <div className="product-reveal">

      {/* ==========================================
          PRODUCT VISUAL
      ========================================== */}

      <div className="product-reveal-visual">

        {/* Soft glow behind product */}
        <div className="product-reveal-glow" />

        <div className="product-reveal-image-wrap">

          {/* ==========================================
              CLICKABLE PRODUCT IMAGE
              Clicking/tapping image → /shop
          ========================================== */}

          <Link
            to="/shop"
            className="product-reveal-image-link"
            aria-label={`Shop ${product.name}`}
          >
            <img
              key={product.id}
              src={product.image}
              alt={product.name}
              className="product-reveal-image"
              draggable="false"
            />
          </Link>

        </div>

      </div>


      {/* ==========================================
          PRODUCT INFORMATION
      ========================================== */}

      <div className="product-reveal-panel">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="product-reveal-heading">

          <span className="product-reveal-category">
            FEATURED PRODUCT
          </span>

          <span className="product-reveal-count">
            {product.number} / 02
          </span>

        </div>


        {/* ==========================================
            PRODUCT NAME
        ========================================== */}

        <div className="product-reveal-name">
          {product.name}
        </div>


        {/* ==========================================
            PRODUCT SELECTOR
        ========================================== */}

        <div className="product-reveal-selector">

          {products.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`product-reveal-option ${
                activeProduct === index ? "active" : ""
              }`}
              onClick={() => handleProductChange(index)}
              aria-label={`Show ${item.name}`}
              aria-pressed={activeProduct === index}
            >

              <span className="product-reveal-option-dot" />

              <span className="product-reveal-option-text">
                {item.shortName}
              </span>

            </button>
          ))}

        </div>


        {/* ==========================================
            VIEW PRODUCTS
        ========================================== */}

        <Link
          to="/shop"
          className="product-reveal-link"
        >
          View all products
        </Link>

      </div>

    </div>
  );
}

export default ProductReveal;