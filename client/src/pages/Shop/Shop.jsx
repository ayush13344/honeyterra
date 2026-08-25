import { useEffect, useMemo, useState } from "react";
import {
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../../components/ProductCard/ProductCard";

import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * Change this URL if your backend uses
         * a different products endpoint.
         */
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        /*
         * Supports both:
         *
         * { products: [...] }
         *
         * and
         *
         * [...]
         */

        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(productList);

      } catch (err) {
        console.error("Product fetch error:", err);

        setError(
          "Unable to load products right now."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }

    return products.filter((product) => {
      const category =
        product.category?.toLowerCase() || "";

      if (activeFilter === "gel-ash-tray") {
        return (
          category.includes("gel") &&
          category.includes("ash")
        );
      }

      if (activeFilter === "honeycomb-wrap") {
        return (
          category.includes("honeycomb") ||
          category.includes("honey comb") ||
          category.includes("wrap")
        );
      }

      return true;
    });
  }, [products, activeFilter]);


  /* =====================================================
     FILTER HANDLER
  ===================================================== */

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };


  return (
    <main className="shop-page">

      {/* =====================================================
          DARK SHOP HEADER
      ===================================================== */}

      <section className="shop-header">

        <div className="shop-container">

          <span className="shop-header-eyebrow">
            HONEYTERRA COLLECTION
          </span>

          <h1>
            Shop everything
          </h1>

          <p>
            Thoughtfully made essentials for a cleaner home —
            practical products designed for everyday life.
          </p>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="shop-products">

        <div className="shop-container">

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="shop-heading">

            <div>

              <span className="section-eyebrow">
                OUR COLLECTION
              </span>

              <h2>
                All products
              </h2>

            </div>

            <p>
              Simple products. Practical solutions.
              Thoughtfully made.
            </p>

          </div>


          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="shop-filters">

            <button
              type="button"
              className={
                activeFilter === "all"
                  ? "shop-filter active"
                  : "shop-filter"
              }
              onClick={() =>
                handleFilterChange("all")
              }
            >
              All Products
            </button>


            <button
              type="button"
              className={
                activeFilter === "gel-ash-tray"
                  ? "shop-filter active"
                  : "shop-filter"
              }
              onClick={() =>
                handleFilterChange("gel-ash-tray")
              }
            >
              Gel Ash Trays
            </button>


            <button
              type="button"
              className={
                activeFilter === "honeycomb-wrap"
                  ? "shop-filter active"
                  : "shop-filter"
              }
              onClick={() =>
                handleFilterChange("honeycomb-wrap")
              }
            >
              Honey Comb Wraps
            </button>

          </div>


          {/* =================================================
              PRODUCT COUNT
          ================================================= */}

          <div className="shop-product-count">

            {loading
              ? "Loading products..."
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1
                    ? "product"
                    : "products"
                }`
            }

          </div>


          {/* =================================================
              PRODUCTS
          ================================================= */}

          {loading ? (

            <div className="shop-loading">

              <div className="shop-loading-spinner"></div>

              <p>
                Loading our collection...
              </p>

            </div>

          ) : error ? (

            <div className="shop-error">

              <h3>
                Something went wrong
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>

            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="shop-empty">

              <div className="shop-empty-icon">
                <Sparkles size={24} />
              </div>

              <h3>
                No products found
              </h3>

              <p>
                There are currently no products in
                this category.
              </p>

              <button
                type="button"
                onClick={() =>
                  handleFilterChange("all")
                }
              >
                View all products
              </button>

            </div>

          ) : (

            <div className="shop-product-grid">

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product._id}
                  product={product}
                />

              ))}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          BENEFITS
      ===================================================== */}

      <section className="shop-benefits">

        <div className="shop-container">

          <div className="shop-benefits-heading">

            <span className="section-eyebrow">
              WHY HONEYTERRA
            </span>

            <h2>
              Good products should
              <br />
              make sense.
            </h2>

          </div>


          <div className="shop-benefits-grid">

            <div className="shop-benefit">

              <div className="shop-benefit-icon">
                <Leaf size={23} />
              </div>

              <h3>
                Eco Friendly
              </h3>

              <p>
                Thoughtfully designed products with
                sustainability in mind.
              </p>

            </div>


            <div className="shop-benefit">

              <div className="shop-benefit-icon">
                <ShieldCheck size={23} />
              </div>

              <h3>
                Made for Real Life
              </h3>

              <p>
                Practical products designed around
                everyday needs.
              </p>

            </div>


            <div className="shop-benefit">

              <div className="shop-benefit-icon">
                <Sparkles size={23} />
              </div>

              <h3>
                Made with Care
              </h3>

              <p>
                Thoughtful design without unnecessary
                complexity.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="shop-cta">

        <div>

          <span className="section-eyebrow shop-cta-eyebrow">
            HONEYTERRA
          </span>

          <h2>
            Choose better.
            <br />
            Keep it simple.
          </h2>

          <Link
            to="/contact"
            className="shop-cta-button"
          >
            Have a question?
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Shop;