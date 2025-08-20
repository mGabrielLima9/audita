import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getSubLimite = async (competencia, status) => {
  const params = {};
  if (status) params.status = status;
  const { data } = await api.get(`/api/sub-limite/${competencia}`, { params });
  return data;
};

// Adiciona a função usada pelo Dashboard
export const getDashboardData = async (competencia) => {
  const { data } = await api.get(`/api/dashboard/${competencia}`);
  return data;
};

// Torna disponível como método do objeto api (compatível com api.getDashboardData(...))
api.getDashboardData = getDashboardData;

export default api;