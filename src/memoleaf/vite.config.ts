import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages のリポジトリ名に合わせたベースパス
  base: '/Memoleaf/',
  plugins: [react(), tailwindcss()],
})
