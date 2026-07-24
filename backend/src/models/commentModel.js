const { query } = require('../config/db');

const formatCommentRow = (row) => ({
  id: row.id,
  comment_text: row.comment_text,
  created_at: row.created_at,
  user: {
    id: row.user_id,
    name: row.user_name,
    role: row.user_role,
  },
});

const createComment = async ({ taskId, userId, commentText }) => {
  const insertSql = `
    INSERT INTO comments (task_id, user_id, comment_text)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
  const insertResult = await query(insertSql, [taskId, userId, commentText]);
  const newCommentId = insertResult.rows[0].id;

  const selectSql = `
    SELECT c.id, c.comment_text, c.created_at,
           u.id AS user_id, u.name AS user_name, u.role AS user_role
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = $1;
  `;
  const result = await query(selectSql, [newCommentId]);
  return formatCommentRow(result.rows[0]);
};

const getCommentsByTaskId = async (taskId) => {
  const sql = `
    SELECT c.id, c.comment_text, c.created_at,
           u.id AS user_id, u.name AS user_name, u.role AS user_role
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.task_id = $1
    ORDER BY c.created_at ASC;
  `;
  const result = await query(sql, [taskId]);
  return result.rows.map(formatCommentRow);
};

const findCommentById = async (commentId) => {
  const sql = `SELECT * FROM comments WHERE id = $1;`;
  const result = await query(sql, [commentId]);
  return result.rows[0];
};

const deleteCommentById = async (commentId) => {
  const sql = `DELETE FROM comments WHERE id = $1 RETURNING *;`;
  const result = await query(sql, [commentId]);
  return result.rows[0];
};

module.exports = {
  createComment,
  getCommentsByTaskId,
  findCommentById,
  deleteCommentById,
};
