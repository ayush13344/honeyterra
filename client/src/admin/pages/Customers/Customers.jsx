import {
  Search,
  UserPlus,
  Mail,
  Phone,
} from "lucide-react";

import { useEffect, useState } from "react";

import AdminTable from "../../components/AdminTable/AdminTable";

import "./Customers.css";

function Customers() {
  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState([]);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    returningCustomers: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH CUSTOMERS
  // ==========================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      console.log("Customers Admin Token:", token);

      if (!token) {
        throw new Error("Admin token not found");
      }

      const response = await fetch(
        "http://localhost:3000/api/admin/customers",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Customers API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch customers"
        );
      }

      setCustomers(data.customers || []);

      setStats(
        data.stats || {
          totalCustomers: 0,
          newThisMonth: 0,
          returningCustomers: 0,
        }
      );
    } catch (error) {
      console.error("Fetch Customers Error:", error);

      setError(
        error.message || "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER CUSTOMERS
  // ==========================================

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.phone
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================

  const columns = [
    {
      key: "id",
      label: "Customer ID",
    },

    {
      key: "name",
      label: "Customer",
    },

    {
      key: "email",
      label: "Email",
    },

    {
      key: "orders",
      label: "Orders",
    },

    {
      key: "spent",
      label: "Total Spent",

      render: (customer) =>
        formatCurrency(customer.spent),
    },

    {
      key: "joined",
      label: "Joined",

      render: (customer) =>
        formatDate(customer.joined),
    },
  ];

  return (
    <div className="admin-customers-page">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="admin-page-heading">

        <div>
          <span className="admin-page-eyebrow">
            STORE
          </span>

          <h1>Customers</h1>

          <p>
            View and manage your HoneyTerra customers.
          </p>
        </div>

        <button className="admin-primary-button">
          <UserPlus size={17} />

          Add Customer
        </button>

      </div>

      {/* ==========================================
          STATS
      ========================================== */}

      <div className="customer-mini-stats">

        <div>
          <span>Total Customers</span>

          <strong>
            {stats.totalCustomers}
          </strong>
        </div>

        <div>
          <span>New This Month</span>

          <strong>
            {stats.newThisMonth}
          </strong>
        </div>

        <div>
          <span>Returning Customers</span>

          <strong>
            {stats.returningCustomers}
          </strong>
        </div>

      </div>

      {/* ==========================================
          SEARCH
      ========================================== */}

      <div className="customers-search">

        <Search size={17} />

        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fee2e2",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {/* ==========================================
          TABLE
      ========================================== */}

      <div className="customers-table-card">

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h3>No customers found</h3>

            <p>
              {search
                ? "Try a different search."
                : "No customers have registered yet."}
            </p>
          </div>
        ) : (
          <AdminTable
            columns={columns}
            data={filteredCustomers}
          />
        )}

      </div>

      {/* ==========================================
          CONTACT INFO
      ========================================== */}

      <div className="customer-contact-info">

        <div>
          <Mail size={17} />

          <span>
            Customer support
          </span>
        </div>

        <div>
          <Phone size={17} />

          <span>
            +91 XXXXX XXXXX
          </span>
        </div>

      </div>

    </div>
  );
}

export default Customers;