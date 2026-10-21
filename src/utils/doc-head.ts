import { useEffect } from 'react';

import { BASE_PATH } from 'src/global-config';

import { withLangPath, type DocLang, withoutLangPath } from './doc-lang';

// ----------------------------------------------------------------------

/** 本模块写入的节点标记：只清理自己加的那些，不碰 head 里的其它东西。 */
const MARK = 'data-doc-head';

/**
 * 静态预渲染写进 head 的同一批标签（由 scripts/ssg.mjs 打上 `data-ssg-head`）。
 *
 * 它们对爬虫是必需的真源，但值里的 origin 是构建期的站点地址；React 挂载后
 * 由本模块按当前 origin 重写一遍。不先删掉旧的，head 里就会叠出两份 canonical
 * 与两套 hreflang —— 页面看不出来，搜索引擎会看到互相矛盾的声明。
 */
const SSG_MARK = 'data-ssg-head';

type HeadEntry = { rel: 'canonical' | 'alternate' | 'meta'; hreflang?: string; href?: string; content?: string };

/**
 * 把 canonical / hreflang / og:locale / html lang 同步到 `<head>`。
 *
 * 为什么不走 Helmet：本项目是 React 19，`<link>` 与 `<meta>` 在 Helmet 里会被
 * 拦下来（title 能生效，这两个不行），结果是 SSG 有 canonical、运行时没有 ——
 * 客户端导航之后 head 与静态版本对不上。这里直接操作 DOM，行为可预期：
 * 每次按当前语言重写一遍，先删自己上次写的节点，绝不重复堆叠。
 *
 * 语言前缀来自 withLangPath / withoutLangPath，与路由完全同一套规则。
 */
export function useDocHead(lang: DocLang, canonicalPath: string) {
  useEffect(() => {
    const head = document.head;
    const origin = `${window.location.origin}${BASE_PATH}`;
    const abs = (path: string) => `${origin}${path === '/' ? '/' : `${path}/`}`;

    // 先剥掉语言前缀再按两种语言各拼一次。
    // 调用方传进来的 canonicalPath 是「当前语言下的地址」（英文页带 /en），
    // 直接拿它去拼中文会原样返回 —— 英文页的 hreflang="zh-CN" 就成了英文自己。
    const barePath = withoutLangPath(canonicalPath);
    const canonical = abs(withLangPath(barePath, lang));
    const zh = abs(withLangPath(barePath, 'cn'));
    const en = abs(withLangPath(barePath, 'en'));

    const entries: HeadEntry[] = [
      { rel: 'canonical', href: canonical },
      { rel: 'alternate', hreflang: 'zh-CN', href: zh },
      { rel: 'alternate', hreflang: 'en', href: en },
      { rel: 'alternate', hreflang: 'x-default', href: zh },
      { rel: 'meta', content: lang === 'en' ? 'en_US' : 'zh_CN' },
    ];

    head.querySelectorAll(`[${MARK}], [${SSG_MARK}]`).forEach((el) => el.remove());

    for (const entry of entries) {
      if (entry.rel === 'meta') {
        const meta = document.createElement('meta');
        meta.setAttribute(MARK, '');
        meta.setAttribute('property', 'og:locale');
        meta.setAttribute('content', entry.content ?? '');
        head.appendChild(meta);
        continue;
      }

      const link = document.createElement('link');
      link.setAttribute(MARK, '');
      link.rel = entry.rel;

      if (entry.hreflang) {
        link.hreflang = entry.hreflang;
      }
      if (entry.href) {
        link.href = entry.href;
      }

      head.appendChild(link);
    }

    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  }, [lang, canonicalPath]);
}
