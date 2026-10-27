import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ProductContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL || "https://honeyterra.onrender.com";

const CACHE_KEY = "honeyterra_products_cache";
const CACHE_TIME_KEY = "honeyterra_products_cache_time";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const ProductProvider = ({ children }) => {
  // Initialize state synchronously from sessionStorage for 0ms initial render
  const [products, setProducts] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CACHE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return !parsed || parsed.length === 0;
    } catch {
      return true;
    }
  });

  const [error, setError] = useState("");

  // ==========================================
  // BACKGROUND HEALTH PING (PRE-WARM SERVER)
  // ==========================================
  useEffect(() => {
    // Send lightweight non-blocking ping to keep/wake server container
    fetch(`${API_URL}/api/health`, { method: "GET" }).catch(() => {});
  }, []);

  // ==========================================
  // FETCH PRODUCTS WITH CACHE PERSISTENCE
  // ==========================================
  const fetchProducts = useCallback(async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    }
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/products`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      const productList = Array.isArray(data)
        ? data
        : data.products || [];

      setProducts(productList);

      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(productList));
        sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      } catch (storageError) {
        // Handle storage quota exceeded gracefully
      }
    } catch (err) {
      console.error("Product fetch error:", err);
      if (!isBackground) {
        setError("Unable to load products right now.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // STALE-WHILE-REVALIDATE LOGIC
  // ==========================================
  useEffect(() => {
    const cachedTime = Number(
      sessionStorage.getItem(CACHE_TIME_KEY) || 0
    );
    const isStale = Date.now() - cachedTime > CACHE_TTL;

    if (products.length === 0) {
      fetchProducts(false);
    } else if (isStale) {
      // Revalidate in background without blocking UI
      fetchProducts(true);
    }
  }, [fetchProducts, products.length]);

  // ==========================================
  // INSTANT PRODUCT LOOKUP HELPER
  // ==========================================
  const getProduct = useCallback(
    (id) => {
      if (!id || !products.length) return null;
      return (
        products.find(
          (p) =>
            p._id === id ||
            p.slug === id ||
            p._id?.toString() === id?.toString()
        ) || null
      );
    },
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        getProduct,
        refreshProducts: () => fetchProducts(true),
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export default ProductContext;
