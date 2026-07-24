const { query } = require('../config/db');

const createUser = async ({ name, email, passwordHash, role = 'user' }) => {
  const sql = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at;
  `;
  const values = [name, email, passwordHash, role];
  const result = await query(sql, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE email = $1;`;
  const result = await query(sql, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const sql = `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE id = $1;
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const sql = `
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY created_at ASC;
  `;
  const result = await query(sql);
  return result.rows;
};

const updateUserRole = async (id, role) => {
  const sql = `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING id, name, email, role, created_at;
  `;
  const result = await query(sql, [role, id]);
  return result.rows[0];
};

const deleteUserWithReassignment = async (id) => {
  // Reassign / null-out tasks assigned to this user before deleting
  const reassignSql = `UPDATE tasks SET assigned_to = NULL WHERE assigned_to = $1;`;
  await query(reassignSql, [id]);

  const deleteSql = `DELETE FROM users WHERE id = $1 RETURNING id, name, email, role;`;
  const result = await query(deleteSql, [id]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUserRole,
  deleteUserWithReassignment,
};
