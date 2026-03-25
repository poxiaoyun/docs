import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type TopNavLink = {
  key: string;
  path: string;
  label: {
    cn: string;
    en: string;
  };
};

const NAV_LINKS: TopNavLink[] = [
  { key: 'home', path: '/', label: { cn: '首页', en: 'Home' } },
  { key: 'moha', path: '/moha', label: { cn: '魔哈仓库', en: 'Moha' } },
  { key: 'rune', path: '/rune', label: { cn: 'Rune 智算平台', en: 'Rune AI Platform' } },
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

  const pillStyles = (active: boolean) => ({
    opacity: active ? 1 : 0.78,
    fontWeight: active ? 700 : 600,
    fontSize: '1rem',
    textTransform: 'none',
    borderRadius: 999,
    px: 2.5,
    py: 0.75,
    bgcolor: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.18)',
    },
  });

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        display: { xs: 'none', lg: 'flex' },
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
          fontSize: { xs: '1.25rem', md: '1.25rem' },
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
          flexGrow: 1,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {NAV_LINKS.map((link) => {
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
