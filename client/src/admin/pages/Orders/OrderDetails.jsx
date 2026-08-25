import React, { useMemo, useState } from "react";
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

const orders = [
  {
    id: "HT1005",
    customer: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    product: "Gel Ash Tray",
    quantity: 1,
    date: "22 Aug 2026",
    amount: 498,
    status: "Paid",
    payment: "Paid",
    paymentMethod: "UPI",
    address: "42 Green Park, New Delhi, India",
    subtotal: 498,
    shipping: 0,
    tax: 0,
  },
  {
    id: "HT1004",
    customer: "Priya Singh",
    email: "priya.singh@gmail.com",
    phone: "+91 98765 12345",
    product: "Honeycomb Wrap",
    quantity: 1,
    date: "21 Aug 2026",
    amount: 799,
    status: "Pending",
    payment: "Pending",
    paymentMethod: "Credit Card",
    address: "18 MG Road, Bengaluru, India",
    subtotal: 749,
    shipping: 50,
    tax: 0,
  },
  {
    id: "HT1003",
    customer: "Aman Verma",
    email: "aman.verma@gmail.com",
    phone: "+91 99887 66554",
    product: "Gel Ash Tray",
    quantity: 1,
    date: "20 Aug 2026",
    amount: 249,
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "UPI",
    address: "23 Sector 15, Chandigarh, India",
    subtotal: 249,
    shipping: 0,
    tax: 0,
  },
  {
    id: "HT1002",
    customer: "Neha Patel",
    email: "neha.patel@gmail.com",
    phone: "+91 98761 23456",
    product: "Gel Ash Tray",
    quantity: 2,
    date: "19 Aug 2026",
    amount: 498,
    status: "Shipped",
    payment: "Paid",
    paymentMethod: "Debit Card",
    address: "72 Satellite Road, Ahmedabad, India",
    subtotal: 498,
    shipping: 0,
    tax: 0,
  },
  {
    id: "HT1001",
    customer: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    phone: "+91 98123 45678",
    product: "Gel Ash Tray",
    quantity: 1,
    date: "18 Aug 2026",
    amount: 249,
    status: "Cancelled",
    payment: "Refunded",
    paymentMethod: "UPI",
    address: "9 Civil Lines, Jaipur, India",
    subtotal: 249,
    shipping: 0,
    tax: 0,
  },
];

const trackingSteps = [
  {
    key: "Pending",
    title: "Order Placed",
    description: "Order has been placed by the customer.",
    icon: Clock3,
  },
  {
    key: "Paid",
    title: "Payment Confirmed",
    description: "Payment has been successfully confirmed.",
    icon: CreditCard,
  },
  {
    key: "Processing",
    title: "Processing",
    description: "Order is being prepared for shipment.",
    icon: Package,
  },
  {
    key: "Shipped",
    title: "Shipped",
    description: "Order has left the warehouse.",
    icon: Truck,
  },
  {
    key: "Delivered",
    title: "Delivered",
    description: "Order has been delivered to the customer.",
    icon: Check,
  },
];

