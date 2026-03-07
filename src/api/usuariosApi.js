import { apiClient } from './apiClient';

export const perrosApi = {
  getAll: () => apiClient.get('/perros'),
  getById: (id) => apiClient.get(`/perros/${id}`),
  create: (perro) => apiClient.post('/perros', perro),
  update: (id, perro) => apiClient.put(`/perros/${id}`, perro),
  remove: (id) => apiClient.delete(`/perros/${id}`)
};