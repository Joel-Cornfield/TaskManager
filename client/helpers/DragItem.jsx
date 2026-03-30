import React from 'react';
import { useDrag } from 'react-dnd';

const DragItem = ({ task, children }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TASK',
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [task]);
    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
            >
            {children || <strong>{task.title}</strong>}
        </div>
    );
};

export default DragItem;
