import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createWorkspace, getWorkspaces } from '../controllers/workspaceController.js';

const workspaceRoutes = express.Router();

workspaceRoutes.get('/', protect, getWorkspaces);
workspaceRoutes.post('/', protect, createWorkspace);

export default workspaceRoutes;