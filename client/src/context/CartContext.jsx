import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const CartContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://honeyterra.onrender.com";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
  // FETCH CART
  // =====================================================

  const fetchCart = async () => {
    const token = getToken();

    if (!token) {
      setCart({
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });

      return;
    }

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CART WHEN APP STARTS
  // =====================================================

  useEffect(() => {
    fetchCart();
  }, []);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (productId, quantity = 1) => {
    // Prevent invalid requests
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

    if (!token) {
      return {
        success: false,
        message: "Please login to add products to cart",
      };
    }

    // Prevent multiple simultaneous add requests
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
        // Update cart immediately with backend response
        setCart(response.data.cart);

        // Open cart drawer automatically
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
    if (!productId) {
      return;
    }

    if (quantity < 1) {
      return;
    }

    try {
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
    }
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeFromCart = async (productId) => {
    if (!productId) {
      return;
    }

    try {
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
    }
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = async () => {
    try {
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
        loading,
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