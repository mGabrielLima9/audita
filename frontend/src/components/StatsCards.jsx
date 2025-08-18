// frontend/src/components/StatsCards.jsx

import React from 'react';

const StatsCards = ({ data }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  const cards = [
    {
      title: 'Empresas Ativas',
      value: formatNumber(data.empresas_ativas),
      color: 'blue',
      icon: '🏢'
    },
    {
      title: 'Empresas Optantes',
      value: formatNumber(data.empresas_optantes),
      color: 'green',
      icon: '✅'
    },
    {
      title: 'Empresas Declararam',
      value: formatNumber(data.empresas_declararam),
      color: 'blue',
      icon: '📊'
    },
    {
      title: 'Empresas Não Declararam',
      value: formatNumber(data.empresas_nao_declararam),
      color: 'orange',
      icon: '⚠️'
    },
    {
      title: 'Empresas Inadimplentes',
      value: formatNumber(data.empresas_inadimplentes),
      color: 'red',
      icon: '❌'
    },
    {
      title: 'Percentual Declararam',
      value: `${data.percentual_declararam}%`,
      color: 'green',
      icon: '📈'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className={`stat-card stat-card-${card.color}`}>
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-content">
            <h3 className="stat-title">{card.title}</h3>
            <p className="stat-value">{card.value}</p>
          </div>
        </div>
      ))}
      
      {/* Card especial para valores */}
      <div className="stat-card stat-card-purple">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <h3 className="stat-title">ISS Declarado</h3>
          <p className="stat-value">{formatCurrency(data.valor_iss_declarado)}</p>
        </div>
      </div>
      
      <div className="stat-card stat-card-teal">
        <div className="stat-icon">💳</div>
        <div className="stat-content">
          <h3 className="stat-title">ISS Pago</h3>
          <p className="stat-value">{formatCurrency(data.valor_iss_pago)}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
