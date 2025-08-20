import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import './App.css';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SubLimiteSN from './pages/SubLimiteSN';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#0277bd',
      light: '#58a5f0',
      dark: '#004c8c',
      contrastText: '#ffffff'
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: '#FAFAFA',
            minHeight: '100vh'
          }}
        >
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
            <Route path="/sub-limite-sn" element={<SubLimiteSN />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;