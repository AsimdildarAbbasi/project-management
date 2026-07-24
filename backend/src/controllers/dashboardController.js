const dashboardModel = require('../models/dashboardModel');

const getAdminDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardModel.getAdminDashboardStats();
    const recent_activity = await dashboardModel.getRecentActivity();

    res.status(200).json({
      ...stats,
      recent_activity,
    });
  } catch (error) {
    next(error);
  }
};

const getUserDashboard = async (req, res, next) => {
  try {
    const userDashboardData = await dashboardModel.getUserDashboardStats(req.user.id);

    res.status(200).json(userDashboardData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getUserDashboard,
};
