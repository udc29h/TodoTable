/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
      extend: {
        colors: {
          'task-bg': '#f4f4f4',
          'task-primary': '#3b82f6',
          'task-secondary': '#10b981'
        }
      },
  },
  plugins: [
  ],
}

