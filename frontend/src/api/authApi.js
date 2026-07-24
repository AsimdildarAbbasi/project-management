import apiClient from './axios';

export const loginApi = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const getMeApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
