import type { SchemesRecord } from '../types';

import { varAlpha } from 'minimal-shared/utils';

import { grey, info, error, common, primary, success, warning, secondary } from './palette';

// ----------------------------------------------------------------------

/**
 * TypeScript extension for MUI theme augmentation.
 * @to {@link file://./../extend-theme-types.d.ts}
 */

export type CustomShadows = {
  z1: string;
  z4: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  primary: string;
  secondary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
  card: string;
  dialog: string;
  dropdown: string;
};

// ----------------------------------------------------------------------

export function createShadowColor(colorChannel: string): string {
  return `0 8px 16px 0 ${varAlpha(colorChannel, 0.24)}`;
}

/**
 * 生成一套自定义阴影。
 *
 * @param colorChannel 分层阴影（z1~z24 / card / dropdown）用的颜色通道
 * @param depthChannel `dialog` 那层深投影用的通道
 * @param scale        整组不透明度的缩放
 */
function createCustomShadows(
  colorChannel: string,
  depthChannel: string = common.blackChannel,
  scale = 1
): CustomShadows {
  const a = (value: number) => varAlpha(colorChannel, value * scale);

  return {
    z1: `0 1px 2px 0 ${a(0.16)}`,
    z4: `0 4px 8px 0 ${a(0.16)}`,
    z8: `0 8px 16px 0 ${a(0.16)}`,
    z12: `0 12px 24px -4px ${a(0.16)}`,
    z16: `0 16px 32px -4px ${a(0.16)}`,
    z20: `0 20px 40px -4px ${a(0.16)}`,
    z24: `0 24px 48px 0 ${a(0.16)}`,
    /********/
    dialog: `-40px 40px 80px -8px ${varAlpha(depthChannel, 0.24 * scale)}`,
    card: `0 0 2px 0 ${a(0.2)}, 0 12px 24px -4px ${a(0.12)}`,
    dropdown: `0 0 2px 0 ${a(0.24)}, -20px 20px 40px -4px ${a(0.24)}`,
    /********/
    primary: createShadowColor(primary.mainChannel),
    secondary: createShadowColor(secondary.mainChannel),
    info: createShadowColor(info.mainChannel),
    success: createShadowColor(success.mainChannel),
    warning: createShadowColor(warning.mainChannel),
    error: createShadowColor(error.mainChannel),
  };
}

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const customShadows: SchemesRecord<CustomShadows> = {
  light: createCustomShadows(grey['500Channel']),
  /**
   * 暗色整组换通道：不是把黑色调淡，而是改用 **白色**。
   *
   * 纯黑页面上 `rgba(0,0,0,·)` 的投影等于没画 —— 卡片、下拉、抽屉、对话框会一起
   * 失去层次，只剩下 `#0B0E12` 与 `#000000` 之间那点人眼分不出的明度差。白色通道
   * 把阴影变成一圈外发光，是纯黑底上唯一还能表达「浮起」的手段。
   *
   * `scale` 取 0.5：沿用 light 那组 0.16~0.24 的不透明度，在纯黑上会糊成一圈雾，
   * 压半之后刚好是「看得出浮起、又不像发光特效」。
   */
  dark: createCustomShadows(common.whiteChannel, common.whiteChannel, 0.5),
};
