import React, { useState } from 'react';
import useTasks from '../hooks/useTasks.js';
import TaskForm from './TaskForm';
import ReactDOM from "react-dom";

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
        return ReactDOM.createPortal(
            <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setIsEditing(false)}>×</button>
                    <TaskForm task={task} onClose={() => setIsEditing(false)} />
                </div>
            </div>,
            document.body
        );
    }

    return (
        <div className="task-card">
            <h3>{task.title}</h3>
            {task.due_date && <p>{formatDate(task.due_date)}</p>}
            {task.assignees && task.assignees.length > 0 && (
                <div className="task-assignees">
                    {task.assignees.map(assignee => (
                        assignee.profile_image ? (
                            <img
                              key={assignee.id}
                              src={`http://localhost:4000${assignee.profile_image}`}
                              alt="Assignee"
                              className="navbar-profile-image"  
                            />
                        ) : (
                            <div key={assignee.id} className="navbar-profile-placeholder">
                                {assignee.name ? assignee.name.charAt(0).toUpperCase() :  assignee.email.charAt(0).toUpperCase()}
                            </div>
                        )
                    ))}
                </div>
            )}
            <div className="task-card-actions">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default TaskCard;