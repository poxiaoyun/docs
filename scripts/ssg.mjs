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
 *   SSG_LANG      用哪个语言目录的正文来静态化（默认 cn；cn/en 共用同一套 URL，
 *                 语言在运行时由 localStorage 决定，故只能索引默认语言）
 *   VITE_BASE_URL 与 vite.config.ts 保持一致，用于给站内链接补 base（默认 /docs）
 *   SSG_OUT       产物目录（默认 dist）
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
const LANG = process.env.SSG_LANG || 'cn';

const SITE_URL = (process.env.SSG_SITE_URL || 'https://docs.poxiaoshi.cn').replace(/\/+$/, '');
// 与 vite.config.ts 的 DOCS_BASE_URL 同源：容器部署是 /docs，Pages 是 ""。
const RAW_BASE = process.env.VITE_BASE_URL ?? '/docs';
const BASE = RAW_BASE === '/' ? '' : RAW_BASE.replace(/\/+$/, '');

const SITE = readSiteConfig();
const SITE_NAME = SITE.name;
const SITE_URL_LANG = LANG === 'en' ? 'en' : 'zh-CN';

function readSiteConfig() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/global-config.json'), 'utf8'));
    return { name: cfg.title || 'RUNE', subtitle: cfg.subTitle || '' };
  } catch {
    return { name: 'RUNE', subtitle: '' };
  }
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

/** 站内链接 -> 带 base 的绝对路径（保留尾斜杠，避免 GitHub Pages 多一次 301）。 */
function toSiteHref(href, pageSegs, isIndex) {
  if (!href) return href;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(href)) return href; // 外链
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;

  const [hashPart, pathPart] = splitHash(href);

  // 已经是绝对路径（含 /assets/...），只补 base
  if (pathPart.startsWith('/')) {
    return `${BASE}${pathPart}${hashPart}`;
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

  return `${BASE}/${parts.join('/')}/${hashPart}`;
}

/** 图片 src：/assets/... 要补 base，其余原样。 */
function toAssetSrc(src) {
  if (!src) return src;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(src) || src.startsWith('data:')) return src;
  if (src.startsWith('/')) return `${BASE}${src}`;
  return src;
}

