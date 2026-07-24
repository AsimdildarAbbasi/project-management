const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

const runMigration = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running database migration using schema.sql...');
    await pool.query(sql);
    console.log('Migration completed successfully! All tables created.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

runMigration();
