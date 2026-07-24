const { query } = require('../config/db');

const createTask = async ({ title, description, createdBy, assignedTo, dueDate }) => {
  const sql = `
    INSERT INTO tasks (title, description, created_by, assigned_to, due_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [
    title,
    description || null,
    createdBy,
    assignedTo || null,
    dueDate || null,
  ];
  const result = await query(sql, values);
  return result.rows[0];
};

const findTaskById = async (id) => {
  const sql = `
    SELECT t.*, 
           u_assignee.name AS assigned_to_name, 
           u_creator.name AS created_by_name
    FROM tasks t
    LEFT JOIN users u_assignee ON t.assigned_to = u_assignee.id
    LEFT JOIN users u_creator ON t.created_by = u_creator.id
    WHERE t.id = $1;
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
};

const getTaskDetails = async (id) => {
  const task = await findTaskById(id);
  if (!task) return null;

  // Get files attached to task
  const filesSql = `
    SELECT id, file_name, file_path, uploaded_by, uploaded_at
    FROM task_files
    WHERE task_id = $1
    ORDER BY uploaded_at ASC;
  `;
  const filesResult = await query(filesSql, [id]);

  // Get comment count
  const commentCountSql = `
    SELECT COUNT(*)::int AS comment_count
    FROM comments
    WHERE task_id = $1;
  `;
  const countResult = await query(commentCountSql, [id]);

  return {
    ...task,
    files: filesResult.rows,
    comment_count: countResult.rows[0].comment_count,
  };
};

const getAllTasks = async ({ status, assigned_to } = {}) => {
  let sql = `
    SELECT t.*, 
           u_assignee.name AS assigned_to_name, 
           u_creator.name AS created_by_name
    FROM tasks t
    LEFT JOIN users u_assignee ON t.assigned_to = u_assignee.id
    LEFT JOIN users u_creator ON t.created_by = u_creator.id
    WHERE 1=1
  `;
  const values = [];

  if (status) {
    values.push(status);
    sql += ` AND t.status = $${values.length}`;
  }

  if (assigned_to) {
    values.push(assigned_to);
    sql += ` AND t.assigned_to = $${values.length}`;
  }

  sql += ` ORDER BY t.created_at DESC;`;

  const result = await query(sql, values);
  return result.rows;
};

const getTasksByAssignee = async (userId) => {
  const sql = `
    SELECT t.*, 
           u_assignee.name AS assigned_to_name, 
           u_creator.name AS created_by_name
    FROM tasks t
    LEFT JOIN users u_assignee ON t.assigned_to = u_assignee.id
    LEFT JOIN users u_creator ON t.created_by = u_creator.id
    WHERE t.assigned_to = $1
    ORDER BY t.created_at DESC;
  `;
  const result = await query(sql, [userId]);
  return result.rows;
};

const updateTask = async (id, fields) => {
  const updates = [];
  const values = [];

  const allowedFields = ['title', 'description', 'assigned_to', 'due_date', 'status'];

  allowedFields.forEach((field) => {
    if (fields[field] !== undefined) {
      values.push(fields[field]);
      updates.push(`${field} = $${values.length}`);
    }
  });

  if (updates.length === 0) {
    return findTaskById(id);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const sql = `
    UPDATE tasks
    SET ${updates.join(', ')}
    WHERE id = $${values.length}
    RETURNING *;
  `;

  const result = await query(sql, values);
  return result.rows[0];
};

const deleteTask = async (id) => {
  const sql = `DELETE FROM tasks WHERE id = $1 RETURNING *;`;
  const result = await query(sql, [id]);
  return result.rows[0];
};

module.exports = {
  createTask,
  findTaskById,
  getTaskDetails,
  getAllTasks,
  getTasksByAssignee,
  updateTask,
  deleteTask,
};
