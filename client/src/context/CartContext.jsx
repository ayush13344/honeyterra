import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // AXIOS CONFIG
  // ==========================================

  const getConfig = () => {
    const token = getToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==========================================
  // FETCH CART
  // ==========================================

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

  // ==========================================
  // LOAD CART WHEN APP STARTS
  // ==========================================

  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please login to add products to cart");
      }

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

        // Open drawer automatically
        setCartOpen(true);

        return {
          success: true,
          message: response.data.message,
        };
      }

      return {
        success: false,
        message: response.data.message,
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

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQuantity = async (productId, quantity) => {
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

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeFromCart = async (productId) => {
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

  // ==========================================
  // CLEAR CART
  // ==========================================

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

  // ==========================================
  // OPEN / CLOSE DRAWER
  // ==========================================

  const openCart = () => {
    setCartOpen(true);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

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

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};