import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "./AdminSidebar.css";

function AdminSidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`admin-sidebar-overlay ${
          isOpen ? "show" : ""
        }`}
        onClick={onClose}
      />

      <aside
        className={`admin-sidebar ${
          isOpen ? "open" : ""
        }`}
      >
        {/* Logo */}

        <div className="admin-sidebar-top">

          <div className="admin-sidebar-logo">
            <span className="admin-logo-icon">
              H
            </span>

            <div>
              <h2>HoneyTerra</h2>
              <span>Admin Panel</span>
            </div>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>

        </div>


        {/* Navigation */}

        <nav className="admin-sidebar-nav">

          <p className="admin-nav-title">
            MANAGEMENT
          </p>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                  `admin-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={19} />

                <span>
                  {item.label}
                </span>
              </NavLink>
            );
          })}

        </nav>


        {/* Bottom */}

        <div className="admin-sidebar-bottom">

          <button
            type="button"
            className="admin-logout-button"
          >
            <LogOut size={19} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;