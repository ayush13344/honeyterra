import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  MapPin,
  CreditCard,
  UserRound,
  CalendarDays,
  RefreshCw,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import "./TrackOrder.css";

const API_URL = "http://localhost:3000";

function TrackOrder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // ==========================================
  // FETCH ORDER
  // ==========================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        setError("Order ID is missing");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/orders/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Track Order API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch order"
        );
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Fetch Track Order Error:", err);

      setError(
        err.message || "Unable to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // ==========================================
  // CANCEL ORDER
  // ==========================================

  const handleCancelOrder = async () => {
    if (!order?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/orders/${order._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel order"
        );
      }

      setOrder(data.order);

      alert("Order cancelled successfully");
    } catch (err) {
      console.error("Cancel Order Error:", err);
      alert(
        err.message || "Unable to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // FORMAT DATE + TIME
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // STATUS LABEL
  // ==========================================

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Order Placed",
      confirmed: "Order Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Order Cancelled",
    };

    return (
      statusMap[status?.toLowerCase()] ||
      "Order Placed"
    );
  };

  // ==========================================
  // STATUS DESCRIPTION
  // ==========================================

  const getStatusDescription = (status) => {
    const descriptions = {
      pending:
        "Your order has been received and is waiting for confirmation.",
      confirmed:
        "Your order has been confirmed and will be prepared soon.",
      processing:
        "Your order is being prepared and packed.",
      shipped:
        "Your order has been shipped and is on its way to you.",
      delivered:
        "Your order has been successfully delivered.",
      cancelled:
        "This order has been cancelled.",
    };

    return (
      descriptions[status?.toLowerCase()] ||
      "Your order is being processed."
    );
  };

  // ==========================================
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle2 size={22} />;

      case "processing":
        return <Package size={22} />;

      case "shipped":
        return <Truck size={22} />;

      case "delivered":
        return <CheckCircle2 size={22} />;

      case "cancelled":
        return <XCircle size={22} />;

      case "pending":
      default:
        return <Clock3 size={22} />;
    }
  };

  // ==========================================
  // TRACKING STEPS
  // ==========================================

  const trackingSteps = [
    {
      key: "pending",
      title: "Order Placed",
      description:
        "Your order has been successfully placed.",
      icon: <ShoppingBag size={18} />,
    },
    {
      key: "confirmed",
      title: "Order Confirmed",
      description:
        "Your order has been confirmed by HoneyTerra.",
      icon: <CheckCircle2 size={18} />,
    },
    {
      key: "processing",
      title: "Processing",
      description:
        "Your products are being prepared and packed.",
      icon: <Package size={18} />,
    },
    {
      key: "shipped",
      title: "Shipped",
      description:
        "Your package is on its way to you.",
      icon: <Truck size={18} />,
    },
    {
      key: "delivered",
      title: "Delivered",
      description:
        "Your order has reached its destination.",
      icon: <CheckCircle2 size={18} />,
    },
  ];

  // ==========================================
  // STATUS ORDER
  // ==========================================

  const statusOrder = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const getCurrentStatusIndex = () => {
    if (!order?.orderStatus) return 0;

    return statusOrder.indexOf(
      order.orderStatus.toLowerCase()
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="track-order-page">
        <div className="track-order-loading">
          <div className="track-loader" />

          <h3>Loading your order...</h3>

          <p>
            Please wait while we fetch your order
            details.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !order) {
    return (
      <div className="track-order-page">
        <div className="track-order-container">
          <div className="track-order-error">
            <div className="track-error-icon">
              <XCircle size={34} />
            </div>

            <h2>Order Not Found</h2>

            <p>
              {error ||
                "We couldn't find this order. It may no longer exist."}
            </p>

            <div className="track-error-actions">
              <button
                className="track-secondary-btn"
                onClick={() =>
                  navigate("/my-orders")
                }
              >
                <ArrowLeft size={16} />
                My Orders
              </button>

              <button
                className="track-primary-btn"
                onClick={fetchOrder}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CURRENT STATUS
  // ==========================================

  const currentStatus =
    order.orderStatus?.toLowerCase() ||
    "pending";

  const currentStatusIndex =
    getCurrentStatusIndex();

  const isCancelled =
    currentStatus === "cancelled";

  const canCancel =
    !isCancelled &&
    currentStatus !== "shipped" &&
    currentStatus !== "delivered";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="track-order-page">
      <div className="track-order-container">

        {/* ======================================
            BACK BUTTON
        ====================================== */}

        <button
          className="track-back-btn"
          onClick={() =>
            navigate("/my-orders")
          }
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </button>

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="track-order-header">
          <div>
            <span className="track-order-eyebrow">
              ORDER TRACKING
            </span>

            <h1>Track Your Order</h1>

            <p>
              Follow the progress of your
              HoneyTerra order.
            </p>
          </div>

          <div className="track-order-number">
            <span>ORDER NUMBER</span>

            <strong>
              #
              {order._id
                ?.slice(-8)
                .toUpperCase()}
            </strong>
          </div>
        </div>

        {/* ======================================
            CURRENT STATUS
        ====================================== */}

        {!isCancelled && (
          <div className="current-order-status">
            <div className="current-status-icon">
              {getStatusIcon(currentStatus)}
            </div>

            <div className="current-status-content">
              <span>CURRENT STATUS</span>

              <h2>
                {getStatusLabel(
                  currentStatus
                )}
              </h2>

              <p>
                {getStatusDescription(
                  currentStatus
                )}
              </p>
            </div>

            <div className="current-status-date">
              <CalendarDays size={15} />

              {formatDate(order.updatedAt)}
            </div>
          </div>
        )}

        {/* ======================================
            CANCELLED BANNER
        ====================================== */}

        {isCancelled && (
          <div className="cancelled-order-banner">
            <div className="cancelled-order-icon">
              <XCircle size={22} />
            </div>

            <div>
              <strong>
                Order Cancelled
              </strong>

              <p>
                This order was cancelled and
                will not be delivered.
              </p>
            </div>
          </div>
        )}

        {/* ======================================
            TRACKING CARD
        ====================================== */}

        <div className="order-tracking-card">
          <div className="tracking-card-header">
            <div>
              <span>DELIVERY PROGRESS</span>

              <h2>Order Timeline</h2>
            </div>

            <Truck size={25} />
          </div>

          <div className="tracking-timeline">

            {isCancelled ? (
              <div className="tracking-step tracking-step-completed">
                <div className="tracking-step-line">
                  <div className="tracking-step-icon">
                    <XCircle size={18} />
                  </div>
                </div>

                <div className="tracking-step-content">
                  <div className="tracking-step-title-row">
                    <h3>
                      Order Cancelled
                    </h3>

                    <span className="tracking-current-badge">
                      Cancelled
                    </span>
                  </div>

                  <p>
                    Your order has been
                    cancelled successfully.
                  </p>
                </div>
              </div>
            ) : (
              trackingSteps.map(
                (step, index) => {
                  const completed =
                    index <=
                    currentStatusIndex;

                  const current =
                    index ===
                    currentStatusIndex;

                  const isLast =
                    index ===
                    trackingSteps.length - 1;

                  return (
                    <div
                      className={`tracking-step ${
                        completed
                          ? "tracking-step-completed"
                          : ""
                      } ${
                        current
                          ? "tracking-step-current"
                          : ""
                      }`}
                      key={step.key}
                    >

                      <div className="tracking-step-line">

                        <div className="tracking-step-icon">
                          {step.icon}
                        </div>

                        {!isLast && (
                          <div
                            className={`tracking-connector ${
                              index <
                              currentStatusIndex
                                ? "tracking-connector-active"
                                : ""
                            }`}
                          />
                        )}

                      </div>

                      <div className="tracking-step-content">

                        <div className="tracking-step-title-row">
                          <h3>
                            {step.title}
                          </h3>

                          {current && (
                            <span className="tracking-current-badge">
                              Current
                            </span>
                          )}
                        </div>

                        <p>
                          {step.description}
                        </p>

                      </div>

                    </div>
                  );
                }
              )
            )}

          </div>
        </div>

        {/* ======================================
            DETAILS GRID
        ====================================== */}

        <div className="order-details-grid">

          {/* ====================================
              SHIPPING
          ==================================== */}

          <div className="order-info-card">
            <div className="order-card-heading">

              <div className="order-card-heading-icon">
                <MapPin size={19} />
              </div>

              <div>
                <span>DELIVERY</span>

                <h2>
                  Shipping Address
                </h2>
              </div>

            </div>

            <div className="shipping-details">

              <div className="shipping-name">
                <UserRound size={15} />

                <strong>
                  {
                    order.shippingAddress
                      ?.fullName
                  }
                </strong>
              </div>

              <p>
                {
                  order.shippingAddress
                    ?.address
                }
              </p>

              <p>
                {
                  order.shippingAddress
                    ?.city
                }
                ,{" "}
                {
                  order.shippingAddress
                    ?.state
                }{" "}
                -{" "}
                {
                  order.shippingAddress
                    ?.pincode
                }
              </p>

              <div className="shipping-phone">
                <span>📞</span>

                {
                  order.shippingAddress
                    ?.phone
                }
              </div>

            </div>
          </div>

          {/* ====================================
              PAYMENT
          ==================================== */}

          <div className="order-info-card">
            <div className="order-card-heading">

              <div className="order-card-heading-icon">
                <CreditCard size={19} />
              </div>

              <div>
                <span>PAYMENT</span>

                <h2>
                  Payment Details
                </h2>
              </div>

            </div>

            <div className="payment-details">

              <div className="payment-row">
                <span>
                  Payment Status
                </span>

                <strong
                  className={`payment-status payment-${
                    order.paymentStatus ||
                    "pending"
                  }`}
                >
                  {order.paymentStatus
                    ? order.paymentStatus
                        .charAt(0)
                        .toUpperCase() +
                      order.paymentStatus.slice(
                        1
                      )
                    : "Pending"}
                </strong>
              </div>

              <div className="payment-row">
                <span>
                  Order Total
                </span>

                <strong>
                  ₹
                  {Number(
                    order.totalAmount || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="payment-row">
                <span>
                  Order Date
                </span>

                <strong>
                  {formatDate(
                    order.createdAt
                  )}
                </strong>
              </div>

            </div>
          </div>

          {/* ====================================
              PRODUCTS
          ==================================== */}

          <div className="order-info-card order-products-card">

            <div className="order-card-heading">

              <div className="order-card-heading-icon">
                <ShoppingBag size={19} />
              </div>

              <div>
                <span>YOUR ORDER</span>

                <h2>
                  Ordered Products
                </h2>
              </div>

            </div>

            <div className="order-products-list">

              {order.items?.map(
                (item, index) => {

                  const image =
                    item.image ||
                    item.product
                      ?.images?.[0];

                  const name =
                    item.name ||
                    item.product
                      ?.name ||
                    "Product";

                  const price =
                    Number(
                      item.price || 0
                    );

                  const quantity =
                    Number(
                      item.quantity || 0
                    );

                  const total =
                    price * quantity;

                  return (
                    <div
                      className="order-product-row"
                      key={
                        item._id ||
                        index
                      }
                    >

                      <div className="order-product-image">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                          />
                        ) : (
                          <Package
                            size={28}
                          />
                        )}
                      </div>

                      <div className="order-product-details">

                        <h3>
                          {name}
                        </h3>

                        <p>
                          Quantity:{" "}
                          {quantity}
                        </p>

                      </div>

                      <div className="order-product-price">

                        <span>
                          ₹
                          {total.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <small>
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}{" "}
                          × {quantity}
                        </small>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            <div className="order-total-row">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {Number(
                  order.totalAmount || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

          {/* ====================================
              ORDER META
          ==================================== */}

          <div className="order-info-card">

            <div className="order-card-heading">

              <div className="order-card-heading-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <span>ORDER INFORMATION</span>

                <h2>
                  Order Details
                </h2>
              </div>

            </div>

            <div className="order-meta-details">

              <div>
                <span>
                  Order ID
                </span>

                <strong>
                  {order._id}
                </strong>
              </div>

              <div>
                <span>
                  Placed On
                </span>

                <strong>
                  {formatDateTime(
                    order.createdAt
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDateTime(
                    order.updatedAt
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Order Status
                </span>

                <strong>
                  {getStatusLabel(
                    currentStatus
                  )}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            ACTIONS
        ====================================== */}

        <div className="track-order-actions">

          <button
            className="track-secondary-btn"
            onClick={() =>
              navigate("/my-orders")
            }
          >
            <ArrowLeft size={16} />
            Back to My Orders
          </button>

          {canCancel && (
            <button
              className="cancel-order-btn"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <RefreshCw
                    size={16}
                    className="cancel-spinner"
                  />
                  Cancelling...
                </>
              ) : (
                <>
                  <RotateCcw size={16} />
                  Cancel Order
                </>
              )}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default TrackOrder;