import express from 'express';
import upload from '../middleware/upload';
import { imageUpload } from '../controllers/profileController';

const profileRoutes = express.Router();

profileRoutes.post('/profile-image', upload.single('image'), protect, imageUpload);

export default profileRoutes;