
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  Check,
  Clock3,
  Truck,
  XCircle,
  Save,
} from "lucide-react";

import "./OrderDetails.css";

const trackingSteps = [
  {
    key: "pending",
    title: "Order Placed",
    description: "Order has been placed by the customer.",
    icon: Clock3,
  },
  {
    key: "confirmed",
    title: "Order Confirmed",
    description: "Order has been confirmed.",
    icon: Check,
  },
  {
    key: "processing",
    title: "Processing",
    description: "Order is being prepared for shipment.",
    icon: Package,
  },
  {
    key: "shipped",
    title: "Shipped",
    description: "Order has left the warehouse.",
    icon: Truck,
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Order has been delivered to the customer.",
    icon: Check,
  },
];

const statusOrder = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const getStatusClass = (status = "") => {
  switch (status.toLowerCase()) {
    case "paid":
      return "details-status-paid";

    case "pending":
      return "details-status-pending";

    case "confirmed":
      return "details-status-processing";

    case "processing":
      return "details-status-processing";

    case "shipped":
      return "details-status-shipped";

    case "delivered":
      return "details-status-delivered";

    case "cancelled":
      return "details-status-cancelled";

    case "failed":
      return "details-status-cancelled";

    case "refunded":
      return "details-status-cancelled";

    default:
      return "";
  }
};

