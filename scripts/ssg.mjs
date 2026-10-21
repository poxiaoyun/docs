#!/usr/bin/env node
/**
 * 静态预渲染（SSG）：为每个文档路由生成真实存在的静态 HTML。
 *
 * 为什么需要它
 * ------------
 * 本站是纯客户端 SPA（react-router + import.meta.glob 懒加载 markdown），
 * GitHub Pages 是纯静态托管：任何没有对应文件的深层路径都返回 404.html。
 * 于是 https://docs.poxiaoshi.cn/boss/gateway/channels 这类页面在搜索引擎眼里
 * 是「HTTP 404 + 空壳 HTML」，全站除首页外一律无法被索引。
 *
 * 本脚本在 `vite build` 之后运行，为每个路由写出 dist/<route>/index.html，
 * 让它变成 HTTP 200 + 可索引正文 + 完整 meta 的真实页面。
 * 用户浏览器加载后仍是同一个 SPA（静态内容被 React 挂载时替换）。
 *
 * 运行顺序（两条部署链都一样）：
 *   vite build  ->  node scripts/ssg.mjs
 *
 * 环境变量
 * --------
 *   SSG_SITE_URL  站点权威地址，用于 canonical / og:url / sitemap（默认 https://docs.poxiaoshi.cn）
 *   VITE_BASE_URL 与 vite.config.ts 保持一致，用于给站内链接补 base（默认 /docs）
 *   SSG_OUT       产物目录（默认 dist）
 *
 * 输出两种语言
 * ------------
 * 中文留在根路径，英文输出到 /en 下（见 LANGS），每个页面都带 hreflang 互指。
 * 只有这样英文正文才有独立的可索引地址 —— 否则一个 URL 只能有一种语言进索引。
 *
 * 首屏配色引导脚本不在这里定义 —— 它在根目录 index.html 的 <!-- theme-bootstrap -->
 * 块里（那是唯一真源），本脚本只负责搬进每个预渲染页。原因见 extractThemeBootstrap。
 */

import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { unified } from 'unified';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';

// ----------------------------------------------------------------------

const ROOT = process.cwd();
const OUT_DIR = path.resolve(ROOT, process.env.SSG_OUT || 'dist');
const CONTENT_DIR = path.join(ROOT, 'src/pages/docs');

/**
 * 支持的语言。
 *
 * prefix 决定 URL 形态：中文留根路径（既有外链、已收录 URL 一条都不动），英文挂 /en。
 * 这是英文能被单独索引的前提 —— 一个 URL 只能有一种语言的正文进索引，
 * 共用地址时英文无论写得多好，搜索引擎看到的永远是中文那份。
 *
 * **改 prefix 等于改全站英文 URL**，必须与 src/utils/doc-lang.ts 的 EN_PREFIX 同步。
 */
const LANGS = [
  { code: 'cn', prefix: '', htmlLang: 'zh-CN', ogLocale: 'zh_CN', homeLabel: '文档首页' },
  { code: 'en', prefix: '/en', htmlLang: 'en', ogLocale: 'en_US', homeLabel: 'Docs home' },
];

const langMeta = (code) => LANGS.find((l) => l.code === code) ?? LANGS[0];


const SITE_URL = (process.env.SSG_SITE_URL || 'https://docs.poxiaoshi.cn').replace(/\/+$/, '');
// 与 vite.config.ts 的 DOCS_BASE_URL 同源：容器部署是 /docs，Pages 是 ""。
const RAW_BASE = process.env.VITE_BASE_URL ?? '/docs';
const BASE = RAW_BASE === '/' ? '' : RAW_BASE.replace(/\/+$/, '');

const SITE = readSiteConfig();
const SITE_NAME = SITE.name;

// sitemap 的 lastmod 兜底值：页面没写 frontmatter.updated 时用它，而不是干脆省略。
// 缺 lastmod 的 URL 在 Google 那边等价于「从没变过」，新页面的抓取优先级会掉。
const BUILD_DATE = new Date().toISOString().slice(0, 10);

function readSiteConfig() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/global-config.json'), 'utf8'));
    return { name: cfg.title || 'RUNE', subtitle: cfg.subTitle || '' };
  } catch {
    return { name: 'RUNE', subtitle: '' };
  }
}

// ----------------------------------------------------------------------
// 首页正文
//
// 首页是 React 组件（src/sections/home/*），本脚本只处理 markdown，渲染不了它。
// 所以这里写一份与首页可见内容严格对应的静态正文。
//
// **文案不再抄一份常量，而是直接读 src/sections/home/home-copy.json** ——
// 那份 JSON 同时是 React 首页的文案真源。以前这里手抄一套，改文案要记得改两处，
// 漏一处就是「静态 HTML 与用户看到的内容不一样」，且构建期看不出来。
//
// 中英各一份静态正文：中文写 dist/index.html，英文写 dist/en/index.html。
// 改首页文案只需要改那个 JSON；自检会校验正文里每个站内链接都真实存在。

const HOME_COPY = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/sections/home/home-copy.json'), 'utf8')
);

const HOME_ECOSYSTEM = [
  'PyTorch',
  'TensorFlow',
  'vLLM',
  'HuggingFace',
  'Ollama',
  'DeepSpeed',
  'Triton',
  'Ray',
  'Kubernetes',
  'Docker',
  'ONNX',
];

/** 静态正文里不属于「组件可见文案」的那几句（标题、收尾指引），按语言各一份。 */
const HOME_EXTRA = {
  cn: {
    productsHeading: '四条产品线',
    ecosystemHeading: '生态与集成',
    ecosystemBody: (list) =>
      `平台与 ${list} 等开源组件协同工作，安装与适配步骤见[生态文档](/ecosystem)。`,
    developerHeading: '开发者',
    resourcesHeading: '更多资源',
    outro:
      '第一次来，建议从[入门指南](/guide)开始：[快速开始](/guide/quick-start)按五个阶段带你把第一个推理服务跑起来，' +
      '[平台架构](/guide/architecture)讲清各子系统怎么协作，[名词表](/guide/glossary)解释常见术语。',
    faqLine: '遇到问题先查[常见问题 FAQ](/reference/faq)。',
  },
  en: {
    productsHeading: 'Four product lines',
    ecosystemHeading: 'Ecosystem & integrations',
    ecosystemBody: (list) =>
      `The platform works with open-source components such as ${list}; installation and adaptation steps live in the [ecosystem docs](/ecosystem).`,
    developerHeading: 'Developers',
    resourcesHeading: 'More resources',
    outro:
      'New here? Start with the [guide](/guide): [Quick start](/guide/quick-start) takes you through your first inference service in five stages, ' +
      '[Architecture](/guide/architecture) explains how the subsystems work together, and the [glossary](/guide/glossary) defines the common terms.',
    faqLine: 'When something breaks, check the [FAQ](/reference/faq) first.',
  },
};

/** 拼出首页静态正文（markdown，随后交给 renderMarkdown 走与文档页同一条管线）。 */
function buildHomeMarkdown(lang) {
  const copy = HOME_COPY[lang];
  const extra = HOME_EXTRA[lang];
  const list = lang === 'en' ? HOME_ECOSYSTEM.join(', ') : HOME_ECOSYSTEM.join('、');

  const lines = [
    `# ${copy.hero.titleLine1} ${copy.hero.titleLine2}`,
    '',
    copy.hero.lead,
    '',
    `## ${extra.productsHeading}`,
    '',
  ];

  for (const product of copy.capabilities.platforms) {
    lines.push(
      `### [${product.name}](${product.to})`,
      '',
      product.tagline,
      '',
      product.entries.map((e) => `[${e.title}](${e.to})`).join(' · '),
      ''
    );
  }

  lines.push(
    `## ${extra.ecosystemHeading}`,
    '',
    extra.ecosystemBody(list),
    '',
    `## ${extra.developerHeading}`,
    '',
    copy.developer.copy,
    '',
    `## ${extra.resourcesHeading}`,
    '',
    copy.resources.items.map((r) => `[${r.title}](${r.to})`).join(' · '),
    '',
    extra.outro,
    '',
    extra.faqLine
  );

  return lines.join('\n');
}

// ----------------------------------------------------------------------
// markdown -> hast

/** 复刻 src/components/markdown/remark-alerts.ts 的语法，输出语义化 div。 */
const ALERT_RE = /^:::(info|success|warning|error|tip)(?:\s+([^\n]+))?\n/;
const ALERT_END_RE = /^:::(info|success|warning|error|tip)(\s+(.+))?$/;

