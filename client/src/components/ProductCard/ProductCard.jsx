import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import "./ProductCard.css";

function optimizeCloudinaryImage(url, width = 600) {
  if (!url || typeof url !== "string") {
    return url;
  }

  // Only modify Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Avoid adding transformations twice
  if (url.includes("/upload/") && !url.includes("/upload/f_auto")) {
    return url.replace(
      "/upload/",
      `/upload/f_auto,q_auto,w_${width}/`
    );
  }

  return url;
}

// ==========================================
// SHORTEN PRODUCT TITLE
// ==========================================

function getShortProductName(name) {
  if (!name || typeof name !== "string") {
    return "Product";
  }

  const cleanedName = name
    .replace(/\s+/g, " ")
    .trim();

  /*
   * Keep the important beginning of the product name.
   * Marketplace-style descriptions after this point are
   * unnecessary inside a product card.
   */
  const maxLength = 48;

  if (cleanedName.length <= maxLength) {
    return cleanedName;
  }

  const shortenedName = cleanedName
    .substring(0, maxLength)
    .replace(/\s+\S*$/, "");

  return `${shortenedName}...`;
}

function ProductCard({ product }) {
  const {
    _id,
    name,
    price,
    compareAtPrice,
    category,
    images,
    stock,
    isFeatured,
  } = product;

  // ==========================================
  // PRODUCT URL
  // ==========================================

  const productUrl = `/products/${_id}`;

  // ==========================================
  // CALCULATE DISCOUNT
  // ==========================================

  const discount =
    compareAtPrice > price
      ? Math.round(
          ((compareAtPrice - price) / compareAtPrice) * 100
        )
      : 0;

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const productImage =
    images && images.length > 0
      ? images[0]
      : null;

  const optimizedImage = optimizeCloudinaryImage(
    productImage,
    600
  );

  // ==========================================
  // SHORT PRODUCT NAME
  // ==========================================

  const shortProductName = getShortProductName(name);

  return (
    <Link
      to={productUrl}
      className="product-card-link-wrapper"
      aria-label={`View ${name}`}
    >
      <article className="product-card">

        {/* ==========================================
            IMAGE
        ========================================== */}

        <div className="product-card-image">

          {/* BADGE */}

          {discount > 0 ? (
            <span className="product-card-badge">
              {discount}% OFF
            </span>
          ) : isFeatured ? (
            <span className="product-card-badge">
              Featured
            </span>
          ) : null}

          {/* IMAGE */}

          {optimizedImage ? (
            <img
              src={optimizedImage}
              alt={name}
              className="product-card-real-image"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="product-image-placeholder">
              <span>Product Image</span>
            </div>
          )}
        </div>

        {/* ==========================================
            PRODUCT CONTENT
        ========================================== */}

        <div className="product-card-content">

          {/* CATEGORY */}

          <span className="product-card-category">
            {category}
          </span>

          {/* NAME */}

          <h3 title={name}>
            {shortProductName}
          </h3>

          {/* ========================================
              BOTTOM
          ======================================== */}

          <div className="product-card-bottom">

            {/* PRICE */}

            <div className="product-card-price-wrapper">

              <span className="product-card-price">
                ₹{price}
              </span>

              {compareAtPrice > price && (
                <span className="product-card-old-price">
                  ₹{compareAtPrice}
                </span>
              )}

              {stock <= 0 && (
                <span className="product-card-stock">
                  Out of Stock
                </span>
              )}
            </div>

            {/* VIEW */}

            <span className="product-card-view">
              View
              <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;