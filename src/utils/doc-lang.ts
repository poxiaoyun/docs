import { useCallback } from 'react';
import { useLocation } from 'react-router';

import { BASE_PATH } from 'src/global-config';

// ----------------------------------------------------------------------

/**
 * 文档站的语言维度。
 *
 * **URL 是语言的真源**，不再由 localStorage 决定：
 *   · 中文 —— 留在根路径（`/rune/console/quota`），既有外链与已收录的 URL 一条都不动；
 *   · 英文 —— 挂在 `/en` 前缀下（`/en/rune/console/quota`）。
 *
 * 为什么必须这么做：中英共用同一套 URL 时，一个地址只能有一种语言的正文进索引，
 * 英文页面无论写得多好，搜索引擎看到的永远是中文那份。加前缀后每个语言各有独立
 * 可索引地址，配合 SSG 输出的 hreflang，两边都能进各自的语种索引。
 *
 * 代价是站内每一处跳转都得带上当前语言的前缀 —— `useLangHref` 就是为了把这件事
 * 收敛到一个地方，避免各组件各写一遍。
 */
export type DocLang = 'cn' | 'en';

/** 英文内容的前缀。改这里等于改全站英文 URL，务必同步 scripts/ssg.mjs 的 LANGS。 */
export const EN_PREFIX = '/en';

/**
 * 从**浏览器地址栏里的 pathname**（含部署 base）判断语言。
 *
 * 只给 i18n 初始化用：那一刻 react-router 还没接管，拿不到 basename 已剥离的
 * location，所以得自己把 BASE_PATH（容器部署是 `/docs`）剥掉。
 */
export function detectDocLang(rawPathname: string): DocLang {
  let path = rawPathname;

  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    path = path.slice(BASE_PATH.length) || '/';
  }

  return path === EN_PREFIX || path.startsWith(`${EN_PREFIX}/`) ? 'en' : 'cn';
}

/** 把 `location.pathname`（已剥离 base）拆成「语言 + 去前缀后的路径」。 */
export function splitLangPath(pathname: string): { lang: DocLang; path: string } {
  if (pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)) {
    return { lang: 'en', path: pathname.slice(EN_PREFIX.length) || '/' };
  }

  return { lang: 'cn', path: pathname || '/' };
}

/** 给站内路径补上目标语言的前缀。已是绝对站内路径或本就带前缀时保持原样。 */
export function withLangPath(path: string, lang: DocLang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;

  if (lang !== 'en') {
    return clean;
  }

  if (clean === EN_PREFIX || clean.startsWith(`${EN_PREFIX}/`)) {
    return clean;
  }

  return clean === '/' ? EN_PREFIX : `${EN_PREFIX}${clean}`;
}

/**
 * 去掉英文前缀，得到「语言无关」的站内路径：`/en/rune/x` → `/rune/x`。
 *
 * 必须存在，否则「同时算出两种语言地址」这件事就是错的：
 * `withLangPath('/en/rune/x', 'cn')` 会把 `/en/rune/x` 原样返回（它只负责加前缀，
 * 不负责剥），于是英文页的 `hreflang="zh-CN"` 会指向英文自己。
 * 要成对生成中英地址，先剥再拼。
 */
export function withoutLangPath(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;

  if (clean === EN_PREFIX) return '/';
  if (clean.startsWith(`${EN_PREFIX}/`)) return clean.slice(EN_PREFIX.length);

  return clean;
}

/** 当前页面所在的语言（来自 URL，而不是 i18n 的当前语言）。 */
export function useDocLang(): DocLang {
  const { pathname } = useLocation();

  return splitLangPath(pathname).lang;
}

/** 绑定当前页面语言的站内路径生成器：`const href = useLangHref(); href('/rune')`。 */
export function useLangHref() {
  const { pathname } = useLocation();
  const { lang } = splitLangPath(pathname);

  return useCallback((path: string) => withLangPath(path, lang), [lang]);
}
