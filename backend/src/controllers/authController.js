const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const config = require('../config/env');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email already registered',
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = await userModel.createUser({
      name,
      email,
      passwordHash,
      role: userRole,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials',
      });
    }

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
