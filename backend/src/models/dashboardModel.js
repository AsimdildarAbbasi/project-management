const { query } = require('../config/db');

const getAdminDashboardStats = async () => {
  const statsSql = `
    SELECT
      COUNT(*)::int AS total_tasks,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
      COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'completed')::int AS overdue_count
    FROM tasks;
  `;
  const statsResult = await query(statsSql);
  return statsResult.rows[0];
};

/*
  Choice Rationale for UNION ALL vs. Code Combination:
  We use a single SQL UNION ALL query combined with ORDER BY timestamp DESC LIMIT 10.
  This approach executes sorting and slicing directly in PostgreSQL, minimizing memory overhead
  in Node.js and avoiding pulling excess records over the database connection.
*/
const getRecentActivity = async () => {
  const activitySql = `
    SELECT * FROM (
      SELECT 
        'task_created' AS type,
        'Task "' || t.title || '" created by ' || COALESCE(u.name, 'Unknown') AS description,
        t.created_at AS timestamp
      FROM tasks t
      LEFT JOIN users u ON t.created_by = u.id

      UNION ALL

      SELECT 
        'comment_added' AS type,
        'Comment added on "' || t.title || '" by ' || COALESCE(u.name, 'Unknown') AS description,
        c.created_at AS timestamp
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      JOIN tasks t ON c.task_id = t.id

      UNION ALL

      SELECT 
        'file_uploaded' AS type,
        'File "' || tf.file_name || '" uploaded to "' || t.title || '" by ' || COALESCE(u.name, 'Unknown') AS description,
        tf.uploaded_at AS timestamp
      FROM task_files tf
      LEFT JOIN users u ON tf.uploaded_by = u.id
      JOIN tasks t ON tf.task_id = t.id
    ) activity
    ORDER BY timestamp DESC
    LIMIT 10;
  `;
  const result = await query(activitySql);
  return result.rows;
};

const getUserDashboardStats = async (userId) => {
  const statsSql = `
    SELECT
      COUNT(*)::int AS assigned_total,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS assigned_pending,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS assigned_completed
    FROM tasks
    WHERE assigned_to = $1;
  `;
  const statsResult = await query(statsSql, [userId]);

  const tasksSql = `
    SELECT t.*, 
           u_creator.name AS created_by_name
    FROM tasks t
    LEFT JOIN users u_creator ON t.created_by = u_creator.id
    WHERE t.assigned_to = $1
    ORDER BY t.created_at DESC;
  `;
  const tasksResult = await query(tasksSql, [userId]);

  return {
    ...statsResult.rows[0],
    tasks: tasksResult.rows,
  };
};

module.exports = {
  getAdminDashboardStats,
  getRecentActivity,
  getUserDashboardStats,
};
