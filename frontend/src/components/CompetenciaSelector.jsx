// frontend/src/components/CompetenciaSelector.jsx

import React from 'react';

const CompetenciaSelector = ({ competencia, onCompetenciaChange, loading }) => {
  // Gerar lista de competências (últimos 12 meses)
  const getCompetencias = () => {
    const competencias = [];
    const hoje = new Date();
    
    for (let i = 0; i < 12; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      competencias.push(`${ano}${mes}`);
    }
    
    return competencias;
  };

  const formatCompetencia = (comp) => {
    const ano = comp.substring(0, 4);
    const mes = comp.substring(4, 6);
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  return (
    <div className="competencia-selector">
      <label htmlFor="competencia">Competência:</label>
      <select 
        id="competencia"
        value={competencia} 
        onChange={(e) => onCompetenciaChange(e.target.value)}
        disabled={loading}
        className="form-select"
      >
        {getCompetencias().map(comp => (
          <option key={comp} value={comp}>
            {formatCompetencia(comp)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompetenciaSelector;
