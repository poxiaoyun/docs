import type { RouteObject } from 'react-router';

import { lazy } from 'react';

import { docsRoutes } from './docs';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));
const HomePage = lazy(() => import('src/pages/home'));

export const routesSection: RouteObject[] = [
  // 中文首页
  {
    path: '/',
    element: <HomePage />,
  },

  // 英文首页（语言只认 URL，见 src/utils/doc-lang.ts）。
  // 必须放在 docsRoutes 的 `/en/*` 之前也拦得住：`/en` 是静态单段路由，
  // 排序天然高于 splat，这里的位置只影响可读性。
  {
    path: '/en',
    element: <HomePage />,
  },

  // Docs
  ...docsRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
