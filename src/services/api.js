import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  deploy: (id) => api.post(`/projects/${id}/deploy`),
};
