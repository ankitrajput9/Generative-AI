import api from './axios';

export const sendChat = (payload) => api.post('/chat', payload);
