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
  const recentOrders = [
    {
      id: "#HT1005",
      customer: "Rahul Sharma",
      product: "Gel Ash Tray",
      amount: "₹498",
      status: "Paid",
    },
    {
      id: "#HT1004",
      customer: "Priya Singh",
      product: "Honeycomb Wrap",
      amount: "₹799",
      status: "Pending",
    },
    {
      id: "#HT1003",
      customer: "Aman Verma",
      product: "Gel Ash Tray",
      amount: "₹249",
      status: "Delivered",
    },
    {
      id: "#HT1002",
      customer: "Neha Patel",
      product: "Gel Ash Tray",
      amount: "₹498",
      status: "Shipped",
    },
  ];

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

  return (
    <div className="admin-dashboard-page">

      {/* Header */}

      <div className="admin-page-heading">

        <div>
          <span className="admin-page-eyebrow">
            OVERVIEW
          </span>

          <h1>Dashboard</h1>

          <p>
            Here's what's happening with your HoneyTerra store.
          </p>
        </div>

        <div className="dashboard-date">
          Today
        </div>

      </div>

      {/* Stats */}

     <div className="dashboard-stats">

  <StatCard
    title="Total Sales"
    value="₹12,450"
    icon={IndianRupee}
    change="+12.5%"
    positive={true}
  />

  <StatCard
    title="Total Orders"
    value="42"
    icon={ShoppingCart}
    change="+8.2%"
    positive={true}
  />

  <StatCard
    title="Customers"
    value="31"
    icon={Users}
    change="+5.4%"
    positive={true}
  />

  <StatCard
    title="Products"
    value="2"
    icon={ShoppingBag}
    change="Active"
    positive={true}
  />

</div>

      {/* Main grid */}

      <div className="dashboard-content-grid">

        {/* Recent Orders */}

        <section className="dashboard-section dashboard-orders">

          <div className="dashboard-section-header">

            <div>
              <h2>Recent Orders</h2>
              <p>Latest activity from your store.</p>
            </div>

            <button className="dashboard-view-button">
              View all
              <ArrowUpRight size={16} />
            </button>

          </div>

          <AdminTable
            columns={columns}
            data={recentOrders}
          />

        </section>

        {/* Products */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <h2>Products</h2>
              <p>Current store inventory.</p>
            </div>

          </div>

          <div className="dashboard-product-list">

            <div className="dashboard-product">

              <div className="dashboard-product-image">
                HT
              </div>

              <div>
                <h3>Gel Ash Tray</h3>
                <span>24 units in stock</span>
              </div>

              <strong>₹249</strong>

            </div>

            <div className="dashboard-product">

              <div className="dashboard-product-image">
                HW
              </div>

              <div>
                <h3>Honeycomb Wrap</h3>
                <span>Coming soon</span>
              </div>

              <strong>—</strong>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;