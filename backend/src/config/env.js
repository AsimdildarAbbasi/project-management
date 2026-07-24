const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'zushimily',
    database: process.env.DB_NAME || 'pma_db',
  },
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
};
