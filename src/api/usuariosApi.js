// 1. Modulo de acceso a endpoints de usuarios
import { apiClient } from './apiClient';

export const usuariosApi = {
  getAll: () => apiClient.get('/usuarios'),
  getById: (id) => apiClient.get(`/usuarios/${id}`),
  create: (usuario) => apiClient.post('/usuarios', usuario),
  update: (id, usuario) => apiClient.put(`/usuarios/${id}`, usuario),
  remove: (id) => apiClient.delete(`/usuarios/${id}`)
};