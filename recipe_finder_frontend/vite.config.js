import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/assignment2",
  server: {
    allowedHosts: ['n12122882.ifn666.com'], // 👈 Add your host here
  },
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      '@chakra-ui/react': '@chakra-ui/react/dist/esm/index.mjs'
    }
  }
})
