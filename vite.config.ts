import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 8080;

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/api': {
        target: 'https://rune.develop.xiaoshiai.cn',
        changeOrigin: true,
      },
      '/avatars': {
        target: 'https://rune.develop.xiaoshiai.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/avatars/, '/api/iam/avatars'),
      },
    },
  },
  preview: { port: PORT, host: true },
});
