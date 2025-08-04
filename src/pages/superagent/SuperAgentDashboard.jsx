import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTicketAlt, FaChartBar } from 'react-icons/fa';
import './superAgent.css';

function SuperAgentDashboard() {
  return (
    <div className="super-agent-dashboard">
      <aside className="sidebar">
        <h2>Super Agent</h2>
        <nav className="sidebar-nav">
          <NavLink to="/superagent/analytics">
            <FaChartBar className="icon" /> Analytics
          </NavLink>
          <NavLink to="/superagent/tickets">
            <FaTicketAlt className="icon" /> All Tickets
          </NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAgentDashboard;