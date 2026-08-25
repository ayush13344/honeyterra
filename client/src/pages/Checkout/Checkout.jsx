import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Truck,
  CreditCard,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart,
    cartItems,
    cartSubtotal,
  } = useCart();

  // ==========================================
  // USE CART DATA
  // ==========================================

  const items =
    cart?.items || cartItems || [];

  const subtotal =
    Number(
      cartSubtotal ??
        cart?.totalAmount ??
        0
    );

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  // ==========================================
  // FORM ERRORS
  // ==========================================

  const [errors, setErrors] = useState({});

  // ==========================================
  // SUBMIT STATE
  // ==========================================

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // ==========================================
  // SHIPPING
  // ==========================================

  const FREE_SHIPPING_LIMIT = 999;

  const shipping =
    subtotal >= FREE_SHIPPING_LIMIT
      ? 0
      : 49;

  const total =
    Number(subtotal) + Number(shipping);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error when user starts typing
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile =
        "Please enter your mobile number.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.mobile
      )
    ) {
      newErrors.mobile =
        "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Please enter your delivery address.";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "Please enter your city.";
    }

    if (!formData.state.trim()) {
      newErrors.state =
        "Please enter your state.";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode =
        "Please enter your pincode.";
    } else if (
      !/^\d{6}$/.test(
        formData.pincode
      )
    ) {
      newErrors.pincode =
        "Please enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    /*
      ==========================================
      BACKEND ORDER API WILL GO HERE
      ==========================================

      Later this will become:

      await axios.post("/api/orders", {
        shippingAddress: formData,
        paymentMethod,
        items,
      });

    */

    // Temporary frontend behavior
    setTimeout(() => {
      setIsSubmitting(false);

      alert(
        "Order placed successfully!"
      );

      navigate("/");
    }, 1000);
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!items || items.length === 0) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <div className="checkout-empty-icon">
            <ShoppingBag size={40} />
          </div>

          <h1>
            Your cart is empty
          </h1>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <button
            onClick={() =>
              navigate("/shop")
            }
            className="checkout-empty-button"
          >
            Continue Shopping
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <section className="checkout-form-section">

          {/* ==========================================
              PAGE HEADING
          ========================================== */}

          <div className="checkout-page-heading">

            <span className="checkout-eyebrow">
              HONEYTERRA
            </span>

            <h1>
              Checkout
            </h1>

            <p>
              Complete your details and
              choose your preferred payment
              method.
            </p>

          </div>

          {/* ==========================================
              CONTACT & DELIVERY
          ========================================== */}

          <form
            id="checkout-form"
            onSubmit={handlePlaceOrder}
            className="checkout-form"
          >

            <section className="checkout-form-block">

              <div className="checkout-section-heading">

                <div className="checkout-section-number">
                  01
                </div>

                <div>
                  <h2>
                    Contact & delivery
                  </h2>

                  <p>
                    Where should we deliver
                    your order?
                  </p>
                </div>

              </div>

              {/* ==========================================
                  FULL NAME
              ========================================== */}

              <div className="checkout-field">

                <label htmlFor="fullName">
                  Full name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={
                    errors.fullName
                      ? "checkout-input checkout-input-error"
                      : "checkout-input"
                  }
                />

                {errors.fullName && (
                  <span className="checkout-error">
                    {errors.fullName}
                  </span>
                )}

              </div>

              {/* ==========================================
                  EMAIL + MOBILE
              ========================================== */}

              <div className="checkout-two-column">

                <div className="checkout-field">

                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={
                      errors.email
                        ? "checkout-input checkout-input-error"
                        : "checkout-input"
                    }
                  />

                  {errors.email && (
                    <span className="checkout-error">
                      {errors.email}
                    </span>
                  )}

                </div>

                <div className="checkout-field">

                  <label htmlFor="mobile">
                    Mobile number
                  </label>

                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    maxLength="10"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className={
                      errors.mobile
                        ? "checkout-input checkout-input-error"
                        : "checkout-input"
                    }
                  />

                  {errors.mobile && (
                    <span className="checkout-error">
                      {errors.mobile}
                    </span>
                  )}

                </div>

              </div>

              {/* ==========================================
                  ADDRESS
              ========================================== */}

              <div className="checkout-field">

                <label htmlFor="address">
                  Address
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House no., street, area"
                  className={
                    errors.address
                      ? "checkout-input checkout-input-error"
                      : "checkout-input"
                  }
                />

                {errors.address && (
                  <span className="checkout-error">
                    {errors.address}
                  </span>
                )}

              </div>

              {/* ==========================================
                  LANDMARK
              ========================================== */}

              <div className="checkout-field">

                <label htmlFor="landmark">
                  Apartment, landmark
                  <span>
                    {" "}
                    (optional)
                  </span>
                </label>

                <input
                  id="landmark"
                  name="landmark"
                  type="text"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Landmark"
                  className="checkout-input"
                />

              </div>

              {/* ==========================================
                  CITY + STATE
              ========================================== */}

              <div className="checkout-two-column">

                <div className="checkout-field">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className={
                      errors.city
                        ? "checkout-input checkout-input-error"
                        : "checkout-input"
                    }
                  />

                  {errors.city && (
                    <span className="checkout-error">
                      {errors.city}
                    </span>
                  )}

                </div>

                <div className="checkout-field">

                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className={
                      errors.state
                        ? "checkout-input checkout-input-error"
                        : "checkout-input"
                    }
                  />

                  {errors.state && (
                    <span className="checkout-error">
                      {errors.state}
                    </span>
                  )}

                </div>

              </div>

              {/* ==========================================
                  PINCODE
              ========================================== */}

              <div className="checkout-field checkout-pincode-field">

                <label htmlFor="pincode">
                  Pincode
                </label>

                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  className={
                    errors.pincode
                      ? "checkout-input checkout-input-error"
                      : "checkout-input"
                  }
                />

                {errors.pincode && (
                  <span className="checkout-error">
                    {errors.pincode}
                  </span>
                )}

              </div>

            </section>

            {/* ==================================================
                PAYMENT
            ================================================== */}

            <section className="checkout-form-block">

              <div className="checkout-section-heading">

                <div className="checkout-section-number">
                  02
                </div>

                <div>
                  <h2>
                    Payment
                  </h2>

                  <p>
                    Choose how you'd like
                    to pay.
                  </p>
                </div>

              </div>

              {/* COD */}

              <button
                type="button"
                className={
                  paymentMethod === "cod"
                    ? "payment-option payment-option-active"
                    : "payment-option"
                }
                onClick={() =>
                  setPaymentMethod("cod")
                }
              >

                <div className="payment-radio">

                  <div
                    className={
                      paymentMethod === "cod"
                        ? "payment-radio-dot"
                        : ""
                    }
                  />

                </div>

                <div className="payment-icon">

                  <CreditCard
                    size={21}
                  />

                </div>

                <div className="payment-content">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay in cash when your
                    order arrives.
                  </span>

                </div>

                {paymentMethod === "cod" && (
                  <CheckCircle2
                    className="payment-check"
                    size={21}
                  />
                )}

              </button>

              {/* ONLINE PAYMENT PLACEHOLDER */}

              <button
                type="button"
                className="payment-option payment-option-disabled"
                disabled
              >

                <div className="payment-radio" />

                <div className="payment-icon">

                  <CreditCard
                    size={21}
                  />

                </div>

                <div className="payment-content">

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    Coming soon
                  </span>

                </div>

              </button>

            </section>

            {/* ==========================================
                MOBILE PLACE ORDER
            ========================================== */}

            <button
              type="submit"
              className="mobile-place-order"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Placing order..."
                : "Place order"}
            </button>

          </form>

        </section>

        {/* ==================================================
            RIGHT SIDE — ORDER SUMMARY
        ================================================== */}

        <aside className="order-summary">

          {/* ==========================================
              SUMMARY HEADER
          ========================================== */}

          <div className="order-summary-header">

            <div>

              <span className="checkout-eyebrow">
                YOUR ORDER
              </span>

              <h2>
                Order summary
              </h2>

            </div>

            <span className="summary-item-count">

              {items.reduce(
                (total, item) =>
                  total +
                  Number(
                    item.quantity || 0
                  ),
                0
              )}{" "}
              items

            </span>

          </div>

          {/* ==========================================
              PRODUCTS
          ========================================== */}

          <div className="summary-products">

            {items.map((item) => {

              const product =
                item.product;

              if (!product) {
                return null;
              }

              const image =
                product.images?.[0];

              return (
                <div
                  className="summary-product"
                  key={product._id}
                >

                  {/* IMAGE */}

                  <div className="summary-product-image">

                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                      />
                    ) : (
                      <ShoppingBag
                        size={25}
                      />
                    )}

                    <span className="summary-product-quantity">
                      {item.quantity}
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="summary-product-info">

                    <h3>
                      {product.name}
                    </h3>

                    {product.category && (
                      <p>
                        {product.category}
                      </p>
                    )}

                    <span>
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {item.quantity}
                    </span>

                  </div>

                  {/* TOTAL */}

                  <strong>
                    ₹
                    {(
                      Number(item.price) *
                      Number(
                        item.quantity
                      )
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              );
            })}

          </div>

          {/* ==========================================
              PRICE DETAILS
          ========================================== */}

          <div className="summary-pricing">

            <div className="summary-price-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="summary-price-row">

              <span>
                Shipping
              </span>

              <strong>
                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}
              </strong>

            </div>

          </div>

          {/* ==========================================
              TOTAL
          ========================================== */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* ==========================================
              PLACE ORDER
          ========================================== */}

          <button
            type="submit"
            form="checkout-form"
            className="summary-place-order"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Placing order..."
              : "Place order"}
          </button>

          {/* ==========================================
              TRUST MESSAGE
          ========================================== */}

          <div className="summary-trust">

            <Truck size={17} />

            <span>
              {shipping === 0
                ? "Free shipping on this order"
                : `Free shipping over ₹${FREE_SHIPPING_LIMIT} · 7-day returns`}
            </span>

          </div>

        </aside>

      </div>

    </main>
  );
};

export default Checkout;