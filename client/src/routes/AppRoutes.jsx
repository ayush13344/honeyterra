import { Routes, Route } from "react-router-dom";

import SiteLayout from "../components/layout/SiteLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Shop from "../pages/Shop/Shop";
import Checkout from "../pages/Checkout/Checkout";

import GelAshTray from "../pages/Products/GelAshTray/GelAshTray";
import HoneycombWrap from "../pages/Products/HoneycombWrap/HoneycombWrap";

import CartDrawer from "../components/CartDrawer/CartDrawer";

/* Admin */

import AdminLayout from "../admin/layout/AdminLayout";

import AdminLogin from "../admin/pages/AdminLogin/AdminLogin";
import Dashboard from "../admin/pages/Dashboard/Dashboard";
import Products from "../admin/pages/Products/Products";
import Orders from "../admin/pages/Orders/Orders";
import OrderDetails from "../admin/pages/Orders/OrderDetails";
import Customers from "../admin/pages/Customers/Customers";
import Settings from "../admin/pages/Settings/Settings";
import AddProduct from "../admin/pages/Products/AddProduct";
import UProducts from "../pages/Products/UProducts";
import ProductDetails from "../pages/ProductDetails/ProductDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          CUSTOMER WEBSITE
      ========================= */}

      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/products" element={<UProducts />} />

        <Route path="/shop/wrap" element={<HoneycombWrap />} />

        <Route path="/shop/ash-tray" element={<GelAshTray />} />

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<CartDrawer />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/checkout" element={<Checkout />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />

        <Route path="/admin/products" element={<Products />} />

        <Route path="/admin/products/add" element={<AddProduct />} />

        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/orders/:orderId" element={<OrderDetails />} />

        <Route path="/admin/customers" element={<Customers />} />

        <Route path="/admin/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
