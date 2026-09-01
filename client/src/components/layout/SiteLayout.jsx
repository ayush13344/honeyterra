import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "../CartDrawer/CartDrawer";

function SiteLayout() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      <Navbar isAuthPage={isAuthPage} />

      <main className={isAuthPage ? "auth-main" : ""}>
        <Outlet />
      </main>

      {!isAuthPage && <Footer />}

      <CartDrawer />
    </>
  );
}

export default SiteLayout;