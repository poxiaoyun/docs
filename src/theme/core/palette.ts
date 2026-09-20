import type {
  TypeAction,
  PaletteColor,
  ColorSystemOptions,
  PaletteColorChannel,
} from '@mui/material/styles';
import type { SchemesRecord } from '../types';

import { varAlpha, createPaletteChannel } from 'minimal-shared/utils';

import { opacity } from './opacity';
import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

/**
 * TypeScript extension for MUI theme augmentation.
 * @to {@link file://./../extend-theme-types.d.ts}
 */

// Keys for core palette colors
export type PaletteColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
export type CommonColorsKeys = 'black' | 'white';

// Palette color without channels
export type PaletteColorNoChannels = Omit<PaletteColor, 'lighterChannel' | 'darkerChannel'>;

// Palette color with channels
export type PaletteColorWithChannels = PaletteColor & PaletteColorChannel;

// Extended palette color shades
export type PaletteColorExtend = {
  lighter: string;
  darker: string;
  lighterChannel: string;
  darkerChannel: string;
};

// Extended common colors
export type CommonColorsExtend = {
  whiteChannel: string;
  blackChannel: string;
};

// Extended text colors
export type TypeTextExtend = {
  disabledChannel: string;
};

// Extended background colors
export type TypeBackgroundExtend = {
  neutral: string;
  neutralChannel: string;
};

// Extended grey colors
export type GreyExtend = {
  '50Channel': string;
  '100Channel': string;
  '200Channel': string;
  '300Channel': string;
  '400Channel': string;
  '500Channel': string;
  '600Channel': string;
  '700Channel': string;
  '800Channel': string;
  '900Channel': string;
};

// Extended palette
export type PaletteExtend = {
  shared: {
    inputOutlined: string;
    inputUnderline: string;
    paperOutlined: string;
    buttonOutlined: string;
  };
};

/**
 * ➤
 * ➤ ➤ Core palette (primary, secondary, info, success, warning, error, common, grey)
 * ➤
 */
export const primary = createPaletteChannel(themeConfig.palette.primary);
export const secondary = createPaletteChannel(themeConfig.palette.secondary);
export const info = createPaletteChannel(themeConfig.palette.info);
export const success = createPaletteChannel(themeConfig.palette.success);
export const warning = createPaletteChannel(themeConfig.palette.warning);
export const error = createPaletteChannel(themeConfig.palette.error);
export const common = createPaletteChannel(themeConfig.palette.common);
export const grey = createPaletteChannel(themeConfig.palette.grey);

/**
 * ➤
 * ➤ ➤ Text, background, action
 * ➤
 */
export const text = {
  light: createPaletteChannel({ primary: grey[800], secondary: grey[600], disabled: grey[500] }),
  /**
   * 纯黑底上的文字。
   *
   * 主色用纯白（对 `#000000` 是 21:1）。次级色从 grey[500] 提到 grey[400]：
   * grey[500] 在旧的 `#141A21` 上勉强够看，挪到纯黑上虽然比值反而更高，但它
   * 承的是引用块正文、侧边栏副标题、右侧目录这些成片文字，读起来仍是「一片灰」，
   * 与「高对比」的诉求相反。disabled 保持 grey[600]，它就该是弱的。
   */
  dark: createPaletteChannel({ primary: '#FFFFFF', secondary: grey[400], disabled: grey[600] }),
};

export const background = {
  light: createPaletteChannel({ paper: '#FFFFFF', default: '#FFFFFF', neutral: grey[200] }),
  /**
   * 纯黑高对比暗色，三档：
   *
   * - `default` `#000000` —— 页面底（含侧边栏，`navColor: 'integrate'` 直接取这个值）
   * - `paper` `#0B0E12` —— 文档框、卡片、抽屉这些浮起面，只比页面亮一档
   * - `neutral` `#1A2028` —— 代码块、表头、斑马纹这些嵌进去的面
   *
   * 纯黑底上真正负责分层的是 1px 边框，不是这三档之间的明度差（相邻两档的对比度
   * 只有 1.05:1 上下，肉眼几乎无感）。所以 `#0B0E12` 不要往灰里调 —— 一旦像旧的
   * grey[800] 那样亮到能看出来，「黑底白字」当场变成「深灰底白字」。
   *
   * 三档都沿用 grey 色阶的冷调（与 grey[900] `#141A21` 同色相），换色要连带调
   * `divider` 与 `extendPaletteDark` 的不透明度，否则边框在纯黑上会看不见。
   */
  dark: createPaletteChannel({ paper: '#0B0E12', default: '#000000', neutral: '#1A2028' }),
};

