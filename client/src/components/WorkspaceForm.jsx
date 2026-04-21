import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';
import MemberManager from './MemberManager';

const WorkspaceForm = ({ onClose, workspace }) => {
  const [name, setName] = useState(workspace?.name || '');
  const [error, setError] = useState('');

  const { createWorkspace, updateWorkspace } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (workspace) {
        await updateWorkspace(workspace.id, name);
      } else {
        await createWorkspace(name);
      }
      onClose();
    } catch (error) {
      setError(error?.response?.data?.message || 'Workspace operation failed');
    }
  };

  return (
    <div className="workspace-form">
      <h2>{workspace ? 'Update Workspace' : 'Create Workspace'}</h2>
      {error && <p className="error">{error}</p>}

      {/* ✅ ONLY workspace form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace name"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">
            {workspace ? 'Update Workspace' : 'Create Workspace'}
          </button>
        </div>
      </form>

      {/* Member management */}
      {workspace && (
        <MemberManager workspaceId={workspace.id} />
      )}
    </div>
  );
};

export default WorkspaceForm;