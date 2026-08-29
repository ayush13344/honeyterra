import { ArrowRight } from "lucide-react";
import { useState } from "react";

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
    link: "/products?category=Gel%20Ash%20Trays",
  },
  {
    id: "wrap",
    number: "02",
    name: "Honeycomb Wrap",
    shortName: "Honeycomb Wrap",
    image: "/products/honeycomb-wrap.png",
    description:
      "Flexible honeycomb protection for products that need extra care.",
    link: "/products?category=Honeycomb%20Wraps",
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

        <div className="product-reveal-glow" />

        <div className="product-reveal-image-wrap">
          <img
            key={product.id}
            src={product.image}
            alt={product.name}
            className="product-reveal-image"
          />
        </div>

      </div>


      {/* ==========================================
          PRODUCT INFO / SELECTOR
      ========================================== */}

      <div className="product-reveal-panel">

        <div className="product-reveal-heading">

          <span className="product-reveal-category">
            FEATURED PRODUCT
          </span>

          <span className="product-reveal-count">
            {product.number} / 02
          </span>

        </div>


        <div className="product-reveal-name">
          {product.name}
        </div>


        <div className="product-reveal-selector">

          {products.map((item, index) => (

            <button
              type="button"
              key={item.id}
              className={`product-reveal-option ${
                activeProduct === index
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleProductChange(index)
              }
              aria-label={`Show ${item.name}`}
              aria-pressed={
                activeProduct === index
              }
            >

              <span className="product-reveal-option-dot" />

              <span className="product-reveal-option-text">
                {item.shortName}
              </span>

            </button>

          ))}

        </div>


        <a
          href={product.link}
          className="product-reveal-link"
        >
          View product
          <ArrowRight size={15} />
        </a>

      </div>

    </div>
  );
}

export default ProductReveal;