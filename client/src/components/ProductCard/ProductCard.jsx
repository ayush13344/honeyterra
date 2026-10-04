import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import "./ProductCard.css";

// ==========================================
// OPTIMIZE CLOUDINARY IMAGE
// ==========================================

function optimizeCloudinaryImage(url, width = 600) {
  if (!url || typeof url !== "string") {
    return url;
  }

  // Only modify Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Only modify URLs that contain /upload/
  if (!url.includes("/upload/")) {
    return url;
  }

  // Avoid adding transformations twice
  if (
    url.includes("/upload/f_auto") ||
    url.includes("/upload/q_auto") ||
    /\/upload\/[^/]+,/.test(url)
  ) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width}/`
  );
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

  // Keep product cards compact
  const maxLength = 48;

  if (cleanedName.length <= maxLength) {
    return cleanedName;
  }

  const shortenedName = cleanedName
    .substring(0, maxLength)
    .replace(/\s+\S*$/, "");

  return `${shortenedName}...`;
}

// ==========================================
// PRODUCT CARD
// ==========================================

function ProductCard({ product, priority = false }) {
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
          ((compareAtPrice - price) /
            compareAtPrice) *
            100
        )
      : 0;

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const productImage =
    Array.isArray(images) && images.length > 0
      ? images[0]
      : null;

  const optimizedImage =
    optimizeCloudinaryImage(
      productImage,
      600
    );

  // ==========================================
  // SHORT PRODUCT NAME
  // ==========================================

  const shortProductName =
    getShortProductName(name);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Link
      to={productUrl}
      className="product-card-link-wrapper"
      aria-label={`View ${name || "product"}`}
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
              alt={name || "HoneyTerra product"}
              className="product-card-real-image"
              loading={
                priority
                  ? "eager"
                  : "lazy"
              }
              fetchPriority={
                priority
                  ? "high"
                  : "auto"
              }
              decoding="async"
            />
          ) : (
            <div className="product-image-placeholder">
              <span>
                Product Image
              </span>
            </div>
          )}

        </div>

        {/* ==========================================
            PRODUCT CONTENT
        ========================================== */}

        <div className="product-card-content">

          {/* CATEGORY */}

          <span className="product-card-category">
            {category || "HoneyTerra"}
          </span>

          {/* NAME */}

          <h3 title={name || "Product"}>
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