import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

import "./MyOrders.css";

const API_URL = "http://localhost:3000";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH MY ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // IMPORTANT:
      // Backend route is:
      // GET /api/orders/my-orders

      const response = await fetch(
        `${API_URL}/api/orders/my-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("My Orders API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Fetch My Orders Error:", err);

      setError(
        err.message || "Unable to load your orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const getStatusLabel = (status) => {
    if (!status) return "Pending";

    const statusMap = {
      pending: "Order Placed",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return (
      statusMap[status.toLowerCase()] ||
      status
    );
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "my-order-status-confirmed";

      case "processing":
        return "my-order-status-processing";

      case "shipped":
        return "my-order-status-shipped";

      case "delivered":
        return "my-order-status-delivered";

      case "cancelled":
        return "my-order-status-cancelled";

      case "pending":
      default:
        return "my-order-status-pending";
    }
  };

  // ==========================================
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle2 size={15} />;

      case "processing":
        return <Package size={15} />;

      case "shipped":
        return <Truck size={15} />;

      case "delivered":
        return <CheckCircle2 size={15} />;

      case "cancelled":
        return <XCircle size={15} />;

      case "pending":
      default:
        return <Clock3 size={15} />;
    }
  };

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (
    !loading &&
    !error &&
    orders.length === 0
  ) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-empty">
          <div className="empty-orders-icon">
            <ShoppingBag size={42} />
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
            Start shopping and your orders will
            appear here.
          </p>

          <button
            className="my-orders-shop-btn"
            onClick={() => navigate("/shop")}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="my-orders-header">
          <div>
            <span className="my-orders-eyebrow">
              MY ACCOUNT
            </span>

            <h1>My Orders</h1>

            <p>
              View your orders and track your
              deliveries.
            </p>
          </div>

          <div className="orders-count">
            <Package size={18} />

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </span>
          </div>
        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="my-orders-error">
            <XCircle size={20} />

            <div>
              <strong>
                Unable to load orders
              </strong>

              <p>{error}</p>
            </div>

            <button
              onClick={fetchOrders}
              className="retry-orders-btn"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (
          <div className="my-orders-loading">
            <div className="orders-loader" />

            <p>
              Loading your orders...
            </p>
          </div>
        ) : (
          /* ==========================================
             ORDERS LIST
          ========================================== */

          <div className="my-orders-list">
            {orders.map((order) => {
              const firstProduct =
                order.items?.[0];

              const remainingItems =
                order.items?.length > 1
                  ? order.items.length - 1
                  : 0;

              return (
                <article
                  className="my-order-card"
                  key={order._id}
                >

                  {/* ==================================
                      ORDER TOP
                  ================================== */}

                  <div className="my-order-top">

                    <div className="my-order-number">
                      <span>
                        ORDER
                      </span>

                      <strong>
                        #
                        {order._id
                          ?.slice(-8)
                          .toUpperCase()}
                      </strong>
                    </div>

                    <div className="my-order-date">
                      Placed on{" "}

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>
                    </div>

                    <span
                      className={`my-order-status ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(
                        order.orderStatus
                      )}

                      {getStatusLabel(
                        order.orderStatus
                      )}
                    </span>

                  </div>

                  {/* ==================================
                      ORDER CONTENT
                  ================================== */}

                  <div className="my-order-content">

                    {/* PRODUCT */}

                    <div className="my-order-product">

                      <div className="my-order-product-image">

                        {firstProduct?.image ||
                        firstProduct?.product
                          ?.images?.[0] ? (
                          <img
                            src={
                              firstProduct.image ||
                              firstProduct.product
                                ?.images?.[0]
                            }
                            alt={
                              firstProduct.name ||
                              firstProduct.product
                                ?.name ||
                              "Product"
                            }
                          />
                        ) : (
                          <Package size={28} />
                        )}

                      </div>

                      <div className="my-order-product-info">

                        <h3>
                          {firstProduct?.name ||
                            firstProduct?.product
                              ?.name ||
                            "Product"}
                        </h3>

                        <p>
                          Quantity:{" "}
                          {firstProduct?.quantity ||
                            1}
                        </p>

                        {remainingItems > 0 && (
                          <span>
                            + {remainingItems} more{" "}
                            {remainingItems === 1
                              ? "item"
                              : "items"}
                          </span>
                        )}

                      </div>

                    </div>

                    {/* ==================================
                        TOTAL
                    ================================== */}

                    <div className="my-order-total">

                      <span>
                        Total Amount
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </strong>

                      <small>
                        {order.paymentStatus ===
                        "paid"
                          ? "Payment received"
                          : "Payment pending"}
                      </small>

                    </div>

                    {/* ==================================
                        TRACK ORDER
                    ================================== */}

                    <button
                      className="track-order-btn"
                      onClick={() =>
                        navigate(
                          `/my-orders/${order._id}`
                        )
                      }
                    >
                      <Truck size={17} />

                      Track Order

                      <ChevronRight
                        size={17}
                      />
                    </button>

                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;