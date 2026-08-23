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

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div className="cart-overlay">
      {/* Background */}
      <div
        className="cart-backdrop"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="cart-drawer">

        {/* Header */}
        <div className="cart-header">
          <h2>Your Cart</h2>

          <button
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Content */}
        {cartItems.length === 0 ? (
          <div className="empty-cart">

            <div className="empty-cart-icon">
              <ShoppingBag size={42} strokeWidth={1.5} />
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
            {/* Shipping message */}
            <div className="cart-shipping">
              <p>
                Add <strong>₹841</strong> more for free shipping
              </p>

              <div className="shipping-progress">
                <span />
              </div>
            </div>

            {/* Products */}
            <div className="cart-items">

              {cartItems.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >

                  {/* Image */}
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

                  {/* Product information */}
                  <div className="cart-item-details">

                    <div className="cart-item-top">

                      <div>
                        <h3>{item.name}</h3>

                        {item.variant && (
                          <p className="cart-variant">
                            {item.variant}
                          </p>
                        )}
                      </div>

                      <button
                        className="cart-delete-btn"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                    {/* Quantity */}
                    <div className="cart-item-bottom">

                      <div className="quantity-control">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>

                      </div>

                      <strong className="cart-item-price">
                        ₹
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* Bottom */}
            <div className="cart-footer">

              <div className="cart-subtotal">
                <span>Subtotal</span>

                <strong>
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Checkout
              </button>

              <button
                className="continue-shopping-btn"
                onClick={closeCart}
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