import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="App">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-content">
        <Header />
        <div className="page-content">
          {currentPage === 'dashboard' && <Dashboard />}
        </div>
      </div>
    </div>
  );
}

export default App;