import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

const DatePickerModal = ({ task, onClose, onSave }) => {
    const [startDate, setStartDate] = useState(task.startDate);
    const [endDate, setEndDate] = useState(task.endDate);

    const handleSave = () => {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const duration = differenceInDays(end, start) + 1;

        onSave({
            startDate,
            endDate,
            duration
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 w-[400px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-primary" />
                        <h3 className="font-semibold text-lg">Editar Fechas</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-[var(--grid-color)] rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Tarea</label>
                        <input
                            type="text"
                            value={task.name}
                            disabled
                            className="w-full px-3 py-2 bg-[var(--grid-color)] border border-[var(--border-color)] rounded-lg text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Fecha de Inicio</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Fecha de Fin</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="bg-[var(--grid-color)] p-3 rounded-lg">
                        <p className="text-sm text-gray-500">
                            Duración: <span className="font-semibold text-[var(--text-color)]">
                                {differenceInDays(parseISO(endDate), parseISO(startDate)) + 1} días
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--grid-color)] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal;
