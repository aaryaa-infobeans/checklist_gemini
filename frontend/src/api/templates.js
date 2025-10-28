import axiosInstance from './axiosInstance';

export const fetchTemplates = () => axiosInstance.get('/templates/').then(r => r.data);

export const createTemplate = (payload) => axiosInstance.post('/templates/', payload).then(r => r.data);

export const updateTemplate = (id, payload) => axiosInstance.put(`/templates/${id}/`, payload).then(r => r.data);

export const deleteTemplate = (id) => axiosInstance.delete(`/templates/${id}/`).then(r => r.data);

export default { fetchTemplates, createTemplate, updateTemplate, deleteTemplate };
