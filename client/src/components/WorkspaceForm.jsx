import React, { use, useState } from 'react'
import useTasks from '../hooks/useTasks';
import { createWorkspace, updateWorkspace } from '../api/tasksApi';

const WorkspaceForm = ({ onClose, workspace }) => {
  const [name, setName] = useState(workspace?.name || '');
  const [error, setError] = useState('');
  const { createWorkspace, updateWorkspace } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (workspace) {
        await updateWorkspace(workspace.id, name)
      } else {
        await createWorkspace(name);
      }
      onClose();
    } catch (error) {
      setError(error?.response?.data?.message || 'Workspace operation failed'); 
    }
  }
  return (
    <div className="workspace-form">
      <h2>{workspace ? 'Update Workspace' : 'Create Workspace'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Workspace name" 
            required>
          </input>
        </div>
        <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{workspace ? 'Update Workspace' : 'Create Workspace'}</button>
        </div>
      </form>
    </div>
  )
};

export default WorkspaceForm;
