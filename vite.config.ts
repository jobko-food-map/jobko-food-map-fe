import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
