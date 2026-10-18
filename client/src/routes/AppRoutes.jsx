import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import SiteLayout from "../components/layout/SiteLayout";

// Immediate storefront routes for fastest FCP/LCP
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";

// Code-split / Lazy load customer pages
const Login = lazy(() => import("../pages/Auth/Login"));
const Signup = lazy(() => import("../pages/Auth/Signup"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const Checkout = lazy(() => import("../pages/Checkout/Checkout"));
const GelAshTray = lazy(() => import("../pages/Products/GelAshTray/GelAshTray"));
const HoneycombWrap = lazy(() => import("../pages/Products/HoneycombWrap/HoneycombWrap"));
const CartDrawer = lazy(() => import("../components/CartDrawer/CartDrawer"));
const OrderConfirmation = lazy(() => import("../pages/OrderConfirmation/OrderConfirmation"));
const UProducts = lazy(() => import("../pages/Products/UProducts"));
const ProductDetails = lazy(() => import("../pages/ProductDetails/ProductDetails"));
const MyOrders = lazy(() => import("../pages/MyOrders/MyOrders"));
const TrackOrder = lazy(() => import("../pages/Orders/TrackOrder"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

// Code-split Admin Panel completely out of storefront initial bundle
const AdminLayout = lazy(() => import("../admin/layout/AdminLayout"));
const Dashboard = lazy(() => import("../admin/pages/Dashboard/Dashboard"));
const Products = lazy(() => import("../admin/pages/Products/Products"));
const EditProduct = lazy(() => import("../admin/pages/Products/EditProduct"));
const Orders = lazy(() => import("../admin/pages/Orders/Orders"));
const OrderDetails = lazy(() => import("../admin/pages/Orders/OrderDetails"));
const Customers = lazy(() => import("../admin/pages/Customers/Customers"));
const Settings = lazy(() => import("../admin/pages/Settings/Settings"));
const AddProduct = lazy(() => import("../admin/pages/Products/AddProduct"));

// Lightweight suspense fallback
function PageLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #d4a373",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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

          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/my-orders" element={<MyOrders />} />

          <Route path="/my-orders/:id" element={<TrackOrder />} />

          <Route path="/cart" element={<CartDrawer />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* =========================
            ADMIN PANEL
        ========================= */}

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />

          <Route path="/admin/products" element={<Products />} />

          <Route path="/admin/products/add" element={<AddProduct />} />

          <Route path="/admin/products/edit/:id" element={<EditProduct />} />

          <Route path="/admin/orders" element={<Orders />} />

          <Route path="/admin/orders/:orderId" element={<OrderDetails />} />

          <Route path="/admin/customers" element={<Customers />} />

          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
