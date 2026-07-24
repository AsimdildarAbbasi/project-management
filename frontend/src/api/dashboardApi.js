import apiClient from './axios';

export const fetchAdminDashboard = async () => {
  const response = await apiClient.get('/dashboard/admin');
  return response.data;
};

export const fetchUserDashboard = async () => {
  const response = await apiClient.get('/dashboard/me');
  return response.data;
};
