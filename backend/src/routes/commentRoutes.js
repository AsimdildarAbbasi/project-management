const express = require('express');
const { body } = require('express-validator');
const {
  addComment,
  getTaskComments,
  deleteComment,
} = require('../controllers/commentController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const commentValidation = [
  body('comment_text').trim().notEmpty().withMessage('Comment text is required'),
];

// Comment endpoints
router.post('/tasks/:taskId/comments', commentValidation, validate, addComment);
router.get('/tasks/:taskId/comments', getTaskComments);
router.delete('/comments/:id', authorizeAdmin, deleteComment);

module.exports = router;
