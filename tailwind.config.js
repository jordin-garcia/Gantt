/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        sidebar: {
          light: '#f9fafb',
          dark: '#111827',
        },
        timeline: {
          light: '#ffffff',
          dark: '#1f2937',
        }
      },
    },
  },
  plugins: [],
}
