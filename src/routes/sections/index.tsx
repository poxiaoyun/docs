import type { RouteObject } from 'react-router';

import { lazy } from 'react';

import { docsRoutes } from './docs';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));
const HomePage = lazy(() => import('src/pages/home'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },

  // Docs
  ...docsRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
