import type { IconButtonProps } from '@mui/material/IconButton';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * 移动端侧边栏开关。
 *
 * 注意：这里**不要**写死 `display: 'none'`。调用方（DashboardLayout）用的是
 * `[theme.breakpoints.up(layoutQuery)]: { display: 'none' }` —— 只在桌面端隐藏。
 * 一旦基础样式也写成 none，下面就没有任何一条规则把它显示回来，
 * 移动端会连按钮带侧边栏一起消失（本仓「基本框架」提交曾这样写死过）。
 */
export function MenuButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton aria-label="Menu" sx={sx} {...other}>
      <Iconify icon="custom:menu-duotone" width={24} />
    </IconButton>
  );
}
