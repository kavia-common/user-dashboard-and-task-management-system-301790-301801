/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        success: '#059669',
        error: '#EF4444',
        background: '#1f2937',
        surface: '#374151',
        textColor: '#f9fafb',
      },
    },
  },
  plugins: [],
}
