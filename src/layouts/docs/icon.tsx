import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

/**
 * 侧边栏图标。
 *
 * - `brand-<name>`：厂商原厂 logo，取 `assets/icons/vendor/<name>.png`。
 *   彩色位图，不走 mask，保留品牌配色。
 * - 其他：取 `assets/icons/navbar/<name>.svg`，按 `currentColor` 单色渲染。
 */
const BRAND_PREFIX = 'brand-';

export const icon = (name: string) => {
  if (name.startsWith(BRAND_PREFIX)) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '5px',
          // 原厂 logo 多为深色，深色主题下铺一层浅底，避免整块看不见
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.94)' : 'transparent',
        }}
      >
        <Box
          component="img"
          alt=""
          src={`${CONFIG.assetsDir}/assets/icons/vendor/${name.slice(BRAND_PREFIX.length)}.png`}
          sx={{ width: 18, height: 18, objectFit: 'contain', display: 'block' }}
        />
      </Box>
    );
  }

  return <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;
};
