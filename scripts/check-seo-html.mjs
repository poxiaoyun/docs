#!/usr/bin/env node
/**
 * 检查生成后的 HTML，不读 Markdown 源码。
 *
 * 与 scripts/ssg.mjs 使用同一组环境变量：
 *   SSG_OUT、SSG_SITE_URL、VITE_BASE_URL
 *
 * 两类失败分开计数：
 *   covered:   本轮覆盖的首页、产品概述、术语表、公共导航，以及本轮新增的外链 / 状态句
 *   structure: 全站 canonical、hreflang 互指、publisher、base 前缀
 *
 * 缺翻译的路由不得写出对应语言的 hreflang。canonical 指向权威站点，不带容器 /docs 前缀。
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PUBLISHER_NAME = '成都破晓石科技有限公司';
const PUBLISHER_URL = 'https://www.poxiaoshi.cn/';

const PRODUCT_LINKS = [
  'https://www.poxiaoshi.cn/products/rune/',
  'https://www.poxiaoshi.cn/products/moha/',
  'https://www.poxiaoshi.cn/products/ai-router/',
  'https://www.poxiaoshi.cn/products/boss/',
  'https://www.poxiaoshi.cn/contact/',
];

const ALLOWED_OFFSITE = new Set([
  ...PRODUCT_LINKS,
  'https://www.poxiaoshi.cn/',
  'https://www.poxiaoshi.cn/about/',
]);

const COVERED = ['', 'en', 'introduction', 'en/introduction', 'guide/glossary', 'en/guide/glossary'];

const CN_STATUS = ['本版本文档没有 XCMP 的操作说明', 'Rune Harness 仍是规划，不是已交付功能'];
const EN_STATUS = ['This version has no XCMP operator guide', 'Rune Harness is still planned, not a shipped feature'];

function walkIndex(dir, rel = '') {
  const out = [];

  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const next = rel ? `${rel}/${name}` : name;

    if (fs.statSync(abs).isDirectory()) out.push(...walkIndex(abs, next));
    else if (name === 'index.html') out.push(next);
  }

  return out;
}

function toPublic(rel) {
  return rel.replace(/\/index\.html$/, '').replace(/^index\.html$/, '');
}

function zhPublic(publicPath) {
  if (publicPath === 'en') return '';
  if (publicPath.startsWith('en/')) return publicPath.slice(3);
  return publicPath;
}

function isEnglish(publicPath) {
  return publicPath === 'en' || publicPath.startsWith('en/');
}

function headerHtml(html) {
  const matched = html.match(/<header class="ssg-header">([\s\S]*?)<\/header>/);
  return matched ? matched[1] : '';
}

export function checkSeoHtml({ outDir, siteUrl, base }) {
  const site = siteUrl.replace(/\/+$/, '');
  const basePath = !base || base === '/' ? '' : String(base).replace(/\/+$/, '');
  const problems = [];

  if (!fs.existsSync(outDir)) {
    return [`structure: 产物目录不存在 ${outDir}`];
  }

  const files = walkIndex(outDir);
  const byPublic = new Map(files.map((rel) => [toPublic(rel), rel]));

  const canonicalOf = (publicPath) => (publicPath ? `${site}/${publicPath}/` : `${site}/`);

  const pageMeta = new Map();

  for (const [publicPath, rel] of byPublic) {
    const html = fs.readFileSync(path.join(outDir, rel), 'utf8');
    const label = publicPath || '/';
    const expectedCanonical = canonicalOf(publicPath);
    const canonicals = [...html.matchAll(/rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);

    if (canonicals.length !== 1) {
      problems.push(`structure: ${label} canonical ${canonicals.length} 条（应为 1）`);
    } else if (canonicals[0] !== expectedCanonical) {
      problems.push(`structure: ${label} canonical ${canonicals[0]} ≠ ${expectedCanonical}`);
    }

    if (canonicals[0]) {
      let pathname = canonicals[0];
      try {
        pathname = new URL(canonicals[0]).pathname;
      } catch {
        pathname = canonicals[0];
      }
      // 只看路径。主机名 docs.poxiaoshi.cn 里的 docs 不是容器前缀。
      if (pathname === '/docs' || pathname.startsWith('/docs/')) {
        problems.push(`structure: ${label} canonical 含容器前缀 /docs`);
      }
    }

    const alternates = [...html.matchAll(/rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(
      (m) => ({ lang: m[1], href: m[2] })
    );
    const langs = new Set(alternates.map((alt) => alt.lang));
    const zhKey = zhPublic(publicPath);
    const enKey = zhKey ? `en/${zhKey}` : 'en';

    if (!byPublic.has(zhKey) && langs.has('zh-CN')) {
      problems.push(`covered: ${label} 写了 zh-CN hreflang，但没有中文页`);
    }

    if (!byPublic.has(enKey) && langs.has('en')) {
      problems.push(`covered: ${label} 写了 en hreflang，但没有英文页`);
    }

    if (byPublic.has(zhKey) && byPublic.has(enKey)) {
      for (const code of ['zh-CN', 'en', 'x-default']) {
        if (!langs.has(code)) problems.push(`structure: ${label} 双语页缺少 hreflang=${code}`);
      }
    }

    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
      (m) => m[1]
    );

    if (scripts.length !== 1) {
      problems.push(`structure: ${label} JSON-LD ${scripts.length} 份（应为 1）`);
    } else {
      try {
        const data = JSON.parse(scripts[0]);
        const publisher = data.publisher;

        if (
          !publisher ||
          publisher['@type'] !== 'Organization' ||
          publisher.name !== PUBLISHER_NAME ||
          publisher.url !== PUBLISHER_URL
        ) {
          problems.push(`structure: ${label} publisher 不是 ${PUBLISHER_NAME} ${PUBLISHER_URL}`);
        }

        const encoded = JSON.stringify(data);

        if (encoded.includes('"@type":"Product"') || encoded.includes('"@type":"Offer"')) {
          problems.push(`covered: ${label} JSON-LD 出现 Product 或 Offer`);
        }
      } catch {
        problems.push(`structure: ${label} JSON-LD 无法解析`);
      }
    }

    if (/utm_/i.test(html)) problems.push(`covered: ${label} 出现 utm 参数`);

    pageMeta.set(publicPath, { html, alternates });
  }

  for (const [publicPath, meta] of pageMeta) {
    const label = publicPath || '/';
    const self = canonicalOf(publicPath);
    const zhKey = zhPublic(publicPath);
    const xDefault = meta.alternates.find((alt) => alt.lang === 'x-default');
    const expectedDefault = byPublic.has(zhKey) ? canonicalOf(zhKey) : self;

    if (!xDefault || xDefault.href !== expectedDefault) {
      problems.push(`structure: ${label} x-default 应为 ${expectedDefault}`);
    }

    for (const alt of meta.alternates) {
      if (alt.lang === 'x-default') continue;
      if (!alt.href.startsWith(`${site}/`) && alt.href !== `${site}/`) {
        problems.push(`structure: ${label} hreflang ${alt.lang} 离开本站 ${alt.href}`);
        continue;
      }

      const target = [...byPublic.keys()].find((key) => canonicalOf(key) === alt.href);

      if (!target && target !== '') {
        problems.push(`structure: ${label} hreflang ${alt.lang} 指向没有产物的 ${alt.href}`);
        continue;
      }

      const backLang = isEnglish(publicPath) ? 'en' : 'zh-CN';
      const pointed = pageMeta.get(target)?.alternates.find((item) => item.lang === backLang);

      if (!pointed || pointed.href !== self) {
        problems.push(`structure: ${label} 与 ${target || '/'} 的 hreflang 不互指`);
      }
    }
  }

  function requireIn(publicPath, needles) {
    const html = pageMeta.get(publicPath)?.html;

    if (!html) {
      problems.push(`covered: 缺少页面 ${publicPath || '/'}`);
      return;
    }

    for (const needle of needles) {
      if (!html.includes(needle)) problems.push(`covered: ${publicPath || '/'} 缺少「${needle}」`);
    }
  }

  for (const publicPath of COVERED) {
    requireIn(
      publicPath,
      PRODUCT_LINKS.map((href) => `href="${href}"`)
    );
  }

  for (const publicPath of ['', 'introduction', 'guide/glossary']) requireIn(publicPath, CN_STATUS);
  for (const publicPath of ['en', 'en/introduction', 'en/guide/glossary']) requireIn(publicPath, EN_STATUS);

  for (const publicPath of ['', 'en']) {
    const html = pageMeta.get(publicPath)?.html || '';

    for (const name of ['Rune', 'Moha', 'AIRouter', 'BOSS']) {
      if (!html.includes('"@type":"DefinedTerm"') || !html.includes(`"name":"${name}"`)) {
        problems.push(`covered: ${publicPath || '/'} JSON-LD 缺少 DefinedTerm ${name}`);
      }
    }

    if (html.includes('50+') || html.includes('24/7')) {
      problems.push(`covered: ${publicPath || '/'} 仍有未证实的 50+ 或 24/7`);
    }

    for (const name of ['XCMP', 'Rune Harness']) {
      if (!html.includes(`"name":"${name}"`)) {
        problems.push(`covered: ${publicPath || '/'} JSON-LD 未标明 ${name} 的状态`);
      }
    }
  }

  for (const publicPath of COVERED) {
    const html = pageMeta.get(publicPath)?.html || '';

    for (const match of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/g)) {
      const href = match[1];
      const clean = href.split('#')[0].split('?')[0];

      if (href.includes('?')) problems.push(`covered: ${publicPath || '/'} 外链带查询参数 ${href}`);
      if (!clean.startsWith(`${site}/`) && clean !== `${site}/` && !ALLOWED_OFFSITE.has(clean)) {
        problems.push(`covered: ${publicPath || '/'} 外链未核验 ${href}`);
      }
    }
  }

  const cnHeader = headerHtml(pageMeta.get('')?.html || '');
  const enHeader = headerHtml(pageMeta.get('en')?.html || '');

  for (const label of ['魔哈仓库', 'Rune 智算平台', '聚合网关', 'BOSS 运营平台']) {
    if (!cnHeader.includes(label)) problems.push(`covered: 中文顶栏缺少 ${label}`);
  }

  for (const label of ['Moha', 'Rune', 'AIRouter', 'BOSS']) {
    if (!enHeader.includes(`>${label}</span>`)) problems.push(`covered: 英文顶栏缺少 ${label}`);
  }

  if (/AIrouter|Boss Operations|Rune AI Platform/.test(enHeader)) {
    problems.push('covered: 英文顶栏仍使用旧产品名');
  }

  const home = pageMeta.get('')?.html || '';
  const runeHref = `${basePath}/rune`;

  if (!home.includes(`href="${runeHref}"`) && !home.includes(`href="${runeHref}/"`)) {
    problems.push(`structure: 首页站内链接未按 base=${basePath || '/'} 生成（期望 ${runeHref}）`);
  }

  if (!basePath && /(?:href|src)="\/docs\//.test(home)) {
    problems.push('structure: base=/ 的首页仍引用 /docs 前缀');
  }

  if (basePath === '/docs' && !/(?:href|src)="\/docs\//.test(home)) {
    problems.push('structure: base=/docs 的首页没有 /docs 前缀');
  }

  return problems;
}

function main() {
  const outDir = path.resolve(process.env.SSG_OUT || 'dist');
  const siteUrl = process.env.SSG_SITE_URL || 'https://docs.poxiaoshi.cn';
  const base = process.env.VITE_BASE_URL ?? '/docs';
  const problems = checkSeoHtml({ outDir, siteUrl, base });

  if (problems.length) {
    const round = problems.filter((line) => line.startsWith('covered:'));
    const structure = problems.filter((line) => line.startsWith('structure:'));
    console.error(
      `[seo] 失败 ${problems.length} 处（本轮覆盖 ${round.length}，全站结构 ${structure.length}）`
    );
    for (const line of problems.slice(0, 40)) console.error(`  - ${line}`);
    process.exit(1);
  }

  console.log(`[seo] 通过。产物 ${outDir}，base=${base || '/'}，site=${siteUrl}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
