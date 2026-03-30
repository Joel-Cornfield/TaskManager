import React from 'react';
import { useDrop } from 'react-dnd';

const DropZone = ({ onDrop, children }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'TASK',
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    const bg = isOver && canDrop ? "#e0ffe0" : 'transparent';

    return (
        <div ref={drop} style={{ background: bg, minHeight: 50, padding: '0.5rem' }}>
            {children}
        </div>
    );
};

export default DropZone;
