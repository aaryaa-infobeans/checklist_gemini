import axiosInstance from './axiosInstance';

export const fetchExecutions = () => axiosInstance.get('/executions/').then(r => r.data);

export const fetchExecution = (id) => axiosInstance.get(`/executions/${id}/`).then(r => r.data);

export const createExecution = (payload) => axiosInstance.post('/executions/', payload).then(r => r.data);

export const updateExecution = (id, payload) => axiosInstance.put(`/executions/${id}/`, payload).then(r => r.data);

export const partialUpdateExecution = (id, payload) => axiosInstance.patch(`/executions/${id}/`, payload).then(r => r.data);

export const deleteExecution = (id) => axiosInstance.delete(`/executions/${id}/`).then(r => r.data);

export const pauseExecution = (id) => axiosInstance.post(`/executions/${id}/pause/`).then(r => r.data);

export const resumeExecution = (id) => axiosInstance.post(`/executions/${id}/resume/`).then(r => r.data);

export default { fetchExecutions, fetchExecution, createExecution, updateExecution, partialUpdateExecution, deleteExecution, pauseExecution, resumeExecution };