const statusOrder = [
  "Pending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
];

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "details-status-paid";

    case "pending":
      return "details-status-pending";

    case "processing":
      return "details-status-processing";

    case "shipped":
      return "details-status-shipped";

    case "delivered":
      return "details-status-delivered";

    case "cancelled":
      return "details-status-cancelled";

    default:
      return "";
  }
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = useMemo(
    () => orders.find((item) => item.id === orderId),
    [orderId]
  );

  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "Pending"
  );

  const [selectedStatus, setSelectedStatus] = useState(
    order?.status || "Pending"
  );

  if (!order) {
    return (
      <div className="order-not-found">
        <Package size={40} />

        <h2>Order not found</h2>

        <p>
          The order you are trying to view does not exist.
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

  const currentStepIndex = statusOrder.indexOf(currentStatus);

  const handleStatusUpdate = () => {
    setCurrentStatus(selectedStatus);

    // When backend/API is connected,
    // make your PUT/PATCH request here.
    console.log(
      `Order #${order.id} updated to ${selectedStatus}`
    );
  };

  const isCancelled = currentStatus === "Cancelled";

  return (
    <div className="order-details-page">
      {/* =========================
          TOP HEADER
      ========================= */}

      <div className="order-details-top">
        <button
          className="back-button"
          onClick={() => navigate("/admin/orders")}
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="order-title-row">
          <div>
            <span className="details-eyebrow">
              ORDER DETAILS
            </span>

            <h1>#{order.id}</h1>

            <p>
              Placed on {order.date}
            </p>
          </div>

          <span
            className={`details-status ${getStatusClass(
              currentStatus
            )}`}
          >
            {currentStatus}
          </span>
        </div>
      </div>

      {/* =========================
          TRACKING
      ========================= */}

      <section className="details-card tracking-card">
        <div className="card-heading">
          <div>
            <h2>Order Tracking</h2>
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
              <h3>Order Cancelled</h3>

              <p>
                This order has been cancelled and will not
                continue through the delivery process.
              </p>
            </div>
          </div>
        ) : (
          <div className="tracking-timeline">
            {trackingSteps.map((step, index) => {
              const StepIcon = step.icon;

              const isCompleted =
                index < currentStepIndex;

              const isCurrent =
                index === currentStepIndex;

              return (
                <div
                  className={`tracking-step ${
                    isCompleted ? "completed" : ""
                  } ${isCurrent ? "current" : ""}`}
                  key={step.key}
                >
                  <div className="tracking-step-left">
                    <div className="tracking-icon">
                      <StepIcon size={17} />
                    </div>

                    {index !== trackingSteps.length - 1 && (
                      <div className="tracking-line" />
                    )}
                  </div>

                  <div className="tracking-content">
                    <h3>{step.title}</h3>

                    <p>{step.description}</p>

                    {isCurrent && (
                      <span className="current-label">
                        Current status
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================
          STATUS UPDATE
      ========================= */}

      <section className="details-card status-update-card">
        <div className="card-heading">
          <div>
            <h2>Update Order Status</h2>

            <p>
              Change the current status of this order.
            </p>
          </div>
        </div>

        <div className="status-update-form">
          <div className="status-select-wrapper">
            <label>Order Status</label>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Processing">
                Processing
              </option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">
                Delivered
              </option>
              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <button
            className="save-status-btn"
            onClick={handleStatusUpdate}
            disabled={selectedStatus === currentStatus}
          >
            <Save size={17} />
            Update Status
          </button>
        </div>
      </section>

      {/* =========================
          DETAILS GRID
      ========================= */}

      <div className="details-grid">
        {/* CUSTOMER */}

        <section className="details-card">
          <div className="card-heading">
            <div>
              <h2>Customer Information</h2>
              <p>Details about the customer.</p>
            </div>

            <User size={22} />
          </div>

          <div className="customer-details">
            <div className="customer-avatar">
              {order.customer.charAt(0)}
            </div>

            <div>
              <h3>{order.customer}</h3>

              <div className="contact-line">
                <Mail size={15} />
                <span>{order.email}</span>
              </div>

              <div className="contact-line">
                <Phone size={15} />
                <span>{order.phone}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SHIPPING */}

        <section className="details-card">
          <div className="card-heading">
            <div>
              <h2>Shipping Address</h2>
              <p>Delivery information.</p>
            </div>

            <MapPin size={22} />
          </div>

          <div className="address-box">
            <MapPin size={18} />

            <p>{order.address}</p>
          </div>
        </section>
      </div>

      {/* =========================
          PRODUCT + PAYMENT
      ========================= */}

      <div className="details-grid">
        <section className="details-card">
          <div className="card-heading">
            <div>
              <h2>Order Items</h2>
              <p>Products included in this order.</p>
            </div>

            <Package size={22} />
          </div>

          <div className="product-detail-row">
            <div className="product-placeholder">
              <Package size={25} />
            </div>

            <div className="product-detail-info">
              <h3>{order.product}</h3>

              <p>
                Quantity: {order.quantity}
              </p>
            </div>

            <strong>
              ₹{order.amount}
            </strong>
          </div>
        </section>

        <section className="details-card">
          <div className="card-heading">
            <div>
              <h2>Payment Information</h2>
              <p>Payment details for this order.</p>
            </div>

            <CreditCard size={22} />
          </div>

          <div className="payment-info">
            <div className="payment-row">
              <span>Payment Status</span>

              <span
                className={`payment-badge ${getStatusClass(
                  order.payment
                )}`}
              >
                {order.payment}
              </span>
            </div>

            <div className="payment-row">
              <span>Payment Method</span>

              <strong>{order.paymentMethod}</strong>
            </div>

            <div className="payment-row">
              <span>Subtotal</span>

              <strong>₹{order.subtotal}</strong>
            </div>

            <div className="payment-row">
              <span>Shipping</span>

              <strong>₹{order.shipping}</strong>
            </div>

            <div className="payment-divider" />

            <div className="payment-row total-row">
              <span>Total</span>

              <strong>₹{order.amount}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderDetails;