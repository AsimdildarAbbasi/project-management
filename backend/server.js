const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./src/config/env');
const apiRoutes = require('./src/routes');
const notFoundHandler = require('./src/middleware/notFoundHandler');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "pma-backend"
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };
