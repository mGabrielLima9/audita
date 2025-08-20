import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    simplesNacional: false,
    tesouroNacional: false
  });
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="toggle-button">
          ☰
        </button>
        <div className="logo">
          <span className="logo-text">Audita</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="section-title">Menu Principal</div>
          <ul className="nav-list">
            <li className={`nav-item ${isActive('/') || isActive('/dashboard') ? 'active' : ''}`}>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span>
                <span className="nav-label">Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <div className="section-title">Simples Nacional</div>
          <ul className="nav-list">
            <li className="nav-item">
              <button 
                className="nav-link menu-toggle"
                onClick={() => toggleMenu('simplesNacional')}
              >
                <span className="nav-icon">🏢</span>
                <span className="nav-label">Simples Nacional</span>
                <span className={`nav-arrow ${expandedMenus.simplesNacional ? 'expanded' : ''}`}>
                  {expandedMenus.simplesNacional ? '▼' : '▶'}
                </span>
              </button>
              {expandedMenus.simplesNacional && (
                <ul className="submenu">
                  <li><Link to="/sub-limite-sn">Sub Limite SN</Link></li>
                  <li><Link to="/declaracoes">Declarações</Link></li>
                  <li><Link to="/parcelamentos">Parcelamentos</Link></li>
                  <li><Link to="/analise-dados">Análise de Dados</Link></li>
                </ul>
              )}
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <div className="section-title">Relatórios</div>
          <ul className="nav-list">
            <li className={`nav-item ${isActive('/tesouro-nacional') ? 'active' : ''}`}>
              <Link to="/tesouro-nacional" className="nav-link">
                <span className="nav-icon">💰</span>
                <span className="nav-label">Tesouro Nacional</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/resumo-fiscal') ? 'active' : ''}`}>
              <Link to="/resumo-fiscal" className="nav-link">
                <span className="nav-icon">📋</span>
                <span className="nav-label">Resumo Fiscal</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/diagnostico-fiscal') ? 'active' : ''}`}>
              <Link to="/diagnostico-fiscal" className="nav-link">
                <span className="nav-icon">🔍</span>
                <span className="nav-label">Diagnóstico Fiscal</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
