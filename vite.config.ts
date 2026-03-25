import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';

const DOCS_BASE_URL = process.env.VITE_BASE_URL || '/docs';
const DOCS_BASE_PREFIX = DOCS_BASE_URL.replace(/\/$/, '');

// SPA fallback for vite preview mode
function spaFallback(): Plugin {
  return {
    name: 'spa-fallback',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const { url } = req;
        if (!url) {
          next();
          return;
        }

        // Keep preview behavior aligned with production by redirecting the root path.
        if (DOCS_BASE_URL !== '/') {
          if (url === '/' || url === DOCS_BASE_URL.replace(/\/$/, '')) {
            _res.statusCode = 302;
            _res.setHeader('Location', DOCS_BASE_URL + '/');
            _res.end();
            return;
          }
        }

        next();
      });
    },
  };
}

// ----------------------------------------------------------------------

const PORT = 8080;

export default defineConfig({
  base: DOCS_BASE_URL,
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
    spaFallback(),
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
    // proxy: {
    //   '/api': {
    //     target: 'https://rune.develop.xiaoshiai.cn',
    //     changeOrigin: true,
    //   },
    //   '/avatars': {
    //     target: 'https://rune.develop.xiaoshiai.cn',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/avatars/, '/api/iam/avatars'),
    //   },
    // },
  },
  preview: { port: PORT, host: true },
});
