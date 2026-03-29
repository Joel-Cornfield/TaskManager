import React from 'react';
import TaskCard from "./TaskCard";

const Column = ({ title, tasks } ) => {
  return (
    <div className="column">
        <h2>{title}</h2>
        {tasks.length === 0 && <p>No tasks yet...</p>}
        {tasks?.map(task => (
            <TaskCard key={task.id} task={task}/>
        ))}
    </div>
  )
}

export default Column;
