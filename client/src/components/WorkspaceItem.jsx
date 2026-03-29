import React, { useState } from 'react'
import WorkspaceForm from './WorkspaceForm';
import { Link } from 'react-router-dom';

const WorkspaceItem = ({ workspace }) => {
  const [isEditing, setIsEditing] = useState(false);

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
            <h3>{workspace.title}</h3>
            <Link to={`/workspace/${workspace.id}`}>Open</Link>
            <div className="workspace-card-actions">
                {/* need to create a route for both */}
                <button onClick={() => setIsEditing(true)}>Edit</button> 
                <button onClick={() => "hi"}>Delete</button>
            </div>
        </div>
    );
};

export default WorkspaceItem
