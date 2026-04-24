import { addDays, format } from 'date-fns';

const today = new Date();

export const initialTasks = [
    {
        id: '1',
        name: 'Diseño de Interfaz UX/UI',
        startDate: format(today, 'yyyy-MM-dd'),
        endDate: format(addDays(today, 5), 'yyyy-MM-dd'),
        duration: 5,
        progress: 100,
        color: '#2563eb',
        parentId: null,
        assignee: 'Ana García'
    },
    {
        id: '2',
        name: 'Desarrollo Frontend',
        startDate: format(addDays(today, 6), 'yyyy-MM-dd'),
        endDate: format(addDays(today, 15), 'yyyy-MM-dd'),
        duration: 10,
        progress: 45,
        color: '#10b981',
        parentId: null,
        assignee: 'Carlos López'
    },
    {
        id: '3',
        name: 'Configuración de API',
        startDate: format(addDays(today, 6), 'yyyy-MM-dd'),
        endDate: format(addDays(today, 10), 'yyyy-MM-dd'),
        duration: 5,
        progress: 20,
        color: '#f59e0b',
        parentId: '2',
        assignee: 'María Torres'
    },
    {
        id: '4',
        name: 'Pruebas y QA',
        startDate: format(addDays(today, 16), 'yyyy-MM-dd'),
        endDate: format(addDays(today, 20), 'yyyy-MM-dd'),
        duration: 5,
        progress: 0,
        color: '#ef4444',
        parentId: null,
        assignee: 'Jorge Ramírez'
    }
];
