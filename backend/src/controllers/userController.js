const userModel = require('../models/userModel');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid role specified. Allowed values are "admin" or "user"',
      });
    }

    const existingUser = await userModel.findUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    const updatedUser = await userModel.updateUserRole(id, role);

    res.status(200).json({
      message: 'User role updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingUser = await userModel.findUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    await userModel.deleteUserWithReassignment(id);

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};
