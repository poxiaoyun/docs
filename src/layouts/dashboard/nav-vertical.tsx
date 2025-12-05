import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { usePathname } from 'src/routes/hooks';

import { useGlobalSettingsContext } from 'src/settings/global';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { NavSectionVertical } from 'src/components/nav-section';
import { NavSectionMini } from 'src/components/nav-section/mini';

import { layoutClasses } from '../core';
import { NavToggleButton } from '../components/nav-toggle-button';

// ----------------------------------------------------------------------

export type NavVerticalProps = React.ComponentProps<'div'> &
  NavSectionProps & {
    isNavMini: boolean;
    layoutQuery?: Breakpoint;
    onToggleNav: () => void;
    slots?: {
      topArea?: React.ReactNode;
      bottomArea?: React.ReactNode;
    };
  };

export function NavVertical({
  sx,
  data,
  slots,
  cssVars,
  className,
  isNavMini: _isNavMini,
  onToggleNav,
  checkPermissions,
  layoutQuery = 'md',
  ...other
}: NavVerticalProps) {
  const pathname = usePathname();
  const { state } = useGlobalSettingsContext();
  const settings = useSettingsContext();

  // 检测是否为产品文档页面（魔哈仓库、Rune、Boss）
  const isProductPage = pathname.includes('/moha') || pathname.includes('/rune') || pathname.includes('/boss');
  const renderNavVertical = () => (
    <>
      {slots?.topArea ?? (
        !isProductPage && (
          <Box sx={{ pl: 3.5, pt: 2.5, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            {state?.logo ? <Logo /> : ''}
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
        )
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={data}
          cssVars={cssVars}
          checkPermissions={checkPermissions}
          sx={{ px: 2, flex: '1 1 auto' }}
        />
      </Scrollbar>
    </>
  );

  const renderNavMini = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          {state?.logo ? <Logo /> : ''}
        </Box>
      )}

      <NavSectionMini
        data={data}
        cssVars={cssVars}
        checkPermissions={checkPermissions}
        sx={[
          (theme) => ({
            ...theme.mixins.hideScrollY,
            pb: 2,
            px: 0.5,
            flex: '1 1 auto',
            overflowY: 'auto',
          }),
        ]}
      />

      {slots?.bottomArea}
    </>
  );

  return (
    <NavRoot
      layoutQuery={layoutQuery}
      className={mergeClasses([layoutClasses.nav.root, layoutClasses.nav.vertical, className])}
      sx={sx}
      {...other}
    >
      <NavToggleButton
        isNavMini={false}
        onClick={onToggleNav}
        sx={{ display: 'none !important' }}
      />
      {_isNavMini ? renderNavMini() : renderNavVertical()}
    </NavRoot>
  );
}

// ----------------------------------------------------------------------

const NavRoot = styled('div', {
  shouldForwardProp: (prop: string) => !['layoutQuery', 'sx'].includes(prop),
})<Pick<NavVerticalProps, 'layoutQuery'>>(({ layoutQuery = 'md', theme }) => ({
  top: 'var(--layout-header-mobile-height)',
  left: 0,
  height: 'calc(100% - var(--layout-header-mobile-height))',
  display: 'none',
  position: 'fixed',
  flexDirection: 'column',
  zIndex: 'var(--layout-nav-zIndex)',
  backgroundColor: 'var(--layout-nav-bg)',
  width: 'var(--layout-nav-vertical-width)',
  borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
  transition: theme.transitions.create(['width'], {
    easing: 'var(--layout-transition-easing)',
    duration: 'var(--layout-transition-duration)',
  }),
  [theme.breakpoints.up(layoutQuery)]: {
    top: 'var(--layout-header-desktop-height)',
    height: 'calc(100% - var(--layout-header-desktop-height))',
    display: 'flex',
  },
}));
