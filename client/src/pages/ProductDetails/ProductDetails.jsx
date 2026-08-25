import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Package,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const {
    addToCart,
  } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ==========================================
  // FETCH PRODUCT
  // ==========================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        console.log("Product details:", data);

        if (!data.success || !data.product) {
          throw new Error("Product not found");
        }

        setProduct(data.product);
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        setError(
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-loading">
          <div className="product-details-spinner"></div>

          <p>
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-details-error">
          <h2>
            Product not found
          </h2>

          <p>
            {error ||
              "This product could not be found."}
          </p>

          <Link
            to="/shop"
            className="product-details-back-button"
          >
            <ArrowLeft size={17} />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // PRODUCT DATA
  // ==========================================
  const {
    name,
    description,
    price,
    compareAtPrice,
    category,
    images,
    stock,
  } = product;

  const productImage =
    images && images.length > 0
      ? images[0]
      : null;

  // ==========================================
  // DISCOUNT
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
  // QUANTITY
  // ==========================================
  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(stock, current + 1)
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // ==========================================
  // RETURN
  // ==========================================
  return (
    <main className="product-details-page">

      {/* ========================================
          BACK TO SHOP
      ======================================== */}

      <section className="product-details-main">
        <div className="product-details-container">

          <Link
            to="/shop"
            className="product-details-back"
          >
            <ArrowLeft size={17} />
            Back to Shop
          </Link>

          {/* ======================================
              PRODUCT
          ====================================== */}

          <div className="product-details-layout">

            {/* ====================================
                IMAGE
            ==================================== */}

            <div className="product-details-image-wrapper">

              {discount > 0 && (
                <span className="product-details-discount">
                  {discount}% OFF
                </span>
              )}

              {productImage ? (
                <img
                  src={productImage}
                  alt={name}
                  className="product-details-image"
                />
              ) : (
                <div className="product-details-image-placeholder">
                  <Package size={45} />

                  <span>
                    Product Image
                  </span>
                </div>
              )}

            </div>

            {/* ====================================
                INFORMATION
            ==================================== */}

            <div className="product-details-info">

              {/* CATEGORY */}

              <span className="product-details-category">
                {category}
              </span>

              {/* NAME */}

              <h1>
                {name}
              </h1>

              {/* DESCRIPTION */}

              {description && (
                <p className="product-details-description">
                  {description}
                </p>
              )}

              {/* PRICE */}

              <div className="product-details-price-row">

                <span className="product-details-price">
                  ₹{price}
                </span>

                {compareAtPrice > price && (
                  <span className="product-details-old-price">
                    ₹{compareAtPrice}
                  </span>
                )}

                {discount > 0 && (
                  <span className="product-details-save">
                    Save {discount}%
                  </span>
                )}

              </div>

              {/* DIVIDER */}

              <div className="product-details-divider"></div>

              {/* STOCK */}

              {stock > 0 ? (
                <div className="product-details-stock available">
                  <Check size={17} />

                  In Stock

                  <span>
                    ({stock} available)
                  </span>
                </div>
              ) : (
                <div className="product-details-stock unavailable">
                  Out of Stock
                </div>
              )}

              {/* ==================================
                  QUANTITY
              ================================== */}

              {stock > 0 && (
                <div className="product-details-quantity-section">

                  <span className="product-details-label">
                    Quantity
                  </span>

                  <div className="product-details-quantity">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        quantity >= stock
                      }
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                </div>
              )}

              {/* ==================================
                  ADD TO CART
              ================================== */}

              <button
                type="button"
                className="product-details-cart-button"
                onClick={handleAddToCart}
                disabled={stock <= 0}
              >
                <ShoppingCart size={19} />

                {stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              {/* ==================================
                  PRODUCT FEATURES
              ================================== */}

              <div className="product-details-features">

                <div className="product-details-feature">

                  <div className="product-details-feature-icon">
                    <Package size={19} />
                  </div>

                  <div>
                    <strong>
                      Quality Product
                    </strong>

                    <span>
                      Made for everyday use
                    </span>
                  </div>

                </div>

                <div className="product-details-feature">

                  <div className="product-details-feature-icon">
                    <Check size={19} />
                  </div>

                  <div>
                    <strong>
                      Genuine HoneyTerra
                    </strong>

                    <span>
                      Authentic product
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default ProductDetails;