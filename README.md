# Gantt Chart App

Una aplicación web moderna y profesional para la gestión de proyectos mediante diagramas de Gantt, construida con React y Tailwind CSS.

## 🚀 Características

- **Gestión Jerárquica**: Crea proyectos, fases, subfases, tareas y subtareas con hasta 5 niveles de profundidad.
- **Visualización Interactiva**: Línea de tiempo dinámica con soporte para diferentes modos de vista (Día, Semana, Mes).
- **Exportación Profesional**: Exporta tus diagramas de Gantt directamente a formato **PNG** o **PDF**.
- **Modo Oscuro/Claro**: Interfaz adaptable con soporte para temas.
- **Persistencia Local**: Tus datos se guardan automáticamente en el navegador mediante `localStorage`.
- **Diseño Responsivo**: Interfaz fluida y moderna que se adapta a diferentes tamaños de pantalla.

## 🛠️ Tecnologías

- **React**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Herramienta de construcción ultrarrápida.
- **Tailwind CSS**: Framework de CSS para un diseño moderno y minimalista.
- **date-fns**: Manipulación avanzada de fechas.
- **html2canvas & jsPDF**: Generación de exportaciones en imagen y PDF.
- **Lucide React**: Set de iconos elegantes y consistentes.

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```

2. Entra en el directorio del proyecto:
   ```bash
   cd Gantt
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

## 🚀 Uso

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Genera la versión de producción para despliegue.
- `npm run preview`: Previsualiza la versión de producción localmente.

## 📁 Estructura del Proyecto

- `src/components`: Componentes reutilizables de la interfaz (Header, TaskList, Timeline, Modals).
- `src/data`: Manejo de datos y estados iniciales.
- `src/App.jsx`: Componente principal que gestiona la lógica global y exportaciones.
- `src/index.css`: Estilos globales y variables de tema.

## 📝 Notas

- El sistema de exportación ha sido optimizado para capturar el contenido completo del diagrama, incluso si hay desplazamiento horizontal o vertical.
- Los colores de las tareas cambian automáticamente según su nivel jerárquico.
