import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Truck,
  CreditCard,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import "./Checkout.css";

// ==========================================
// API URL
// ==========================================

const API_URL = "https://honeyterra.onrender.com";

// ==========================================
// RAZORPAY SCRIPT
// ==========================================

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Already loaded
    if (window.Razorpay) {
      console.log("Razorpay already loaded");
      resolve(true);
      return;
    }

    console.log("Loading Razorpay script...");

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      console.log(
        "Razorpay script loaded successfully"
      );

      resolve(true);
    };

    script.onerror = () => {
      console.error(
        "Razorpay script failed to load"
      );

      resolve(false);
    };

    document.body.appendChild(script);
  });
};

// ==========================================
// CHECKOUT COMPONENT
// ==========================================

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart,
    cartItems,
    cartSubtotal,
  } = useCart();

  // ==========================================
  // CART
  // ==========================================

  const items =
    cart?.items || cartItems || [];

  const subtotal = Number(
    cartSubtotal ??
      cart?.totalAmount ??
      0
  );

  // ==========================================
  // FORM
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
    useState("razorpay");

  // ==========================================
  // ERRORS
  // ==========================================

  const [errors, setErrors] = useState({});

  // ==========================================
  // SUBMITTING
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
    Number(subtotal) +
    Number(shipping);

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

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  // ==========================================
  // VALIDATE FORM
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
        formData.email.trim()
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
        formData.mobile.trim()
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
        formData.pincode.trim()
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
  // RAZORPAY PAYMENT
  // ==========================================

  const startRazorpayPayment = async () => {
    console.log(
      "================================="
    );

    console.log(
      "RAZORPAY PAYMENT STARTED"
    );

    console.log(
      "================================="
    );

    // ==========================================
    // VALIDATE
    // ==========================================

    if (!validateForm()) {
      console.log(
        "Checkout validation failed"
      );

      return;
    }

    // ==========================================
    // TOKEN
    // ==========================================

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login before making payment."
      );

      navigate("/login");

      return;
    }

    // ==========================================
    // CART CHECK
    // ==========================================

    if (
      !items ||
      items.length === 0
    ) {
      alert(
        "Your cart is empty."
      );

      navigate("/shop");

      return;
    }

    try {
      setIsSubmitting(true);

      // ==========================================
      // STEP 1
      // LOAD RAZORPAY
      // ==========================================

      console.log(
        "Step 1: Loading Razorpay..."
      );

      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        alert(
          "Unable to load Razorpay. Please check your internet connection."
        );

        setIsSubmitting(false);

        return;
      }

      // ==========================================
      // CHECK WINDOW.RAZORPAY
      // ==========================================

      if (!window.Razorpay) {
        console.error(
          "window.Razorpay is undefined"
        );

        alert(
          "Razorpay could not be initialized. Please refresh the page and try again."
        );

        setIsSubmitting(false);

        return;
      }

      console.log(
        "Step 2: Razorpay SDK ready"
      );

      // ==========================================
      // STEP 2
      // CREATE ORDER ON BACKEND
      // ==========================================

      console.log(
        "Step 3: Creating Razorpay order..."
      );

      console.log(
        "API:",
        `${API_URL}/api/payment/create-order`
      );

      const orderResponse =
        await axios.post(
          `${API_URL}/api/payment/create-order`,
          {
            fullName:
              formData.fullName.trim(),

            phone:
              formData.mobile.trim(),

            address:
              formData.address.trim(),

            city:
              formData.city.trim(),

            state:
              formData.state.trim(),

            pincode:
              formData.pincode.trim(),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      console.log(
        "Backend Razorpay response:",
        orderResponse.data
      );

      // ==========================================
      // CHECK RESPONSE
      // ==========================================

      if (
        !orderResponse.data ||
        !orderResponse.data.success
      ) {
        throw new Error(
          orderResponse.data?.message ||
            "Unable to create Razorpay order."
        );
      }

      const {
        key,
        amount,
        currency,
        razorpayOrderId,
      } = orderResponse.data;

      // ==========================================
      // IMPORTANT CHECKS
      // ==========================================

      console.log(
        "Razorpay Key:",
        key
      );

      console.log(
        "Razorpay Amount:",
        amount
      );

      console.log(
        "Razorpay Currency:",
        currency
      );

      console.log(
        "Razorpay Order ID:",
        razorpayOrderId
      );

      if (!key) {
        throw new Error(
          "Razorpay Key ID was not returned by the server."
        );
      }

      if (!amount) {
        throw new Error(
          "Razorpay amount was not returned by the server."
        );
      }

      if (!razorpayOrderId) {
        throw new Error(
          "Razorpay Order ID was not returned by the server."
        );
      }

      // ==========================================
      // STEP 3
      // RAZORPAY OPTIONS
      // ==========================================

      const options = {
        key: key,

        amount: Number(amount),

        currency:
          currency || "INR",

        name: "HoneyTerra",

        description:
          "HoneyTerra Order",

        order_id:
          razorpayOrderId,

        prefill: {
          name:
            formData.fullName.trim(),

          email:
            formData.email.trim(),

          contact:
            `+91${formData.mobile.trim()}`,
        },

        notes: {
          address:
            formData.address.trim(),

          city:
            formData.city.trim(),

          state:
            formData.state.trim(),

          pincode:
            formData.pincode.trim(),
        },

        theme: {
          color: "#d99a2b",
        },

        modal: {
          escape: true,

          backdropclose: false,

          ondismiss: () => {
            console.log(
              "Razorpay checkout closed."
            );

            setIsSubmitting(false);
          },
        },

        // ==========================================
        // SUCCESS
        // ==========================================

        handler: async (
          paymentResponse
        ) => {
          console.log(
            "================================="
          );

          console.log(
            "RAZORPAY PAYMENT SUCCESS"
          );

          console.log(
            paymentResponse
          );

          console.log(
            "================================="
          );

          try {
            // ==========================================
            // CHECK PAYMENT RESPONSE
            // ==========================================

            if (
              !paymentResponse
                .razorpay_payment_id ||
              !paymentResponse
                .razorpay_order_id ||
              !paymentResponse
                .razorpay_signature
            ) {
              throw new Error(
                "Incomplete Razorpay payment response."
              );
            }

            // ==========================================
            // VERIFY PAYMENT
            // ==========================================

            console.log(
              "Verifying payment with backend..."
            );

            const verifyResponse =
              await axios.post(
                `${API_URL}/api/payment/verify`,
                {
                  razorpayOrderId:
                    paymentResponse.razorpay_order_id,

                  razorpayPaymentId:
                    paymentResponse.razorpay_payment_id,

                  razorpaySignature:
                    paymentResponse.razorpay_signature,
                },
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,

                    "Content-Type":
                      "application/json",
                  },
                }
              );

            console.log(
              "Verification response:",
              verifyResponse.data
            );

            if (
              verifyResponse.data.success
            ) {
              alert(
                "Payment successful! Your order has been placed."
              );

              navigate("/");
            } else {
              alert(
                verifyResponse.data.message ||
                  "Payment verification failed."
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            console.error(
              "Server response:",
              error.response?.data
            );

            if (
              error.response?.status ===
              401
            ) {
              alert(
                "Your session has expired. Please login again."
              );

              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              navigate("/login");

              return;
            }

            alert(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed. Please contact support."
            );
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      // ==========================================
      // STEP 4
      // CREATE RAZORPAY INSTANCE
      // ==========================================

      console.log(
        "Step 4: Creating Razorpay instance..."
      );

      const razorpay =
        new window.Razorpay(
          options
        );

      // ==========================================
      // PAYMENT FAILED
      // ==========================================

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "================================="
          );

          console.error(
            "RAZORPAY PAYMENT FAILED"
          );

          console.error(
            response
          );

          console.error(
            response.error
          );

          console.error(
            "================================="
          );

          alert(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setIsSubmitting(false);
        }
      );

      // ==========================================
      // STEP 5
      // OPEN RAZORPAY
      // ==========================================

      console.log(
        "Step 5: Opening Razorpay Checkout..."
      );

      razorpay.open();

      console.log(
        "Razorpay open() called."
      );
    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "RAZORPAY START ERROR"
      );

      console.error(
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      console.error(
        "================================="
      );

      if (
        error.response?.status ===
        401
      ) {
        alert(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;
      }

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to start Razorpay payment."
      );
    } finally {
      // Do NOT leave button disabled
      // if an error happens before popup.
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // COD ORDER
  // ==========================================

  const handleCODOrder = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login before placing an order."
      );

      navigate("/login");

      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await axios.post(
          `${API_URL}/api/orders`,
          {
            fullName:
              formData.fullName.trim(),

            phone:
              formData.mobile.trim(),

            address:
              formData.address.trim(),

            city:
              formData.city.trim(),

            state:
              formData.state.trim(),

            pincode:
              formData.pincode.trim(),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      console.log(
        "COD order response:",
        response.data
      );

      if (response.data.success) {
        alert(
          "Order placed successfully!"
        );

        navigate("/");
      } else {
        alert(
          response.data.message ||
            "Failed to place order."
        );
      }
    } catch (error) {
      console.error(
        "COD Order Error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        alert(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // MAIN SUBMIT
  // ==========================================

  const handlePlaceOrder = async (
    event
  ) => {
    event.preventDefault();

    console.log(
      "================================="
    );

    console.log(
      "CHECKOUT SUBMIT"
    );

    console.log(
      "Selected payment:",
      paymentMethod
    );

    console.log(
      "================================="
    );

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!validateForm()) {
      console.log(
        "Validation failed."
      );

      return;
    }

    // ==========================================
    // LOGIN
    // ==========================================

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login before placing an order."
      );

      navigate("/login");

      return;
    }

    // ==========================================
    // RAZORPAY
    // ==========================================

    if (
      paymentMethod === "razorpay"
    ) {
      console.log(
        "Calling Razorpay..."
      );

      await startRazorpayPayment();

      return;
    }

    // ==========================================
    // COD
    // ==========================================

    await handleCODOrder();
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (
    !items ||
    items.length === 0
  ) {
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

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <section className="checkout-form-section">

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
              FORM
          ========================================== */}

          <form
            id="checkout-form"
            onSubmit={
              handlePlaceOrder
            }
            className="checkout-form"
          >

            {/* ==========================================
                DELIVERY
            ========================================== */}

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

              {/* FULL NAME */}

              <div className="checkout-field">

                <label htmlFor="fullName">
                  Full name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
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

              {/* EMAIL + MOBILE */}

              <div className="checkout-two-column">

                <div className="checkout-field">

                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
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
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleChange
                    }
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

              {/* ADDRESS */}

              <div className="checkout-field">

                <label htmlFor="address">
                  Address
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
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

              {/* LANDMARK */}

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
                  value={
                    formData.landmark
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Landmark"
                  className="checkout-input"
                />

              </div>

              {/* CITY + STATE */}

              <div className="checkout-two-column">

                <div className="checkout-field">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
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
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
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

              {/* PINCODE */}

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
                  value={
                    formData.pincode
                  }
                  onChange={
                    handleChange
                  }
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

            {/* ==========================================
                PAYMENT
            ========================================== */}

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
                disabled
                aria-disabled="true"
                className="payment-option payment-option-disabled"
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
                  <CreditCard size={21} />
                </div>

                <div className="payment-content">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Cash on Delivery is currently unavailable.
                  </span>

                </div>

                

              </button>

              {/* RAZORPAY */}

              <button
                type="button"
                className={
                  paymentMethod ===
                  "razorpay"
                    ? "payment-option payment-option-active"
                    : "payment-option"
                }
                onClick={() => {
                  console.log(
                    "Razorpay selected"
                  );

                  setPaymentMethod(
                    "razorpay"
                  );
                }}
              >

                <div className="payment-radio">

                  <div
                    className={
                      paymentMethod ===
                      "razorpay"
                        ? "payment-radio-dot"
                        : ""
                    }
                  />

                </div>

                <div className="payment-icon">
                  <CreditCard size={21} />
                </div>

                <div className="payment-content">

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    Pay securely using Razorpay
                  </span>

                </div>

                {paymentMethod ===
                  "razorpay" && (
                  <CheckCircle2
                    className="payment-check"
                    size={21}
                  />
                )}

              </button>

            </section>

            {/* MOBILE BUTTON */}

            <button
              type="submit"
              className="mobile-place-order"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? paymentMethod ===
                  "razorpay"
                  ? "Opening payment..."
                  : "Placing order..."
                : paymentMethod ===
                  "razorpay"
                ? "Pay securely"
                : "Place order"}
            </button>

          </form>

        </section>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <aside className="order-summary">

          {/* HEADER */}

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
                (count, item) =>
                  count +
                  Number(
                    item.quantity || 0
                  ),
                0
              )}{" "}
              items

            </span>

          </div>

          {/* PRODUCTS */}

          <div className="summary-products">

            {items.map(
              (item, index) => {

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
                    key={
                      product._id ||
                      item._id ||
                      index
                    }
                  >

                    <div className="summary-product-image">

                      {image ? (
                        <img
                          src={image}
                          alt={
                            product.name
                          }
                        />
                      ) : (
                        <ShoppingBag
                          size={25}
                        />
                      )}

                      <span className="summary-product-quantity">
                        {
                          item.quantity
                        }
                      </span>

                    </div>

                    <div className="summary-product-info">

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      {product.category && (
                        <p>
                          {
                            product.category
                          }
                        </p>
                      )}

                      <span>
                        ₹
                        {Number(
                          item.price
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        ×{" "}
                        {
                          item.quantity
                        }
                      </span>

                    </div>

                    <strong>
                      ₹
                      {(
                        Number(
                          item.price
                        ) *
                        Number(
                          item.quantity
                        )
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

          {/* PRICING */}

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

          {/* TOTAL */}

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
              DESKTOP PAYMENT BUTTON
          ========================================== */}

          <button
            type="submit"
            form="checkout-form"
            className="summary-place-order"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? paymentMethod ===
                "razorpay"
                ? "Opening payment..."
                : "Placing order..."
              : paymentMethod ===
                "razorpay"
              ? "Pay securely"
              : "Place order"}
          </button>

          {/* TRUST */}

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