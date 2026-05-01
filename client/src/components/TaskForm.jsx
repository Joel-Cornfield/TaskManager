import React, { useState, useEffect } from 'react';
import useTasks from '../hooks/useTasks.js';

const TaskForm = ({ onClose, task, status = 'active' }) => {
  const { createTask, updateTask, currentWorkspace, fetchWorkspaceMembers } = useTasks();
  const [title, setTitle] = useState(task?.title || '');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [assigneeIds, setAssigneeIds] = useState(
    task?.assignee_ids || task?.assignees?.map((assignee) => assignee.id) || []
  );
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentWorkspace?.id) {
      loadWorkspaceMembers();
    }
  }, [currentWorkspace?.id]);

  useEffect(() => {
    if (task?.assignees) {
      setAssigneeIds(task.assignees.map((assignee) => assignee.id));
    }
  }, [task?.assignees]);

  const loadWorkspaceMembers = async () => {
    try {
      const members = await fetchWorkspaceMembers(currentWorkspace.id);
      setWorkspaceMembers(members);
    } catch (error) {
      console.error('Error loading workspace members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const taskData = { 
        title, 
        due_date: dueDate === "" ? null : dueDate,
        assignee_ids: assigneeIds,
      };
      
      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask({ 
          ...taskData,
          workspace_id: currentWorkspace?.id,
          status,
        });
      } 
      onClose();
    } catch (error) {
      setError(error?.response?.data?.message || 'Task operation failed'); 
    }
  }

  const handleAssigneeChange = (memberId) => {
    setAssigneeIds(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

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
            required
          />
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
        <div className="form-group">
          <label>Assignees</label>
          <div className="assignees-list">
            {workspaceMembers.map(member => (
              <label key={member.id} className="assignee-checkbox">
                <input
                  type="checkbox"
                  checked={assigneeIds.includes(member.id)}
                  onChange={() => handleAssigneeChange(member.id)}
                />
                {member.name || member.email}
              </label>
            ))}
          </div>
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