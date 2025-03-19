import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
  envDir: './env', // 환경변수 파일이 있는 디렉토리 경로
  server: {
    port: 3000,
  },
  preview: {
    port: 30000,
  },
});
