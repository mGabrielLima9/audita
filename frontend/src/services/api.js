// frontend/src/services/api.js

import axios from 'axios';

// Configuração da API
const API_BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Buscar dados do dashboard por competência
  getDashboardData: async (competencia) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${competencia}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  },

  // Buscar empresas inadimplentes detalhadas
  getInadimplentesDetalhadas: async (competencia) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${competencia}/inadimplentes`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar inadimplentes:', error);
      throw error;
    }
  },

  // Buscar empresas omissas detalhadas
  getOmissasDetalhadas: async (competencia) => {
    try {
      const response = await apiClient.get(`/api/dashboard/${competencia}/omissas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar omissas:', error);
      throw error;
    }
  }
};