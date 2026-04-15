import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addWorkspaceMember, createWorkspace, deleteWorkspace, getWorkspaceMembers, getWorkspaces, removeWorkspaceMember, updateWorkspace } from '../controllers/workspaceController.js';

const workspaceRoutes = express.Router();

workspaceRoutes.get('/', protect, getWorkspaces);
workspaceRoutes.post('/', protect, createWorkspace);
workspaceRoutes.put('/:id', protect, updateWorkspace);
workspaceRoutes.delete('/:id', protect, deleteWorkspace);
workspaceRoutes.get('/:id/members', protect, getWorkspaceMembers);
workspaceRoutes.post('/:id/members', protect, addWorkspaceMember);
workspaceRoutes.delete('/:id/members/:member', protect, removeWorkspaceMember);

export default workspaceRoutes;