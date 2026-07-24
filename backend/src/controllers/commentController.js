const commentModel = require('../models/commentModel');
const taskModel = require('../models/taskModel');

const addComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { comment_text } = req.body;

    const task = await taskModel.findTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    if (req.user.role !== 'admin' && task.assigned_to !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied: Only assignee or admin can comment on this task',
      });
    }

    const comment = await commentModel.createComment({
      taskId,
      userId: req.user.id,
      commentText: comment_text,
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await taskModel.findTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    if (req.user.role !== 'admin' && task.assigned_to !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied: Only assignee or admin can view comments on this task',
      });
    }

    const comments = await commentModel.getCommentsByTaskId(taskId);

    res.status(200).json({
      comments,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await commentModel.findCommentById(id);
    if (!comment) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Comment not found',
      });
    }

    await commentModel.deleteCommentById(id);

    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getTaskComments,
  deleteComment,
};
