import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simples-nacional" element={
            <div className="page-content">
              <h2>Simples Nacional</h2>
              <p>Conteúdo do Simples Nacional será implementado aqui.</p>
            </div>
          } />
          <Route path="/tesouro-nacional" element={
            <div className="page-content">
              <h2>Tesouro Nacional</h2>
              <p>Conteúdo do Tesouro Nacional será implementado aqui.</p>
            </div>
          } />
          <Route path="/resumo-fiscal" element={
            <div className="page-content">
              <h2>Resumo Fiscal</h2>
              <p>Conteúdo do Resumo Fiscal será implementado aqui.</p>
            </div>
          } />
          <Route path="/diagnostico-fiscal" element={
            <div className="page-content">
              <h2>Diagnóstico Fiscal</h2>
              <p>Conteúdo do Diagnóstico Fiscal será implementado aqui.</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default App;