import type { NavSectionProps } from 'src/components/nav-section';

import { useEffect } from 'react';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import { usePathname } from 'src/routes/hooks';

import { useGlobalSettingsContext } from 'src/settings/global';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { NavSectionVertical } from 'src/components/nav-section';

import { layoutClasses } from '../core';

// ----------------------------------------------------------------------

type NavMobileProps = NavSectionProps & {
  open: boolean;
  onClose: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
};

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  className,
  checkPermissions,
  ...other
}: NavMobileProps) {
  const pathname = usePathname();

  const { state } = useGlobalSettingsContext();
  const settings = useSettingsContext();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: mergeClasses([layoutClasses.nav.root, layoutClasses.nav.vertical, className]),
          sx: [
            {
              overflow: 'unset',
              bgcolor: 'var(--layout-nav-bg)',
              width: 'var(--layout-nav-mobile-width)',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Logo />
          <Box>
            <Typography
              variant="h4"
              sx={(theme) => ({
                fontFamily: 'Pangmengzuodao-Simple',
                color:
                  settings.state.contrast === 'hight'
                    ? theme.palette.common.white
                    : 'var(--layout-nav-text-primary-color)',
              })}
            >
              {state?.title}
            </Typography>
            <Typography
              variant="body2"
              sx={(theme) => ({
                fontFamily: 'Pangmengzuodao-Simple',
                color:
                  settings.state.contrast === 'hight'
                    ? varAlpha(theme.vars.palette.common.whiteChannel, 0.6)
                    : 'var(--layout-nav-text-secondary-color)',
              })}
            >
              {state?.subTitle}
            </Typography>
          </Box>
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={data}
          checkPermissions={checkPermissions}
          sx={{ px: 2, flex: '1 1 auto' }}
          {...other}
        />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
