import { Routes, Route } from "react-router-dom";

import SiteLayout from "../components/layout/SiteLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Shop from "../pages/Shop/Shop";

import GelAshTray from "../pages/Products/GelAshTray/GelAshTray";
import HoneycombWrap from "../pages/Products/HoneycombWrap/HoneycombWrap";

import CartDrawer from "../components/CartDrawer/CartDrawer";

/* Admin */

import AdminLayout from "../admin/layout/AdminLayout";

import AdminLogin from "../admin/pages/AdminLogin/AdminLogin";
import Dashboard from "../admin/pages/Dashboard/Dashboard";
import Products from "../admin/pages/Products/Products";
import Orders from "../admin/pages/Orders/Orders";
import Customers from "../admin/pages/Customers/Customers";
import Settings from "../admin/pages/Settings/Settings";

function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          CUSTOMER WEBSITE
      ========================= */}

      <Route element={<SiteLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/shop/wrap"
          element={<HoneycombWrap />}
        />

        <Route
          path="/shop/ash-tray"
          element={<GelAshTray />}
        />

        <Route
          path="/cart"
          element={<CartDrawer />}
        />

        <Route
          path="/search"
          element={<h1>Search</h1>}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

      </Route>

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        element={<AdminLayout />}
      >

        <Route
          path="/admin"
          element={<Dashboard />}
        />

        <Route
          path="/admin/products"
          element={<Products />}
        />

        <Route
          path="/admin/orders"
          element={<Orders />}
        />

        <Route
          path="/admin/customers"
          element={<Customers />}
        />

        <Route
          path="/admin/settings"
          element={<Settings />}
        />

      </Route>

    </Routes>
  );
}

export default AppRoutes;