import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const {
    _id,
    name,
    description,
    price,
    compareAtPrice,
    category,
    images,
    stock,
    isFeatured,
  } = product;

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
    images && images.length > 0
      ? images[0]
      : null;

  return (
    <article className="product-card">

      {/* ==========================================
          IMAGE
      ========================================== */}

      <div className="product-card-image">

        {/* FEATURED / DISCOUNT BADGE */}

        {discount > 0 ? (
          <span className="product-card-badge">
            {discount}% OFF
          </span>
        ) : isFeatured ? (
          <span className="product-card-badge">
            Featured
          </span>
        ) : null}

        {productImage ? (
          <img
            src={productImage}
            alt={name}
            className="product-card-real-image"
          />
        ) : (
          <div className="product-image-placeholder">
            <span>Product Image</span>
            <small>No image available</small>
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

        <h3>{name}</h3>

        {/* DESCRIPTION */}

        <p>{description}</p>

        {/* ==========================================
            BOTTOM
        ========================================== */}

        <div className="product-card-bottom">

          <div>

            {/* PRICE */}

            <span className="product-card-price">
              ₹{price}
            </span>

            {/* OLD PRICE */}

            {compareAtPrice > price && (
              <span className="product-card-old-price">
                ₹{compareAtPrice}
              </span>
            )}

            {/* STOCK */}

            {stock <= 0 && (
              <span className="product-card-stock">
                Out of Stock
              </span>
            )}

          </div>

          {/* VIEW PRODUCT */}

          <Link
            to={`/products/${_id}`}
            className="product-card-link"
          >
            View Product
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;