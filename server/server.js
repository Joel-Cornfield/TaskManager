import 'dotenv/config'; // Automatically load .env at import time
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';

import { errorHandler } from './middleware/errorMiddleware.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use('/uploads', express.static('uploads')); // /uploads accessible in browser

// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/profile', profileRoutes);

// Error handler initialisation
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});