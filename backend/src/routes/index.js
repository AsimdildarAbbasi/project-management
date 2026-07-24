const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const fileRoutes = require('./fileRoutes');
const commentRoutes = require('./commentRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/', fileRoutes);
router.use('/', commentRoutes);

module.exports = router;
