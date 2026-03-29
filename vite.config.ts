import fs from 'node:fs';
import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';

const DOCS_BASE_URL = process.env.VITE_BASE_URL || '/';
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

function githubPagesSpaFallback(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    writeBundle(options) {
      const outDir = options.dir ? path.resolve(options.dir) : path.resolve('dist');
      const indexPath = path.join(outDir, 'index.html');
      const fallbackPath = path.join(outDir, '404.html');

      if (!fs.existsSync(indexPath)) {
        return;
      }

      fs.copyFileSync(indexPath, fallbackPath);
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
    githubPagesSpaFallback(),
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
