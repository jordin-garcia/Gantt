import React, { useRef, useMemo } from 'react';
import { format, addDays, eachDayOfInterval, startOfMonth, differenceInDays, parseISO, startOfWeek, endOfWeek, eachWeekOfInterval, eachMonthOfInterval, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import TaskBar from './TaskBar';

const Timeline = ({ tasks, viewMode, updateTask }) => {
    const timelineRef = useRef(null);

    // Calcular el rango dinámico basado EXACTAMENTE en las fechas de las tareas
    const { rangeStart, rangeEnd } = useMemo(() => {
        if (tasks.length === 0) {
            // Si no hay tareas, mostrar desde hoy
            const today = new Date();
            return {
                rangeStart: today,
                rangeEnd: addDays(today, 30)
            };
        }

        // Encontrar la fecha de inicio más temprana y la fecha de fin más tardía
        // IMPORTANTE: Usar parseISO para evitar problemas de zona horaria
        let earliestStart = parseISO(tasks[0].startDate);
        let latestEnd = parseISO(tasks[0].endDate);

        tasks.forEach(task => {
            const taskStart = parseISO(task.startDate);
            const taskEnd = parseISO(task.endDate);

            if (taskStart < earliestStart) earliestStart = taskStart;
            if (taskEnd > latestEnd) latestEnd = taskEnd;
        });

        // Sin padding - exactamente desde la primera fecha hasta la última
        return {
            rangeStart: earliestStart,
            rangeEnd: latestEnd
        };
    }, [tasks]);

    // Calcular el ancho de celda según el modo de vista
    const cellWidth = viewMode === 'Día' ? 40 : viewMode === 'Semana' ? 80 : 120;

    const timeUnits = useMemo(() => {
        if (viewMode === 'Día') {
            return eachDayOfInterval({ start: rangeStart, end: rangeEnd });
        } else if (viewMode === 'Semana') {
            return eachWeekOfInterval({ start: rangeStart, end: rangeEnd }, { weekStartsOn: 1 });
        } else {
            return eachMonthOfInterval({ start: rangeStart, end: rangeEnd });
        }
    }, [viewMode, rangeStart, rangeEnd]);

    const getTaskPosition = (startDate, duration) => {
        const taskStart = parseISO(startDate);

        if (viewMode === 'Día') {
            const diff = differenceInDays(taskStart, rangeStart);
            return {
                left: diff * cellWidth,
                width: duration * cellWidth
            };
        } else if (viewMode === 'Semana') {
            const weeksDiff = Math.floor(differenceInDays(taskStart, rangeStart) / 7);
            const weeksSpan = Math.ceil(duration / 7);
            return {
                left: weeksDiff * cellWidth,
                width: weeksSpan * cellWidth
            };
        } else {
            // Modo Mes
            const monthsDiff = (taskStart.getFullYear() - rangeStart.getFullYear()) * 12 + (taskStart.getMonth() - rangeStart.getMonth());
            const monthsSpan = Math.ceil(duration / 30);
            return {
                left: monthsDiff * cellWidth,
                width: monthsSpan * cellWidth
            };
        }
    };

    // Ordenar tareas jerárquicamente igual que en TaskList
    const getSortedTasks = (taskList) => {
        const sorted = [];

        const addTaskWithChildren = (task) => {
            sorted.push(task);
            const children = taskList.filter(t => t.parentId === task.id);
            children.forEach(child => addTaskWithChildren(child));
        };

        // Primero agregar tareas raíz (sin padre)
        const rootTasks = taskList.filter(t => !t.parentId);
        rootTasks.forEach(task => addTaskWithChildren(task));

        return sorted;
    };

    const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks]);

    // Agrupar por meses para la cabecera superior
    const monthGroups = useMemo(() => {
        const groups = [];
        let currentMonth = null;
        let monthStart = 0;

        timeUnits.forEach((unit, idx) => {
            const monthKey = format(unit, 'MMM yyyy', { locale: es });

            if (monthKey !== currentMonth) {
                if (currentMonth !== null) {
                    groups.push({
                        label: currentMonth,
                        start: monthStart,
                        span: idx - monthStart
                    });
                }
                currentMonth = monthKey;
                monthStart = idx;
            }
        });

        // Añadir el último mes
        if (currentMonth !== null) {
            groups.push({
                label: currentMonth,
                start: monthStart,
                span: timeUnits.length - monthStart
            });
        }

        return groups;
    }, [timeUnits]);

    return (
        <div className="flex-1 relative bg-[var(--bg-color)] min-h-full h-fit">
            {/* Cabecera del Mes */}
            <div className="sticky top-0 z-30 h-8 flex bg-[var(--grid-color)] border-b-2 border-primary">
                {monthGroups.map((group, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-center border-r border-[var(--border-color)] font-bold text-xs text-primary uppercase"
                        style={{ width: group.span * cellWidth, minWidth: group.span * cellWidth }}
                    >
                        {group.label}
                    </div>
                ))}
            </div>

            {/* Cabecera de Días/Semanas/Meses */}
            <div className="sticky top-8 z-20 h-12 flex bg-[var(--grid-color)] border-b border-[var(--border-color)]">
                {timeUnits.map((unit, idx) => (
                    <div
                        key={idx}
                        className={`min-w-[${cellWidth}px] w-[${cellWidth}px] flex flex-col items-center justify-center border-r border-[var(--border-color)] relative`}
                        style={{ width: cellWidth, minWidth: cellWidth }}
                    >
                        {viewMode === 'Día' && (
                            <>
                                <span className="text-[10px] text-gray-400 uppercase">{format(unit, 'EEE', { locale: es })}</span>
                                <span className="text-xs font-semibold">{format(unit, 'd')}</span>
                            </>
                        )}
                        {viewMode === 'Semana' && (
                            <>
                                <span className="text-[10px] text-gray-400">Semana</span>
                                <span className="text-xs font-semibold">{format(unit, 'd MMM', { locale: es })}</span>
                            </>
                        )}
                        {viewMode === 'Mes' && (
                            <span className="text-xs font-semibold">{format(unit, 'MMM', { locale: es })}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Grid de Fondo y Barras de Tareas */}
            <div className="relative" style={{ width: timeUnits.length * cellWidth }}>
                {/* Líneas verticales */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-50"
                    style={{
                        backgroundSize: `${cellWidth}px 100%`,
                        backgroundImage: 'linear-gradient(to right, var(--border-color) 1px, transparent 1px)'
                    }}
                />

                {/* Filas de Tareas */}
                <div className="flex flex-col">
                    {sortedTasks.map((task) => {
                        const { left, width } = getTaskPosition(task.startDate, task.duration);
                        return (
                            <div
                                key={task.id}
                                className="min-h-[48px] border-b border-[var(--border-color)] relative group flex items-center"
                            >
                                <TaskBar
                                    task={task}
                                    left={left}
                                    width={width}
                                    updateTask={updateTask}
                                    rangeStart={rangeStart}
                                    cellWidth={cellWidth}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
