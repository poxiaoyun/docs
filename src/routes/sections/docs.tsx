import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { DocsLayout } from 'src/layouts/docs/layout';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const DocsViewer = lazy(() => import('src/pages/docs/viewer'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const docsLayout = () => (
  <DocsLayout>
    <SuspenseOutlet />
  </DocsLayout>
);

/**
 * 英文内容挂在 `/en` 下（见 src/utils/doc-lang.ts）。
 *
 * 必须是独立的一棵路由树，而不是在 `*` 里自己剥前缀：react-router 的 splat 参数
 * 会基于匹配到的父路由算，`/en` 这棵树拿到的 `*` 天然就是去前缀后的路径，
 * viewer 里的内容解析因此完全不用改。
 *
 * **这里刻意没有 index 子路由**：`/en` 本身是英文首页（见 routes/sections/index.tsx），
 * 不是文档页。留一个 `path: ''` 会让 `/en` 落进 viewer，把落地页顶掉。
 */
const enDocsRoute: RouteObject = {
  path: '/en',
  element: docsLayout(),
  children: [
    {
      path: '*',
      element: <DocsViewer />,
    },
  ],
};

export const docsRoutes: RouteObject[] = [
  enDocsRoute,
  {
    path: '/',
    element: docsLayout(),
    children: [
      {
        path: '',
        element: <DocsViewer />,
      },
      {
        path: '*',
        element: <DocsViewer />,
      },
    ],
  },
];