function remarkAlerts() {
  return (tree) => {
    const blocks = [];

    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index === undefined || !Array.isArray(parent.children)) return;

      const firstChild = node.children[0];
      if (firstChild?.type !== 'text') return;

      // 形式一：开闭标记与内容同在一个段落（无空行，最常见）
      const inline = firstChild.value.match(ALERT_RE);

      if (inline) {
        const lastChild = node.children[node.children.length - 1];

        if (lastChild?.type === 'text' && /\n:::[ \t]*$/.test(lastChild.value)) {
          const [, type, title = ''] = inline;
          const kids = node.children.map((c) => ({ ...c }));

          kids[0].value = kids[0].value.slice(inline[0].length);
          const lastIdx = kids.length - 1;
          kids[lastIdx].value = kids[lastIdx].value.replace(/\n:::[ \t]*$/, '');

          const kept = kids.filter((c) => c.type !== 'text' || c.value !== '');
          blocks.push({
            parent,
            startIndex: index,
            endIndex: index,
            type,
            title,
            contentNodes: kept.length
              ? kept
              : [{ type: 'paragraph', children: [{ type: 'text', value: '' }] }],
          });
          return;
        }
      }

      // 形式二：多段落（空行分隔）
      const start = firstChild.value.match(ALERT_END_RE);

      if (start) {
        const [, type, , title = ''] = start;
        const contentNodes = [];
        let endIndex = index + 1;

        while (endIndex < parent.children.length) {
          const cur = parent.children[endIndex];
          const isEnd =
            cur.type === 'paragraph' &&
            cur.children?.[0]?.type === 'text' &&
            cur.children[0].value.trim() === ':::';

          if (isEnd) break;
          contentNodes.push(cur);
          endIndex += 1;
        }

        if (endIndex < parent.children.length) {
          blocks.push({ parent, startIndex: index, endIndex, type, title, contentNodes });
        }
      }
    });

    blocks.reverse().forEach(({ parent, startIndex, endIndex, type, title, contentNodes }) => {
      const open = {
        type: 'html',
        value: `<div class="alert alert-${type}">${
          title ? `<p class="alert-title">${escapeHtml(title)}</p>` : ''
        }`,
      };
      parent.children.splice(startIndex, endIndex - startIndex + 1, open, ...contentNodes, {
        type: 'html',
        value: '</div>',
      });
    });
  };
}

// ----------------------------------------------------------------------
// 链接改写：复刻 src/components/markdown/markdown.tsx 的解析规则
//
// 运行时由 RouterLink 负责补 basename，静态 HTML 里没有 router，必须自己补。

function splitHash(href) {
  const i = href.indexOf('#');
  return i >= 0 ? [href.slice(i), href.slice(0, i)] : ['', href];
}

/**
 * 站内内容路径补语言前缀。
 *
 * 三种不补：没有前缀（中文）、已经带了（避免 /en/en/）、静态资源（图片是全站共用的
 * 一份文件，/assets 不随语言复制）。
 */
function withLangHref(pathname, prefix) {
  if (!prefix) return pathname;
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return pathname;
  if (pathname.startsWith('/assets/')) return pathname;
  return pathname === '/' ? prefix : `${prefix}${pathname}`;
}

/** 站内链接 -> 带 base 的绝对路径（保留尾斜杠，避免 GitHub Pages 多一次 301）。 */
function toSiteHref(href, pageSegs, isIndex, prefix = '') {
  if (!href) return href;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(href)) return href; // 外链
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;

  const [hashPart, pathPart] = splitHash(href);

  // 已经是绝对路径（含 /assets/...），只补 base 与语言前缀
  if (pathPart.startsWith('/')) {
    return `${BASE}${withLangHref(pathPart, prefix)}${hashPart}`;
  }

  // 相对路径：以当前页 URL 的目录为基准，逐段剥 ^\d+\. 与 .md
  const parts = isIndex ? [...pageSegs] : pageSegs.slice(0, -1);

  for (const raw of pathPart.split('/')) {
    const clean = raw.replace(/^\d+\./, '').replace(/\.md$/, '');

    if (clean === '.' || clean === '') continue;
    if (clean === '..') parts.pop();
    else parts.push(clean);
  }

  if (parts[parts.length - 1] === 'index') parts.pop();

  const rel = parts.join('/');

  // 相对链接是先拼出「语言无关的站内路径」，再补前缀 —— 顺序反过来会拼出 /en/en/xxx。
  if (!prefix) return `${BASE}/${rel ? `${rel}/` : ''}${hashPart}`;

  return `${BASE}${prefix}/${rel ? `${rel}/` : ''}${hashPart}`;
}

/** 图片 src：/assets/... 要补 base，其余原样。 */
function toAssetSrc(src) {
  if (!src) return src;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(src) || src.startsWith('data:')) return src;
  if (src.startsWith('/')) return `${BASE}${src}`;
  return src;
}

function rewriteLinks({ pageSegs, isIndex, prefix = '' }) {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties;
      if (!props) return;

      if (node.tagName === 'a' && typeof props.href === 'string') {
        props.href = toSiteHref(props.href, pageSegs, isIndex, prefix);
      } else if (node.tagName === 'img' && typeof props.src === 'string') {
        props.src = toAssetSrc(props.src);
      }
    });
  };
}

// ----------------------------------------------------------------------
// hast -> HTML（自己序列化，避免为了 rehype-stringify 动 yarn.lock）

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

const PROP_ALIAS = { className: 'class', htmlFor: 'for', srcSet: 'srcset', acceptCharset: 'accept-charset' };

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function serialize(node) {
  if (node.type === 'text') return escapeHtml(node.value);
  if (node.type === 'raw') return node.value;
  if (node.type === 'comment') return `<!--${node.value}-->`;

  if (node.type !== 'element') {
    return (node.children || []).map(serialize).join('');
  }

  const { tagName, properties = {}, children = [] } = node;
  const attrs = Object.entries(properties)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => {
      const name = PROP_ALIAS[k] || k;
      if (v === true) return name;
      if (Array.isArray(v)) return `${name}="${escapeAttr(v.join(' '))}"`;
      return `${name}="${escapeAttr(v)}"`;
    })
    .join(' ');

  const open = attrs ? `<${tagName} ${attrs}>` : `<${tagName}>`;
  if (VOID_ELEMENTS.has(tagName)) return open;
  return `${open}${children.map(serialize).join('')}</${tagName}>`;
}

const baseProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkAlerts)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug);

function renderMarkdown(markdown, pageSegs, isIndex, prefix = '') {
  // 先把 markdown 完整走成 hast（remark-parse → remark-rehype → rehype-raw → rehype-slug），
  // 再单独跑一遍链接改写。两个坑：
  //   1. rewriteLinks 的参数逐页不同，不能挂到共用的 baseProcessor 上；
  //   2. 必须走完 remarkRehype/rehypeRaw 才拿得到 hast —— 只 parse 得到的是 mdast，
  //      直接序列化会把标题/列表/表格/强调等结构节点全丢掉，只剩纯文字。
  const hast = baseProcessor.runSync(baseProcessor.parse(markdown));
  const linked = unified().use(rewriteLinks, { pageSegs, isIndex, prefix }).runSync(hast);

  return serialize(linked);
}

// ----------------------------------------------------------------------
// 路由推导：与 src/pages/docs/viewer.tsx 的 matchesPath 保持一致

const stripPrefix = (part) => part.replace(/^\d+\./, '');

function routeFromRelativePath(relPath) {
  const parts = relPath.replace(/\.md$/, '').split('/');
  const segs = parts.map(stripPrefix);
  if (segs[segs.length - 1] === 'index') segs.pop();
  return segs.join('/');
}

function walkMarkdown(dir, base = '', acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkMarkdown(full, path.join(base, entry.name), acc);
    } else if (entry.name.endsWith('.md')) {
      acc.push(path.join(base, entry.name));
    }
  }
  return acc;
}

/**
 * 列出产物目录下所有 index.html 对应的路由（相对路径，首页为空串）。
 * 用于 sitemap 覆盖率自检：以**真实产物**为准，而不是以 collectPages 的结果为准 ——
 * 后者只反映 markdown 输入，漏写模板或路由算错时它自己发现不了。
 */
function walkIndexHtml(dir, base = '', acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const full = path.join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;

    if (fs.existsSync(path.join(full, 'index.html'))) acc.push(rel);
    walkIndexHtml(full, rel, acc);
  }
  return acc;
}

