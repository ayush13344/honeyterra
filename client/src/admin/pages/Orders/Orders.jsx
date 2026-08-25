import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Download,
  Package,
} from "lucide-react";
import "./Orders.css";

const initialOrders = [
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
  },
];

const statusOptions = [
  "All Status",
  "Pending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "status-paid";

    case "pending":
      return "status-pending";

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

const Order = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(search) ||
        order.customer.toLowerCase().includes(search) ||
        order.product.toLowerCase().includes(search);

      const matchesStatus =
        selectedStatus === "All Status" ||
        order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

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

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer,
      order.email,
      order.product,
      order.quantity,
      order.date,
      `₹${order.amount}`,
      order.status,
      order.payment,
      order.paymentMethod,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `honeyterra-orders-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <span className="orders-eyebrow">STORE</span>

          <h1>Orders</h1>

          <p>Track and manage customer orders.</p>
        </div>

        <button className="export-btn" onClick={exportOrders}>
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      <div className="orders-toolbar">
        <div className="orders-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search order or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <ChevronDown size={17} />
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
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

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="order-row"
                  onClick={() => handleOrderClick(order.id)}
                >
                  <td>
                    <div className="order-id-wrapper">
                      <div className="order-icon">
                        <Package size={17} />
                      </div>

                      <span className="order-id">
                        #{order.id}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="customer-name">
                      {order.customer}
                    </div>
                  </td>

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

                  <td>{order.date}</td>

                  <td className="order-amount">
                    ₹{order.amount}
                  </td>

                  <td>
                    <span
                      className={`order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="no-orders">
                    <Package size={30} />
                    <p>No orders found</p>
                    <span>
                      Try changing your search or status filter.
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