import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "../components/AdminHeader/AdminHeader";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

import "./AdminLayout.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Area */}
      <div className="admin-main">

        {/* Header */}
        <AdminHeader
          onMenuClick={toggleSidebar}
        />

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>

      </div>

      {/* Mobile Overlay */}
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