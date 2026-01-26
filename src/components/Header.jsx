import React, { useState } from 'react';
import { Plus, Sun, Moon, Download, ChevronDown, Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';
import ProjectModal from './ProjectModal';

const Header = ({ darkMode, setDarkMode, onCreateProject, onExportPNG, onExportPDF, viewMode, setViewMode, onClearData, hasExistingData }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);

    return (
        <>
            <header className="h-16 px-6 flex items-center justify-between bg-[var(--bg-color)] border-b border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">G</div>
                        GanttPro
                    </h1>
                    <button
                        onClick={() => setShowProjectModal(true)}
                        className="ml-4 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-all transform active:scale-95"
                    >
                        <Plus size={18} />
                        Nuevo Proyecto
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Selector de Vista */}
                    <div className="flex bg-[var(--grid-color)] p-1 rounded-lg border border-[var(--border-color)]">
                        {['Día', 'Semana', 'Mes'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === mode
                                        ? 'bg-[var(--bg-color)] shadow-sm text-primary'
                                        : 'text-gray-500 hover:text-[var(--text-color)]'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full hover:bg-[var(--grid-color)] transition-colors border border-[var(--border-color)]"
                    >
                        {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--grid-color)] transition-colors"
                        >
                            <Download size={18} />
                            <span>Exportar</span>
                            <ChevronDown size={14} />
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 overflow-hidden">
                                <button
                                    onClick={() => {
                                        onExportPNG();
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-[var(--grid-color)] transition-colors border-b border-[var(--border-color)]"
                                >
                                    Exportar como PNG
                                </button>
                                <button
                                    onClick={() => {
                                        onExportPDF();
                                        setShowExportMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-[var(--grid-color)] transition-colors"
                                >
                                    Exportar como PDF
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-full hover:bg-[var(--grid-color)] transition-colors"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                    onClearData={onClearData}
                />
            )}

            {showProjectModal && (
                <ProjectModal
                    onClose={() => setShowProjectModal(false)}
                    onCreateProject={onCreateProject}
                    hasExistingData={hasExistingData}
                />
            )}

            {/* Close export menu when clicking outside */}
            {showExportMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                />
            )}
        </>
    );
};

export default Header;
