import React from 'react';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    {
      section: 'DASHBOARD',
      items: [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'simples-nacional', label: 'Simples Nacional' },
        { id: 'tesouro-nacional', label: 'Tesouro Nacional', hasArrow: true }
      ]
    },
    {
      section: 'VISÃO GERAL',
      items: [
        { id: 'resumo-fiscal', label: 'Resumo Fiscal' },
        { id: 'diagnostico-fiscal', label: 'Diagnóstico Fiscal' }
      ]
    },
    {
      section: 'SIMPLES NACIONAL',
      items: [
        { id: 'sub-limite-sn', label: 'Sub Limite SN' },
        { id: 'declaracoes', label: 'Declarações', hasArrow: true },
        { id: 'parcelamentos', label: 'Parcelamentos', hasArrow: true },
        { id: 'analise-dados', label: 'Análise de Dados', hasArrow: true }
      ]
    },
    {
      section: 'MEI',
      items: [
        { id: 'mei-declaracoes', label: 'Declarações', hasArrow: true },
        { id: 'mei-analise', label: 'Análise de Dados', hasArrow: true }
      ]
    },
    {
      section: 'NOTAS FISCAIS',
      items: [
        { id: 'nfse-emitidas', label: 'NFSe - Emitidas' },
        { id: 'nfse-prestador', label: 'NFSe - Prestador' },
        { id: 'nfse-tomador', label: 'NFSe - Tomador' }
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">Auditor Digital</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            <h3 className="section-title">{section.section}</h3>
            <ul className="nav-list">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => setCurrentPage(item.id)}
                  >
                    <span className="nav-label">{item.label}</span>
                    {item.hasArrow && <span className="nav-arrow">→</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
