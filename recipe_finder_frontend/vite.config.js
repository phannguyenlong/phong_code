import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
//
// git add .
// git add vite.config.js
// git commit -m "Add vite config.js"
// git push origin main

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/assignment2",
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
    }
  }
})
