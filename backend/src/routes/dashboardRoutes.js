const express = require('express');
const { getAdminDashboard, getUserDashboard } = require('../controllers/dashboardController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/admin', authorizeAdmin, getAdminDashboard);
router.get('/me', getUserDashboard);

module.exports = router;
