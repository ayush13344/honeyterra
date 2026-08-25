import { Link, useNavigate } from "react-router-dom";

import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  ArrowRight,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

import "./CartDrawer.css";

const CartDrawer = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartSubtotal,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (!isCartOpen) {
    return null;
  }

  // ==========================================
  // TOTAL NUMBER OF PRODUCTS
  // ==========================================

  const cartItemCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // ==========================================
  // FREE SHIPPING
  // ==========================================

  const FREE_SHIPPING_LIMIT = 1000;

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_LIMIT - cartSubtotal,
    0
  );

  const shippingProgress = Math.min(
    (cartSubtotal / FREE_SHIPPING_LIMIT) * 100,
    100
  );

  // ==========================================
  // CHECKOUT
  // ==========================================

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  // ==========================================
  // CONTINUE SHOPPING
  // ==========================================

  const handleContinueShopping = () => {
    closeCart();
    navigate("/shop");
  };

  return (
    <div className="cart-overlay">

      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div
        className="cart-backdrop"
        onClick={closeCart}
      />

      {/* ==========================================
          CART DRAWER
      ========================================== */}

      <aside className="cart-drawer">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="cart-header">

          <div className="cart-header-title">

            <h2>Your Cart</h2>

            {cartItemCount > 0 && (
              <span className="cart-count-label">
                {cartItemCount}{" "}
                {cartItemCount === 1 ? "item" : "items"}
              </span>
            )}

          </div>

          <button
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={27} strokeWidth={2} />
          </button>

        </div>


        {/* ==========================================
            EMPTY CART
        ========================================== */}

        {cartItems.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              <ShoppingBag
                size={42}
                strokeWidth={1.5}
              />
            </div>

            <h3>Your cart is empty</h3>

            <p>
              Looks like you haven't added anything
              to your cart yet.
            </p>

            <Link
              to="/shop"
              className="start-shopping-btn"
              onClick={closeCart}
            >
              Start Shopping
              <ArrowRight size={18} />
            </Link>

          </div>

        ) : (

          <>

            {/* ==========================================
                SHIPPING MESSAGE
            ========================================== */}

            <div className="cart-shipping">

              {remainingForFreeShipping > 0 ? (

                <p>
                  Add{" "}
                  <strong>
                    ₹
                    {remainingForFreeShipping.toLocaleString(
                      "en-IN"
                    )}
                  </strong>{" "}
                  more for free shipping
                </p>

              ) : (

                <p className="free-shipping-message">
                  🎉 You unlocked{" "}
                  <strong>free shipping!</strong>
                </p>

              )}

              <div className="shipping-progress">
                <span
                  style={{
                    width: `${shippingProgress}%`,
                  }}
                />
              </div>

            </div>


            {/* ==========================================
                PRODUCTS
            ========================================== */}

            <div className="cart-items">

              {cartItems.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  {/* ==========================================
                      PRODUCT IMAGE
                  ========================================== */}

                  <div className="cart-item-image">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    ) : (

                      <div className="cart-image-placeholder">
                        <ShoppingBag size={28} />
                      </div>

                    )}

                  </div>


                  {/* ==========================================
                      PRODUCT DETAILS
                  ========================================== */}

                  <div className="cart-item-details">

                    <div className="cart-item-top">

                      <div>

                        <h3>
                          {item.name}
                        </h3>

                        {item.variant && (
                          <p className="cart-variant">
                            {item.variant}
                          </p>
                        )}

                      </div>


                      {/* DELETE */}

                      <button
                        className="cart-delete-btn"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2
                          size={18}
                          strokeWidth={1.8}
                        />
                      </button>

                    </div>


                    {/* ==========================================
                        QUANTITY + PRICE
                    ========================================== */}

                    <div className="cart-item-bottom">

                      {/* Quantity */}

                     <div
  className="quantity-control"
  aria-label={`Quantity ${item.quantity}`}
>
  <button
    className="quantity-btn"
    onClick={() =>
      decreaseQuantity(item.id)
    }
    aria-label="Decrease quantity"
  >
    <Minus
      size={16}
      strokeWidth={2.5}
    />
  </button>

  <span className="quantity-number">
    {item.quantity}
  </span>

  <button
    className="quantity-btn"
    onClick={() =>
      increaseQuantity(item.id)
    }
    aria-label="Increase quantity"
  >
    <Plus
      size={16}
      strokeWidth={2.5}
    />
  </button>
</div>


                      {/* Item Price */}

                      <strong className="cart-item-price">

                        ₹
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toLocaleString("en-IN")}

                      </strong>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            {/* ==========================================
                FOOTER
            ========================================== */}

            <div className="cart-footer">

              {/* Subtotal */}

              <div className="cart-subtotal">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {cartSubtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {/* Checkout */}

              <button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Checkout
              </button>


              {/* Continue Shopping */}

              <button
                className="continue-shopping-btn"
                onClick={handleContinueShopping}
              >
                Continue shopping
              </button>

            </div>

          </>

        )}

      </aside>

    </div>
  );
};

export default CartDrawer;