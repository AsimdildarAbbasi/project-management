import apiClient from './axios';

export const fetchTasksApi = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.status && params.status !== 'ALL') {
    queryParams.append('status', params.status.toLowerCase());
  }
  if (params.assigned_to) {
    queryParams.append('assigned_to', params.assigned_to);
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/tasks?${queryString}` : '/tasks';
  const response = await apiClient.get(url);
  return Array.isArray(response.data) ? response.data : response.data?.tasks || [];
};

export const fetchMyTasksApi = async () => {
  const response = await apiClient.get('/tasks/mine');
  return Array.isArray(response.data) ? response.data : response.data?.tasks || [];
};

export const toggleTaskCompleteApi = async (taskId) => {
  const response = await apiClient.patch(`/tasks/${taskId}/complete`);
  return response.data;
};
