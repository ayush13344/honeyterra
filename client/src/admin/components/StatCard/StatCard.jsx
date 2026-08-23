import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import "./StatCard.css";

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel = "from last month",
  positive = true,
}) {
  return (
    <article className="admin-stat-card">

      <div className="admin-stat-top">

        <div className="admin-stat-icon">
          {Icon && <Icon size={20} />}
        </div>

        {change !== undefined && (
          <span
            className={`admin-stat-change ${
              positive ? "positive" : "negative"
            }`}
          >
            {positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}

            {change}
          </span>
        )}

      </div>


      <div className="admin-stat-content">

        <span className="admin-stat-title">
          {title}
        </span>

        <strong className="admin-stat-value">
          {value}
        </strong>

        {change !== undefined && (
          <span className="admin-stat-label">
            {changeLabel}
          </span>
        )}

      </div>

    </article>
  );
}

export default StatCard;