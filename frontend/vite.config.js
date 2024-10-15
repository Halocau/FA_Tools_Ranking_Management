import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,  // Customize the port
    open: true,  // Automatically open the browser
    host: true,  // Allow access from external devices (e.g., in a local network)
  },
})
