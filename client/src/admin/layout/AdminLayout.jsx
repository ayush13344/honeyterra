import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "../components/AdminHeader/AdminHeader";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

import "./AdminLayout.css";

function AdminLayout() {
  /*
   * ==============================
   * SIDEBAR STATE
   * ==============================
   */

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /*
   * Sidebar position:
   * false = LEFT
   * true  = RIGHT
   *
   * We remember the user's choice
   * using localStorage.
   */

  const [sidebarRight, setSidebarRight] = useState(() => {
    return localStorage.getItem("honeyterra-sidebar-position") === "right";
  });

  /*
   * ==============================
   * SIDEBAR CONTROLS
   * ==============================
   */

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /*
   * Change sidebar from LEFT ↔ RIGHT
   */

  const toggleSidebarPosition = () => {
    setSidebarRight((prev) => {
      const newPosition = !prev;

      localStorage.setItem(
        "honeyterra-sidebar-position",
        newPosition ? "right" : "left"
      );

      return newPosition;
    });

    /*
     * If the sidebar is currently open on mobile,
     * close it after changing position.
     */
    setSidebarOpen(false);
  };

  return (
    <div
      className={`admin-layout ${
        sidebarRight ? "sidebar-right" : ""
      }`}
    >
      {/* =================================
          SIDEBAR
      ================================= */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isRight={sidebarRight}
        onPositionToggle={toggleSidebarPosition}
      />

      {/* =================================
          MAIN AREA
      ================================= */}

      <div className="admin-main">

        {/* Header */}

        <AdminHeader
          onMenuClick={toggleSidebar}
          sidebarRight={sidebarRight}
          onSidebarPositionToggle={toggleSidebarPosition}
        />

        {/* Page Content */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

      {/* =================================
          MOBILE OVERLAY
      ================================= */}

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close admin sidebar"
        />
      )}
    </div>
  );
}

export default AdminLayout;