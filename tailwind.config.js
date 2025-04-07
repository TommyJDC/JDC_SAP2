/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Updated to include src directory
  ],
  theme: {
    extend: {
       fontFamily: {
         poppins: ['Poppins', 'sans-serif'],
       },
       colors: {
         // Custom colors if needed
       }
    },
  },
  plugins: [],
}
