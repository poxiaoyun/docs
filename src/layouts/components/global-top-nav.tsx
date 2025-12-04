import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { getPlatformName } from 'src/utils/platform-name';

// ----------------------------------------------------------------------

type TopNavLink = {
  key: string;
  path: string;
  label: string;
};

const NAV_LINKS: TopNavLink[] = [
  { key: 'home', path: '/', label: '首页' },
  { key: 'moha', path: '/docs/moha', label: '魔哈仓库' },
  { key: 'rune', path: '/docs/rune', label: 'Rune' },
  { key: 'boss', path: '/docs/boss', label: 'BOSS' },
];

// ----------------------------------------------------------------------

export function GlobalTopNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const platformName = getPlatformName();

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
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, letterSpacing: '0.1em', color: 'text.primary', fontSize: '2rem' }}
      >
        {platformName}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
        {NAV_LINKS.map((link) => {
          const isActive = link.path === '/' ? pathname === link.path : pathname.startsWith(link.path);

          return (
            <Button
              key={link.key}
              color="inherit"
              size="small"
              component={RouterLink}
              to={link.path}
              sx={pillStyles(isActive)}
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
