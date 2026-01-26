import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';

const TaskBar = ({ task, left, width, updateTask, rangeStart }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const barRef = useRef(null);

    const handleMouseDown = (e, type) => {
        e.stopPropagation();
        if (type === 'resize') setIsResizing(true);
        else setIsDragging(true);

        const startX = e.pageX;
        const initialLeft = left;
        const initialWidth = width;

        const handleMouseMove = (moveEvent) => {
            const delta = moveEvent.pageX - startX;

            if (type === 'resize') {
                const newWidth = Math.max(40, initialWidth + delta);
                const newDuration = Math.round(newWidth / 40);
                updateTask(task.id, { duration: newDuration });
            } else {
                const newLeft = initialLeft + delta;
                const daysOffset = Math.round((newLeft - initialLeft) / 40);
                if (daysOffset !== 0) {
                    const newStartDate = addDays(new Date(task.startDate), daysOffset);
                    const newEndDate = addDays(newStartDate, task.duration);
                    updateTask(task.id, {
                        startDate: format(newStartDate, 'yyyy-MM-dd'),
                        endDate: format(newEndDate, 'yyyy-MM-dd')
                    });
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={barRef}
            className={`absolute h-7 rounded-md cursor-move select-none flex items-center shadow-sm group/bar transition-all 
        ${isDragging || isResizing ? 'z-50 opacity-80 scale-[1.02]' : 'z-10'}
      `}
            style={{
                left: left + 4,
                width: width - 8,
                backgroundColor: task.color,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
            {/* Indicador de Progreso */}
            <div
                className="absolute left-0 top-0 bottom-0 bg-black/20 rounded-l-md pointer-events-none"
                style={{ width: `${task.progress}%` }}
            />

            <div className="px-2 text-[10px] text-white font-medium z-10 w-full flex justify-between items-center overflow-hidden gap-1">
                <span className="truncate min-w-0 flex-1" title={task.name}>{task.name}</span>
                {width > 100 && <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity flex-shrink-0 whitespace-nowrap">{task.duration}d</span>}
            </div>

            {/* Handle de Resize (Derecho) */}
            <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 rounded-r-md"
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
            />

            {/* Tooltip de fechas al pasar por encima */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {format(new Date(task.startDate), 'dd MMM')} - {format(addDays(new Date(task.startDate), task.duration), 'dd MMM')}
            </div>
        </div>
    );
};

export default TaskBar;
