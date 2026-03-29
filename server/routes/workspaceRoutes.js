import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createWorkspace, deleteWorkspace, getWorkspaces, updateWorkspace } from '../controllers/workspaceController.js';

const workspaceRoutes = express.Router();

workspaceRoutes.get('/', protect, getWorkspaces);
workspaceRoutes.post('/', protect, createWorkspace);
workspaceRoutes.put('/', protect, updateWorkspace);
workspaceRoutes.delete('/', protect, deleteWorkspace);

export default workspaceRoutes;