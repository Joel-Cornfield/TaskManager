import React, { useState } from 'react'
import WorkspaceForm from './WorkspaceForm';
import { Link } from 'react-router-dom';
import useTasks from '../hooks/useTasks';

const WorkspaceItem = ({ workspace }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteWorkspace, workspaces } = useTasks();

  // Check if this is an owned workspace
  const isOwned = workspaces.some(w => w.id === workspace.id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      deleteWorkspace(workspace.id);
    }
  };

  if (isEditing) {
        return (
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
                    <WorkspaceForm workspace={workspace} onClose={() => setIsEditing(false)} />
                </div>
            </div>
        );
  }
  return (
        <div className="workspace-item">
            <h3>{workspace.name}</h3>
            <Link to={`/workspace/${workspace.id}`}>Open</Link>
            {isOwned && (
                <div className="workspace-card-actions">
                    <button onClick={() => setIsEditing(true)}>Edit</button> 
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default WorkspaceItem;