const formatStatus = (status = "") => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [currentStatus, setCurrentStatus] = useState("pending");

  const [selectedStatus, setSelectedStatus] = useState("pending");

  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState("pending");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [updatingPayment, setUpdatingPayment] = useState(false);

  // ==========================================
  // FETCH ADMIN ORDER
  // ==========================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      console.log("Admin Token:", token);

      if (!token) {
        throw new Error("Admin token not found");
      }

      console.log(
        "Fetching Admin Order:",
        `http://localhost:3000/api/admin/orders/${orderId}`
      );

      const response = await fetch(
        `http://localhost:3000/api/admin/orders/${orderId}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Admin Order Details Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch order"
        );
      }

      if (!data.success || !data.order) {
        throw new Error("Order not found");
      }

      setOrder(data.order);

      setCurrentStatus(data.order.orderStatus);

      setSelectedStatus(data.order.orderStatus);

      setSelectedPaymentStatus(data.order.paymentStatus);
    } catch (error) {
      console.error("Fetch Admin Order Error:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ORDER WHEN ID CHANGES
  // ==========================================

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleStatusUpdate = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (selectedStatus === currentStatus) {
        return;
      }

      setUpdatingStatus(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin token not found");
      }

      const response = await fetch(
        `http://localhost:3000/api/admin/orders/${order._id}/status`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            orderStatus: selectedStatus,
          }),
        }
      );

      const data = await response.json();

      console.log("Update Order Status Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      setOrder(data.order);

      setCurrentStatus(data.order.orderStatus);

      setSelectedStatus(data.order.orderStatus);

      alert("Order status updated successfully");
    } catch (error) {
      console.error("Update Status Error:", error);

      alert(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  const handlePaymentUpdate = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (
        selectedPaymentStatus === order.paymentStatus
      ) {
        return;
      }

      setUpdatingPayment(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin token not found");
      }

      const response = await fetch(
        `http://localhost:3000/api/admin/orders/${order._id}/payment-status`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            paymentStatus: selectedPaymentStatus,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Update Payment Status Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update payment status"
        );
      }

      setOrder(data.order);

      setSelectedPaymentStatus(
        data.order.paymentStatus
      );

      alert("Payment status updated successfully");
    } catch (error) {
      console.error(
        "Update Payment Error:",
        error
      );

      alert(error.message);
    } finally {
      setUpdatingPayment(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="order-not-found">
        <Package size={40} />

        <h2>Loading Order...</h2>

        <p>
          Please wait while we load the order details.
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !order) {
    return (
      <div className="order-not-found">
        <XCircle size={40} />

        <h2>Order not found</h2>

        <p>
          {error ||
            "The order you are trying to view does not exist."}
        </p>

        <button
          onClick={() => navigate("/admin/orders")}
          className="back-orders-btn"
        >
          <ArrowLeft size={17} />

          Back to Orders
        </button>
      </div>
    );
  }

  // ==========================================
  // TRACKING
  // ==========================================

  const isCancelled =
    order.orderStatus === "cancelled";

  const currentStepIndex =
    statusOrder.indexOf(currentStatus);

  // ==========================================
  // DATE
  // ==========================================

  const orderDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // ==========================================
  // CUSTOMER
  // ==========================================

  const customerName =
    order.user?.name ||
    order.shippingAddress?.fullName ||
    "Customer";

  const customerEmail =
    order.user?.email || "No email available";

  const customerPhone =
    order.shippingAddress?.phone ||
    "No phone available";

  // ==========================================
  // SHIPPING ADDRESS
  // ==========================================

  const shippingAddress =
    order.shippingAddress;

  const completeAddress = [
    shippingAddress?.address,
    shippingAddress?.city,
    shippingAddress?.state,
    shippingAddress?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  // ==========================================
  // PAYMENT
  // ==========================================

  const paymentStatus =
    order.paymentStatus || "pending";

  return (
    <div className="order-details-page">

      {/* ==========================================
          TOP HEADER
      ========================================== */}

      <div className="order-details-top">

        <button
          className="back-button"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <ArrowLeft size={18} />

          Back to Orders
        </button>

        <div className="order-title-row">

          <div>

            <span className="details-eyebrow">
              ORDER DETAILS
            </span>

            <h1>
              #{order._id}
            </h1>

            <p>
              Placed on {orderDate}
            </p>

          </div>

          <span
            className={`details-status ${getStatusClass(
              currentStatus
            )}`}
          >
            {formatStatus(currentStatus)}
          </span>

        </div>

      </div>

      {/* ==========================================
          ORDER TRACKING
      ========================================== */}

      <section className="details-card tracking-card">

        <div className="card-heading">

          <div>

            <h2>
              Order Tracking
            </h2>

            <p>
              Track the current progress of this order.
            </p>

          </div>

          <Truck size={23} />

        </div>

        {isCancelled ? (

          <div className="cancelled-order">

            <div className="cancelled-icon">
              <XCircle size={28} />
            </div>

            <div>

              <h3>
                Order Cancelled
              </h3>

              <p>
                This order has been cancelled and
                will not continue through the
                delivery process.
              </p>

            </div>

          </div>

        ) : (

          <div className="tracking-timeline">

            {trackingSteps.map(
              (step, index) => {

                const StepIcon = step.icon;

                const isCompleted =
                  index < currentStepIndex;

                const isCurrent =
                  index === currentStepIndex;

                return (
                  <div
                    className={`tracking-step ${
                      isCompleted
                        ? "completed"
                        : ""
                    } ${
                      isCurrent
                        ? "current"
                        : ""
                    }`}
                    key={step.key}
                  >

                    <div className="tracking-step-left">

                      <div className="tracking-icon">
                        <StepIcon size={17} />
                      </div>

                      {index !==
                        trackingSteps.length - 1 && (
                        <div className="tracking-line" />
                      )}

                    </div>

                    <div className="tracking-content">

                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {step.description}
                      </p>

                      {isCurrent && (
                        <span className="current-label">
                          Current status
                        </span>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* ==========================================
          STATUS UPDATE
      ========================================== */}

      <section className="details-card status-update-card">

        <div className="card-heading">

          <div>

            <h2>
              Update Order Status
            </h2>

            <p>
              Change the current status of this order.
            </p>

          </div>

        </div>

        <div className="status-update-form">

          <div className="status-select-wrapper">

            <label>
              Order Status
            </label>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
            >
              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="shipped">
                Shipped
              </option>

              <option value="delivered">
                Delivered
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

          </div>

          <button
            className="save-status-btn"
            onClick={handleStatusUpdate}
            disabled={
              updatingStatus ||
              selectedStatus === currentStatus
            }
          >
            <Save size={17} />

            {updatingStatus
              ? "Updating..."
              : "Update Status"}
          </button>

        </div>

      </section>

      {/* ==========================================
          PAYMENT STATUS
      ========================================== */}

      <section className="details-card status-update-card">

        <div className="card-heading">

          <div>

            <h2>
              Update Payment Status
            </h2>

            <p>
              Change the payment status of this order.
            </p>

          </div>

        </div>

        <div className="status-update-form">

          <div className="status-select-wrapper">

            <label>
              Payment Status
            </label>

            <select
              value={selectedPaymentStatus}
              onChange={(e) =>
                setSelectedPaymentStatus(
                  e.target.value
                )
              }
            >
              <option value="pending">
                Pending
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="refunded">
                Refunded
              </option>
            </select>

          </div>

          <button
            className="save-status-btn"
            onClick={handlePaymentUpdate}
            disabled={
              updatingPayment ||
              selectedPaymentStatus ===
                paymentStatus
            }
          >
            <Save size={17} />

            {updatingPayment
              ? "Updating..."
              : "Update Payment"}
          </button>

        </div>

      </section>

      {/* ==========================================
          CUSTOMER + SHIPPING
      ========================================== */}

      <div className="details-grid">

        {/* CUSTOMER */}

        <section className="details-card">

          <div className="card-heading">

            <div>

              <h2>
                Customer Information
              </h2>

              <p>
                Details about the customer.
              </p>

            </div>

            <User size={22} />

          </div>

          <div className="customer-details">

            <div className="customer-avatar">
              {customerName.charAt(0).toUpperCase()}
            </div>

            <div>

              <h3>
                {customerName}
              </h3>

              <div className="contact-line">

                <Mail size={15} />

                <span>
                  {customerEmail}
                </span>

              </div>

              <div className="contact-line">

                <Phone size={15} />

                <span>
                  {customerPhone}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* SHIPPING */}

        <section className="details-card">

          <div className="card-heading">

            <div>

              <h2>
                Shipping Address
              </h2>

              <p>
                Delivery information.
              </p>

            </div>

            <MapPin size={22} />

          </div>

          <div className="address-box">

            <MapPin size={18} />

            <p>
              {completeAddress ||
                "No shipping address available"}
            </p>

          </div>

        </section>

      </div>

      {/* ==========================================
          PRODUCTS + PAYMENT
      ========================================== */}

      <div className="details-grid">

        {/* ORDER ITEMS */}

        <section className="details-card">

          <div className="card-heading">

            <div>

              <h2>
                Order Items
              </h2>

              <p>
                Products included in this order.
              </p>

            </div>

            <Package size={22} />

          </div>

          <div>

            {order.items?.map(
              (item, index) => {

                const productImage =
                  item.image ||
                  item.product?.images?.[0] ||
                  "";

                return (
                  <div
                    className="product-detail-row"
                    key={
                      item.product?._id ||
                      `${order._id}-${index}`
                    }
                  >

                    <div className="product-placeholder">

                      {productImage ? (

                        <img
                          src={productImage}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />

                      ) : (

                        <Package size={25} />

                      )}

                    </div>

                    <div className="product-detail-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <p>
                        Price: ₹{item.price}
                      </p>

                    </div>

                    <strong>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* PAYMENT */}

        <section className="details-card">

          <div className="card-heading">

            <div>

              <h2>
                Payment Information
              </h2>

              <p>
                Payment details for this order.
              </p>

            </div>

            <CreditCard size={22} />

          </div>

          <div className="payment-info">

            <div className="payment-row">

              <span>
                Payment Status
              </span>

              <span
                className={`payment-badge ${getStatusClass(
                  paymentStatus
                )}`}
              >
                {formatStatus(
                  paymentStatus
                )}
              </span>

            </div>

            <div className="payment-row">

              <span>
                Payment Method
              </span>

              <strong>
                {order.razorpayPaymentId
                  ? "Razorpay"
                  : "Pending"}
              </strong>

            </div>

            {order.razorpayOrderId && (
              <div className="payment-row">

                <span>
                  Razorpay Order ID
                </span>

                <strong>
                  {order.razorpayOrderId}
                </strong>

              </div>
            )}

            {order.razorpayPaymentId && (
              <div className="payment-row">

                <span>
                  Payment ID
                </span>

                <strong>
                  {order.razorpayPaymentId}
                </strong>

              </div>
            )}

            <div className="payment-row">

              <span>
                Total Items
              </span>

              <strong>
                {order.items?.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </strong>

            </div>

            <div className="payment-divider" />

            <div className="payment-row total-row">

              <span>
                Total
              </span>

              <strong>
                ₹{order.totalAmount}
              </strong>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default OrderDetails;

