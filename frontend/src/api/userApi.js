import apiClient from './axios';

export const fetchUsersApi = async () => {
  const response = await apiClient.get('/users');
  return response.data?.users || response.data || [];
};

export const updateUserRoleApi = async (userId, role) => {
  const response = await apiClient.put(`/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUserApi = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};
