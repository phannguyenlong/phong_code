import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/assignment2",
//   server: {
//     allowedHosts: ['n12122882.ifn666.com'],
//   },

// })
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const API_URL = `${env.VITE_API_URL ?? 'http://localhost:3000'}`;
  const PORT = `${env.VITE_PORT ?? '3000'}`;

  return {
    plugins: [react()],
    base: "/assignment2",
    server: {
      allowedHosts: ['n12122882.ifn666.com'],
    },
  };
});