import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

const ProjectModal = ({ onClose, onCreateProject, hasExistingData }) => {
    const [projectName, setProjectName] = useState('');
    const [showConfirm, setShowConfirm] = useState(hasExistingData);

    const handleCreate = () => {
        if (!projectName.trim()) {
            alert('Por favor ingresa un nombre para el proyecto');
            return;
        }
        onCreateProject(projectName);
        onClose();
    };

    const handleConfirmClear = () => {
        setShowConfirm(false);
    };

    if (showConfirm) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
                <div
                    className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 w-[450px]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-red-600 dark:text-red-400">⚠️ Confirmar Acción</h3>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-[var(--grid-color)] rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <p className="text-sm mb-6">
                        Ya tienes un diagrama con datos. ¿Estás seguro de que quieres crear un nuevo proyecto?
                        <strong className="block mt-2 text-red-600 dark:text-red-400">Esto borrará todos los datos actuales.</strong>
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--grid-color)] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmClear}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            Sí, Borrar Todo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 w-[450px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FolderPlus size={20} className="text-primary" />
                        <h3 className="font-semibold text-lg">Crear Nuevo Proyecto</h3>
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
                        <label className="block text-sm font-medium mb-2">Nombre del Proyecto</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            placeholder="Ej: Desarrollo de Aplicación Web"
                            className="w-full px-3 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-primary"
                            autoFocus
                        />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                            💡 <strong>Jerarquía:</strong> Proyecto → Fase → SubFase → Tarea → SubTarea
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
                        onClick={handleCreate}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Crear Proyecto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
