import React, { useState, useEffect, useRef } from 'react';
import { initialTasks } from './data/mockData';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Timeline from './components/Timeline';
import { addDays, differenceInDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function App() {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('gantt-tasks');
        return saved ? JSON.parse(saved) : [];
    });

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    const [viewMode, setViewMode] = useState('Día');
    const ganttRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('gantt-tasks', JSON.stringify(tasks));
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [tasks, darkMode]);

    const createProject = (projectName) => {
        const newProject = {
            id: Date.now().toString(),
            name: projectName,
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
            duration: 30,
            progress: 0,
            color: '#2563eb',
            parentId: null,
            assignee: ''
        };
        setTasks([newProject]);
    };

    const addTask = (parentId = null) => {
        // Calcular la profundidad del padre correctamente
        const getParentDepth = (taskId) => {
            if (!taskId) return -1; // Sin padre, el hijo será nivel 0
            const parent = tasks.find(t => t.id === taskId);
            if (!parent) return -1;
            if (!parent.parentId) return 0; // El padre es raíz (Proyecto nivel 0)
            return 1 + getParentDepth(parent.parentId);
        };

        const parentDepth = getParentDepth(parentId);
        const childDepth = parentDepth + 1;

        const labels = ['Proyecto', 'Fase', 'SubFase', 'Tarea', 'SubTarea'];
        const label = labels[Math.min(childDepth, 4)];

        const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
        const color = colors[Math.min(childDepth, 4)];

        const newTask = {
            id: Date.now().toString(),
            name: `Nueva ${label}`,
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
            duration: 5,
            progress: 0,
            color: color,
            parentId: parentId,
            assignee: ''
        };
        setTasks([...tasks, newTask]);
    };

    const updateTask = (id, updates) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTask = (id) => {
        const getChildIds = (taskId) => {
            const children = tasks.filter(t => t.parentId === taskId);
            return [taskId, ...children.flatMap(child => getChildIds(child.id))];
        };

        const idsToDelete = getChildIds(id);
        setTasks(tasks.filter(t => !idsToDelete.includes(t.id)));
    };

    const handleClearData = () => {
        localStorage.removeItem('gantt-tasks');
        setTasks([]);
    };

    const exportAsJSON = () => {
        const data = {
            version: '1.0.0',
            appName: 'GanttPro',
            exportedAt: new Date().toISOString(),
            tasks: tasks
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `gantt-proyecto-${format(new Date(), 'yyyy-MM-dd_HH-mm')}.gantt.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    const importFromJSON = (mode = 'replace') => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.gantt.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    let importedTasks;

                    // Support both wrapped format { tasks: [...] } and plain array [...]
                    if (Array.isArray(data)) {
                        importedTasks = data;
                    } else if (data.tasks && Array.isArray(data.tasks)) {
                        importedTasks = data.tasks;
                    } else {
                        alert('El archivo no tiene un formato válido. Se espera un archivo .gantt.json exportado por GanttPro.');
                        return;
                    }

                    // Validate minimum task structure
                    const isValid = importedTasks.every(t => t.id && t.name && t.startDate && t.endDate);
                    if (!isValid) {
                        alert('Algunas tareas del archivo no tienen la estructura requerida (id, name, startDate, endDate).');
                        return;
                    }

                    if (mode === 'merge') {
                        // Merge: add imported tasks that don't already exist by id
                        const existingIds = new Set(tasks.map(t => t.id));
                        const newTasks = importedTasks.filter(t => !existingIds.has(t.id));
                        setTasks([...tasks, ...newTasks]);
                    } else {
                        // Replace: overwrite all tasks
                        setTasks(importedTasks);
                    }
                } catch (err) {
                    alert('Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const prepareCloneForExport = (clonedDoc) => {
        const clonedElement = clonedDoc.body.querySelector('main > div');
        if (clonedElement) {
            clonedElement.style.width = 'fit-content';
            clonedElement.style.minWidth = '100%';
        }

        // 0. RESETEAR SCROLL CONTAINER PRINCIPAL (MAIN)
        // El contenedor 'main' es ahora el que tiene overflow-auto. Necesitamos expandirlo.
        const mainContainer = clonedDoc.querySelector('main');
        if (mainContainer) {
            mainContainer.style.overflow = 'visible';
            mainContainer.style.height = 'auto';
            mainContainer.style.maxHeight = 'none';
            mainContainer.style.width = 'fit-content'; // Asegurar que todo el ancho se capture
        }

        // 0. ALINEACIÓN: Eliminar padding de las filas de TaskList para que midan exactamente 48px
        // La clase py-1 añade 8px (4px arriba + 4px abajo), haciendo que midan 56px en total
        // El Timeline mide 48px exactos, causando el desalineamiento acumulativo
        const taskRows = clonedDoc.querySelectorAll('.py-1');
        taskRows.forEach(row => {
            row.classList.remove('py-1');
            row.style.paddingTop = '0';
            row.style.paddingBottom = '0';
            row.style.height = '48px';
            row.style.minHeight = '48px';
        });

        // 1. EXPANDIR CONTENEDORES SCROLL PARA CAPTURAR TODO (pero NO hidden - eso rompe truncación)
        const scrollableDivs = clonedDoc.querySelectorAll('div');
        scrollableDivs.forEach(div => {
            const style = window.getComputedStyle(div);
            if (style.overflowX === 'auto' || style.overflowX === 'scroll' ||
                style.overflowY === 'auto' || style.overflowY === 'scroll') {

                div.style.overflow = 'visible';
                div.style.width = 'fit-content';
                div.style.height = 'auto';
                div.style.maxHeight = 'none';
                div.style.maxWidth = 'none';
            }
        });

        // 2. ARREGLAR TEXTO EN BARRAS DE TAREAS (TaskBar) - Forzar line-height explícito
        const taskBarTextContainers = clonedDoc.querySelectorAll('.rounded-md > div');
        taskBarTextContainers.forEach(container => {
            const style = window.getComputedStyle(container);
            if (style.display === 'flex') {
                // El contenedor de texto tiene h-7 (28px), pero el texto está descentrado
                // Forzar line-height igual a la altura del padre
                const parent = container.parentElement;
                if (parent) {
                    const parentHeight = window.getComputedStyle(parent).height;
                    container.style.lineHeight = parentHeight;
                }
            }
        });

        // 3. ARREGLAR TEXTO EN TASK LIST (inputs y spans)
        const elementsToFix = [
            ...clonedDoc.querySelectorAll('input[type="text"]'),
            ...clonedDoc.querySelectorAll('button span.truncate')
        ];

        elementsToFix.forEach(el => {
            const target = el.tagName === 'SPAN' ? el.parentElement : el;
            const value = el.tagName === 'SPAN' ? el.textContent : el.value;

            const div = clonedDoc.createElement('div');
            div.innerText = value;

            const style = window.getComputedStyle(target);


            // 1. DESACTIVAR OVERFLOW EN EL PADRE para evitar que corte el texto verticalmente
            if (target.parentElement) {
                target.parentElement.style.overflow = 'visible';
                target.parentElement.style.minHeight = 'auto'; // Permitir que crezca si es necesario
            }

            // 2. Estilo del div de reemplazo
            // IMPORTANTE: Altura fija de 48px (altura estándar de la fila) para evitar colapso en el canvas
            const rowHeight = '48px';

            div.style.width = '100%';
            div.style.height = rowHeight;
            div.style.minHeight = rowHeight;
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.margin = '0';
            div.style.padding = '0';
            div.style.lineHeight = 'normal';
            div.style.boxSizing = 'border-box';

            // Copiar alineación horizontal
            if (style.textAlign === 'center') div.style.justifyContent = 'center';
            else if (style.textAlign === 'right') div.style.justifyContent = 'flex-end';
            else div.style.justifyContent = 'flex-start';

            // Forzar centrado si es fecha (columna Fechas y Días)
            if (value.includes('/') || (value.endsWith('d') && value.length < 10)) {
                div.style.justifyContent = 'center';
            }

            div.style.fontSize = style.fontSize;
            div.style.fontWeight = style.fontWeight;
            div.style.color = style.color;

            // TRUNCACIÓN INTERNA
            div.style.overflow = 'hidden';
            div.style.textOverflow = 'ellipsis';
            div.style.whiteSpace = 'nowrap';

            div.className = target.className.replace('bg-transparent', '').replace('border-none', '').replace('outline-none', '');

            if (target.parentNode) {
                target.parentNode.replaceChild(div, target);
            }
        });

        // 4. ARREGLAR SPANS DE TEXTO EN BARRAS (truncate spans dentro de TaskBar)
        const taskBarSpans = clonedDoc.querySelectorAll('span.truncate');
        taskBarSpans.forEach(span => {
            const style = window.getComputedStyle(span);
            const parent = span.parentElement;
            if (parent) {
                const parentHeight = window.getComputedStyle(parent).height;
                span.style.lineHeight = parentHeight;
                span.style.display = 'inline-block';
                span.style.verticalAlign = 'middle';
            }
        });
    };

    const exportAsImage = async () => {
        if (!ganttRef.current) return;

        const element = ganttRef.current;

        // Calcular ancho total real expandiendo todo
        const scrollContainer = element.querySelector('.overflow-x-auto');
        let fullWidth = element.scrollWidth;
        if (scrollContainer) {
            fullWidth = Math.max(fullWidth, scrollContainer.scrollWidth + 800);
        }

        const canvas = await html2canvas(element, {
            backgroundColor: darkMode ? '#111827' : '#ffffff',
            scale: 2,
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: fullWidth,
            windowHeight: element.scrollHeight,
            width: fullWidth,
            height: element.scrollHeight,
            onclone: prepareCloneForExport
        });

        const link = document.createElement('a');
        link.download = 'gantt-chart.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    const exportAsPDF = async () => {
        if (!ganttRef.current) return;

        const element = ganttRef.current;

        // Calcular ancho total real expandiendo todo
        const scrollContainer = element.querySelector('.overflow-x-auto');
        let fullWidth = element.scrollWidth;
        if (scrollContainer) {
            fullWidth = Math.max(fullWidth, scrollContainer.scrollWidth + 800);
        }

        const canvas = await html2canvas(element, {
            backgroundColor: darkMode ? '#111827' : '#ffffff',
            scale: 2,
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: fullWidth,
            windowHeight: element.scrollHeight,
            width: fullWidth,
            height: element.scrollHeight,
            onclone: prepareCloneForExport
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'px', [canvas.width, canvas.height]);
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('gantt-chart.pdf');
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[var(--bg-color)] text-[var(--text-color)] transition-colors">
            <Header
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onCreateProject={createProject}
                onExportPNG={exportAsImage}
                onExportPDF={exportAsPDF}
                onExportJSON={exportAsJSON}
                onImportJSON={importFromJSON}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onClearData={handleClearData}
                hasExistingData={tasks.length > 0}
            />

            <main className="flex-1 overflow-auto flex border-t border-[var(--border-color)] relative" ref={ganttRef}>
                <div className="flex w-full min-h-full min-w-max h-fit">
                    <TaskList
                        tasks={tasks}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                        addTask={addTask}
                    />

                    <Timeline
                        tasks={tasks}
                        viewMode={viewMode}
                        updateTask={updateTask}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
