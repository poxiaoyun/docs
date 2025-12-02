import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { varTap, varHover, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export function SettingsButton({ sx, ...other }: IconButtonProps) {
  const settings = useSettingsContext();

  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Settings button"
      onClick={settings.onToggleDrawer}
      sx={[{ p: 0, width: 40, height: 40 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Iconify icon="solar:settings-bold-duotone" width={24} />
    </IconButton>
  );
}
