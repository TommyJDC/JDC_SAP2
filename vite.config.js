import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss'; // Import tailwindcss

export default defineConfig({
  plugins: [], // No specific plugins needed for this basic setup yet
  css: {
    postcss: { // Add postcss configuration
      plugins: [
        tailwindcss(), // Add tailwindcss plugin
        // autoprefixer(), // You might want autoprefixer too
      ],
    },
  },
  server: {
    host: '0.0.0.0', // Make accessible on the network
    port: 3000 // Optional: specify port
  }
});
