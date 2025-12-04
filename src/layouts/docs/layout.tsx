import type { NavSectionProps } from 'src/components/nav-section';
import type { DashboardLayoutProps } from 'src/layouts/dashboard/layout';

import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { DashboardLayout } from 'src/layouts/dashboard/layout';
import { type DocsSidebarItem, DOCS_SIDEBAR_SECTIONS } from 'src/pages/docs/toc';

import { icon } from './icon';

// ----------------------------------------------------------------------

export function DocsLayout({ children, slotProps, ...other }: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const activeProduct = useMemo(() => getProductFromPath(pathname), [pathname]);
  const navData = useMemo(() => mapDocsNavData(activeProduct), [activeProduct]);

  return (
    <DashboardLayout
      {...other}
      slotProps={{
        ...slotProps,
        nav: {
          ...slotProps?.nav,
          data: navData,
        },
        header: {
          ...slotProps?.header,
          position: 'fixed',
          slotProps: {
            ...slotProps?.header?.slotProps,
            container: {
              maxWidth: false as const,
              ...slotProps?.header?.slotProps?.container,
            },
          },
        },
        main: {
          ...slotProps?.main,
          sx: {
            pt: { xs: 'var(--layout-header-mobile-height)', md: 'var(--layout-header-desktop-height)' },
            ...slotProps?.main?.sx,
          },
        },
      }}
      sx={{
        px: { md: 3 },
      }}
    >
      {children}
    </DashboardLayout>
  );
}

function mapDocsNavData(product?: DocsSidebarItem['product']): NavSectionProps['data'] {
  const mapItem = (item: DocsSidebarItem): NavSectionProps['data'][number]['items'][number] => ({
    title: item.title,
    path: item.path,
    icon: item.icon ? icon(item.icon) : undefined,
    deepMatch: item.deepMatch ?? true,
    children: item.children?.map((child) => mapItem(child)),
  });

  const sections = product
    ? DOCS_SIDEBAR_SECTIONS.filter((section) =>
        section.items.some((item) => item.product === product)
      )
    : DOCS_SIDEBAR_SECTIONS;

  return sections.map((section) => ({
    subheader: section.subheader,
    items: section.items.map((item) => mapItem(item)),
  }));
}

function getProductFromPath(pathname: string): DocsSidebarItem['product'] | undefined {
  const normalized = pathname.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  const segments = normalized.split('/');
  if (segments[0] === 'docs') {
    const target = segments[1] ?? '';
    if (target === 'moha') return 'moha';
    if (target === 'rune') return 'rune';
    if (target === 'boss') return 'boss';
  }

  if (segments[0] === 'moha') return 'moha';
  if (segments[0] === 'rune') return 'rune';
  if (segments[0] === 'boss') return 'boss';

  return undefined;
}
