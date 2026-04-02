import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api/auth': {
                target: 'https://localhost:7068',
                secure: false, // Allows self-signed dev certificates
                changeOrigin: true
            },
            '/api/signatures': {
                target: 'https://localhost:7025',
                secure: false,
                changeOrigin: true
            }
        }
    }
})
