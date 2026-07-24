const { query } = require('../config/db');

const createTaskFile = async ({ taskId, fileName, filePath, uploadedBy }) => {
  const sql = `
    INSERT INTO task_files (task_id, file_name, file_path, uploaded_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [taskId, fileName, filePath, uploadedBy];
  const result = await query(sql, values);
  return result.rows[0];
};

const findFileById = async (fileId) => {
  const sql = `
    SELECT tf.*, t.assigned_to
    FROM task_files tf
    JOIN tasks t ON tf.task_id = t.id
    WHERE tf.id = $1;
  `;
  const result = await query(sql, [fileId]);
  return result.rows[0];
};

const getFilesByTaskId = async (taskId) => {
  const sql = `
    SELECT tf.*, u.name AS uploaded_by_name
    FROM task_files tf
    LEFT JOIN users u ON tf.uploaded_by = u.id
    WHERE tf.task_id = $1
    ORDER BY tf.uploaded_at DESC;
  `;
  const result = await query(sql, [taskId]);
  return result.rows;
};

const deleteFileById = async (fileId) => {
  const sql = `
    DELETE FROM task_files
    WHERE id = $1
    RETURNING *;
  `;
  const result = await query(sql, [fileId]);
  return result.rows[0];
};

module.exports = {
  createTaskFile,
  findFileById,
  getFilesByTaskId,
  deleteFileById,
};