export const action = (mode: 'light' | 'dark'): Partial<TypeAction> => {
  const isDark = mode === 'dark';

  return {
    // active 也是「成片可见」的角色（输入框光标、未选中图标），在纯黑上提一档。
    active: isDark ? grey[400] : grey[600],
    /**
     * 暗色下的叠加不透明度整体上抬。
     *
     * `action.*` 是叠在底色上的一层灰，8% 的 grey[500] 落到 `#000000` 上只有
     * `rgb(12 13 14)`，hover 看起来就像「点了没反应」。上抬到 0.16 / 0.28 / 0.4
     * 之后分别落在 `#171A1B` / `#282B2E` / `#464C52`，是层级分明的一串灰。
     *
     * 只动颜色值，不动下面那组 `*Opacity` 数字 —— 后者是 MUI 内部按比例折算时
     * 用的基数，改了会波及一批组件的尺寸与透明度计算，收益不成正比。
     */
    hover: varAlpha(grey['500Channel'], isDark ? 0.16 : 0.08),
    selected: varAlpha(grey['500Channel'], isDark ? 0.28 : 0.16),
    focus: varAlpha(grey['500Channel'], isDark ? 0.4 : 0.24),
    disabled: varAlpha(grey['500Channel'], 0.8),
    disabledBackground: varAlpha(grey['500Channel'], isDark ? 0.3 : 0.24),
    hoverOpacity: 0.08,
    selectedOpacity: 0.08,
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
    disabledOpacity: 0.48,
  };
};

/**
 * ➤
 * ➤ ➤ Extended palette
 * ➤
 */
export const extendPalette: PaletteExtend = {
  shared: {
    inputUnderline: varAlpha(grey['500Channel'], opacity.inputUnderline),
    inputOutlined: varAlpha(grey['500Channel'], 0.2),
    paperOutlined: varAlpha(grey['500Channel'], 0.16),
    buttonOutlined: varAlpha(grey['500Channel'], 0.32),
  },
};

/**
 * 暗色版的 outline 边框。
 *
 * 上面那组是按白底调的：0.16 的 grey[500] 落在 `#FFFFFF` 上是清晰的一根线，
 * 落到 `#000000` 上却是 `rgb(23 25 27)` —— 描边卡片、outlined 按钮会「没有边」。
 * 暗色统一抬到 0.32~0.56。
 */
const extendPaletteDark: PaletteExtend = {
  shared: {
    inputUnderline: varAlpha(grey['500Channel'], 0.48),
    inputOutlined: varAlpha(grey['500Channel'], 0.4),
    paperOutlined: varAlpha(grey['500Channel'], 0.32),
    buttonOutlined: varAlpha(grey['500Channel'], 0.56),
  },
};

/**
 * ➤
 * ➤ ➤ Base configuration
 * ➤
 */
const basePalette: ColorSystemOptions['palette'] = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  grey,
  divider: varAlpha(grey['500Channel'], 0.2),
  TableCell: { border: varAlpha(grey['500Channel'], 0.2) },
  ...extendPalette,
};

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const palette: SchemesRecord<ColorSystemOptions['palette']> = {
  light: {
    ...basePalette,
    text: text.light,
    background: background.light,
    action: action('light'),
  },
  dark: {
    ...basePalette,
    ...extendPaletteDark,
    // 分隔线同样按纯黑底抬一档：0.2 的 grey[500] 落在 `#000000` 上只有
    // `rgb(29 32 34)`，文档框描边、表格网格、hr 全都糊掉。
    divider: varAlpha(grey['500Channel'], 0.4),
    TableCell: { border: varAlpha(grey['500Channel'], 0.28) },
    text: text.dark,
    background: background.dark,
    action: action('dark'),
  },
};

export const colorKeys: {
  palette: PaletteColorKey[];
  common: CommonColorsKeys[];
} = {
  palette: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
  common: ['black', 'white'],
};
