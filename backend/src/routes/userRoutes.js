const express = require('express');
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
