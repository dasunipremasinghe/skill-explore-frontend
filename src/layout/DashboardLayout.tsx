import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../CSS/DashboardLayout.css"; 

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">🏠 Dashboard</Link>
            </li>
            <li className={location.pathname.startsWith("/plans") ? "active" : ""}>
              <Link to="/plans">📚 My Plans</Link>
            </li>
            <li className={location.pathname.startsWith("/explore") ? "active" : ""}>
              <Link to="/explore">🌐 Explore</Link>
            </li>
            <li className={location.pathname.startsWith("/plans/create") ? "active" : ""}>
              <Link to="/plans/create">✏️ Create Plan</Link>
            </li>
            <li>
              <Link to="/logout">🚪 Logout</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
