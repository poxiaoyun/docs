import fs from 'node:fs';
import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';

// 默认值 "/docs" 是给容器部署用的（Dockerfile + nginx.conf.template）。
// GitHub Pages 走自定义域名 docs.poxiaoshi.cn，站点在域名根路径，构建时必须
// 用 VITE_BASE_URL=/ 覆盖，见 .github/workflows/pages.yml。
const DOCS_BASE_URL = process.env.VITE_BASE_URL || '/docs';

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

// GitHub Pages 是纯静态托管，未知路径一律返回它自带的 404 页；而本项目用的是
// react-router 的 history 路由，用户直接打开或刷新深层链接（如 /platform-architecture）
// 就会拿到 404。构建时把 index.html 复制一份成 404.html，Pages 便会用 SPA 外壳兜底。
// 注意：只有在 base 为 "/"（自定义域名场景）时这个 fallback 才有意义。
function githubPagesSpaFallback(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    writeBundle(options) {
      // 容器部署（base=/docs）由 nginx 的 try_files 兜底，不需要 404.html，
      // 这里直接跳过，保证 Docker / Helm 那条链路的产物与改动前完全一致。
      if (DOCS_BASE_URL !== '/') {
        return;
      }

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
