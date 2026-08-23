import {
  Bell,
  Menu,
  Search,
  UserRound,
} from "lucide-react";

import "./AdminHeader.css";

function AdminHeader({
  title = "Dashboard",
  onMenuClick,
}) {
  return (
    <header className="admin-header">

      {/* Left */}

      <div className="admin-header-left">

        <button
          type="button"
          className="admin-menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1>
            {title}
          </h1>

          <p>
            Welcome back, Admin
          </p>
        </div>

      </div>


      {/* Right */}

      <div className="admin-header-right">

        {/* Search */}

        <div className="admin-header-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>


        {/* Notifications */}

        <button
          type="button"
          className="admin-header-icon"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="notification-dot" />
        </button>


        {/* Profile */}

        <button
          type="button"
          className="admin-profile"
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