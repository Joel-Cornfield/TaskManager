import express from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const taskRoutes = express.Router();

// All protected routes
taskRoutes.get('/', protect, getTasks);
taskRoutes.post('/', protect, createTask);
taskRoutes.put('/:id', protect, updateTask);
taskRoutes.delete('/:id', protect, deleteTask);

export default taskRoutes;