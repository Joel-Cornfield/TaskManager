import React from 'react';
import TaskCard from "./TaskCard";
import DropZone from '../../helpers/DropZone';
import DragItem from '../../helpers/DragItem';

const Column = ({ title, tasks = [], onDrop, onAddTask } ) => {
  return (
    <div className="column">
        <div className="column-header">{title}</div>
        {tasks.length === 0 && <p>No tasks yet...</p>}

        <DropZone onDrop={(item) => onDrop?.(item, title)}>
          <div className="task-list">
            {tasks?.map(task => (
              <DragItem key={task.id} task={task}>
                <TaskCard task={task}/>
              </DragItem>
            ))}
          </div>
          <div className='column-action'>
            <button onClick={onAddTask}>+ Add Task</button>
          </div>
        </DropZone>
    </div>
  )
}

export default Column;
