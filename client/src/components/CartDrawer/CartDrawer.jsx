import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

import "./CartDrawer.css";

function CartDrawer() {
  const {
    cart,
    cartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  if (!cartOpen) {
    return null;
  }

  const items = cart?.items || [];

  return (
    <div className="cart-overlay">

      {/* ==========================================
          BACKDROP
      ========================================== */}

      <div
        className="cart-backdrop"
        onClick={closeCart}
      ></div>

      {/* ==========================================
          DRAWER
      ========================================== */}

      <aside className="cart-drawer">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="cart-drawer-header">
          <div>
            <span className="cart-eyebrow">
              HONEYTERRA
            </span>

            <h2>Your Cart</h2>
          </div>

          <button
            className="cart-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* ==========================================
            FREE SHIPPING
        ========================================== */}

        {items.length > 0 && (
          <div className="cart-shipping">

            <div className="cart-shipping-text">
              {cart.totalAmount >= 1000 ? (
                <span>
                  🎉 You unlocked free shipping!
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong>
                    ₹{1000 - cart.totalAmount}
                  </strong>{" "}
                  more for free shipping
                </span>
              )}
            </div>

            <div className="cart-progress">
              <div
                className="cart-progress-bar"
                style={{
                  width: `${Math.min(
                    (cart.totalAmount / 1000) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>

          </div>
        )}

        {/* ==========================================
            CART CONTENT
        ========================================== */}

        <div className="cart-drawer-content">

          {items.length === 0 ? (

            <div className="cart-empty">

              <div className="cart-empty-icon">
                <ShoppingBag size={28} />
              </div>

              <h3>
                Your cart is empty
              </h3>

              <p>
                Looks like you haven't added
                anything yet.
              </p>

              <button
                onClick={closeCart}
                className="cart-shop-button"
              >
                Continue Shopping
              </button>

            </div>

          ) : (

            <div className="cart-items">

              {items.map((item) =>  {

                const product = item.product;

                if (!product) {
                  return null;
                }

                const image =
                  product.images?.[0];

                return (
                  <div
                    className="cart-item"
                    key={product._id}
                  >

                    {/* IMAGE */}

                    <div className="cart-item-image">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                        />
                      ) : (
                        <div>
                          No Image
                        </div>
                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="cart-item-details">

                      <div className="cart-item-top">

                        <div>

                          <h3>
                            {product.name}
                          </h3>

                          {product.category && (
                            <span>
                              {product.category}
                            </span>
                          )}

                        </div>

                        <button
                          className="cart-delete"
                          onClick={() =>
                            removeFromCart(
                              product._id
                            )
                          }
                          aria-label="Remove product"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                      {/* PRICE */}

                      <div className="cart-item-price">
                        ₹{item.price}
                      </div>

                      {/* QUANTITY */}

                      <div className="cart-item-bottom">

                        <div className="cart-quantity">

                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={
                              item.quantity <= 1
                            }
                          >
                            <Minus size={14} />
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >=
                              product.stock
                            }
                          >
                            <Plus size={14} />
                          </button>

                        </div>

                        <strong>
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        {items.length > 0 && (

          <div className="cart-drawer-footer">

            <div className="cart-subtotal">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {cart.totalAmount?.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <button
              className="cart-checkout-button"
              onClick={() => {
                closeCart();
                navigate("/checkout");
              }}
            >
              Checkout
            </button>

            <button
              className="cart-continue"
              onClick={closeCart}
            >
              Continue shopping
            </button>

          </div>

        )}

      </aside>

    </div>
  );
}

export default CartDrawer;