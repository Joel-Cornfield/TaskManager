import React, { useState } from 'react';
import useTasks from '../hooks/useTasks.js';

const TaskForm = ({ onClose, task }) => {
  const { createTask, updateTask, currentWorkspace } = useTasks();
  const [title, setTitle] = useState(task?.title || '');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (task) {
        await updateTask(task.id, { title, due_date: dueDate });
      } else {
        await createTask({ 
          title, 
          due_date: dueDate,
          workspace_id: currentWorkspace?.id,
          status: 'active',
        });
      } 
      onClose();
    } catch (error) {
      setError(error?.response?.data?.message || 'Task operation failed'); 
    }
  }
  return (
    <div className="task-form">
      <h2>{task ? 'Update Task' : 'Create Task'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            id="title" 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Task title" 
            required>
          </input>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{task ? 'Update Task' : 'Create Task'}</button>
        </div>
      </form>
    </div>
  )
};

export default TaskForm;