function collectPages(lang) {
  const langDir = path.join(CONTENT_DIR, lang);
  const pages = [];

  for (const rel of walkMarkdown(langDir)) {
    const route = routeFromRelativePath(rel.split(path.sep).join('/'));
    const raw = fs.readFileSync(path.join(langDir, rel), 'utf8');
    const { content, data } = matter(raw);

    pages.push({
      lang,
      route,
      segs: route ? route.split('/') : [],
      isIndex: path.basename(rel) === 'index.md',
      title: data.title,
      description: data.description,
      updated: data.updated,
      tags: data.tags,
      content,
    });
  }

  // 按 URL 去重（同一 URL 若被多个文件命中，取第一条并告警）
  const seen = new Map();

  for (const page of pages) {
    if (seen.has(page.route)) {
      console.warn(`  ! URL 冲突 "${page.route}"：已存在，跳过此文件`);
      continue;
    }
    seen.set(page.route, page);
  }

  return [...seen.values()].sort((a, b) => a.route.localeCompare(b.route));
}

// ----------------------------------------------------------------------
// 模板

/**
 * 从 vite 产物里挑出「构建注入的资源标签」。
 *
 * 必须用白名单：SSG 自己写进 head 的 canonical / JSON-LD / ssg.css 和 vite 注入的
 * script/link 在同一个文件里，不加区分地全量提取会让 head 层层堆叠
 * （第二次运行就会出现两份 canonical、三份 favicon）。
 */
const ASSET_LINK_REL =
  /rel="(?:stylesheet|modulepreload|icon|apple-touch-icon|manifest|preconnect|dns-prefetch)"/;

function extractAssetTags(html) {
  return [...html.matchAll(/<(script|link)\b[^>]*>(?:<\/script>)?/g)]
    .map((m) => m[0])
    .filter((tag) => {
      if (tag.startsWith('<script')) return /type="module"/.test(tag); // 只要 vite 的入口
      return ASSET_LINK_REL.test(tag) && !tag.includes('ssg.css');
    });
}

function readTemplate() {
  const indexPath = path.join(OUT_DIR, 'index.html');

  if (!fs.existsSync(indexPath)) {
    throw new Error(`${indexPath} 不存在：请先跑 vite build，再跑 ssg`);
  }

  const html = fs.readFileSync(indexPath, 'utf8');

  return { html, headTags: extractAssetTags(html), bootstrap: extractThemeBootstrap(html) };
}

/**
 * 首屏配色引导脚本：**从模板 index.html 里取，不在这里写第二份**。
 *
 * 站点默认走暗色（`themeConfig.defaultMode = 'dark'`），但调色板的 CSS 变量是 MUI 在
 * 运行时用 emotion 注入的，首屏绘制时 `var(--palette-background-default)` 还没定义，
 * 浏览器按「未设值」渲染 —— 纯黑站点会先白闪一下再变黑，很扎眼。
 *
 * 那段脚本同步执行在 `<head>` 里，抢在首屏绘制前把 `data-color-scheme` 与底色定下来；
 * 等 React 起来，MUI 接管同名属性与变量，视觉上不跳变。
 *
 * **真源在根目录 `index.html` 的 `<!-- theme-bootstrap -->` 块里**，理由两条：
 * ① `vite dev` 与「只跑 vite build、不跑 ssg」这两条路径根本不会经过本文件，写在这儿
 * 等于只有 SSG 产物受益，开发和预览时照样白闪；放模板里则三条路径共用一份。
 * ② 避免两处副本各自漂移（历史上 canonical / favicon 就是这么一层层叠上去的）。
 * SSG 只负责把这一块原样搬进每个预渲染页的 `<head>`。
 */
const THEME_BOOTSTRAP_RE = /<!--\s*theme-bootstrap\s*-->[\s\S]*?<!--\s*\/theme-bootstrap\s*-->/;

function extractThemeBootstrap(html) {
  const match = html.match(THEME_BOOTSTRAP_RE);

  if (!match) {
    throw new Error(
      `在 ${path.join(OUT_DIR, 'index.html')} 里找不到 <!-- theme-bootstrap --> 块：` +
        '首屏配色引导是模板 index.html 的一部分，SSG 只负责搬运。' +
        '产物可能已被别的东西覆盖，请重新跑 vite build'
    );
  }

  return match[0];
}

// ----------------------------------------------------------------------
// 顶栏

/**
 * 一级栏目与站名：**从源码读，不在本脚本里写第二份**。
 *
 * 为什么壳里要有顶栏：React 接管前的那几秒，页面上只有预渲染壳。壳原先没有顶栏，
 * 于是**新访客看到的第一屏是一个悬空的文字卡片** —— 没有导航、没有站名，亮色模式下
 * 卡片与页面底色又几乎同色，整体看起来就像「样式没加载出来」。
 * 把真实顶栏的骨架静态化，首屏一上来就是个完整的站点框架，接管时只在原位换内容。
 *
 * 为什么解析源码而不是抄一份常量：抄一份就是第二个真源，栏目一改两边就漂。
 * 解析失败会直接抛错（不是静默少渲染几项），构建期拦住。
 */
const TOP_NAV_SRC = path.join(ROOT, 'src/layouts/components/global-top-nav.tsx');

let topNavCache = null;

function getTopNav() {
  if (!topNavCache) topNavCache = readTopNav();
  return topNavCache;
}

