import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { DocsLayout } from 'src/layouts/docs/layout';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IntroductionPage = lazy(() => import('src/pages/docs/introduction'));

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
    path: 'docs',
    element: docsLayout(),
    children: [
      { path: 'introduction', element: <IntroductionPage /> },
      { path: 'quick-start', element: <IntroductionPage /> }, // Placeholder
      { path: 'mock-server', element: <IntroductionPage /> }, // Placeholder
      { path: 'deployment', element: <IntroductionPage /> }, // Placeholder
      { path: 'package-license', element: <IntroductionPage /> }, // Placeholder
      { path: 'setup', element: <IntroductionPage /> }, // Placeholder
      { path: 'figma', element: <IntroductionPage /> }, // Placeholder
      {
        path: 'theme',
        children: [
          { path: 'colors', element: <IntroductionPage /> }, // Placeholder
          { path: 'typography', element: <IntroductionPage /> }, // Placeholder
          { path: 'icons', element: <IntroductionPage /> }, // Placeholder
          { path: 'shadows', element: <IntroductionPage /> }, // Placeholder
          { path: 'css-vars', element: <IntroductionPage /> }, // Placeholder
          { path: 'logo', element: <IntroductionPage /> }, // Placeholder
          { path: 'layout', element: <IntroductionPage /> }, // Placeholder
          { path: 'navigation', element: <IntroductionPage /> }, // Placeholder
          { path: 'settings', element: <IntroductionPage /> }, // Placeholder
        ],
      },
      {
        path: 'global',
        children: [
          { path: 'styles', element: <IntroductionPage /> }, // Placeholder
          { path: 'config', element: <IntroductionPage /> }, // Placeholder
          { path: 'components-overrides', element: <IntroductionPage /> }, // Placeholder
        ],
      },
      {
        path: 'development',
        children: [
          { path: 'routing', element: <IntroductionPage /> }, // Placeholder
        ],
      },
    ],
  },
];
