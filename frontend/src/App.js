import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar.jsx';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <nav className="breadcrumb">
              <a href="#">Home</a> / <a href="#">Dashboard</a>
            </nav>
          </div>
        </header>
        
        {/* Adicionando Filtros */}
        <div className="filter-container">
          <button className="filter-button" onClick={toggleFilter}>
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
          {isFilterOpen && (
            <div className="filter-options">
              <div className="filter-group">
                <label htmlFor="year">Select Year:</label>
                <select id="year" name="year" className="filter-select">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="month">Select Month:</label>
                <select id="month" name="month" className="filter-select">
                  <option value="january">January</option>
                  <option value="february">February</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="page-content">
          <Routes>
            <Route path="/" element={
              <div className="chart-section">
                <h3>Performance Chart</h3>
                {/* Aqui você pode adicionar seu gráfico */}
              </div>
            } />
            <Route path="/settings" element={
              <div className="settings-section">
                <h3>Settings</h3>
                {/* Adicione conteúdo de configurações */}
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;