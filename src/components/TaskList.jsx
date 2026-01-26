import React, { useState } from 'react';
import { Trash2, ChevronRight, ChevronDown, Plus, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import DatePickerModal from './DatePickerModal';

const TaskList = ({ tasks, updateTask, deleteTask, addTask }) => {
    const [collapsed, setCollapsed] = useState({});
    const [editingTask, setEditingTask] = useState(null);

    const toggleCollapse = (taskId) => {
        setCollapsed(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const hasChildren = (taskId) => {
        return tasks.some(t => t.parentId === taskId);
    };

    const getTaskDepth = (task) => {
        if (!task.parentId) return 0;
        const parent = tasks.find(t => t.id === task.parentId);
        if (!parent) return 0;
        return 1 + getTaskDepth(parent);
    };

    const getTaskLabel = (depth) => {
        const labels = ['Proyecto', 'Fase', 'SubFase', 'Tarea', 'SubTarea'];
        return labels[Math.min(depth, 4)];
    };

    const canAddChild = (task) => {
        return getTaskDepth(task) < 4; // Máximo 5 niveles (0, 1, 2, 3, 4)
    };

    // Calcular tamaño de fuente dinámico basado en la longitud del texto
    const getDynamicFontSize = (text, depth) => {
        const effectiveLength = text.length + (depth * 5); // Considerar indentación adicional

        // Ajustado para mayor legibilidad dado el nuevo ancho
        if (effectiveLength <= 25) return 'text-xs'; // 12px
        if (effectiveLength <= 40) return 'text-[11px]';
        if (effectiveLength <= 60) return 'text-[10px]';
        if (effectiveLength <= 80) return 'text-[9px]';
        return 'text-[8px]'; // Mínimo para textos muy largos
    };

    const isVisible = (task) => {
        if (!task.parentId) return true;
        const parent = tasks.find(t => t.id === task.parentId);
        if (!parent) return true;
        if (collapsed[task.parentId]) return false;
        return isVisible(parent);
    };

    // Ordenar tareas jerárquicamente: padres seguidos de sus hijos
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

    const sortedTasks = getSortedTasks(tasks);
    const visibleTasks = sortedTasks.filter(isVisible);

    return (
        <>
            {/* Aumentado ancho total a 600px usando estilo en línea para forzar el cambio */}
            <div
                className="border-r border-[var(--border-color)] flex flex-col bg-[var(--bg-color)] shrink-0 sticky left-0 z-40 h-fit min-h-full"
                style={{ width: '600px', minWidth: '600px' }}
            >
                {/* Spacer para alinearse con la fila de meses del Timeline */}
                <div className="h-8 border-b-2 border-primary bg-[var(--grid-color)] sticky top-0 z-50"></div>

                {/* Header de columnas */}
                <div className="h-12 flex items-center pl-4 border-b border-[var(--border-color)] bg-[var(--grid-color)] font-semibold text-xs text-center sticky top-8 z-50">
                    <div className="flex-1 text-center">Nombre</div>
                    {/* Reducido ancho de columnas secundarias */}
                    <div className="w-32 text-center">Fechas</div>
                    <div className="w-12 text-center">Días</div>
                    {/* Espaciador para alinear con los botones de acción (aprox 40px) */}
                    <div className="w-[40px]"></div>
                </div>

                <div className="flex-1">
                    {visibleTasks.map((task) => {
                        const depth = getTaskDepth(task);
                        const label = getTaskLabel(depth);
                        const canAdd = canAddChild(task);
                        const fontSize = getDynamicFontSize(task.name, depth);

                        return (
                            <div
                                key={task.id}
                                className="group flex items-center min-h-[48px] border-b border-[var(--border-color)] hover:bg-[var(--grid-color)] transition-colors py-1"
                                style={{ paddingLeft: `${16 + depth * 20}px` }}
                            >
                                <div className="flex-1 flex items-center gap-2 overflow-hidden min-w-0 pr-2">
                                    {hasChildren(task.id) && (
                                        <button
                                            onClick={() => toggleCollapse(task.id)}
                                            className="p-0.5 hover:bg-[var(--border-color)] rounded transition-colors shrink-0"
                                        >
                                            {collapsed[task.id] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                                        </button>
                                    )}
                                    {!hasChildren(task.id) && <div className="w-[16px] shrink-0" />}

                                    <div
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ backgroundColor: task.color }}
                                        title={label}
                                    ></div>
                                    <input
                                        type="text"
                                        value={task.name}
                                        onChange={(e) => updateTask(task.id, { name: e.target.value })}
                                        placeholder={`Nombre del ${label}`}
                                        className={`bg-transparent border-none outline-none focus:ring-1 focus:ring-primary rounded px-1 transition-all w-full min-w-0 ${fontSize}`}
                                        style={{
                                            lineHeight: '1.3',
                                            wordBreak: 'break-word',
                                            whiteSpace: 'normal'
                                        }}
                                    />
                                </div>

                                <div className="w-32 flex items-center justify-center shrink-0">
                                    <button
                                        onClick={() => setEditingTask(task)}
                                        className="flex items-center justify-center gap-1 text-[10px] text-gray-500 hover:text-primary transition-colors px-1 w-full"
                                        title="Editar fechas"
                                    >
                                        <Calendar size={10} className="shrink-0" />
                                        <span className="truncate">
                                            {format(parseISO(task.startDate), 'dd/MM')} - {format(parseISO(task.endDate), 'dd/MM')}
                                        </span>
                                    </button>
                                </div>

                                <div className="w-12 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-medium">{task.duration}d</span>
                                </div>

                                {canAdd && (
                                    <button
                                        onClick={() => addTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-primary transition-all shrink-0"
                                        title={`Añadir ${getTaskLabel(depth + 1)}`}
                                    >
                                        <Plus size={12} />
                                    </button>
                                )}
                                {!canAdd && <div className="w-[20px] shrink-0" />}

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all shrink-0"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {editingTask && (
                <DatePickerModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={(updates) => updateTask(editingTask.id, updates)}
                />
            )}
        </>
    );
};

export default TaskList;
