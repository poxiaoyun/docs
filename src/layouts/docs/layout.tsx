import type { DashboardLayoutProps } from 'src/layouts/dashboard/layout';

import { useMemo } from 'react';

import { DashboardLayout } from 'src/layouts/dashboard/layout';

import { generateNavData } from './nav-generator';

// ----------------------------------------------------------------------

export function DocsLayout({ children, slotProps, ...other }: DashboardLayoutProps) {
  const navData = useMemo(() => generateNavData(), []);

  return (
    <DashboardLayout
      {...other}
      slotProps={{
        ...slotProps,
        nav: {
          ...slotProps?.nav,
          data: navData,
        },
      }}
    >
      {children}
    </DashboardLayout>
  );
}
