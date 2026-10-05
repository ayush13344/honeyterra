
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER ON APP START
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const result = await getCurrentUser();

        if (result.user) {
          setUser(result.user);

          localStorage.setItem(
            "user",
            JSON.stringify(result.user)
          );
        }
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = (userData, token) => {
    if (!userData || !token) {
      console.error(
        "Login failed: user or token missing"
      );
      return;
    }

    const isAdmin = userData.role === "admin";

    if (isAdmin) {
      localStorage.setItem(
        "adminToken",
        token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(userData)
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } else {
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    }

    // IMPORTANT:
    // This immediately updates AuthContext.
    // CartContext is listening to this change.
    setUser(userData);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useAuth = () => {
  return useContext(AuthContext);
};