function readTopNav() {
  const src = fs.readFileSync(TOP_NAV_SRC, 'utf8');

  const block = src.match(/export const TOP_NAV_LINKS[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!block) {
    throw new Error(
      `在 ${TOP_NAV_SRC} 里找不到 TOP_NAV_LINKS：预渲染壳的顶栏栏目取自那里。` +
        '如果改成了 map 之类的生成式写法，要回来同步本脚本的解析。'
    );
  }

  const items = [
    ...block[1].matchAll(
      /\{\s*key:\s*'([^']+)',\s*path:\s*'([^']+)',\s*label:\s*\{\s*cn:\s*'([^']+)',\s*en:\s*'([^']+)'\s*\},?/g
    ),
  ].map((m) => ({ key: m[1], path: m[2], cn: m[3], en: m[4] }));

  // 解析出的条数必须等于源码里 `key:` 出现的次数。若有人把某个栏目换成多行写法，
  // 正则只会漏掉那一项 —— 顶栏少一个栏目，而构建照样绿。这里把它变成硬失败。
  const declared = (block[1].match(/\bkey:/g) || []).length;
  if (!items.length || items.length !== declared) {
    throw new Error(
      `TOP_NAV_LINKS 解析不完整：正则拿到 ${items.length} 项，源码里声明了 ${declared} 项。` +
        '本脚本的正则要求「一个栏目写成一行」，换行写会导致静默漏项。'
    );
  }

  const title = src.match(/const siteTitle = locale === 'en' \? '([^']*)' : '([^']*)';/);
  if (!title) {
    throw new Error(`在 ${TOP_NAV_SRC} 里找不到 siteTitle 的赋值，预渲染壳的站名取自那里。`);
  }

  return { title: { cn: title[2], en: title[1] }, items };
}

/**
 * 静态顶栏的 HTML。
 *
 * 尺寸与结构对着 `layouts/core/header-section.tsx`（高度走 `layouts/core/css-vars.ts`
 * 的那两个变量，桌面 72 / 移动 64，切换断点是 lg）与 `layouts/components/global-top-nav.tsx`
 * 来，保证 React 接管时顶栏在原位换内容、不跳。
 *
 * 栏目刻意渲染成 `<span>` 而不是 `<a>`：首屏它只是占位骨架，做成可点的会让用户在
 * 接管前后点到两套不同的东西；顺带也省掉了 BASE 前缀与尾斜杠的换算。
 */
function renderHeader(route, nav, lang = 'cn') {
  const pathname = route ? `/${route}` : '/';

  const items = nav.items
    .map((item) => {
      // 选中判据与 GlobalTopNav 保持一致：首页严格相等，其余按前缀匹配。
      const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
      return `<span${active ? ' data-active' : ''}>${escapeHtml(item[lang] ?? item.cn)}</span>`;
    })
    .join('\n        ');

  return `    <header class="ssg-header">
      <span class="ssg-header-brand">${escapeHtml(nav.title[lang] ?? nav.title.cn)}</span>
      <nav class="ssg-header-nav">
        ${items}
      </nav>
    </header>`;
}

function breadcrumb(route, title, lang = 'cn') {
  const langInfo = langMeta(lang);
  const segments = route ? route.split('/') : [];
  const items = [{ name: langInfo.homeLabel, url: `${SITE_URL}${langInfo.prefix}/` }];
  let acc = '';

  for (const seg of segments) {
    acc += `/${seg}`;
    items.push({ name: seg, url: `${SITE_URL}${langInfo.prefix}${acc}/` });
  }

  if (items.length > 1) items[items.length - 1].name = title;

  return items;
}

/**
 * 首屏骨架。挂在 `.ssg` 容器的第一个子节点，与后面那段被 `.ssg-pending` 隐藏的正文同位。
 *
 * 两种形态，因为首页和文档页接管后的样子差得太远：
 *   · 首页 —— 门户式落地页：一段大标题 + 两行副标题 + 三张并排的卡片。
 *   · 其余页 —— 文档页：一行面包屑 + 一张正文卡片（标题行 + 几行文本）。
 *
 * 讲究只有一条：**别画得太具体**。骨架越像某个具体东西，接管时越像「画错了被换掉」；
 * 几个中性灰块反倒读成「正在加载」。所以这里不写任何文案、不放图标，纯色块。
 *
 * 侧边栏没有复刻：真实文档页是「左边栏 + 内容」两栏，而 `.ssg` 是居中的单栏容器，
 * 壳里补一条假边栏就得把整个容器改成两栏布局，收益只在那两秒的位移量上，不划算。
 * 已知残留：文档页接管时正文会从左往右让开一个侧边栏的宽度。
 *
 * `aria-hidden` 是必须的：骨架是装饰，读屏软件不该念一堆空 div。
 */
function renderSkeleton(route) {
  if (route === '') {
    return `      <div class="ssg-skel ssg-skel-home" aria-hidden="true">
        <div class="ssg-skel-hero-title"></div>
        <div class="ssg-skel-hero-sub"></div>
        <div class="ssg-skel-hero-sub ssg-skel-hero-sub-2"></div>
        <div class="ssg-skel-grid">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>`;
  }

  // 宽度参差是刻意的：等宽灰条会被读成表格或分隔线，参差的才像一段段文字。
  const lines = [96, 100, 88, 92, 61]
    .map((w) => `          <div class="ssg-skel-line" style="width:${w}%"></div>`)
    .join('\n');

  return `      <div class="ssg-skel" aria-hidden="true">
        <div class="ssg-skel-crumb"></div>
        <div class="ssg-skel-card">
          <div class="ssg-skel-title"></div>
${lines}
        </div>
      </div>`;
}

/** 同一路由在各语言下的地址，用于 hreflang 互指。 */
function alternatesFor(route, routeLangs) {
  const langs = routeLangs.get(route) || new Set(['cn']);
  const suffix = route ? `/${route}` : '';
  const list = LANGS.filter((l) => langs.has(l.code)).map((l) => ({
    hreflang: l.htmlLang,
    href: `${SITE_URL}${l.prefix}${suffix}/`,
  }));

  // x-default 给中文：不给搜索引擎留「不知道推哪个」的空档。
  const fallback = list.find((a) => a.hreflang === 'zh-CN') || list[0];

  if (fallback) list.push({ hreflang: 'x-default', href: fallback.href });

  return list;
}

/** 这一页是否有另一种语言的版本（决定要不要写 og:locale:alternate）。 */
function otherLangExists(alternates, langInfo) {
  return alternates.some((a) => a.hreflang !== 'x-default' && a.hreflang !== langInfo.htmlLang);
}

function renderPage(page, tmpl, childrenByRoute, routeLangs) {  const { route, title, description, updated, content, segs, isIndex, lang } = page;
  const langInfo = langMeta(lang);
  const prefix = langInfo.prefix;
  const url = `${SITE_URL}${prefix}${route ? `/${route}` : ''}/`;
  // canonical 一律自指。首页有自己独立的正文（见 buildHomeMarkdown），不再与
  // /introduction 共用内容，把首页的权重合并过去只会让首页自己进不了索引。
  const canonical = url;
  const alternates = page.alternates || alternatesFor(route, routeLangs);

  // 首页用「站点名 + 定位」而不是「产品概述 | RUNE」：首页是品牌词与站点级检索的落点，
  // 其余页面沿用「页面标题 | 站点名」，与运行时 <Helmet> 的设置保持一致。
  // 首页标题直接取自 home-copy.json（中英各一份），保证静态 HTML 与 React 渲染同一句。
  const siteLevelTitle = SITE.subtitle ? `${SITE_NAME} 文档 · ${SITE.subtitle}` : `${SITE_NAME} 文档`;
  const pageTitle = route !== '' && title ? `${title} | ${SITE_NAME}` : title || siteLevelTitle;
  const body = renderMarkdown(content, segs, isIndex, prefix);

  const children = childrenByRoute.get(route) || [];
  const childrenHtml = children.length
    ? `<section class="ssg-children"><h2>${
        lang === 'en' ? `${children.length} pages in this section` : `本节包含 ${children.length} 个页面`
      }</h2><ul>${children
        .map(
          (c) =>
            `<li><a href="${BASE}${prefix}/${c.route}/">${escapeHtml(c.title || c.route)}</a></li>`
        )
        .join('')}</ul></section>`
    : '';

  const crumbs = breadcrumb(route, title || SITE_NAME, lang);
  const crumbHtml = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<span>${escapeHtml(c.name)}</span>`
        : `<a href="${c.url}">${escapeHtml(c.name)}</a>`
    )
    .join(' <span aria-hidden="true">/</span> ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pageTitle,
    ...(description ? { description } : {}),
    ...(updated ? { dateModified: updated } : {}),
    inLanguage: langInfo.htmlLang,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    url: canonical,
    publisher: { '@type': 'Organization', name: SITE_NAME },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    },
  };

  const meta = [
    `<title>${escapeHtml(pageTitle)}</title>`,
    description ? `<meta name="description" content="${escapeAttr(description)}" />` : '',
    // data-ssg-head：静态 head 的这份标签在 React 挂载后会被 src/utils/doc-head.ts
    // 删掉重写（运行时要知道当前语言与 origin）。打个标记，它才认得哪些是自己该接管的，
    // 否则同一个 head 里会叠出两份 canonical 与两套 hreflang。
    `<link rel="canonical" href="${canonical}" data-ssg-head />`,
    // hreflang 是「这两个地址是同一页的两种语言」的声明。缺了它，Google 会把
    // 中英文当成两份各自独立的页面，英文版拿不到中文版已有的权重，也进不了
    // 英文语种的检索结果。
    ...alternates.map(
      (a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" data-ssg-head />`
    ),
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${langInfo.ogLocale}" data-ssg-head />`,
    otherLangExists(alternates, langInfo)
      ? `<meta property="og:locale:alternate" content="${lang === 'en' ? 'zh_CN' : 'en_US'}" />`
      : '',
    `<meta property="og:title" content="${escapeAttr(pageTitle)}" />`,
    description ? `<meta property="og:description" content="${escapeAttr(description)}" />` : '',
    `<meta property="og:url" content="${canonical}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeAttr(pageTitle)}" />`,
    description
      ? `<meta name="twitter:description" content="${escapeAttr(description)}" />`
      : '',
    updated ? `<meta property="article:modified_time" content="${updated}" />` : '',
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ');

  // 首页是门户式深色落地页（见 src/sections/home/tokens.ts 的 bgPage），两种主题下都是深色。
  // 给它挂一个标记，让首屏壳也能钉成深色 —— 否则亮色主题下会先铺一屏浅色、React 接管时
  // 整屏翻黑，那是全屏级的跳变。其余页面跟随主题，不需要这个标记。
  return `<!doctype html>
<html lang="${langInfo.htmlLang}"${route === '' ? ' data-ssg-home' : ''}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
${tmpl.bootstrap}
    ${meta}
    ${tmpl.headTags.join('\n    ')}
    ${inlineCriticalCss()}
  </head>

  <body>
    <div id="root">
${renderHeader(route, getTopNav(), lang)}
      <div class="ssg ssg-pending">
${renderSkeleton(route)}
        <nav class="ssg-crumb">${crumbHtml}</nav>
        <main class="ssg-card">
          <article>
${body}
          </article>
${childrenHtml}
        </main>
      </div>
      <script>
        /* 骨架的兜底放行：入口 chunk 拉不下来时 React 永远不会接管，不能让人一直盯着
           骨架。正常路径下这条定时器到点时 #root 早被 React 清空，属性挂上去也无处生效。
           只能内联在壳旁边 —— 它要跟着壳一起被 React 删掉，放 head 里也一样，但放这里
           两段逻辑挨着，改的人不会漏。 */
        setTimeout(function () {
          document.documentElement.setAttribute('data-ssg-fallback', '');
        }, 8000);
      </script>
    </div>
  </body>
</html>
`;
}

/**
 * 生成 404 兜壳。
 *
 * 它必须是「SPA 空壳」：#root 里不放静态正文，交给浏览器里的 react-router 渲染
 * 「页面不存在」。只加 noindex，避免搜索引擎把未知路径当软 404 收录 —— 内容页那套
 * canonical / og / JSON-LD 一个都不要（它们会把 404 页伪装成正文页）。
 *
 * 注意这里是**整份重新生成**，不是就地 replace：vite 插件产出的那份每次构建都会被
 * 当成新文件再追加一次 noindex，连跑两次就变成 3 份（构建不报错，只是 page 越滚越脏）。
 */
function renderNotFound(tmpl) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
${tmpl.bootstrap}
    <meta name="robots" content="noindex" />
    <title>页面不存在 | ${escapeHtml(SITE_NAME)}</title>
    ${tmpl.headTags.join('\n    ')}
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
`;
}

function writeFile(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function buildChildrenIndex(pages) {
  const map = new Map();

  for (const page of pages) {
    const parentRoute = page.route.includes('/')
      ? page.route.slice(0, page.route.lastIndexOf('/'))
      : '';
    // 仅收直接子页（URL 段数正好比父级多 1），且排除父级自身与 index 页
    if (page.route === '' || page.isIndex) continue;
    if (!map.has(parentRoute)) map.set(parentRoute, []);
    map.get(parentRoute).push(page);
  }

  for (const [, list] of map) {
    list.sort((a, b) => (a.route > b.route ? 1 : -1));
  }

  return map;
}

const IMAGE_TITLE_MAX = 120;

/**
 * 从渲染好的页面 HTML 里抽出图片（src + alt），供 image sitemap 使用。
 *
 * 从**渲染结果**里取而不是重新解析 markdown：这样 sitemap 声明的图片与页面里
 * 真实出现的 <img> 严格一致，不会因为链接改写规则调整而两边错位。
 *
 * 只保留站内绝对路径 —— Google 硬性要求 image:loc 与 sitemap 同域，外链图和
 * data: URI 一律不进本站 sitemap。
 */
function extractPageImages(html) {
  const seen = new Set();
  const images = [];

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const src = /\bsrc="([^"]*)"/.exec(m[0])?.[1];

    if (!src || !src.startsWith('/')) continue;

    const url = `${SITE_URL}${src}`;

    if (seen.has(url)) continue; // 同一页同一张图只声明一次

    seen.add(url);

    const alt = /\balt="([^"]*)"/.exec(m[0])?.[1] ?? '';

    images.push({
      url,
      alt: alt.length > IMAGE_TITLE_MAX ? `${alt.slice(0, IMAGE_TITLE_MAX)}…` : alt,
    });
  }

  return images;
}

/**
 * 生成 sitemap（含 image 扩展，Google 与 Bing 都支持）。
 *
 * 为什么值得带图片声明：它解决的是**发现**问题。页面刚上线、还没有任何外链时，
 * sitemap 是最强的发现信号；带上 image:loc 后 Googlebot-Image / Bingbot 可以
 * 直接把 142 张图排进抓取队列，不必等爬完 177 个页面再逐个解析 <img>。
 * 对更依赖 sitemap 的 Bing 尤其有意义。
 *
 * 每条 URL 都必须有 lastmod：缺失时退回构建日期，而不是留空。
 * 少一条 lastmod，搜索引擎就没有「这页变过」的依据，新内容会排在抓取队列后面。
 */
function buildSitemap(pages) {
  const entries = pages
    .map((page) => {
      const url = `${SITE_URL}${page.prefix || ''}${page.route ? `/${page.route}` : ''}/`;
      const lastmod = `<lastmod>${page.updated || BUILD_DATE}</lastmod>`;
      // sitemap 里的 hreflang 与页面 head 里的必须成对出现：只写在一边，
      // 搜索引擎对「这两页是同一内容的两种语言」的判断会打折。
      const alternates = (page.alternates || [])
        .map(
          (a) =>
            `\n    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}" />`
        )
        .join('');
      const images = (page.images || [])
        .map(
          (img) =>
            `\n    <image:image><image:loc>${escapeHtml(img.url)}</image:loc>` +
            (img.alt ? `<image:title>${escapeHtml(img.alt)}</image:title>` : '') +
            `</image:image>`
        )
        .join('');

      return `  <url><loc>${url}</loc>${lastmod}<changefreq>weekly</changefreq>${alternates}${images}</url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}

/**
 * 静态预渲染首屏样式。仅作用于 `.ssg`，React 接管后随静态内容一起失效。
 *
 * **内联进每个页面的 `<head>`，不再走外部 `<link href="/assets/ssg.css">`。**
 * 那份外链只有 4.5KB，却是 render-blocking 的：它承载「预渲染壳长什么样」的全部样式，
 * 浏览器必须等它回来才肯画第一帧。省掉这一次往返，静态壳就能和引导脚本一起在第一帧
 * 就位 —— 首屏不再有「等样式」的空窗，也就没有壳先裸奔一瞬再被样式覆盖的跳变。
 *
 * 代价是每页多背这一份 CSS（2026-09-21 实测 11.5KB raw / 4.6KB gzip）。一次访问只加载
 * 一页，也就是这点流量；相对首屏稳定，这个交换划算。顺带一提，`assets/ssg.css` 仍然照写
 * 不误：老访问者手里可能还捏着引用它的旧 HTML 缓存，删文件会让那种页面变成无样式的裸壳；
 * 等一个发布周期再摘。**但新增的规则都得能容忍「旧 HTML 里没有对应元素」**，理由见下面
 * 骨架那一段里的 ssg-pending 说明。
 */
const SSG_CSS = `/* 静态预渲染首屏样式。四段职责不同：
   · html/body 兜底 —— 从首帧一直活到 React 接管。此前这块是空的，于是首屏那几秒
     里 body 还是浏览器默认的 margin:8px + 透明底，四周露出一圈底色，看着像没加载完。
   · 顶栏 —— 同理，让首屏一上来就有站点框架，而不是一张悬空的卡片。
     上面这两段在 React 接管后由 CssBaseline 与 HeaderSection 给出同样的值，
     **取值必须与最终态一致**，不一致就会在接管瞬间看到跳动。
   · 骨架屏 —— 正文在样式就绪前**不显示**，那个位置留给骨架。理由见下面那一段注释。
   · .ssg 及其子选择器 —— 只负责预渲染正文，React 接管后随静态内容一起消失。

   色值一律手写，没有 var(--palette-*)：调色板变量由 emotion 在运行时注入，首帧根本
   还不存在。改 src/theme/core/palette.ts 的 background 两套时要回来同步这里。 */
