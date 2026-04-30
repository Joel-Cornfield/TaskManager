import React, { useEffect, useState } from 'react'
import WorkspaceForm from './WorkspaceForm';
import { Link } from 'react-router-dom';
import useTasks from '../hooks/useTasks';

const WorkspaceItem = ({ workspace }) => {
  const [members, setMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { deleteWorkspace, workspaces, fetchWorkspaceMembers } = useTasks();

  // Check if this is an owned workspace
  const isOwned = workspaces.some(w => w.id === workspace.id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      deleteWorkspace(workspace.id);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [workspace.id]);

  const loadMembers = async () => {
    try {
        const data = await fetchWorkspaceMembers(workspace.id);
        setMembers(data);
    } catch (error) {
        console.error('Error loading members', error);
    }
   }

  if (isEditing) {
        return (
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
                    <WorkspaceForm workspace={workspace} members={members} onClose={() => setIsEditing(false)} />
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
            {members && (
                <div className='members-preview'>
                    {members.map(member => (
                        member.profile_image ? (
                            <img
                              key={member.id}
                              src={`http://localhost:4000${member.profile_image}`}
                              alt="Member"
                              className="navbar-profile-image"  
                            />
                        ) : (
                            <div key={member.id} className="navbar-profile-placeholder">
                                {member.name ? member.name.charAt(0).toUpperCase() :  member.email.charAt(0).toUpperCase()}
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkspaceItem;
