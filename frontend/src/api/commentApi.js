import apiClient from './axios';

export const fetchTaskCommentsApi = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}/comments`);
  return Array.isArray(response.data) ? response.data : response.data?.comments || [];
};

export const addCommentApi = async (taskId, comment_text) => {
  const response = await apiClient.post(`/tasks/${taskId}/comments`, { comment_text });
  return response.data;
};

export const deleteCommentApi = async (commentId) => {
  const response = await apiClient.delete(`/comments/${commentId}`);
  return response.data;
};
