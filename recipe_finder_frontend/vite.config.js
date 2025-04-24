import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// 
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
