/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jdc-yellow': '#FFD700',
        'jdc-black': '#000000',
        'jdc-gray-dark': '#1A1A1A',
        'jdc-gray-medium': '#2A2A2A', // Example, adjust as needed
        'jdc-gray-light': '#888888', // Example, adjust as needed
        'status-open': '#FF3B30',
        'status-in-progress': '#FF9500',
        'status-resolved': '#34C759',
        'status-urgent': '#AF52DE',
        'status-prepared': '#5AC8FA',
        'status-shipped': '#007AFF',
        'status-delivered': '#34C759',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
