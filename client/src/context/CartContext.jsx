
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://honeyterra.onrender.com";

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  const [cartOpen, setCartOpen] = useState(false);

  // Used for add/update/remove actions
  const [loading, setLoading] = useState(false);

  // Used only while fetching the cart
  const [cartLoading, setCartLoading] = useState(false);

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // AXIOS CONFIG
  // =====================================================

  const getConfig = () => {
    const token = getToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =====================================================
  // RESET CART
  // =====================================================

  const resetCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalAmount: 0,
    });
  };

  // =====================================================
  // FETCH CART
  // =====================================================

  const fetchCart = async () => {
    const token = getToken();

    if (!token) {
      resetCart();
      return;
    }

    try {
      setCartLoading(true);

      const response = await axios.get(
        `${API_URL}/api/cart`,
        getConfig()
      );

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error(
        "Fetch Cart Error:",
        error.response?.data || error.message
      );

      // If token is invalid/expired
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        resetCart();
      }
    } finally {
      setCartLoading(false);
    }
  };

  // =====================================================
  // FETCH CART WHEN AUTHENTICATION CHANGES
  // =====================================================

  useEffect(() => {
    // Wait until AuthContext finishes checking authentication
    if (authLoading) {
      return;
    }

    // User is logged in
    if (user) {
      fetchCart();
    } else {
      // User logged out
      resetCart();
    }
  }, [user, authLoading]);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (productId, quantity = 1) => {
    if (!productId) {
      return {
        success: false,
        message: "Product ID is missing",
      };
    }

    if (!quantity || quantity < 1) {
      quantity = 1;
    }

    const token = getToken();

    // Authentication validation
    if (!token || !user) {
      return {
        success: false,
        message: "Please login to add products to cart",
        requiresLogin: true,
      };
    }

    // Only block another cart action.
    // cartLoading does NOT block Add to Cart.
    if (loading) {
      return {
        success: false,
        message: "Please wait...",
      };
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/cart/add`,
        {
          productId,
          quantity,
        },
        getConfig()
      );

      if (response.data.success) {
        setCart(response.data.cart);

        setCartOpen(true);

        return {
          success: true,
          message:
            response.data.message ||
            "Product added to cart",
        };
      }

      return {
        success: false,
        message:
          response.data.message ||
          "Unable to add product to cart",
      };
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error.response?.data || error.message
      );

      // Token expired / invalid
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        return {
          success: false,
          message: "Your session has expired. Please login again.",
          requiresLogin: true,
        };
      }

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Unable to add product to cart",
      };
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (!productId || quantity < 1) {
      return;
    }

    const token = getToken();

    if (!token || !user) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${API_URL}/api/cart/update/${productId}`,
        {
          quantity,
        },
        getConfig()
      );

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error(
        "Update Cart Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to update cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeFromCart = async (productId) => {
    if (!productId) {
      return;
    }

    const token = getToken();

    if (!token || !user) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.delete(
        `${API_URL}/api/cart/remove/${productId}`,
        getConfig()
      );

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error(
        "Remove Cart Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = async () => {
    const token = getToken();

    if (!token || !user) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.delete(
        `${API_URL}/api/cart/clear`,
        getConfig()
      );

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error(
        "Clear Cart Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN / CLOSE CART
  // =====================================================

  const openCart = () => {
    setCartOpen(true);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,

        // Action loading
        loading,

        // Fetching loading
        cartLoading,

        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};
