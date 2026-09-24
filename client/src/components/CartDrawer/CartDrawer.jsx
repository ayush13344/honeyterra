import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
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
  const totalAmount = Number(cart?.totalAmount || 0);

  const handleRemove = (item) => {
    // Prefer product ID because CartContext uses product ID
    // to identify products in the cart.
    const productId =
      item?.product?._id ||
      item?.product?.id ||
      item?.product;

    if (!productId) {
      console.error("Unable to remove cart item:", item);
      return;
    }

    removeFromCart(productId);
  };

  const handleDecrease = (item) => {
    const productId =
      item?.product?._id ||
      item?.product?.id ||
      item?.product;

    if (!productId) return;

    if (item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleIncrease = (item) => {
    const product = item?.product;

    const productId =
      product?._id ||
      product?.id ||
      product;

    if (!productId) return;

    const stock = Number(product?.stock ?? 999999);

    if (item.quantity < stock) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div className="cart-overlay">
      {/* BACKDROP */}
      <div
        className="cart-backdrop"
        onClick={closeCart}
      />

      {/* DRAWER */}
      <aside className="cart-drawer">
        {/* HEADER */}
        <div className="cart-drawer-header">
          <div>
            <span className="cart-eyebrow">
              HONEYTERRA
            </span>

            <h2>Your Cart</h2>
          </div>

          <button
            type="button"
            className="cart-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* FREE SHIPPING */}
        {items.length > 0 && (
          <div className="cart-shipping">
            <div className="cart-shipping-text">
              {totalAmount >= 1000 ? (
                <span>
                  🎉 You unlocked free shipping!
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong>
                    ₹{(1000 - totalAmount).toLocaleString("en-IN")}
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
                    (totalAmount / 1000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* CART CONTENT */}
        <div className="cart-drawer-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag size={28} />
              </div>

              <h3>Your cart is empty</h3>

              <p>
                Looks like you haven't added
                anything yet.
              </p>

              <button
                type="button"
                onClick={closeCart}
                className="cart-shop-button"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item, index) => {
                const product = item?.product;

                if (!product) {
                  return null;
                }

                const productId =
                  product._id || product.id;

                const image =
                  Array.isArray(product.images)
                    ? product.images[0]
                    : product.images;

                const itemPrice = Number(
                  item.price || product.price || 0
                );

                const quantity = Number(
                  item.quantity || 1
                );

                const stock = Number(
                  product.stock ?? 999999
                );

                return (
                  <div
                    className="cart-item"
                    key={`${productId}-${index}`}
                  >
                    {/* IMAGE */}
                    <div className="cart-item-image">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name || "Product"}
                        />
                      ) : (
                        <div>No Image</div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <div>
                          <h3>{product.name}</h3>

                          {product.category && (
                            <span>
                              {product.category}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="cart-delete"
                          onClick={() =>
                            handleRemove(item)
                          }
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      {/* PRICE */}
                      <div className="cart-item-price">
                        ₹{itemPrice.toLocaleString("en-IN")}
                      </div>

                      {/* QUANTITY */}
                      <div className="cart-item-bottom">
                        <div className="cart-quantity">
                          <button
                            type="button"
                            onClick={() =>
                              handleDecrease(item)
                            }
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(item)
                            }
                            disabled={
                              quantity >= stock
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <strong>
                          ₹
                          {(
                            itemPrice * quantity
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

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>

              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              type="button"
              className="cart-checkout-button"
              onClick={handleCheckout}
            >
              Checkout
            </button>

            <button
              type="button"
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