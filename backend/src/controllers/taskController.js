const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');

const createTask = async (req, res, next) => {
  try {
    const { title, description, assigned_to, due_date } = req.body;

    if (assigned_to) {
      const assignedUser = await userModel.findUserById(assigned_to);
      if (!assignedUser) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Assigned user does not exist',
        });
      }
    }

    const task = await taskModel.createTask({
      title,
      description,
      createdBy: req.user.id,
      assignedTo: assigned_to,
      dueDate: due_date,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, assigned_to, due_date, status } = req.body;

    const existingTask = await taskModel.findTaskById(id);
    if (!existingTask) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    if (assigned_to !== undefined && assigned_to !== null) {
      const assignedUser = await userModel.findUserById(assigned_to);
      if (!assignedUser) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Assigned user does not exist',
        });
      }
    }

    const updatedTask = await taskModel.updateTask(id, {
      title,
      description,
      assigned_to,
      due_date,
      status,
    });

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingTask = await taskModel.findTaskById(id);
    if (!existingTask) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    await taskModel.deleteTask(id);

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const { status, assigned_to } = req.query;
    const tasks = await taskModel.getAllTasks({ status, assigned_to });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await taskModel.getAllTasks();
    } else {
      tasks = await taskModel.getTasksByAssignee(req.user.id);
    }

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await taskModel.getTaskDetails(id);

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    res.status(200).json({
      task,
    });
  } catch (error) {
    next(error);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await taskModel.findTaskById(id);
    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found',
      });
    }

    if (req.user.role !== 'admin' && task.assigned_to !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only mark tasks assigned to you as completed',
      });
    }

    const updatedTask = await taskModel.updateTask(id, { status: 'completed' });

    res.status(200).json({
      message: 'Task marked as completed',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  completeTask,
};
