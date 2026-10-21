import type { NavSectionProps } from 'src/components/nav-section';
import type { DashboardLayoutProps } from 'src/layouts/dashboard/layout';

import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { withLangPath, type DocLang, splitLangPath } from 'src/utils/doc-lang';

import { DashboardLayout } from 'src/layouts/dashboard/layout';
import { type DocsSidebarItem, getDocsSidebarSections } from 'src/pages/docs/toc';
import { DocsProductSwitcher } from 'src/layouts/components/docs-product-switcher';

import { icon } from './icon';

// ----------------------------------------------------------------------

export function DocsLayout({ children, slotProps, ...other }: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const { lang, path: langlessPath } = splitLangPath(pathname);
  const activeProduct = useMemo(() => getProductFromPath(langlessPath), [langlessPath]);
  const navData = useMemo(
    () => mapDocsNavData(getDocsSidebarSections(lang), lang, activeProduct),
    [activeProduct, lang]
  );

  return (
    <DashboardLayout
      {...other}
      slotProps={{
        ...slotProps,
        nav: {
          ...slotProps?.nav,
          data: navData,
          slots: {
            ...slotProps?.nav?.slots,
            // 移动端顶栏不显示一级栏目（< lg 隐藏），抽屉里必须补上切换器，
            // 否则手机上只能看到当前产品的目录、切不到别的产品。
            topArea: slotProps?.nav?.slots?.topArea ?? <DocsProductSwitcher />,
          },
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
            // 断点必须跟顶栏自己的高度切换断点一致（HeaderContainer 用的是 layoutQuery = lg），
            // 写成 md 会在 900~1200px 之间多留 8px 空白。
            pt: { xs: 'var(--layout-header-mobile-height)', lg: 'var(--layout-header-desktop-height)' },
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
  lang: DocLang,
  product?: DocsSidebarItem['product']
): NavSectionProps['data'] {
  const mapItem = (item: DocsSidebarItem): NavSectionProps['data'][number]['items'][number] => ({
    title: item.title,
    // 侧边栏的 path 是语言无关的真源（/rune/console/quota），渲染前统一补上前缀：
    // 英文页点目录不该掉回中文，也更不该出现 /en 再套 /en 的双前缀。
    path: withLangPath(item.path, lang),
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
  if (segments[0] === 'airouter') return 'airouter';
  if (segments[0] === 'boss') return 'boss';
  if (segments[0] === 'ecosystem') return 'ecosystem';

  return undefined;
}
