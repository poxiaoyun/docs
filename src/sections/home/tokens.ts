/**
 * 首页设计令牌 —— 与 new-portal（www.poxiaoshi.cn）官网首页保持同一套视觉语言。
 *
 * 数值取自门户站点 assets/css/vendor.css 的 :root 与 assets/css/custom.css：
 *   --pxs-*  底板 / 文本 / 描边 / 圆角 / 阴影 / 内容宽度
 *   --tf-*   四大产品的强调色
 * 门户是 Tailwind + 编译产物，这里是它那套变量的 TypeScript 副本，
 * 供 MUI 的 sx 使用，避免把 300KB 编译后的样式表搬进文档站。
 */

// ----------------------------------------------------------------------

export const TOKENS = {
  /** 底板：门户用 #050506 作页面底色、#111 作内容面 */
  bgPage: '#050506',
  bgSurface: '#111111',
  bgSurface2: '#161616',
  /** 深色玻璃面（面板 / 终端 / 导航框的内层） */
  bgInset: '#08090be6',
  bgInsetSoft: '#08090bdb',

  text: '#ffffff',
  textStrong: '#fffffff0',
  textDefault: '#ffffffc7',
  textMuted: '#ffffff9e',
  textSubtle: '#ffffff7a',
  textDim: '#ffffff61',
  /** 主按钮上的深色文字 */
  textInverse: '#050506',

  borderFaint: '#ffffff14',
  borderSubtle: '#ffffff1a',
  borderDefault: '#ffffff24',
  borderStrong: '#ffffff38',
  /** 面板左上/右上角标的颜色（比常规描边亮） */
  borderCorner: '#ffffff85',
  /** 内容 rail 的左右竖线 */
  borderRail: '#ffffff12',

  /** 强调橙：公告条的 New:、结论条的 ✓、外链小字 */
  accent: '#ff8a3d',
  accentSoft: '#f4802a',

  /** 四大产品强调色（与门户 tabs / 卡片 pill 一致） */
  rune: '#9fe9ff',
  moha: '#d7c5ff',
  airouter: '#8affc1',
  boss: '#ffb36b',

  /** 终端正文里的语义色 */
  termSuccess: '#8affc1',
  termInfo: '#9fcfff',

  fontSans:
    '"Geist", "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  fontMono:
    '"Geist Mono", "Google Sans Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "PingFang SC", "Microsoft YaHei", monospace',

  /** 门户的圆角体系里首页实际用到的几档 */
  radiusXxs: '5px',
  radiusCode: '7px',
  radiusXs: '15px',
  radiusPanel: '24px',
  radiusPill: '99px',

  /** 内容轨宽度与竖向格线间距 */
  contentMax: '1280px',
  gridSize: '72px',
  /** 面板四角的直角装饰线长度 */
  cornerSize: '10px',

  shadowPanel: '0 34px 100px #00000057',
  shadowTerminal: '0 18px 60px #00000047',

  easeOut: 'cubic-bezier(.22, 1, .36, 1)',
  easeStandard: 'cubic-bezier(.4, 0, .2, 1)',
} as const;

/** 页头 overline 的渐变描边（门户 .tf-overline 的 border-box 渐变） */
export const OVERLINE_BORDER = `linear-gradient(100deg, #9fcfff, #ffffff 42%, ${TOKENS.accent})`;

/** 首页主标题第二行的渐变文字（门户 hero 的强调行） */
export const HERO_GRADIENT =
  'linear-gradient(90deg, #ffb36b 0%, #f4e0a7 45%, #a9d7ff 100%)';
