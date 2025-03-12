import { reactRouter } from '@react-router/dev/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), vanillaExtractPlugin()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
