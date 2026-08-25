import {
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";

import axios from "axios";

import AdminTable from "../../components/AdminTable/AdminTable";

import "./Products.css";

import { Link, useNavigate } from "react-router-dom";

function Products() {
  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // GET ALL ADMIN PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      console.log("Products Admin Token:", token);

      if (!token) {
        setError(
          "Admin session not found. Please login again."
        );

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/products/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Admin Products Response:",
        response.data
      );

      if (response.data.success) {
        setProducts(
          response.data.products || []
        );
      } else {
        setError(
          response.data.message ||
            "Failed to fetch products"
        );
      }
    } catch (error) {
      console.error(
        "Get Admin Products Error:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Your admin session has expired. Please login again."
        );

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to access admin products."
        );

        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (productId) => {
    const product = products.find(
      (item) => item._id === productId
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);

      const token = localStorage.getItem(
        "adminToken"
      );

      if (!token) {
        setError(
          "Admin session not found. Please login again."
        );

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Delete Product Response:",
        response.data
      );

      if (response.data.success) {
        setProducts((previousProducts) =>
          previousProducts.filter(
            (item) =>
              item._id !== productId
          )
        );
      } else {
        setError(
          response.data.message ||
            "Failed to delete product"
        );
      }
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const searchValue =
        search.toLowerCase().trim();

      if (!searchValue) {
        return true;
      }

      return (
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.category
          ?.toLowerCase()
          .includes(searchValue) ||
        product._id
          ?.toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // ==========================================
  // TABLE COLUMNS
  // ==========================================

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
    {
      key: "actions",
      label: "Actions",
    },
  ];

  // ==========================================
  // FORMAT PRODUCTS FOR TABLE
  // ==========================================

  const formattedProducts =
    filteredProducts.map((product) => ({
      id: product._id
        ? `#${product._id
            .slice(-6)
            .toUpperCase()}`
        : "—",

      name: product.name || "Unnamed Product",

      category:
        product.category || "Uncategorized",

      price: `₹${Number(
        product.price || 0
      ).toLocaleString("en-IN")}`,

      stock:
        product.stock !== undefined
          ? product.stock
          : 0,

      status: product.isActive
        ? "Active"
        : "Inactive",

      actions: (
        <div className="products-row-actions">
          <button
            type="button"
            title="Edit Product"
            onClick={() =>
              navigate(
                `/admin/products/edit/${product._id}`
              )
            }
          >
            <Edit size={15} />
          </button>

          <button
            type="button"
            title="More Options"
          >
            <MoreVertical size={15} />
          </button>

          <button
            type="button"
            title="Delete Product"
            className="danger"
            disabled={
              deletingId === product._id
            }
            onClick={() =>
              handleDelete(product._id)
            }
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    }));

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-products-page">
        <div className="admin-page-heading">
          <div>
            <span className="admin-page-eyebrow">
              STORE
            </span>

            <h1>Products</h1>

            <p>
              Loading your HoneyTerra products...
            </p>
          </div>
        </div>

        <div className="products-table-card">
          <div className="products-table-header">
            <div>
              <h2>All Products</h2>

              <span>
                Loading products...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-products-page">
      {/* ==========================================
          HEADING
      ========================================== */}

      <div className="admin-page-heading">
        <div>
          <span className="admin-page-eyebrow">
            STORE
          </span>

          <h1>Products</h1>

          <p>
            Manage your HoneyTerra products and
            inventory.
          </p>
        </div>

        <Link to="/admin/products/add">
          <button className="admin-primary-button">
            <Plus size={17} />
            Add Product
          </button>
        </Link>
      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {/* ==========================================
          TOOLBAR
      ========================================== */}

      <div className="products-toolbar">
        <div className="products-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <button className="products-filter-button">
          All products
        </button>
      </div>

      {/* ==========================================
          TABLE
      ========================================== */}

      <div className="products-table-card">
        <div className="products-table-header">
          <div>
            <h2>All Products</h2>

            <span>
              {filteredProducts.length} products
            </span>
          </div>
        </div>

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {filteredProducts.length === 0 ? (
          <div className="products-empty-state">
            <p>
              {search
                ? "No products match your search."
                : "No products found."}
            </p>

            {!search && (
              <Link to="/admin/products/add">
                <button className="admin-primary-button">
                  <Plus size={17} />
                  Add Product
                </button>
              </Link>
            )}
          </div>
        ) : (
          <AdminTable
            columns={columns}
            data={formattedProducts}
          />
        )}

        {/* ==========================================
            ACTION NOTE
        ========================================== */}

        {filteredProducts.length > 0 && (
          <div className="products-action-note">
            <button
              type="button"
              onClick={() => {
                if (filteredProducts[0]?._id) {
                  navigate(
                    `/admin/products/edit/${filteredProducts[0]._id}`
                  );
                }
              }}
            >
              <Edit size={15} />
              Edit
            </button>

            <button type="button">
              <MoreVertical size={15} />
              More
            </button>

            <button
              type="button"
              className="danger"
              onClick={() => {
                if (
                  filteredProducts[0]?._id
                ) {
                  handleDelete(
                    filteredProducts[0]._id
                  );
                }
              }}
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;