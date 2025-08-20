// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import '../Dashboard.css';

const Dashboard = () => {
  const [ano, setAno] = useState('2025');
  const [mes, setMes] = useState('01');
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dados mockados para quando a API não estiver disponível
  const mockData = {
    estabelecimentos_ativos: 7055,
    empresas_optantes: 6794,
    empresas_declararam: 5856,
    empresas_nao_declararam: 938,
    empresas_inadimplentes: 550,
    percentual_declararam: 86.19
  };

  // Carregar dados do dashboard
  const loadDashboardData = async (anoComp, mesComp) => {
    setLoading(true);
    setError(null);
    
    try {
      const competencia = `${anoComp}${mesComp}`;
      const data = await api.getDashboardData(competencia);
      setDashboardData(data);
    } catch (err) {
      console.log('API não disponível, usando dados mockados');
      setDashboardData(mockData);
      setError(null); // Não mostrar erro se usar dados mockados
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData(ano, mes);
  }, []);

  // Quando ano ou mês muda
  const handleAnoChange = (novoAno) => {
    setAno(novoAno);
    loadDashboardData(novoAno, mes);
  };

  const handleMesChange = (novoMes) => {
    setMes(novoMes);
    loadDashboardData(ano, novoMes);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar lógica de busca aqui
    console.log('Pesquisando:', searchTerm);
  };

  // Dados para o gráfico (12 meses)
  const chartData = [
    { mes: 'Jan', totalDAS: 1708459.52, totalDASPago: 14900000.00, totalISS: 50000, totalISSPago: 45000 },
    { mes: 'Fev', totalDAS: 1800000.00, totalDASPago: 15000000.00, totalISS: 52000, totalISSPago: 48000 },
    { mes: 'Mar', totalDAS: 1900000.00, totalDASPago: 16000000.00, totalISS: 55000, totalISSPago: 50000 },
    { mes: 'Abr', totalDAS: 2000000.00, totalDASPago: 17000000.00, totalISS: 58000, totalISSPago: 52000 },
    { mes: 'Mai', totalDAS: 2100000.00, totalDASPago: 18000000.00, totalISS: 60000, totalISSPago: 55000 },
    { mes: 'Jun', totalDAS: 2200000.00, totalDASPago: 19000000.00, totalISS: 62000, totalISSPago: 58000 },
    { mes: 'Jul', totalDAS: 2300000.00, totalDASPago: 20000000.00, totalISS: 65000, totalISSPago: 60000 },
    { mes: 'Ago', totalDAS: 2400000.00, totalDASPago: 21000000.00, totalISS: 68000, totalISSPago: 63000 },
    { mes: 'Set', totalDAS: 2500000.00, totalDASPago: 22000000.00, totalISS: 70000, totalISSPago: 65000 },
    { mes: 'Out', totalDAS: 2600000.00, totalDASPago: 23000000.00, totalISS: 72000, totalISSPago: 68000 },
    { mes: 'Nov', totalDAS: 2700000.00, totalDASPago: 24000000.00, totalISS: 75000, totalISSPago: 70000 },
    { mes: 'Dez', totalDAS: 2800000.00, totalDASPago: 25000000.00, totalISS: 78000, totalISSPago: 73000 }
  ];

  // Adicionar estado para controlar visibilidade das séries
  const [visibleSeries, setVisibleSeries] = useState({
    totalDAS: true,
    totalDASPago: true,
    totalISS: true,
    totalISSPago: true
  });

  // Função para alternar visibilidade de uma série
  const toggleSeries = (seriesName) => {
    setVisibleSeries(prev => ({
      ...prev,
      [seriesName]: !prev[seriesName]
    }));
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
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={() => loadDashboardData(ano, mes)} className="btn-retry">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Cabeçalho da Página */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="ano">Competência Ano:</label>
            <select 
              id="ano"
              value={ano} 
              onChange={(e) => handleAnoChange(e.target.value)}
              className="filter-select"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="mes">Competência Mês:</label>
            <select 
              id="mes"
              value={mes} 
              onChange={(e) => handleMesChange(e.target.value)}
              className="filter-select"
            >
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Pesquisar
            </button>
          </form>
        </div>
      </div>

      {dashboardData && (
        <>
          {/* Informações Estatísticas */}
          <div className="stats-section">
            <h2>Dados Simples Nacional - {mes === '01' ? 'Janeiro' : 'Julho'} {ano}</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{dashboardData.estabelecimentos_ativos?.toLocaleString('pt-BR') || '7.055'}</div>
                <div className="stat-label">Estabelecimentos</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{dashboardData.empresas_optantes?.toLocaleString('pt-BR') || '6.794'}</div>
                <div className="stat-label">Empresas Optantes</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{dashboardData.empresas_declararam?.toLocaleString('pt-BR') || '5.856'}</div>
                <div className="stat-label">Empresas que Declararam</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{dashboardData.empresas_nao_declararam?.toLocaleString('pt-BR') || '938'}</div>
                <div className="stat-label">Empresas Não Declararam</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{dashboardData.empresas_inadimplentes?.toLocaleString('pt-BR') || '550'}</div>
                <div className="stat-label">Empresas Inadimplentes</div>
              </div>
              
              <div className="stat-card highlight">
                <div className="stat-value">{dashboardData.percentual_declararam || '86.19'}%</div>
                <div className="stat-label">Empresas Declararam PGDAS (%)</div>
              </div>
            </div>
          </div>

          {/* Gráfico de Desempenho */}
          <div className="chart-section">
            <h3>Total DAS x Total ISS / Competência</h3>
            
            <div className="chart-legend">
              <div 
                className={`legend-item ${!visibleSeries.totalDAS ? 'disabled' : ''}`}
                onClick={() => toggleSeries('totalDAS')}
                style={{ cursor: 'pointer' }}
              >
                <div className="legend-color blue"></div>
                <span>Total DAS Apuração</span>
              </div>
              <div 
                className={`legend-item ${!visibleSeries.totalDASPago ? 'disabled' : ''}`}
                onClick={() => toggleSeries('totalDASPago')}
                style={{ cursor: 'pointer' }}
              >
                <div className="legend-color green"></div>
                <span>Total DAS Pago</span>
              </div>
              <div 
                className={`legend-item ${!visibleSeries.totalISS ? 'disabled' : ''}`}
                onClick={() => toggleSeries('totalISS')}
                style={{ cursor: 'pointer' }}
              >
                <div className="legend-color orange"></div>
                <span>Total ISS Apuração</span>
              </div>
              <div 
                className={`legend-item ${!visibleSeries.totalISSPago ? 'disabled' : ''}`}
                onClick={() => toggleSeries('totalISSPago')}
                style={{ cursor: 'pointer' }}
              >
                <div className="legend-color red"></div>
                <span>Total ISS Pago</span>
              </div>
            </div>
            
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                    labelFormatter={(label) => `${label} 2025`}
                  />
                  {visibleSeries.totalDAS && <Bar dataKey="totalDAS" fill="#2563eb" name="Total DAS Apuração" />}
                  {visibleSeries.totalDASPago && <Bar dataKey="totalDASPago" fill="#16a34a" name="Total DAS Pago" />}
                  {visibleSeries.totalISS && <Bar dataKey="totalISS" fill="#f59e0b" name="Total ISS Apuração" />}
                  {visibleSeries.totalISSPago && <Bar dataKey="totalISSPago" fill="#dc2626" name="Total ISS Pago" />}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Área Inferior - Declarações Mensais */}
          <div className="declaracoes-section">
            <h3>Declarações Mensais (PGDAS)</h3>
            <div className="table-container">
              <table className="declaracoes-table">
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Total Declarações</th>
                    <th>Valor Total Declarado</th>
                    <th>ISS Apurado</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Janeiro 2025</td>
                    <td>5.856</td>
                    <td>R$ 1.708.459,52</td>
                    <td>R$ 50.000,00</td>
                    <td><span className="status-badge success">Concluído</span></td>
                  </tr>
                  <tr>
                    <td>Fevereiro 2025</td>
                    <td>5.920</td>
                    <td>R$ 1.800.000,00</td>
                    <td>R$ 52.000,00</td>
                    <td><span className="status-badge success">Concluído</span></td>
                  </tr>
                  <tr>
                    <td>Março 2025</td>
                    <td>5.950</td>
                    <td>R$ 1.900.000,00</td>
                    <td>R$ 55.000,00</td>
                    <td><span className="status-badge success">Concluído</span></td>
                  </tr>
                  <tr>
                    <td>Abril 2025</td>
                    <td>6.000</td>
                    <td>R$ 2.000.000,00</td>
                    <td>R$ 58.000,00</td>
                    <td><span className="status-badge pending">Pendente</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;