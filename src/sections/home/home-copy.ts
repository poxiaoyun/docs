import { useDocLang, type DocLang } from 'src/utils/doc-lang';

import { TOKENS } from './tokens';
import HOME_COPY_JSON from './home-copy.json';

// ----------------------------------------------------------------------
// 首页文案。
//
// **文案只放在 home-copy.json 里**，中英各一份。原因有两个：
//   1. 英文首页要成为一个真正可被收录的页面（/en），文案必须能整体切换，
//      散落在各 section 的 JSX 里切不了；
//   2. `scripts/ssg.mjs` 要拿同一份文案生成首页的静态正文，否则静态 HTML 与
//      React 渲染出来的内容会是两套（以前是抄一份常量，改一处忘一处）。
//      那边直接读这个 JSON —— 单一真源，构建期自检会校验其中的站内链接。
//
// 颜色与图标不放进 JSON：它们与语言无关，放进去就是四份重复的色值。
// 这里按 `to` 关联，文案改路径时颜色自然跟着走，漏了由类型检查兜住。

export type HomePlatformCopy = {
  name: string;
  tagline: string;
  to: string;
  cta: string;
  entries: { title: string; to: string }[];
};

export type HomeResourceCopy = {
  title: string;
  description: string;
  action: string;
  to: string;
};

export type HomeFaqCopy = { q: string; a: string };

export type HomeCopy = {
  meta: { title: string; description: string };
  hero: {
    overline: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    primary: string;
    secondary: string;
  };
  capabilities: {
    label: string;
    title: string;
    copy: string;
    platforms: HomePlatformCopy[];
  };
  ecosystem: { label: string; line1: string; line2: string };
  developer: { overline: string; title: string; copy: string; cta: string };
  resources: {
    label: string;
    title: string;
    copy: string;
    items: HomeResourceCopy[];
  };
  faq: {
    title: string;
    copy: string;
    cta: string;
    note: string;
    items: HomeFaqCopy[];
  };
  cta: {
    title: string;
    copy: string;
    primary: string;
    secondary: string;
    stats: { value: string; label: string }[];
  };
};

const COPY = HOME_COPY_JSON as unknown as Record<DocLang, HomeCopy>;

/** 四条产品线的强调色（与门户 tabs / 卡片 pill 一致），按入口路径关联。 */
const PLATFORM_COLOR: Record<string, string> = {
  '/rune': TOKENS.rune,
  '/moha': TOKENS.moha,
  '/airouter': TOKENS.airouter,
  '/boss': TOKENS.boss,
};

/** 资源卡片的图标与图标底色，同样按入口路径关联。 */
const RESOURCE_ICON: Record<string, { icon: string; color: string }> = {
  '/reference/api-overview': { icon: 'ic-product', color: '#a2d1ff' },
  '/rune/resources/presets': { icon: 'ic-subpaths', color: '#8affc1' },
  '/reference/faq': { icon: 'ic-chat', color: '#c599ff' },
};

/** 产品线卡片：文案取自 JSON，颜色按路径补齐。 */
export function platformsOf(copy: HomeCopy) {
  return copy.capabilities.platforms.map((platform) => ({
    ...platform,
    color: PLATFORM_COLOR[platform.to] ?? TOKENS.accent,
  }));
}

/** 资源卡片：文案取自 JSON，图标按路径补齐。 */
export function resourcesOf(copy: HomeCopy) {
  return copy.resources.items.map((item) => ({
    ...item,
    ...(RESOURCE_ICON[item.to] ?? { icon: 'ic-product', color: '#a2d1ff' }),
  }));
}

/**
 * 当前语言的首页文案。
 *
 * 语言只认 URL（`/en` = 英文，其余中文），与文档正文同一套规则 ——
 * 首页也因此不需要另一份「i18n 当前语言」的判断。
 */
export function useHomeCopy(): HomeCopy {
  return COPY[useDocLang()];
}
