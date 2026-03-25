import express from 'express';
import { getUser, login, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/getUser', protect, getUser);

export default authRoutes;