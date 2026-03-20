import 'dotenv/config'; // Automatically load .env at import time
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pool from './config/db.js'; 
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173'], // your frontend
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});