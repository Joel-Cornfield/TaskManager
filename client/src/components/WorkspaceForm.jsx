import React, { use, useState } from 'react'
import useTasks from '../hooks/useTasks';
import { createWorkspace } from '../api/tasksApi';

const WorkspaceForm = ({ onClose, workspace }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const { createWorkspace } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (workspace) {
        // update workspace
      } else {
        await createWorkspace(title);
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
          <label htmlFor="title">Title</label>
          <input 
            id="title" 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Workspace title" 
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