function rewriteLinks({ pageSegs, isIndex }) {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties;
      if (!props) return;

      if (node.tagName === 'a' && typeof props.href === 'string') {
        props.href = toSiteHref(props.href, pageSegs, isIndex);
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

function renderMarkdown(markdown, pageSegs, isIndex) {
  // 先把 markdown 完整走成 hast（remark-parse → remark-rehype → rehype-raw → rehype-slug），
  // 再单独跑一遍链接改写。两个坑：
  //   1. rewriteLinks 的参数逐页不同，不能挂到共用的 baseProcessor 上；
  //   2. 必须走完 remarkRehype/rehypeRaw 才拿得到 hast —— 只 parse 得到的是 mdast，
  //      直接序列化会把标题/列表/表格/强调等结构节点全丢掉，只剩纯文字。
  const hast = baseProcessor.runSync(baseProcessor.parse(markdown));
  const linked = unified().use(rewriteLinks, { pageSegs, isIndex }).runSync(hast);

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

function collectPages() {
  const langDir = path.join(CONTENT_DIR, LANG);
  const pages = [];

  for (const rel of walkMarkdown(langDir)) {
    const route = routeFromRelativePath(rel.split(path.sep).join('/'));
    const raw = fs.readFileSync(path.join(langDir, rel), 'utf8');
    const { content, data } = matter(raw);

    pages.push({
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

  return { html, headTags: extractAssetTags(html) };
}

function breadcrumb(route, title) {
  const segments = route ? route.split('/') : [];
  const items = [{ name: '文档首页', url: `${SITE_URL}/` }];
  let acc = '';

  for (const seg of segments) {
    acc += `/${seg}`;
    items.push({ name: seg, url: `${SITE_URL}${acc}/` });
  }

  if (items.length > 1) items[items.length - 1].name = title;

  return items;
}

function renderPage(page, tmpl, childrenByRoute) {
  const { route, title, description, updated, content, segs, isIndex } = page;
  const url = `${SITE_URL}${route ? `/${route}` : ''}/`;
  // 根路径展示的是 introduction 的内容，canonical 指到它的正式位置，避免重复内容
  const canonical = route === '' ? `${SITE_URL}/introduction/` : url;

  // 首页用「站点名 + 定位」而不是「产品概述 | RUNE」：首页是品牌词与站点级检索的落点，
  // 其余页面沿用「页面标题 | 站点名」，与运行时 <Helmet> 的设置保持一致。
  const siteLevelTitle = SITE.subtitle ? `${SITE_NAME} 文档 · ${SITE.subtitle}` : `${SITE_NAME} 文档`;
  const pageTitle = route !== '' && title ? `${title} | ${SITE_NAME}` : siteLevelTitle;
  const body = renderMarkdown(content, segs, isIndex);

  const children = childrenByRoute.get(route) || [];
  const childrenHtml = children.length
    ? `<section class="ssg-children"><h2>本节包含 ${children.length} 个页面</h2><ul>${children
        .map((c) => `<li><a href="${BASE}/${c.route}/">${escapeHtml(c.title || c.route)}</a></li>`)
        .join('')}</ul></section>`
    : '';

  const crumbs = breadcrumb(route, title || SITE_NAME);
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
    inLanguage: SITE_URL_LANG,
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
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
    `<meta property="og:locale" content="${SITE_URL_LANG === 'en' ? 'en_US' : 'zh_CN'}" />`,
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

  return `<!doctype html>
<html lang="${SITE_URL_LANG}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    ${meta}
    ${tmpl.headTags.join('\n    ')}
    <link rel="stylesheet" href="${BASE}/assets/ssg.css" />
  </head>

  <body>
    <div id="root"><div class="ssg">
      <nav class="ssg-crumb">${crumbHtml}</nav>
      <main class="ssg-card">
        <article>
${body}
        </article>
${childrenHtml}
      </main>
    </div></div>
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
<html lang="${SITE_URL_LANG}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
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

// ----------------------------------------------------------------------

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

function buildSitemap(pages) {
  const entries = pages
    .map((page) => {
      const url = `${SITE_URL}${page.route ? `/${page.route}` : ''}/`;
      const lastmod = page.updated ? `<lastmod>${page.updated}</lastmod>` : '';
      return `  <url><loc>${url}</loc>${lastmod}<changefreq>weekly</changefreq></url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

const SSG_CSS = `/* 静态预渲染首屏样式：仅作用于 .ssg，React 接管后随静态内容一起失效 */
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
`;

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
    if (!page.title) problems.push(`${page.route}: frontmatter 缺 title`);
    if (!page.description) problems.push(`${page.route}: frontmatter 缺 description`);

    const html = fs.readFileSync(path.join(OUT_DIR, page.route, 'index.html'), 'utf8');

    for (const [, href] of html.matchAll(/<(?:a|img)\b[^>]*(?:href|src)="(\/[^"]*)"/g)) {
      if (!existsInDist(href)) problems.push(`${page.route}: 死链 ${href}`);
    }

    // 幂等性：这几个标签每页有且只能有一份。SSG 重复运行时曾把 canonical / favicon
    // 一层层叠上去（构建不报错、页面却越滚越脏），所以直接在构建期拦住。
    for (const [re, label] of [
      [/<title>/g, '<title>'],
      [/rel="canonical"/g, 'canonical'],
      [/name="description"/g, 'description'],
      [/rel="stylesheet" href="[^"]*ssg\.css"/g, 'ssg.css'],
    ]) {
      const n = (html.match(re) || []).length;
      if (n !== 1) problems.push(`${page.route}: ${label} 出现 ${n} 次（应为 1）`);
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

  const pages = collectPages();
  const childrenByRoute = buildChildrenIndex(pages);

  console.log(`[ssg] 语言=${LANG}  base="${BASE}"  site=${SITE_URL}`);
  console.log(`[ssg] 路由 ${pages.length} 个`);

  let written = 0;

  for (const page of pages) {
    const target = path.join(OUT_DIR, page.route, 'index.html');
    writeFile(target, renderPage(page, tmpl, childrenByRoute));
    written += 1;
  }

  // 根路径与 /introduction 内容相同，单独写一份（复用 introduction 的正文）
  const intro = pages.find((p) => p.route === 'introduction');

  if (intro) {
    writeFile(
      path.join(OUT_DIR, 'index.html'),
      renderPage({ ...intro, route: '' }, tmpl, childrenByRoute)
    );
    written += 1;
  }

  // 未知路径走 404.html（GitHub Pages 只把「没有对应文件」的请求交给它，由 vite.config.ts
  // 的插件从 index.html 拷出）。这里整份重新生成，保证重复构建结果一致。
  const notFoundPath = path.join(OUT_DIR, '404.html');

  if (fs.existsSync(notFoundPath)) {
    writeFile(notFoundPath, renderNotFound(tmpl));
  }

  writeFile(path.join(OUT_DIR, 'sitemap.xml'), buildSitemap(pages));
  // 只写产物目录：SSG 永远在 vite build 之后运行，dist/assets 已经存在，
  // 不需要再往 public/ 放一份（那会变成两个真源）。robots.txt 相反 —— 它走 public/，
  // 因为两条部署链都会经过 vite build 的 public 拷贝。
  writeFile(path.join(OUT_DIR, 'assets/ssg.css'), SSG_CSS);

  console.log(`[ssg] 生成 ${written} 个页面 + sitemap.xml（${pages.length} 条）+ assets/ssg.css`);

  const problems = selfCheck(pages);

  if (problems.length) {
    console.error(`[ssg] 自检失败，共 ${problems.length} 处：`);
    for (const line of problems.slice(0, 30)) console.error(`  - ${line}`);
    if (problems.length > 30) console.error(`  ...（其余 ${problems.length - 30} 处已省略）`);
    process.exit(1);
  }

  console.log(`[ssg] 自检通过：${pages.length} 页的标题/摘要齐全，站内链接与图片均指向存在的文件`);
}

main();
