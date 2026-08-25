import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Download,
  Package,
} from "lucide-react";
import axios from "axios";
import "./Orders.css";

const statusOptions = [
  "All Status",
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "status-paid";

    case "pending":
      return "status-pending";

    case "confirmed":
      return "status-processing";

    case "processing":
      return "status-processing";

    case "shipped":
      return "status-shipped";

    case "delivered":
      return "status-delivered";

    case "cancelled":
      return "status-cancelled";

    default:
      return "";
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Order = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("All Status");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ALL ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      console.log("Orders Admin Token:", token);

      if (!token) {
        setError("Admin authentication token not found.");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Orders API Response:", response.data);

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(
          response.data.message ||
            "Failed to fetch orders"
        );
      }
    } catch (error) {
      console.error(
        "Fetch Orders Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT ORDERS
  // ==========================================

  const formattedOrders = useMemo(() => {
    return orders.map((order) => {
      const firstItem = order.items?.[0];

      return {
        ...order,

        displayId: order._id
          ? `HT${order._id.slice(-5).toUpperCase()}`
          : "—",

        customer:
          order.user?.name ||
          "Guest Customer",

        email:
          order.user?.email ||
          "—",

        product:
          firstItem?.product?.name ||
          firstItem?.name ||
          "Unknown Product",

        quantity:
          order.items?.reduce(
            (total, item) =>
              total + Number(item.quantity || 0),
            0
          ) || 0,

        date: formatDate(order.createdAt),

        amount: Number(
          order.totalAmount ||
            order.total ||
            order.grandTotal ||
            0
        ),

        status:
          order.orderStatus || "pending",

        payment:
          order.paymentStatus || "pending",

        paymentMethod:
          order.paymentMethod || "—",
      };
    });
  }, [orders]);

  // ==========================================
  // FILTER ORDERS
  // ==========================================

  const filteredOrders = useMemo(() => {
    return formattedOrders.filter((order) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        order.displayId
          .toLowerCase()
          .includes(search) ||
        order._id
          ?.toLowerCase()
          .includes(search) ||
        order.customer
          .toLowerCase()
          .includes(search) ||
        order.email
          .toLowerCase()
          .includes(search) ||
        order.product
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        selectedStatus === "All Status" ||
        order.status.toLowerCase() ===
          selectedStatus.toLowerCase();

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [
    formattedOrders,
    searchTerm,
    selectedStatus,
  ]);

  // ==========================================
  // OPEN ORDER DETAILS
  // ==========================================

  const handleOrderClick = (orderId) => {
    if (!orderId) return;

    navigate(`/admin/orders/${orderId}`);
  };

  // ==========================================
  // EXPORT ORDERS
  // ==========================================

  const exportOrders = () => {
    if (filteredOrders.length === 0) {
      alert("There are no orders to export.");
      return;
    }

    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Product",
      "Quantity",
      "Date",
      "Amount",
      "Status",
      "Payment",
      "Payment Method",
    ];

    const rows = filteredOrders.map(
      (order) => [
        order.displayId,
        order.customer,
        order.email,
        order.product,
        order.quantity,
        order.date,
        `₹${order.amount}`,
        order.status,
        order.payment,
        order.paymentMethod,
      ]
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `honeyterra-orders-${
      new Date()
        .toISOString()
        .split("T")[0]
    }.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <div>
            <span className="orders-eyebrow">
              STORE
            </span>

            <h1>Orders</h1>

            <p>
              Loading customer orders...
            </p>
          </div>
        </div>

        <div className="orders-table-container">
          <div className="no-orders">
            <Package size={30} />

            <p>Loading orders...</p>

            <span>
              Please wait while we fetch your
              orders.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <div>
            <span className="orders-eyebrow">
              STORE
            </span>

            <h1>Orders</h1>

            <p>{error}</p>
          </div>

          <button
            className="export-btn"
            onClick={fetchOrders}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="orders-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="orders-header">
        <div>
          <span className="orders-eyebrow">
            STORE
          </span>

          <h1>Orders</h1>

          <p>
            Track and manage customer orders.
          </p>
        </div>

        <button
          className="export-btn"
          onClick={exportOrders}
        >
          <Download size={18} />

          <span>Export</span>
        </button>
      </div>

      {/* ========================================
          TOOLBAR
      ======================================== */}

      <div className="orders-toolbar">

        {/* SEARCH */}

        <div className="orders-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search order or customer..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        {/* STATUS FILTER */}

        <div className="status-filter">
          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value
              )
            }
          >
            {statusOptions.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>

          <ChevronDown size={17} />
        </div>
      </div>

      {/* ========================================
          ORDERS TABLE
      ======================================== */}

      <div className="orders-table-container">

        <table className="orders-table">

          {/* TABLE HEADER */}

          <thead>
            <tr>
              <th>Order</th>

              <th>Customer</th>

              <th>Product</th>

              <th>Date</th>

              <th>Amount</th>

              <th>Status</th>
            </tr>
          </thead>

          {/* TABLE BODY */}

          <tbody>

            {filteredOrders.length > 0 ? (

              filteredOrders.map(
                (order) => (

                  <tr
                    key={order._id}
                    className="order-row"
                    onClick={() =>
                      handleOrderClick(
                        order._id
                      )
                    }
                  >

                    {/* ORDER */}

                    <td>
                      <div className="order-id-wrapper">

                        <div className="order-icon">
                          <Package size={17} />
                        </div>

                        <span className="order-id">
                          #{order.displayId}
                        </span>

                      </div>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="customer-name">
                        {order.customer}
                      </div>
                    </td>

                    {/* PRODUCT */}

                    <td>
                      <span className="product-name">
                        {order.product}
                      </span>

                      {order.quantity > 1 && (
                        <span className="product-quantity">
                          × {order.quantity}
                        </span>
                      )}
                    </td>

                    {/* DATE */}

                    <td>
                      {order.date}
                    </td>

                    {/* AMOUNT */}

                    <td className="order-amount">
                      ₹
                      {order.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`order-status ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status
                          .charAt(0)
                          .toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>

                  </tr>
                )
              )

            ) : (

              /* NO ORDERS */

              <tr>
                <td colSpan="6">

                  <div className="no-orders">

                    <Package size={30} />

                    <p>
                      No orders found
                    </p>

                    <span>
                      {orders.length === 0
                        ? "No customer orders have been placed yet."
                        : "Try changing your search or status filter."}
                    </span>

                  </div>

                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default Order;