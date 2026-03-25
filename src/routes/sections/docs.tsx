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

export const docsRoutes: RouteObject[] = [
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
