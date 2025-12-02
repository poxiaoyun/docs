import type { DashboardLayoutProps } from 'src/layouts/dashboard/layout';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardLayout } from 'src/layouts/dashboard/layout';

import { generateNavData } from './nav-generator';

// ----------------------------------------------------------------------

export function DocsLayout({ children, slotProps, ...other }: DashboardLayoutProps) {
  const { i18n } = useTranslation('navbar');

  const navData = useMemo(() => generateNavData(i18n.language), [i18n.language]);

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
