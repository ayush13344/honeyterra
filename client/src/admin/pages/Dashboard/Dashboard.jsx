
import { useEffect, useState } from "react";
import axios from "axios";

import {
  ShoppingBag,
  ShoppingCart,
  Users,
  IndianRupee,
  ArrowUpRight,
  Eye,
  UserRound,
  CalendarDays,
  TrendingUp,
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
  // VISITOR ANALYTICS STATE
  // ==========================================

  const [visitorRange, setVisitorRange] = useState("7d");

  const [visitorAnalytics, setVisitorAnalytics] = useState({
    summary: {
      totalVisits: 0,
      uniqueVisitors: 0,
    },
    dailyStats: [],
    deviceStats: [],
    pageStats: [],
  });

  const [visitorLoading, setVisitorLoading] = useState(true);
  const [visitorError, setVisitorError] = useState("");

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

      const token = localStorage.getItem("adminToken");

      console.log("Dashboard Admin Token:", token);

      if (!token) {
        setError(
          "Admin authentication token not found. Please login again."
        );
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://honeyterra.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dashboard Response:", response.data);

      if (response.data.success) {
        setStats(
          response.data.stats || {
            totalSales: 0,
            totalOrders: 0,
            totalCustomers: 0,
            totalProducts: 0,
          }
        );

        setRecentOrders(response.data.recentOrders || []);
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);

      if (error.response?.status === 401) {
        setError(
          "Admin session expired or invalid. Please login again."
        );

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
  // FETCH VISITOR ANALYTICS
  // ==========================================

  useEffect(() => {
    fetchVisitorAnalytics();
  }, [visitorRange]);

  const fetchVisitorAnalytics = async () => {
    try {
      setVisitorLoading(true);
      setVisitorError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        setVisitorError("Admin authentication required.");
        setVisitorLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/analytics/visitors",
        {
          params: {
            range: visitorRange,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Visitor Analytics Response:",
        response.data
      );

      if (response.data?.success) {
        setVisitorAnalytics({
          summary: response.data.summary || {
            totalVisits: 0,
            uniqueVisitors: 0,
          },
          dailyStats: response.data.dailyStats || [],
          deviceStats: response.data.deviceStats || [],
          pageStats: response.data.pageStats || [],
        });
      }
    } catch (error) {
      console.error(
        "Visitor Analytics Error:",
        error
      );

      if (error.response?.status === 401) {
        setVisitorError(
          "Admin session expired. Please login again."
        );
      } else {
        setVisitorError(
          error.response?.data?.message ||
            "Failed to load visitor analytics."
        );
      }
    } finally {
      setVisitorLoading(false);
    }
  };

  // ==========================================
  // VISITOR RANGE TITLE
  // ==========================================

  const getVisitorRangeTitle = () => {
    switch (visitorRange) {
      case "today":
        return "Today";

      case "yesterday":
        return "Yesterday";

      case "7d":
        return "Last 7 Days";

      case "30d":
        return "Last 30 Days";

      case "thisMonth":
        return "This Month";

      case "lastMonth":
        return "Last Month";

      default:
        return "Last 7 Days";
    }
  };

  // ==========================================
  // FORMAT ANALYTICS DATE
  // ==========================================

  const formatAnalyticsDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  // ==========================================
  // ANALYTICS CALCULATIONS
  // ==========================================

  const dailyStats =
    visitorAnalytics.dailyStats || [];

  const maxDailyVisitors = Math.max(
    ...dailyStats.map(
      (item) => Number(item.uniqueVisitors) || 0
    ),
    1
  );

  const dailyAverage =
    dailyStats.length > 0
      ? Math.round(
          Number(
            visitorAnalytics.summary?.totalVisits || 0
          ) / dailyStats.length
        )
      : 0;

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
  // FORMAT ORDERS
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
          MAIN STATS
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
          WEBSITE VISITOR ANALYTICS
      ========================================== */}

      <section className="dashboard-section visitor-analytics-section">

        <div className="dashboard-section-header visitor-analytics-header">

          <div>
            <h2>Website Visitors</h2>

            <p>
              Track visitors and website activity.
            </p>
          </div>

          <select
            className="visitor-range-select"
            value={visitorRange}
            onChange={(e) =>
              setVisitorRange(e.target.value)
            }
          >
            <option value="today">
              Today
            </option>

            <option value="yesterday">
              Yesterday
            </option>

            <option value="7d">
              Last 7 Days
            </option>

            <option value="30d">
              Last 30 Days
            </option>

            <option value="thisMonth">
              This Month
            </option>

            <option value="lastMonth">
              Last Month
            </option>
          </select>

        </div>

        {visitorError && (
          <div className="visitor-error">
            {visitorError}
          </div>
        )}

        {visitorLoading ? (
          <div className="visitor-loading">
            Loading visitor analytics...
          </div>
        ) : (
          <>
            {/* ======================================
                VISITOR STATISTICS
            ====================================== */}

            <div className="visitor-stat-grid">

              <div className="visitor-stat-card">

                <div className="visitor-stat-icon">
                  <UserRound size={21} />
                </div>

                <div>
                  <span>
                    Unique Visitors
                  </span>

                  <strong>
                    {Number(
                      visitorAnalytics.summary
                        ?.uniqueVisitors || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                  <small>
                    Different visitors
                  </small>
                </div>

              </div>

              <div className="visitor-stat-card">

                <div className="visitor-stat-icon">
                  <Eye size={21} />
                </div>

                <div>
                  <span>
                    Total Visits
                  </span>

                  <strong>
                    {Number(
                      visitorAnalytics.summary
                        ?.totalVisits || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                  <small>
                    Total page visits
                  </small>
                </div>

              </div>

              <div className="visitor-stat-card">

                <div className="visitor-stat-icon">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <span>
                    Period
                  </span>

                  <strong className="visitor-period-value">
                    {getVisitorRangeTitle()}
                  </strong>

                  <small>
                    Selected range
                  </small>
                </div>

              </div>

              <div className="visitor-stat-card">

                <div className="visitor-stat-icon">
                  <TrendingUp size={21} />
                </div>

                <div>
                  <span>
                    Daily Average
                  </span>

                  <strong>
                    {dailyAverage.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <small>
                    Visits per day
                  </small>
                </div>

              </div>

            </div>

            {/* ======================================
                DAILY VISITOR GRAPH
            ====================================== */}

            <div className="visitor-chart-container">

              <div className="visitor-chart-title">
                <div>
                  <h3>
                    Daily Visitors
                  </h3>

                  <p>
                    Unique visitors per day
                  </p>
                </div>
              </div>

              {dailyStats.length === 0 ? (
                <div className="visitor-empty">
                  <UserRound size={28} />

                  <p>
                    No visitor data available
                    for this period.
                  </p>
                </div>
              ) : (
                <div className="visitor-chart">

                  {dailyStats.map((item) => {

                    const visitorCount =
                      Number(
                        item.uniqueVisitors
                      ) || 0;

                    const barHeight =
                      visitorCount > 0
                        ? Math.max(
                            (visitorCount /
                              maxDailyVisitors) *
                              100,
                            8
                          )
                        : 2;

                    return (
                      <div
                        className="visitor-chart-column"
                        key={item.date}
                      >

                        <div className="visitor-chart-value">
                          {visitorCount}
                        </div>

                        <div className="visitor-bar-wrapper">

                          <div
                            className="visitor-bar"
                            style={{
                              height: `${barHeight}%`,
                            }}
                            title={`${visitorCount} unique visitors`}
                          />

                        </div>

                        <span>
                          {formatAnalyticsDate(
                            item.date
                          )}
                        </span>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

            {/* ======================================
                DEVICE AND PAGE STATISTICS
            ====================================== */}

            <div className="visitor-details-grid">

              {/* DEVICES */}

              <div className="visitor-detail-card">

                <div className="visitor-detail-header">
                  <div>
                    <h3>
                      Devices
                    </h3>

                    <p>
                      Website visits by device
                    </p>
                  </div>
                </div>

                {visitorAnalytics.deviceStats
                  ?.length === 0 ? (

                  <div className="visitor-detail-empty">
                    No device data available.
                  </div>

                ) : (

                  <div className="visitor-device-list">

                    {visitorAnalytics.deviceStats.map(
                      (item) => (
                        <div
                          className="visitor-device-row"
                          key={item.device}
                        >

                          <span>
                            {item.device
                              ?.charAt(0)
                              .toUpperCase() +
                              item.device?.slice(1)}
                          </span>

                          <strong>
                            {Number(
                              item.count || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>
                      )
                    )}

                  </div>

                )}

              </div>

              {/* POPULAR PAGES */}

              <div className="visitor-detail-card">

                <div className="visitor-detail-header">
                  <div>
                    <h3>
                      Popular Pages
                    </h3>

                    <p>
                      Most visited pages
                    </p>
                  </div>
                </div>

                {visitorAnalytics.pageStats
                  ?.length === 0 ? (

                  <div className="visitor-detail-empty">
                    No page data available.
                  </div>

                ) : (

                  <div className="visitor-page-list">

                    {visitorAnalytics.pageStats
                      .slice(0, 5)
                      .map((item) => (
                        <div
                          className="visitor-page-row"
                          key={item.page}
                        >

                          <span title={item.page}>
                            {item.page}
                          </span>

                          <strong>
                            {Number(
                              item.visits || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>
                      ))}

                  </div>

                )}

              </div>

            </div>
          </>
        )}

      </section>

      {/* ==========================================
          MAIN CONTENT GRID
      ========================================== */}

      <div className="dashboard-content-grid">

        {/* ==========================================
            RECENT ORDERS
        ========================================== */}

        <section className="dashboard-section dashboard-orders">

          <div className="dashboard-section-header">

            <div>
              <h2>
                Recent Orders
              </h2>

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
              <h2>
                Products
              </h2>

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

