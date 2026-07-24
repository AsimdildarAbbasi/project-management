const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  completeTask,
} = require('../controllers/taskController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Apply authenticate to all task routes
router.use(authenticate);

// Validation rules
const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
];

// Shared / User-Accessible Routes
// GET /mine must come before GET /:id
router.get('/mine', getMyTasks);
router.get('/:id', getTaskById);
router.patch('/:id/complete', completeTask);

// Admin-Only Routes
router.post('/', authorizeAdmin, createTaskValidation, validate, createTask);
router.put('/:id', authorizeAdmin, updateTask);
router.delete('/:id', authorizeAdmin, deleteTask);
router.get('/', authorizeAdmin, getAllTasks);

module.exports = router;
