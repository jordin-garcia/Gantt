import React, { useState } from 'react';
import { X, Save, Trash } from 'lucide-react';

const SettingsModal = ({ onClose, onClearData }) => {
    const [autoSave, setAutoSave] = useState(
        localStorage.getItem('auto-save') !== 'false'
    );

    const handleToggleAutoSave = () => {
        const newValue = !autoSave;
        setAutoSave(newValue);
        localStorage.setItem('auto-save', newValue);
    };

    const handleClearData = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
            onClearData();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 w-[450px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Configuración</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-[var(--grid-color)] rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Auto-Save Toggle */}
                    <div className="flex items-center justify-between p-4 bg-[var(--grid-color)] rounded-lg">
                        <div className="flex items-center gap-3">
                            <Save size={20} className="text-primary" />
                            <div>
                                <p className="font-medium">Guardado Automático</p>
                                <p className="text-xs text-gray-500">Guardar cambios automáticamente en el navegador</p>
                            </div>
                        </div>
                        <button
                            onClick={handleToggleAutoSave}
                            className={`relative w-12 h-6 rounded-full transition-colors ${autoSave ? 'bg-primary' : 'bg-gray-400'
                                }`}
                        >
                            <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Clear Data */}
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-3 mb-3">
                            <Trash size={20} className="text-red-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-700 dark:text-red-400">Zona de Peligro</p>
                                <p className="text-xs text-red-600 dark:text-red-500">Borrar todos los datos guardados</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearData}
                            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                        >
                            Borrar Todos los Datos
                        </button>
                    </div>

                    {/* App Info */}
                    <div className="text-center pt-4 border-t border-[var(--border-color)]">
                        <p className="text-xs text-gray-500">GanttPro v1.0.0</p>
                        <p className="text-xs text-gray-400 mt-1">Diagrama de Gantt Profesional</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
