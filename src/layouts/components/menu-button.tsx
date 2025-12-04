import type { IconButtonProps } from '@mui/material/IconButton';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function MenuButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton sx={{ display: 'none', ...sx }} {...other}>
      <Iconify icon="custom:menu-duotone" width={24} />
    </IconButton>
  );
}
