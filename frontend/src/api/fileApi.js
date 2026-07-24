import apiClient from './axios';

export const fetchTaskFilesApi = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}/files`);
  return Array.isArray(response.data) ? response.data : response.data?.files || [];
};

export const uploadTaskFileApi = async (taskId, file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(`/tasks/${taskId}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    },
  });
  return response.data;
};

export const downloadFileApi = async (fileId, fileName) => {
  const response = await apiClient.get(`/files/${fileId}/download`, {
    responseType: 'blob',
  });

  // Create temporary blob URL and trigger browser download
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName || `file-${fileId}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const deleteTaskFileApi = async (fileId) => {
  const response = await apiClient.delete(`/files/${fileId}`);
  return response.data;
};
