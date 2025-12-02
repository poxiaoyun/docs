import type { DashboardLayoutProps } from 'src/layouts/dashboard/layout';

import { DashboardLayout } from 'src/layouts/dashboard/layout';

import { docsNavData } from './nav-config-docs';

// ----------------------------------------------------------------------

export function DocsLayout({ children, slotProps, ...other }: DashboardLayoutProps) {
  return (
    <DashboardLayout
      {...other}
      slotProps={{
        ...slotProps,
        nav: {
          ...slotProps?.nav,
          data: docsNavData,
        },
      }}
    >
      {children}
    </DashboardLayout>
  );
}
