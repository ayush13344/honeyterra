import {
  Search,
  Eye,
  Download,
} from "lucide-react";

import { useState } from "react";

import AdminTable from "../../components/AdminTable/AdminTable";

import "./Orders.css";

function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const orders = [
    {
      id: "#HT1005",
      customer: "Rahul Sharma",
      product: "Gel Ash Tray",
      date: "22 Aug 2026",
      amount: "₹498",
      status: "Paid",
    },
    {
      id: "#HT1004",
      customer: "Priya Singh",
      product: "Honeycomb Wrap",
      date: "21 Aug 2026",
      amount: "₹799",
      status: "Pending",
    },
    {
      id: "#HT1003",
      customer: "Aman Verma",
      product: "Gel Ash Tray",
      date: "20 Aug 2026",
      amount: "₹249",
      status: "Delivered",
    },
    {
      id: "#HT1002",
      customer: "Neha Patel",
      product: "Gel Ash Tray",
      date: "19 Aug 2026",
      amount: "₹498",
      status: "Shipped",
    },
    {
      id: "#HT1001",
      customer: "Arjun Mehta",
      product: "Gel Ash Tray",
      date: "18 Aug 2026",
      amount: "₹249",
      status: "Cancelled",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      order.customer
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || order.status === status;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "id",
      label: "Order",
    },
    {
      key: "customer",
      label: "Customer",
    },
    {
      key: "product",
      label: "Product",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "amount",
      label: "Amount",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  return (
    <div className="admin-orders-page">

      <div className="admin-page-heading">

        <div>
          <span className="admin-page-eyebrow">
            STORE
          </span>

          <h1>Orders</h1>

          <p>
            Track and manage customer orders.
          </p>
        </div>

        <button className="orders-export-button">
          <Download size={16} />
          Export
        </button>

      </div>

      {/* Filters */}

      <div className="orders-toolbar">

        <div className="orders-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search order or customer..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="orders-status-filter"
        >
          <option value="All">All status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

      </div>

      {/* Table */}

      <div className="orders-table-card">

        <AdminTable
          columns={columns}
          data={filteredOrders}
        />

        <div className="orders-mobile-actions">

          <button>
            <Eye size={15} />
            View order
          </button>

        </div>

      </div>

    </div>
  );
}

export default Orders;