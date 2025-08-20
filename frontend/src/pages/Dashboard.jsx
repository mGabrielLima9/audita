// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import '../Dashboard.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';

const Dashboard = () => {
  const [anoDate, setAnoDate] = useState(new Date(2025, 0));
  const [mesDate, setMesDate] = useState(new Date(2025, 0));
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Anos disponíveis
  const anos = ['2023', '2024', '2025'];

  // Meses com nome e número
  const meses = [
    { num: '01', nome: 'Janeiro' },
    { num: '02', nome: 'Fevereiro' },
    { num: '03', nome: 'Março' },
    { num: '04', nome: 'Abril' },
    { num: '05', nome: 'Maio' },
    { num: '06', nome: 'Junho' },
    { num: '07', nome: 'Julho' },
    { num: '08', nome: 'Agosto' },
    { num: '09', nome: 'Setembro' },
    { num: '10', nome: 'Outubro' },
    { num: '11', nome: 'Novembro' },
    { num: '12', nome: 'Dezembro' }
  ];

  // Função para formatar a data em ano e mês
  const formatCompetencia = (date) => {
    const ano = date.getFullYear().toString();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    return { ano, mes };
  };
  
  // Função para carregar dados apenas quando clicar em Pesquisar
  const handlePesquisar = () => {
    const { ano } = formatCompetencia(anoDate);
    const { mes } = formatCompetencia(mesDate);
    loadDashboardData(ano, mes);
  };

  // Dados mockados para quando a API não estiver disponível - MODIFICAR
  const mockData = {
    estabelecimentos_ativos: 0,
    empresas_optantes: 0,
    empresas_declararam: 0,
    empresas_nao_declararam: 0,
    empresas_inadimplentes: 0,
    percentual_declararam: 0
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
      console.log('Dados não encontrados para esta competência, usando zeros');
      setDashboardData(mockData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Remover estas funções que não são mais necessárias
  // const handleAnoChange = (novoAno) => {
  //   setAno(novoAno);
  //   loadDashboardData(novoAno, mes);
  // };
  
  // const handleMesChange = (novoMes) => {
  //   setMes(novoMes);
  //   loadDashboardData(ano, novoMes);
  // };
  
  // Carregar dados iniciais
  useEffect(() => {
    const { ano, mes } = formatCompetencia(anoDate);
    loadDashboardData(ano, mes);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar lógica de busca aqui
    console.log('Pesquisando:', searchTerm);
  };

  // Estado para armazenar dados do gráfico
  const [chartData, setChartData] = useState([]);

  // Carregar dados para o gráfico
  const loadChartData = async () => {
    const { ano } = formatCompetencia(anoDate); // Usar o ano do estado anoDate
    const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const nomeMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const dados = await Promise.all(
      meses.map(async (mes, index) => {
        try {
          const data = await api.getDashboardData(`${ano}${mes}`);
          return {
            mes: nomeMeses[index],
            totalDAS: data.valor_declarado_total,
            totalDASPago: data.valor_iss_pago,
            totalISS: data.valor_iss_declarado,
            totalISSPago: data.valor_iss_pago
          };
        } catch (error) {
          return {
            mes: nomeMeses[index],
            totalDAS: 0,
            totalDASPago: 0,
            totalISS: 0,
            totalISSPago: 0
          };
        }
      })
    );

    setChartData(dados);
  };

  // Carregar dados quando o ano mudar
  useEffect(() => {
    loadChartData();
  }, [anoDate]); // Mudando a dependência para anoDate ao invés de ano

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
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Competência Ano:</label>
            <DatePicker
              selected={anoDate}
              onChange={date => setAnoDate(date)}
              showYearPicker
              dateFormat="yyyy"
              yearItemNumber={9}
              locale={ptBR}
              className="filter-select"
            />
          </div>

          <div className="filter-group">
            <label>Competência Mês:</label>
            <DatePicker
              selected={mesDate}
              onChange={date => setMesDate(date)}
              showMonthYearPicker
              dateFormat="MMMM"
              locale={ptBR}
              className="filter-select"
              formatMonthCapitalize={true}
            />
          </div>

          <button
            onClick={handlePesquisar}
            className="pesquisar-btn"
          >
            Pesquisar
          </button>
        </div>
      </div>

      {dashboardData && (
        <>
          {/* Informações Estatísticas */}
          <div className="stats-section">
            <h2>Dados Simples Nacional - {formatCompetencia(mesDate).mes === '01' ? 'Janeiro' : 'Julho'} {formatCompetencia(anoDate).ano}</h2>
            
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
                    labelFormatter={(label) => `${label} ${formatCompetencia(anoDate).ano}`}
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