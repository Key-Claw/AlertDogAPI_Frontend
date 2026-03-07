// 1. Modulo de acceso a endpoints de citas
import { apiClient } from './apiClient';

export const citasApi = {
  getAll: () => apiClient.get('/citas'),
  getById: (id) => apiClient.get(`/citas/${id}`),
  // 2. Capturar regla de negocio del backend para citas duplicadas
  create: async (cita) => {
    try {
      return await apiClient.post('/citas', cita);
    } catch (error) {
      // Tu backend devuelve mensaje de negocio para duplicados
      if (error.status === 500 && String(error.message).includes('ya tiene una cita')) {
        error.code = 'CITA_DUPLICADA';
      }
      throw error;
    }
  },
  update: async (id, cita) => {
    try {
      return await apiClient.put(`/citas/${id}`, cita);
    } catch (error) {
      if (error.status === 500 && String(error.message).includes('ya tiene una cita')) {
        error.code = 'CITA_DUPLICADA';
      }
      throw error;
    }
  },
  remove: (id) => apiClient.delete(`/citas/${id}`)
};