import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (sidebarOpen) {
      // Animação de fechamento
      document.querySelector('.sidebar').style.width = '0';
    } else {
      // Animação de abertura
      document.querySelector('.sidebar').style.width = '240px';
    }
  };

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="toggle-button">
          ☰
        </button>
        <div className="logo">
          <span className="logo-text">Dashboard</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="section-title">Menu</div>
          <ul className="nav-list">
            <li className="nav-item active">
              <span className="nav-label">Home</span>
              <span className="nav-arrow">▶</span>
            </li>
            <li className="nav-item">
              <span className="nav-label">Settings</span>
              <span className="nav-arrow">▶</span>
            </li>
            <li className="nav-item">
              <span className="nav-label">Analytics</span>
              <span className="nav-arrow">▶</span>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
