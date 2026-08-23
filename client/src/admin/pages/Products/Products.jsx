import {
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import AdminTable from "../../components/AdminTable/AdminTable";

import "./Products.css";

function Products() {
  const [search, setSearch] = useState("");

  const products = [
    {
      id: "HT-P001",
      name: "Gel Ash Tray",
      category: "Ash Tray",
      price: "₹249",
      stock: 24,
      status: "Active",
    },
    {
      id: "HT-P002",
      name: "Honeycomb Wrap",
      category: "Packaging",
      price: "—",
      stock: 0,
      status: "Coming Soon",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "id",
      label: "Product ID",
    },
    {
      key: "name",
      label: "Product",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "stock",
      label: "Stock",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  return (
    <div className="admin-products-page">

      {/* Heading */}

      <div className="admin-page-heading">

        <div>
          <span className="admin-page-eyebrow">
            STORE
          </span>

          <h1>Products</h1>

          <p>
            Manage your HoneyTerra products and inventory.
          </p>
        </div>

        <button className="admin-primary-button">
          <Plus size={17} />
          Add Product
        </button>

      </div>

      {/* Toolbar */}

      <div className="products-toolbar">

        <div className="products-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <button className="products-filter-button">
          All products
        </button>

      </div>

      {/* Table */}

      <div className="products-table-card">

        <div className="products-table-header">

          <div>
            <h2>All Products</h2>
            <span>
              {filteredProducts.length} products
            </span>
          </div>

        </div>

        <AdminTable
          columns={columns}
          data={filteredProducts}
        />

        {/* Actions */}

        <div className="products-action-note">

          <button>
            <Edit size={15} />
            Edit
          </button>

          <button>
            <MoreVertical size={15} />
            More
          </button>

          <button className="danger">
            <Trash2 size={15} />
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default Products;