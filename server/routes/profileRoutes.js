import express from 'express';
import upload from '../middleware/upload.js';
import { imageUpload } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const profileRoutes = express.Router();

profileRoutes.post('/profile-image', upload.single('image'), protect, imageUpload);

export default profileRoutes;