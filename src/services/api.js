import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  deploy: (id) => api.post(`/projects/${id}/deploy`),
  testConnection: (data) => api.post('/test-connection', data),
};

export const toolsService = {
  getAll: () => api.get('/tools'),
  getById: (id) => api.get(`/tools/${id}`),
  create: (data) => api.post('/tools', data),
  update: (id, data) => api.put(`/tools/${id}`, data),
  delete: (id) => api.delete(`/tools/${id}`),
};

export const projectTypesService = {
  getAll: () => api.get('/project-types'),
  getById: (id) => api.get(`/project-types/${id}`),
  create: (data) => api.post('/project-types', data),
  update: (id, data) => api.put(`/project-types/${id}`, data),
  delete: (id) => api.delete(`/project-types/${id}`),
};

export const organizationsService = {
  getAll: () => api.get('/organizations'),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  delete: (id) => api.delete(`/organizations/${id}`),
};
