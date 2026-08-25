import {
  Bell,
  Menu,
  PanelLeft,
  PanelRight,
  Search,
  UserRound,
} from "lucide-react";

import "./AdminHeader.css";

function AdminHeader({
  title = "Dashboard",
  onMenuClick,
  sidebarRight = false,
  onSidebarPositionToggle,
}) {
  return (
    <header className="admin-header">

      {/* =================================
          LEFT
      ================================= */}

      <div className="admin-header-left">

        {/* Mobile / Tablet Menu */}

        <button
          type="button"
          className="admin-menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
          title="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Page Title */}

        <div>
          <h1>{title}</h1>

          <p>
            Welcome back, Admin
          </p>
        </div>

      </div>


      {/* =================================
          RIGHT
      ================================= */}

      <div className="admin-header-right">

        {/* Search */}

        <div className="admin-header-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
            aria-label="Search admin panel"
          />

        </div>


        {/* =================================
            SIDEBAR POSITION
        ================================= */}

        <button
          type="button"
          className="admin-header-icon admin-sidebar-position-button"
          onClick={onSidebarPositionToggle}
          aria-label={
            sidebarRight
              ? "Move sidebar to left"
              : "Move sidebar to right"
          }
          title={
            sidebarRight
              ? "Move sidebar to left"
              : "Move sidebar to right"
          }
        >
          {sidebarRight ? (
            <PanelLeft size={18} />
          ) : (
            <PanelRight size={18} />
          )}
        </button>


        {/* =================================
            NOTIFICATIONS
        ================================= */}

        <button
          type="button"
          className="admin-header-icon"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />

          <span className="notification-dot" />
        </button>


        {/* =================================
            PROFILE
        ================================= */}

        <button
          type="button"
          className="admin-profile"
          aria-label="Admin profile"
        >

          <div className="admin-profile-avatar">
            <UserRound size={17} />
          </div>

          <div className="admin-profile-info">

            <strong>
              Admin
            </strong>

            <span>
              Administrator
            </span>

          </div>

        </button>

      </div>

    </header>
  );
}

export default AdminHeader;