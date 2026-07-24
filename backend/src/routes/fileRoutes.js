const express = require('express');
const {
  uploadTaskFile,
  getTaskFiles,
  downloadFile,
  deleteFile,
} = require('../controllers/fileController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Task file endpoints
router.post('/tasks/:taskId/files', uploadMiddleware, uploadTaskFile);
router.get('/tasks/:taskId/files', getTaskFiles);
router.get('/files/:fileId/download', downloadFile);
router.delete('/files/:fileId', authorizeAdmin, deleteFile);

module.exports = router;