html,body{margin:0;padding:0}
body{min-height:100vh;background:#f9fafb;color:#1f2937;font:16px/1.75 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;-webkit-font-smoothing:antialiased}
html[data-color-scheme='dark'] body{background:#000;color:#fff}
.ssg-header{display:flex;align-items:center;height:72px;padding:0 24px}
.ssg-header-brand{font-weight:600;letter-spacing:.1em;font-size:1.25rem;line-height:1.2;white-space:nowrap}
.ssg-header-nav{display:flex;align-items:center;gap:8px;margin-left:16px;overflow:hidden}
.ssg-header-nav span{font-size:1rem;font-weight:600;opacity:.78;padding:6px 20px;border-radius:999px;white-space:nowrap}
.ssg-header-nav span[data-active]{font-weight:700;opacity:1;background:color-mix(in srgb,currentColor 12%,transparent)}
@media (max-width:1199.98px){.ssg-header{height:64px;padding:0 16px}.ssg-header-brand{font-size:1rem}.ssg-header-nav{display:none}}
.ssg{max-width:920px;margin:0 auto;padding:24px 20px 64px;font:16px/1.75 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;color:#1f2937;background:#f9fafb}
.ssg *{box-sizing:border-box}
.ssg-crumb{font-size:13px;color:#6b7280;margin:0 0 14px}
.ssg-crumb a{color:#6b7280;text-decoration:none}
.ssg-crumb a:hover{text-decoration:underline}
.ssg-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:32px 36px}
.ssg h1{font-size:28px;line-height:1.35;margin:0 0 20px}
.ssg h2{font-size:22px;line-height:1.4;margin:34px 0 14px}
.ssg h3{font-size:18px;line-height:1.4;margin:24px 0 10px}
.ssg p{margin:0 0 14px}
.ssg a{color:#0b6bcb}
.ssg ul,.ssg ol{padding-left:22px;margin:0 0 14px}
.ssg li{margin:4px 0}
.ssg table{border-collapse:collapse;width:100%;margin:16px 0;font-size:15px}
.ssg th,.ssg td{border:1px solid #e5e7eb;padding:8px 12px;text-align:left;vertical-align:top}
.ssg th{background:#f3f4f6;font-weight:600}
.ssg img{max-width:100%;height:auto;border:1px solid #e5e7eb;border-radius:8px}
.ssg pre{background:#f6f8fa;border:1px solid #e5e7eb;border-radius:8px;padding:14px;overflow:auto}
.ssg code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.92em}
.ssg blockquote{margin:16px 0;padding:2px 16px;border-left:3px solid #d1d5db;color:#4b5563}
.ssg hr{border:0;border-top:1px solid #e5e7eb;margin:28px 0}
.ssg .alert{margin:16px 0;padding:12px 16px;border-left:4px solid #3b82f6;background:#eff6ff;border-radius:8px}
.ssg .alert-title{font-weight:600;margin:0 0 6px}
.ssg .alert-success{border-color:#10b981;background:#ecfdf5}
.ssg .alert-warning{border-color:#f59e0b;background:#fffbeb}
.ssg .alert-error{border-color:#ef4444;background:#fef2f2}
.ssg .alert-tip{border-color:#8b5cf6;background:#f5f3ff}
.ssg-children{margin-top:40px;padding-top:22px;border-top:1px solid #e5e7eb}
.ssg-children h2{font-size:17px;margin:0 0 14px}
.ssg-children ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
.ssg-children a{display:block;padding:9px 12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-decoration:none}
.ssg-children a:hover{border-color:#0b6bcb}
/* ----------------------------------------------------------------------
   骨架屏：正文在样式就绪之前不出现。

   为什么要把正文藏起来：预渲染壳的正文与 React 接管后的页面**形态不同**，而且不是
   细节不同 —— 首页壳是一张 markdown 文档卡片（"四条产品线"那几段），真实首页是门户式
   暗色落地页（Hero + 模拟终端 + Bento Grid，见 src/sections/home/）；文档页壳没有左侧
   边栏，真实页是 DashboardLayout 的「固定顶栏 + 左边栏 + 内容」。用户先看到一版完全不同
   的正文、两秒后整片被换掉，比多等一会儿糟得多。所以壳只负责把自己画成骨架。

   「ssg-pending」挂在 .ssg 自己身上、而不是写成无条件规则，是为了**过渡期**：
   assets/ssg.css 仍被老访问者手里的旧 HTML 缓存引用，那些页面里既没有 .ssg-pending
   也没有骨架 —— 无条件隐藏会把它们变成永久空白页。带上这个标记，新旧产物各自正确。

   藏的是 visibility 而不是 display：内容仍然参与布局，页面滚动高度与接管后一致，
   接管时不会因为滚动条出现/消失再跳一次。正文是加载后就被 React 整个替换掉的，
   留不留占位都不影响最终观感。
   ---------------------------------------------------------------------- */
.ssg-pending .ssg-crumb,.ssg-pending .ssg-card,.ssg-pending .ssg-children{visibility:hidden}
.ssg-skel-crumb,.ssg-skel-title,.ssg-skel-line,.ssg-skel-hero-title,.ssg-skel-hero-sub,.ssg-skel-grid>div{background:#e5e7eb;animation:ssg-skel-pulse 1.6s ease-in-out infinite}
@keyframes ssg-skel-pulse{0%,100%{opacity:.55}50%{opacity:1}}
.ssg-skel-crumb{width:140px;height:13px;border-radius:6px;margin:0 0 14px}
.ssg-skel-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:32px 36px}
.ssg-skel-title{width:min(56%,420px);height:30px;border-radius:8px;margin:0 0 26px}
.ssg-skel-line{height:14px;border-radius:7px;margin:0 0 14px}
.ssg-skel-hero-title{width:78%;height:40px;border-radius:10px}
.ssg-skel-hero-sub{width:100%;height:16px;border-radius:8px;margin:18px 0 0}
.ssg-skel-hero-sub-2{width:72%}
.ssg-skel-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:44px 0 0}
.ssg-skel-grid>div{height:168px;border-radius:14px}
@media (max-width:899.98px){.ssg-skel-grid{grid-template-columns:1fr}.ssg-skel-grid>div{height:120px}}
/* 骨架的呼吸动画只是提示「在加载」，没有信息量 —— 跟着系统的减弱动效开关一起关掉。 */
@media (prefers-reduced-motion:reduce){.ssg-skel-crumb,.ssg-skel-title,.ssg-skel-line,.ssg-skel-hero-title,.ssg-skel-hero-sub,.ssg-skel-grid>div{animation:none;opacity:.8}}
/* ----------------------------------------------------------------------
   暗色首屏。
   上面那套是按浅色写的（浅灰页 + 白卡片），而站点默认是暗色：预渲染整屏先铺一屏
   浅色，等 React 接管再翻成纯黑 —— 那就是一次满屏白闪，比没做预渲染还难受。
   用 html 上的 data-color-scheme 分流；根目录 index.html 里那段引导脚本（由本脚本搬进
   head）在首屏绘制前就把该属性定好了，所以这里跟得上，用户看不到中间态。
   只覆盖配色，布局一律不动。色值对应 src/theme/core/palette.ts 的 background.dark
   与各 dark* 常量，改那边要回来同步。
   ---------------------------------------------------------------------- */
html[data-color-scheme='dark'] .ssg{color:#fff;background:#000}
html[data-color-scheme='dark'] .ssg-crumb,
html[data-color-scheme='dark'] .ssg-crumb a{color:#9aa5b1}
html[data-color-scheme='dark'] .ssg-card{background:#0b0e12;border-color:#262b33}
html[data-color-scheme='dark'] .ssg a{color:#5be49b}
html[data-color-scheme='dark'] .ssg th,
html[data-color-scheme='dark'] .ssg td{border-color:#262b33}
html[data-color-scheme='dark'] .ssg th{background:#1a2028}
html[data-color-scheme='dark'] .ssg img{border-color:#262b33}
html[data-color-scheme='dark'] .ssg pre{background:#0e1218;border-color:#262b33}
html[data-color-scheme='dark'] .ssg blockquote{border-left-color:#3a3f44;color:#c4cdd5}
html[data-color-scheme='dark'] .ssg hr{border-top-color:#262b33}
html[data-color-scheme='dark'] .ssg-children{border-top-color:#262b33}
html[data-color-scheme='dark'] .ssg-children a{background:#12161b;border-color:#262b33}
html[data-color-scheme='dark'] .ssg-children a:hover{border-color:#5be49b}
html[data-color-scheme='dark'] .ssg .alert{background:rgba(147,187,253,.14);border-left-color:#93bbfd}
html[data-color-scheme='dark'] .ssg .alert-success{background:rgba(134,239,172,.14);border-color:#86efac}
html[data-color-scheme='dark'] .ssg .alert-warning{background:rgba(252,211,77,.14);border-color:#fcd34d}
html[data-color-scheme='dark'] .ssg .alert-error{background:rgba(252,165,165,.14);border-color:#fca5a5}
html[data-color-scheme='dark'] .ssg .alert-tip{background:rgba(94,234,212,.14);border-color:#5eead4}
html[data-color-scheme='dark'] .ssg-skel-crumb,
html[data-color-scheme='dark'] .ssg-skel-title,
html[data-color-scheme='dark'] .ssg-skel-line{background:#1a2028}
html[data-color-scheme='dark'] .ssg-skel-card{background:#0b0e12;border-color:#262b33}
/* ----------------------------------------------------------------------
   首页专供：门户式深色落地页在**两种主题下都是深色**（见 src/sections/home/tokens.ts
   的 bgPage 与内容面），所以它不能跟着 data-color-scheme 走 —— 亮色主题下若铺浅色，
   React 接管时是整屏翻黑，比顶栏翻色刺眼得多。顶栏也一并变白字：首页顶栏本就是深色底。
   只覆盖首页正文里真实出现的元素（标题/段落/链接/面包屑）。首页正文由 buildHomeMarkdown
   生成，没有表格与代码块，所以那几类不必在这里重复一遍。
   注意这两组选择器特异性相同，靠**书写顺序**取胜：必须排在上面那套暗色规则之后。
   ---------------------------------------------------------------------- */
html[data-ssg-home] body{background:#050506;color:#fff}
html[data-ssg-home] .ssg{color:#fff;background:#050506}
html[data-ssg-home] .ssg-card{background:#0d0e10;border-color:#262b33}
html[data-ssg-home] .ssg a{color:#5be49b}
html[data-ssg-home] .ssg-crumb,
html[data-ssg-home] .ssg-crumb a{color:#9aa5b1}
html[data-ssg-home] .ssg-skel-hero-title,
html[data-ssg-home] .ssg-skel-hero-sub,
html[data-ssg-home] .ssg-skel-grid>div{background:#171b20}
/* ----------------------------------------------------------------------
   兜底放行。壳的正文靠「React 接管时整片清空 #root」自然消失，所以这里平时不需要任何
   揭示动作；但入口 chunk 拉不下来时（部署换版中途、公司网络挡了 js、老浏览器报错），
   React 永远不会来，那就不能让人一直盯着骨架。
   由 renderPage 里那段内联脚本在 8s 后给 <html> 挂 data-ssg-fallback 触发。
   只会发生在失败路径上：正常路径下 React 早已把带 .ssg-pending 的整个节点删掉了。
   JS 被完全禁用的情况不走这里（setTimeout 也不会执行），由 head 里的 <noscript> 放行，
   见 inlineCriticalCss。
   ---------------------------------------------------------------------- */
html[data-ssg-fallback] .ssg-pending .ssg-crumb,
html[data-ssg-fallback] .ssg-pending .ssg-card,
html[data-ssg-fallback] .ssg-pending .ssg-children{visibility:visible}
html[data-ssg-fallback] .ssg-skel{display:none}
`;

/**
 * 把首屏样式包成 `<style id="ssg-critical">` 塞进 head，紧跟一份 `<noscript>` 放行样式。
 *
 * id 不是装饰：自检靠它断言「每页有且只有一份」。SSG 重复运行时曾经把 canonical /
 * favicon 一层层叠上去（构建照样绿、页面越滚越脏），所以内联了也必须有幂等锚点。
 * 想换 id 的话记得同步改 selfCheck。
 */
function inlineCriticalCss() {
  // <noscript> 兜底：JS 被完全禁用时没有「样式就绪」这回事，也就永远等不到 React。
  // 那种情况下壳里那份正文就是用户能拿到的全部内容，直接放行、并把骨架藏掉。
  // 放在这里而不是写进 SSG_CSS，是因为 <noscript> 不能嵌在 <style> 里面。
  // 特异性与 SSG_CSS 里的隐藏规则相同，靠「在后」取胜。
  return `<style id="ssg-critical">${SSG_CSS}</style>
    <noscript><style>.ssg-pending .ssg-crumb,.ssg-pending .ssg-card,.ssg-pending .ssg-children{visibility:visible}.ssg-skel{display:none}</style></noscript>`;
}

/**
 * 生成后自检。
 *
 * 静态 HTML 里的链接一旦指向不存在的文件，搜索引擎爬到的就是 404 —— 而这类问题
 * 在构建日志里完全看不出来（部署照样成功、CI 照样绿），所以必须在构建时拦住。
 * 同时兜住「新增页面忘了写 title/description」这类会直接削弱 SEO 的疏漏。
 */
function selfCheck(pages) {
  const problems = [];

  const existsInDist = (url) => {
    const clean = url.split('#')[0].split('?')[0];
    const relative = clean.startsWith(BASE) ? clean.slice(BASE.length) : clean;

    if (!relative || relative === '/') return true;

    const target = path.resolve(OUT_DIR, relative.replace(/^\/+/, ''));

    if (target !== OUT_DIR && !target.startsWith(OUT_DIR + path.sep)) return false;
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return true;
    return fs.existsSync(path.join(target, 'index.html'));
  };

  for (const page of pages) {
    // 首页 route 为空，报错信息里给个能认出来的名字；英文页要连前缀一起报，
    // 否则中文 /rune 与英文 /en/rune 在日志里长得一模一样。
    const label = `${page.prefix || ''}${page.route ? `/${page.route}` : ''}` || '(首页)';

    if (!page.title) problems.push(`${label}: frontmatter 缺 title`);
    if (!page.description) problems.push(`${label}: frontmatter 缺 description`);

    const html = fs.readFileSync(
      path.join(OUT_DIR, (page.prefix || '').replace(/^\//, ''), page.route, 'index.html'),
      'utf8'
    );

    for (const [, href] of html.matchAll(/<(?:a|img)\b[^>]*(?:href|src)="(\/[^"]*)"/g)) {
      if (!existsInDist(href)) problems.push(`${label}: 死链 ${href}`);
    }

    // 幂等性：这几个标签每页有且只能有一份。SSG 重复运行时曾把 canonical / favicon
    // 一层层叠上去（构建不报错、页面却越滚越脏），所以直接在构建期拦住。
    for (const [re, label] of [
      [/<title>/g, '<title>'],
      [/rel="canonical"/g, 'canonical'],
      [/name="description"/g, 'description'],
      // 首屏样式改内联后，仍然按「有且只有一份」守：它在渲染阻塞路径上，叠两份会让
      // 每页的产物白白翻倍，而页面上看不出来。
      [/id="ssg-critical"/g, '内联首屏样式'],
      // 引导脚本同理。注意这里匹配的是**开标记**，闭合标记带 `/` 不会误计。
      [/<!--\s*theme-bootstrap\s*-->/g, 'theme-bootstrap'],
      // 预渲染顶栏同理：它在常规流里紧挨着正文，叠两份会把整页内容推下去一屏。
      [/<header class="ssg-header">/g, '预渲染顶栏'],
      // 骨架也同理：正文被 .ssg-pending 藏着，叠两份骨架就是整页两屏灰条。
      [/<div class="ssg-skel[ "]/g, '首屏骨架'],
    ]) {
      const n = (html.match(re) || []).length;
      if (n !== 1) problems.push(`${page.route}: ${label} 出现 ${n} 次（应为 1）`);
    }

    // 语言维度。这三项任一错了都不会让页面报错，只会让英文内容悄悄退回
    // 「中文页」的身份：html lang 不对，浏览器与搜索引擎都判错语言；
    // hreflang 缺失，中英文被当成两份互不相干的页面；canonical 指错，
    // 等于把自己的权重送给了另一个地址。
    const expectedLang = langMeta(page.lang).htmlLang;

    if (!html.includes(`<html lang="${expectedLang}"`)) {
      problems.push(`${label}: html lang 不是 ${expectedLang}`);
    }

    const expectedCanonical = `${SITE_URL}${page.prefix || ''}${page.route ? `/${page.route}` : ''}/`;
    const canonical = /rel="canonical" href="([^"]+)"/.exec(html)?.[1];

    if (canonical !== expectedCanonical) {
      problems.push(`${label}: canonical 指向 ${canonical ?? '(缺失)'}（应为 ${expectedCanonical}）`);
    }

    for (const alt of page.alternates || []) {
      if (!html.includes(`hreflang="${alt.hreflang}" href="${alt.href}"`)) {
        problems.push(`${label}: 缺少 hreflang=${alt.hreflang} → ${alt.href}`);
      }
    }

    const hreflangCount = (html.match(/rel="alternate" hreflang="/g) || []).length;

    if (hreflangCount !== (page.alternates || []).length) {
      problems.push(
        `${label}: hreflang ${hreflangCount} 条（应为 ${(page.alternates || []).length}）`
      );
    }

    // 骨架的对照面：正文必须真的被藏起来。这条规则要是在 SSG_CSS 里被误删，页面上
    // 不会报任何错、构建照样绿，只是用户又看到「另一个样子的正文」闪一下再被换掉 ——
    // 正是本次要修的那个观感。所以把它当成契约守在这里。
    // 用正则而不是整串 includes：那条规则是三段选择器的逗号列表，改行/加选择器都属正常
    // 维护，不该把守卫弄红。这里只认「.ssg-pending 后面某个块里声明了 hidden」。
    if (!/\.ssg-pending[^{}]*\{[^}]*visibility:hidden/.test(html)) {
      problems.push(`${label}: 内联首屏样式里没有「正文先隐藏」的规则（.ssg-pending）`);
    }
  }

  // 404 兜壳不进 pages，单独校验：必须幂等且只留 noindex（不能混入 canonical/JSON-LD，
  // 否则搜索引擎会把未知路径当成正常页面收录）。
  const notFoundPath = path.join(OUT_DIR, '404.html');

  if (fs.existsSync(notFoundPath)) {
    const html = fs.readFileSync(notFoundPath, 'utf8');
    const robots = (html.match(/name="robots"/g) || []).length;
    const title = (html.match(/<title>/g) || []).length;

    if (robots !== 1) problems.push(`404.html: noindex 出现 ${robots} 次（应为 1）`);
    if (title !== 1) problems.push(`404.html: <title> 出现 ${title} 次（应为 1）`);
    if (/rel="canonical"/.test(html)) problems.push('404.html: 不应出现 canonical');
    if (/application\/ld\+json/.test(html)) problems.push('404.html: 不应出现 JSON-LD');
    // 404 是空壳，没有预渲染正文 —— 也就不该有骨架，否则页面会永远空转在一屏灰条上。
    if (/ssg-skel/.test(html)) problems.push('404.html: 不应出现首屏骨架');
  }

  // image sitemap 自检。声明了却抓不到的图，搜索引擎会直接把它从图片索引里剔除 ——
  // 而这类问题在构建日志里同样完全看不出来，必须在这里拦住。
  const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');

  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const locs = [...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);

    // 覆盖率自检：sitemap 的 URL 集合必须与预渲染出来的页面集合严格相等。
    // 少一条 = 有页面搜不到入口；多一条 = 声明了打不开的地址（搜索引擎会记一笔软 404）。
    // 这两类问题在构建日志里都看不见，而「漏页」恰恰是新增文档后最容易犯的错。
    const xmlUrls = new Set([...xml.matchAll(/<url><loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    const distUrls = new Set([
      `${SITE_URL}/`,
      ...walkIndexHtml(OUT_DIR).map((rel) => `${SITE_URL}/${rel}/`),
    ]);

    for (const url of distUrls) {
      if (!xmlUrls.has(url)) problems.push(`sitemap: 缺少已生成的页面 ${url}`);
    }

    for (const url of xmlUrls) {
      if (!distUrls.has(url)) problems.push(`sitemap: 声明了没有产物的页面 ${url}`);
    }

    // lastmod 必须逐条存在：没有它，搜索引擎没有「这页变过」的依据。
    for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(block[1])) {
        const pageUrl = /<loc>([^<]+)<\/loc>/.exec(block[1])?.[1] ?? '?';
        problems.push(`sitemap: ${pageUrl} 缺少 lastmod`);
      }
    }

    if (locs.length === 0) {
      problems.push('sitemap: 一张图片都没声明 —— 图片收集逻辑失效了');
    }

    // 注意：同一张图出现在多个页面上是**合法**的（image sitemap 的语义是
    // 「这张图出现在这个页面上」），所以跨页重复不该报错。要查的是同一页内重复声明。
    for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const inner = [...block[1].matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);

      if (new Set(inner).size !== inner.length) {
        const pageUrl = /<loc>([^<]+)<\/loc>/.exec(block[1])?.[1] ?? '?';
        problems.push(`sitemap: ${pageUrl} 同一页内重复声明了同一张图`);
      }
    }

    for (const loc of new Set(locs)) {
      if (!loc.startsWith(`${SITE_URL}/`)) {
        problems.push(`sitemap: image:loc 不在本站域名下 ${loc}`);
        continue;
      }

      if (!existsInDist(loc.slice(SITE_URL.length))) {
        problems.push(`sitemap: image:loc 指向不存在的文件 ${loc}`);
      }
    }
  }

  return problems;
}

// ----------------------------------------------------------------------

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    throw new Error(`产物目录 ${OUT_DIR} 不存在：请先跑 vite build`);
  }

  const tmpl = readTemplate();

  if (!tmpl.headTags.some((t) => t.startsWith('<script'))) {
    throw new Error(
      `在 ${path.join(OUT_DIR, 'index.html')} 里没找到 vite 的入口 <script type="module">：` +
        '产物可能已被破坏（或 index.html 被别的东西覆盖），请重新跑 vite build'
    );
  }

  // 先按语言各收一遍：hreflang 需要知道「同一个路由有哪些语言版本」，
  // 两边都读完才渲染，否则先渲染的那一边写不出互指。
  const pagesByLang = new Map(LANGS.map((l) => [l.code, collectPages(l.code)]));
  const routeLangs = new Map();

  for (const [code, list] of pagesByLang) {
    for (const page of list) {
      if (!routeLangs.has(page.route)) routeLangs.set(page.route, new Set());
      routeLangs.get(page.route).add(code);
    }
  }

  console.log(`[ssg] base="${BASE}"  site=${SITE_URL}  语言=${LANGS.map((l) => l.code).join('/')}`);

  // 只有单语版本的路由不会有 hreflang 互指（也没法有）。目前两边 272 对完全对齐，
  // 这里只告警不失败 —— 但一旦出现，说明某个语言漏了翻译，值得在构建日志里看见。
  // 首页不在其中：它没有 markdown 源文件，路由表里根本不会出现，互指由 homePages 显式给出。
  const singleLang = [...routeLangs.entries()]
    .filter(([route, set]) => route !== '' && set.size < LANGS.length)
    .map(([route]) => route);

  if (singleLang.length) {
    console.warn(`  ! ${singleLang.length} 个路由只有单语版本，不会有 hreflang 互指：`);
    for (const route of singleLang.slice(0, 10)) console.warn(`    - ${route || '(首页)'}`);
  }

  let written = 0;
  const allPages = [];

  for (const langInfo of LANGS) {
    const pages = pagesByLang.get(langInfo.code);
    const childrenByRoute = buildChildrenIndex(pages);

    console.log(
      `[ssg] ${langInfo.code}: ${pages.length} 页${langInfo.prefix ? `（前缀 ${langInfo.prefix}）` : ''}`
    );

    for (const page of pages) {
      page.prefix = langInfo.prefix;
      page.alternates = alternatesFor(page.route, routeLangs);

      const html = renderPage(page, tmpl, childrenByRoute, routeLangs);
      const target = path.join(
        OUT_DIR,
        langInfo.prefix.replace(/^\//, ''),
        page.route,
        'index.html'
      );

      writeFile(target, html);
      // 顺手收集本页图片供 image sitemap 用：复用刚渲染出的 HTML，避免为了取图再解析一遍 markdown
      page.images = extractPageImages(html);
      written += 1;
    }

    allPages.push(...pages);
  }

  // 首页：正文由 buildHomeMarkdown 生成，与 React 首页的可见内容对应。
  // lastmod 取全站最新一页的 updated —— 首页聚合的是全站入口，有内容更新它就该算变过；
  // 退一步用构建日期，也比完全没有 lastmod 强。
  const latestUpdated = allPages.reduce(
    (acc, p) => (p.updated && p.updated > acc ? p.updated : acc),
    ''
  );

  /**
   * 首页在两种语言下各是一个真实页面：中文 `/`、英文 `/en`。
   * 两者内容对等（同一套版式、同一批入口、各自完整翻译），因此互相声明 hreflang，
   * x-default 给中文 —— 这才是「同一页的两种语言」，不是硬凑的配对。
   */
  const homePages = LANGS.map((langInfo) => {
    const copy = HOME_COPY[langInfo.code];

    return {
      lang: langInfo.code,
      prefix: langInfo.prefix,
      route: '',
      segs: [],
      isIndex: false,
      title: copy.meta.title,
      description: copy.meta.description,
      content: buildHomeMarkdown(langInfo.code),
      updated: latestUpdated || BUILD_DATE,
      alternates: [
        { hreflang: 'zh-CN', href: `${SITE_URL}/` },
        { hreflang: 'en', href: `${SITE_URL}/en/` },
        { hreflang: 'x-default', href: `${SITE_URL}/` },
      ],
    };
  });

  for (const homePage of homePages) {
    const homeHtml = renderPage(
      homePage,
      tmpl,
      buildChildrenIndex(pagesByLang.get(homePage.lang)),
      routeLangs
    );

    writeFile(
      path.join(OUT_DIR, homePage.prefix.replace(/^\//, ''), 'index.html'),
      homeHtml
    );
    homePage.images = extractPageImages(homeHtml);
    written += 1;
  }

  // 未知路径走 404.html（GitHub Pages 只把「没有对应文件」的请求交给它，由 vite.config.ts
  // 的插件从 index.html 拷出）。这里整份重新生成，保证重复构建结果一致。
  const notFoundPath = path.join(OUT_DIR, '404.html');

  if (fs.existsSync(notFoundPath)) {
    writeFile(notFoundPath, renderNotFound(tmpl));
  }

  // 首页也要进 sitemap —— 它是最重要的入口，而 pages 只来自 markdown 文件，
  // 根路径一直缺席。sitemapEntries 同时作为自检的输入，首页因此也会被检查链接。
  const sitemapEntries = [...homePages, ...allPages];

  writeFile(path.join(OUT_DIR, 'sitemap.xml'), buildSitemap(sitemapEntries));
  // 首屏样式已经内联进每个页面的 head，这个文件眼下没人引用，留着是为了**过渡期**：
  // 老访问者手里可能还捏着引用它的旧 HTML 缓存，删掉会让那种页面渲染成无样式的裸壳。
  // 只写产物目录：SSG 永远在 vite build 之后运行，dist/assets 已经存在，不需要再往
  // public/ 放一份（那会变成两个真源）。robots.txt 相反 —— 它走 public/，因为两条
  // 部署链都会经过 vite build 的 public 拷贝。
  writeFile(path.join(OUT_DIR, 'assets/ssg.css'), SSG_CSS);

  console.log(
    `[ssg] 生成 ${written} 个页面 + sitemap.xml（${sitemapEntries.length} 条，含首页），首屏样式与配色引导已内联进 head`
  );

  const problems = selfCheck(sitemapEntries);

  if (problems.length) {
    console.error(`[ssg] 自检失败，共 ${problems.length} 处：`);
    for (const line of problems.slice(0, 30)) console.error(`  - ${line}`);
    if (problems.length > 30) console.error(`  ...（其余 ${problems.length - 30} 处已省略）`);
    process.exit(1);
  }

  console.log(
    `[ssg] 自检通过：${sitemapEntries.length} 页的标题/摘要齐全，站内链接与图片均指向存在的文件`
  );
}

main();
