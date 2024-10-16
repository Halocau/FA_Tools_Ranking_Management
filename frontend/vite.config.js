import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [react(),
  eslintPlugin({
    include: ['src/**/*.js', 'src/**/*.jsx'], // Include your source files
    exclude: ['node_modules', 'dist'], // Exclude unnecessary directories
  }),
  ],
  server: {
    port: 5002,  // Customize the port
    open: true,  // Automatically open the browser
    host: true,  // Allow access from external devices (e.g., in a local network)
  },
})
