import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({
  imageLabel,
  category,
  name,
  description,
  price,
  badge,
  link,
}) {
  return (
    <article className="product-card">

      <div className="product-card-image">

        {badge && (
          <span className="product-card-badge">
            {badge}
          </span>
        )}

        <div className="product-image-placeholder">
          <span>Product Image</span>
          <small>{imageLabel}</small>
        </div>

      </div>

      <div className="product-card-content">

        <span className="product-card-category">
          {category}
        </span>

        <h3>{name}</h3>

        <p>{description}</p>

        <div className="product-card-bottom">

          <div>
            {price !== null ? (
              <span className="product-card-price">
                ₹{price}
              </span>
            ) : (
              <span className="product-card-price-text">
                Coming Soon
              </span>
            )}
          </div>

          <Link
            to={link}
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