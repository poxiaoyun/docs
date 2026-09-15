import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { TOP_NAV_LINKS } from './global-top-nav';

// ----------------------------------------------------------------------

/**
 * 移动端抽屉里的「产品与栏目」切换器。
 *
 * 桌面端靠顶栏胶囊切换产品，但顶栏胶囊在 < lg 是隐藏的 —— 移动端如果不补这一层，
 * 抽屉里只会列出「当前产品」的目录，用户在手机上无法切到别的产品。
 * 真源与顶栏共用 TOP_NAV_LINKS。
 */
export function DocsProductSwitcher() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith('en') ? 'en' : 'cn';

  return (
    <Box sx={{ px: 2.5, pt: 0.5, pb: 2 }}>
      <Typography
        component="p"
        sx={{
          m: 0,
          mb: 1,
          color: 'text.disabled',
          fontSize: '.6875rem',
          fontWeight: 700,
          lineHeight: 1.4,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
        }}
      >
        {locale === 'en' ? 'Products & Sections' : '产品与栏目'}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {TOP_NAV_LINKS.map((link) => {
          const isActive =
            link.path === '/' ? pathname === link.path : pathname.startsWith(link.path);

          return (
            <Box
              key={link.key}
              component={RouterLink}
              to={link.path}
              aria-current={isActive ? 'page' : undefined}
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                border: '1px solid',
                borderColor: isActive ? 'transparent' : 'divider',
                bgcolor: isActive ? 'action.selected' : 'transparent',
                color: isActive ? 'text.primary' : 'text.secondary',
                fontSize: '.8125rem',
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1.5,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'background-color .2s, color .2s, border-color .2s',
                '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
              }}
            >
              {link.label[locale]}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
