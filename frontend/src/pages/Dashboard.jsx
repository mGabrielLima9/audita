// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CompetenciaSelector from '../components/CompetenciaSelector';
import StatsCards from '../components/StatsCards';
import '../Dashboard.css';

const Dashboard = () => {
  const [competencia, setCompetencia] = useState('202507');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar dados do dashboard
  const loadDashboardData = async (comp) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.getDashboardData(comp);
      setDashboardData(data);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData(competencia);
  }, []);

  // Quando competência muda
  const handleCompetenciaChange = (novaCompetencia) => {
    setCompetencia(novaCompetencia);
    loadDashboardData(novaCompetencia);
  };

  const formatCompetenciaDisplay = (comp) => {
    const ano = comp.substring(0, 4);
    const mes = comp.substring(4, 6);
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  if (loading && !dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">
          <h2>❌ Erro</h2>
          <p>{error}</p>
          <button onClick={() => loadDashboardData(competencia)} className="btn-retry">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Dashboard - Auditor Digital</h1>
        <p className="subtitle">Município de Morros - Simples Nacional</p>
        
        <CompetenciaSelector 
          competencia={competencia}
          onCompetenciaChange={handleCompetenciaChange}
          loading={loading}
        />
      </div>

      {dashboardData && (
        <>
          <div className="competencia-info">
            <h2>Dados do Simples Nacional - {formatCompetenciaDisplay(competencia)}</h2>
            {loading && <span className="loading-indicator">🔄 Atualizando...</span>}
          </div>

          <StatsCards data={dashboardData} />

          <div className="dashboard-footer">
            <div className="summary">
              <h3>📋 Resumo da Auditoria</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>Taxa de Declaração:</strong> 
                  <span className={dashboardData.percentual_declararam > 80 ? 'good' : 'warning'}>
                    {dashboardData.percentual_declararam}%
                  </span>
                </div>
                <div className="summary-item">
                  <strong>Taxa de Inadimplência:</strong> 
                  <span className={dashboardData.percentual_inadimplentes > 20 ? 'bad' : 'good'}>
                    {dashboardData.percentual_inadimplentes}%
                  </span>
                </div>
                <div className="summary-item">
                  <strong>Estabelecimentos Ativos:</strong> 
                  <span>{dashboardData.estabelecimentos_ativos.toLocaleString('pt-BR')}</span>
                </div>
                <div className="summary-item">
                  <strong>Receita Total Declarada:</strong> 
                  <span>{dashboardData.valor_declarado_total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;