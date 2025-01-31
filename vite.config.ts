import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(
  {  
    plugins: [  
      tailwindcss(),  
    ],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:11434", // URL твоего API
          changeOrigin: true,
          secure: false, // Установи в true, если API использует HTTPS
        },
      },
    },
  }
)