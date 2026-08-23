import {
  Search,
  UserPlus,
  Mail,
  Phone,
} from "lucide-react";

import { useState } from "react";

import AdminTable from "../../components/AdminTable/AdminTable";

import "./Customers.css";

function Customers() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: "CUS001",
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+91 98765 43210",
      orders: 3,
      spent: "₹1,247",
      joined: "12 Aug 2026",
    },
    {
      id: "CUS002",
      name: "Priya Singh",
      email: "priya@gmail.com",
      phone: "+91 98765 12345",
      orders: 2,
      spent: "₹998",
      joined: "10 Aug 2026",
    },
    {
      id: "CUS003",
      name: "Aman Verma",
      email: "aman@gmail.com",
      phone: "+91 98765 98765",
      orders: 1,
      spent: "₹249",
      joined: "07 Aug 2026",
    },
    {
      id: "CUS004",
      name: "Neha Patel",
      email: "neha@gmail.com",
      phone: "+91 98123 45678",
      orders: 4,
      spent: "₹1,496",
      joined: "05 Aug 2026",
    },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

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
    },
    {
      key: "joined",
      label: "Joined",
    },
  ];

  return (
    <div className="admin-customers-page">

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

      {/* Stats */}

      <div className="customer-mini-stats">

        <div>
          <span>Total Customers</span>
          <strong>31</strong>
        </div>

        <div>
          <span>New This Month</span>
          <strong>8</strong>
        </div>

        <div>
          <span>Returning Customers</span>
          <strong>12</strong>
        </div>

      </div>

      {/* Search */}

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

      {/* Table */}

      <div className="customers-table-card">

        <AdminTable
          columns={columns}
          data={filteredCustomers}
        />

      </div>

      {/* Contact quick actions */}

      <div className="customer-contact-info">

        <div>
          <Mail size={17} />
          <span>Customer support</span>
        </div>

        <div>
          <Phone size={17} />
          <span>+91 XXXXX XXXXX</span>
        </div>

      </div>

    </div>
  );
}

export default Customers;