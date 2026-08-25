import { useEffect, useState } from "react";
import axios from "axios";

import {
  ShoppingBag,
  ShoppingCart,
  Users,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";

import StatCard from "../../components/StatCard/StatCard";
import AdminTable from "../../components/AdminTable/AdminTable";

import "./Dashboard.css";

function Dashboard() {
  // ==========================================
  // STATE
  // ==========================================

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // ==========================================
      // GET ADMIN TOKEN
      // ==========================================

      const token = localStorage.getItem("adminToken");

      console.log("Dashboard Admin Token:", token);

      // ==========================================
      // CHECK TOKEN
      // ==========================================

      if (!token) {
        setError("Admin authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // ==========================================
      // FETCH DASHBOARD
      // ==========================================

      const response = await axios.get(
        "http://localhost:3000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dashboard Response:", response.data);

      // ==========================================
      // SET DATA
      // ==========================================

      if (response.data.success) {
        setStats(
          response.data.stats || {
            totalSales: 0,
            totalOrders: 0,
            totalCustomers: 0,
            totalProducts: 0,
          }
        );

        setRecentOrders(
          response.data.recentOrders || []
        );

        setProducts(
          response.data.products || []
        );
      }
    } catch (error) {
      console.error(
        "Dashboard Fetch Error:",
        error
      );

      // ==========================================
      // HANDLE UNAUTHORIZED
      // ==========================================

      if (error.response?.status === 401) {
        setError(
          "Admin session expired or invalid. Please login again."
        );

        // Remove invalid token
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ORDER TABLE COLUMNS
  // ==========================================

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
      key: "amount",
      label: "Amount",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  // ==========================================
  // FORMAT ORDERS FOR TABLE
  // ==========================================

  const formattedOrders = recentOrders.map(
    (order) => ({
      id: order._id
        ? `#${order._id.slice(-6).toUpperCase()}`
        : "#N/A",

      customer:
        order.user?.name ||
        "Unknown Customer",

      product:
        order.items?.length > 1
          ? `${order.items[0]?.name || "Product"} + ${
              order.items.length - 1
            } more`
          : order.items?.[0]?.name ||
            "Unknown Product",

      amount: `₹${Number(
        order.totalAmount || 0
      ).toLocaleString("en-IN")}`,

      status: order.orderStatus
        ? order.orderStatus
            .charAt(0)
            .toUpperCase() +
          order.orderStatus.slice(1)
        : "Pending",
    })
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-page-heading">
          <div>
            <span className="admin-page-eyebrow">
              OVERVIEW
            </span>

            <h1>Dashboard</h1>

            <p>
              Loading your HoneyTerra store data...
            </p>
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
      <div className="admin-dashboard-page">
        <div className="admin-page-heading">
          <div>
            <span className="admin-page-eyebrow">
              OVERVIEW
            </span>

            <h1>Dashboard</h1>

            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="admin-dashboard-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="admin-page-heading">
        <div>
          <span className="admin-page-eyebrow">
            OVERVIEW
          </span>

          <h1>Dashboard</h1>

          <p>
            Here's what's happening with your
            HoneyTerra store.
          </p>
        </div>

        <div className="dashboard-date">
          Today
        </div>
      </div>

      {/* ==========================================
          STATS
      ========================================== */}

      <div className="dashboard-stats">

        <StatCard
          title="Total Sales"
          value={`₹${Number(
            stats.totalSales || 0
          ).toLocaleString("en-IN")}`}
          icon={IndianRupee}
          change="All time"
          positive={true}
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon={ShoppingCart}
          change="All time"
          positive={true}
        />

        <StatCard
          title="Customers"
          value={stats.totalCustomers || 0}
          icon={Users}
          change="Registered"
          positive={true}
        />

        <StatCard
          title="Products"
          value={stats.totalProducts || 0}
          icon={ShoppingBag}
          change="Total"
          positive={true}
        />

      </div>

      {/* ==========================================
          MAIN GRID
      ========================================== */}

      <div className="dashboard-content-grid">

        {/* ==========================================
            RECENT ORDERS
        ========================================== */}

        <section className="dashboard-section dashboard-orders">

          <div className="dashboard-section-header">

            <div>
              <h2>Recent Orders</h2>

              <p>
                Latest activity from your store.
              </p>
            </div>

            <button className="dashboard-view-button">
              View all
              <ArrowUpRight size={16} />
            </button>

          </div>

          <AdminTable
            columns={columns}
            data={formattedOrders}
          />

        </section>

        {/* ==========================================
            PRODUCTS
        ========================================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>Products</h2>

              <p>
                Current store inventory.
              </p>
            </div>

          </div>

          <div className="dashboard-product-list">

            {products.length === 0 ? (

              <p>
                No products found.
              </p>

            ) : (

              products.map((product) => (

                <div
                  className="dashboard-product"
                  key={product._id}
                >

                  {/* PRODUCT IMAGE */}

                  <div className="dashboard-product-image">

                    {product.images?.[0] ? (

                      <img
                        src={product.images[0]}
                        alt={product.name}
                      />

                    ) : (

                      "HT"

                    )}

                  </div>

                  {/* PRODUCT DETAILS */}

                  <div>

                    <h3>
                      {product.name}
                    </h3>

                    <span>

                      {product.stock > 0
                        ? `${product.stock} units in stock`
                        : "Out of stock"}

                    </span>

                  </div>

                  {/* PRODUCT PRICE */}

                  <strong>
                    ₹
                    {Number(
                      product.price || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

              ))

            )}

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;