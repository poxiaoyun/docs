import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export type TopNavLink = {
  key: string;
  path: string;
  label: {
    cn: string;
    en: string;
  };
};

/** 站点一级栏目。桌面端渲染成顶栏胶囊，移动端复用成抽屉里的切换器（同一个真源）。 */
export const TOP_NAV_LINKS: TopNavLink[] = [
  { key: 'home', path: '/', label: { cn: '首页', en: 'Home' } },
  { key: 'moha', path: '/moha', label: { cn: '魔哈仓库', en: 'Moha' } },
  { key: 'rune', path: '/rune', label: { cn: 'Rune 智算平台', en: 'Rune AI Platform' } },
  { key: 'airouter', path: '/airouter', label: { cn: '聚合网关', en: 'AIrouter' } },
  { key: 'boss', path: '/boss', label: { cn: 'Boss 运营平台', en: 'Boss Operations Platform' } },
  { key: 'ecosystem', path: '/ecosystem', label: { cn: '生态文档', en: 'Ecosystem' } },
];

// ----------------------------------------------------------------------

/**
 * 全局顶部导航栏组件
 * 在所有页面中统一使用，提供平台名称和主要导航链接
 */
export function GlobalTopNav() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith('en') ? 'en' : 'cn';
  const siteTitle = locale === 'en' ? 'Docs Center' : '文档中心';

  // 选中态用 currentColor 混色，而不是写死的白色 —— 文档页是浅色底，
  // 白色 12% 压在近白背景上等于看不见；首页顶栏被强制成深色且文字变白，
  // currentColor 跟着文字走，两种底色下都能得到正确的选中块。
  const pillStyles = (active: boolean) => ({
    opacity: active ? 1 : 0.78,
    fontWeight: active ? 700 : 600,
    fontSize: '1rem',
    textTransform: 'none',
    borderRadius: 999,
    px: 2.5,
    py: 0.75,
    bgcolor: active ? 'color-mix(in srgb, currentColor 12%, transparent)' : 'transparent',
    '&:hover': {
      bgcolor: 'color-mix(in srgb, currentColor 18%, transparent)',
    },
  });

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        // 移动端保留「文档中心」这行标题（顶栏不至于整条空着），
        // 一级栏目胶囊只在桌面端展开 —— 移动端由抽屉里的切换器承担。
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-start',
        minWidth: 0, // 允许内容收缩
      }}
    >
      <Typography
        component="span"
        sx={{
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: 'text.primary',
          fontSize: { xs: '1rem', md: '1.25rem' },
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {siteTitle}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexGrow: 1,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {TOP_NAV_LINKS.map((link) => {
          const isActive =
            link.path === '/' ? pathname === link.path : pathname.startsWith(link.path);
          const label = link.label[locale];

          return (
            <Button
              key={link.key}
              color="inherit"
              size="small"
              component={RouterLink}
              to={link.path}
              sx={pillStyles(isActive)}
              aria-label={label}
            >
              {label}
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default GlobalTopNav;
