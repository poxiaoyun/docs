import type { NavSectionProps } from 'src/components/nav-section';
import type { DashboardLayoutProps } from 'src/layouts/dashboard/layout';

import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

import { DashboardLayout } from 'src/layouts/dashboard/layout';
import { type DocsSidebarItem, getDocsSidebarSections } from 'src/pages/docs/toc';

import { icon } from './icon';

// ----------------------------------------------------------------------

export function DocsLayout({ children, slotProps, ...other }: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const activeProduct = useMemo(() => getProductFromPath(pathname), [pathname]);
  const navData = useMemo(
    () => mapDocsNavData(getDocsSidebarSections(i18n.language), activeProduct),
    [activeProduct, i18n.language]
  );

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

function mapDocsNavData(
  sections: ReturnType<typeof getDocsSidebarSections>,
  product?: DocsSidebarItem['product']
): NavSectionProps['data'] {
  const mapItem = (item: DocsSidebarItem): NavSectionProps['data'][number]['items'][number] => ({
    title: item.title,
    path: item.path,
    icon: item.icon ? icon(item.icon) : undefined,
    deepMatch: item.deepMatch ?? true,
    children: item.children?.map((child) => mapItem(child)),
  });

  const filteredSections = product
    ? sections.filter((section) =>
        section.items.some((item) => item.product === product)
      )
    : sections;

  return filteredSections.map((section) => ({
    subheader: section.subheader,
    items: section.items.map((item) => mapItem(item)),
  }));
}

function getProductFromPath(pathname: string): DocsSidebarItem['product'] | undefined {
  const normalized = pathname.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  const segments = normalized.split('/');

  if (segments[0] === 'moha') return 'moha';
  if (segments[0] === 'rune') return 'rune';
  if (segments[0] === 'boss') return 'boss';
  if (segments[0] === 'ecosystem') return 'ecosystem';

  return undefined;
}
