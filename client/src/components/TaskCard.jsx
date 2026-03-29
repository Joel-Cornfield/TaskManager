import React, { useState } from 'react';
import useTasks from '../hooks/useTasks.js';
import TaskForm from './TaskForm';

const TaskCard = ({ task }) => {
    const { deleteTask } = useTasks();
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = () => {
        deleteTask(task.id);
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isEditing) {
        return (
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
                    <TaskForm task={task} onClose={() => setIsEditing(false)} />
                </div>
            </div>
        );
    }

    return (
        <div className="task-card">
            <h3>{task.title}</h3>
            <p>{formatDate(task.due_date)}</p>
            <div className="task-card-actions">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default TaskCard;