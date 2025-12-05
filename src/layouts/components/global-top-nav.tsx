import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type TopNavLink = {
  key: string;
  path: string;
  label: string;
};

const NAV_LINKS: TopNavLink[] = [
  { key: 'home', path: '/', label: '首页' },
  { key: 'moha', path: '/docs/moha', label: '魔哈仓库' },
  { key: 'rune', path: '/docs/rune', label: 'Rune 智算平台' },
  { key: 'boss', path: '/docs/boss', label: 'Boss 运营平台' },
];

// ----------------------------------------------------------------------

/**
 * 全局顶部导航栏组件
 * 在所有页面中统一使用，提供平台名称和主要导航链接
 */
export function GlobalTopNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

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
        文档中心
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

          return (
            <Button
              key={link.key}
              color="inherit"
              size="small"
              component={RouterLink}
              to={link.path}
              sx={pillStyles(isActive)}
              aria-label={t(link.label)}
            >
              {t(link.label)}
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default GlobalTopNav;
