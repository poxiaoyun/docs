#!/usr/bin/env node
/**
 * diff-console.mjs — 列出「锚点 .. 最新 origin/main」之间 XiaoShi-Rune-Console 的全部变更，
 * 并按「对文档站的影响面」分类（must / maybe / none）。
 *
 * 用法：
 *   node scripts/diff-console.mjs                    # 人读的 Markdown 报告
 *   node scripts/diff-console.mjs --json             # 机器读的 JSON
 *   node scripts/diff-console.mjs --json --out /tmp/diff.json
 *   node scripts/diff-console.mjs --no-fetch         # 不联网，用本地已有的 origin/main
 *   node scripts/diff-console.mjs --fail-on-pending  # 有待评估提交时退出码 2（可挂 CI）
 *
 * 仓库定位顺序：--repo → $RUNE_CONSOLE_REPO → anchor.json 的 source.local_path_hint
 *             → ../rune/XiaoShi-Rune-Console → /tmp/rune-console-main（worktree）
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(HERE, '..');
// SKILL_DIR 是 <docs>/.workbuddy/skills/rune-docs-update，往上三层才是 docs 仓库根
const DOCS_ROOT = path.resolve(SKILL_DIR, '../../..');
const ANCHOR_FILE = path.join(SKILL_DIR, 'anchor.json');

// ---------------------------------------------------------------------------
// 分类规则：顺序敏感，先匹配先返回。
// verdict 三档：must（一定影响文档）/ maybe（要人判断）/ none（不用改文档）
// ---------------------------------------------------------------------------

const RULES = [
  // 测试、快照 —— 永远不影响文档
  { test: /(^|\/)__tests__\/|\.(test|spec)\.[cm]?[jt]sx?$/, area: 'test', verdict: 'none', docs: '—' },

  // 门户（独立应用，不是文档描述的对象）
  { test: /^apps\/portal\//, area: 'portal', verdict: 'none', docs: '门户首页，文档站不描述' },

  // 仓库自身的说明/规范/CI/部署
  { test: /^(README|AGENTS|DEVELOPMENT|DESIGN_SYSTEM|TESTING)\.md$/, area: 'repo-docs', verdict: 'none', docs: '—' },
  { test: /^(\.github|deploy|scripts|tests|public)\//, area: 'infra', verdict: 'none', docs: '—' },
  { test: /^(pnpm-lock\.yaml|package\.json|pnpm-workspace\.yaml|tsconfig\.json|eslint\.config\.mjs|prettier\.config\.mjs|Dockerfile|Makefile|nginx\.conf\.template)$/, area: 'infra', verdict: 'none', docs: '—' },

  // 账号中心（IAM 应用）—— 文档里同时在「BOSS / IAM」与「账号」两处分身
  { test: /^apps\/iam\//, area: 'iam', verdict: 'must', docs: '20.boss/01.iam/ + 05.account/' },

  // BOSS 运营面
  { test: /^apps\/boss\//, area: 'boss', verdict: 'must', docs: '20.boss/' },

  // 控制台：rune / moha / chatapp 三块
  { test: /^apps\/console\/src\/pages\/rune\//, area: 'console/rune', verdict: 'must', docs: '10.rune/03.console/' },
  { test: /^apps\/console\/src\/pages\/moha\//, area: 'console/moha', verdict: 'must', docs: '30.moha/' },
  { test: /^apps\/console\/src\/pages\/chatapp\//, area: 'console/chatapp', verdict: 'must', docs: '10.rune/03.console/（模型体验 / 应用市场）' },
  { test: /^apps\/console\/src\/(routes|app-config|bootstrap)\//, area: 'console/shell', verdict: 'maybe', docs: '入门与导航类页面（guide/console 总览）' },

  // 共享层：路由与文案直接决定菜单名、URL 与跳转，文档受影响面最大
  { test: /^packages\/shared\/src\/routes\//, area: 'shared/routes', verdict: 'must', docs: '全站：toc.ts / toc.tsx / URL 与跳转' },
  { test: /^packages\/shared\/src\/locales\//, area: 'shared/locales', verdict: 'must', docs: '菜单名与术语（guide/glossary 等）' },
  { test: /^packages\/shared\/src\/(business|layouts|components)\//, area: 'shared/ui', verdict: 'maybe', docs: '视具体页面（字段名、按钮文案）' },
  { test: /^packages\/shared\//, area: 'shared/other', verdict: 'maybe', docs: '视情况' },
  { test: /^packages\/(core|icon)\//, area: 'packages', verdict: 'maybe', docs: '视情况（多为通用交互）' },
];

const VERDICT_RANK = { none: 0, maybe: 1, must: 2 };
const VERDICT_LABEL = { must: '需同步', maybe: '待判断', none: '不改' };

function classify(file) {
  for (const rule of RULES) {
    if (rule.test.test(file)) return rule;
  }
  return { area: 'other', verdict: 'maybe', docs: '视情况' };
}

// ---------------------------------------------------------------------------
// 参数与仓库定位
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { json: false, fetch: true, failOnPending: false, out: null, repo: null, anchor: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--json') out.json = true;
    else if (a === '--no-fetch') out.fetch = false;
    else if (a === '--fail-on-pending') out.failOnPending = true;
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--repo') out.repo = argv[++i];
    else if (a === '--anchor') out.anchor = argv[++i];
    else if (a === '-h' || a === '--help') {
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]);
      process.exit(0);
    } else {
      throw new Error(`未知参数：${a}`);
    }
  }
  return out;
}

function readAnchor() {
  if (!fs.existsSync(ANCHOR_FILE)) throw new Error(`找不到锚点文件：${ANCHOR_FILE}`);
  return JSON.parse(fs.readFileSync(ANCHOR_FILE, 'utf8'));
}

function git(repo, args, { allowFail = false } = {}) {
  try {
    return execFileSync('git', ['-C', repo, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
    }).trim();
  } catch (err) {
    if (allowFail) return null;
    throw new Error(`git ${args.join(' ')} 失败：${err.stderr?.toString().trim() || err.message}`);
  }
}

function resolveRepo(anchor, override) {
  const candidates = [
    override,
    process.env.RUNE_CONSOLE_REPO,
    anchor.source?.local_path_hint,
    path.resolve(DOCS_ROOT, '..', 'rune', 'XiaoShi-Rune-Console'),
    '/tmp/rune-console-main',
  ].filter(Boolean);

  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue;
    if (git(dir, ['rev-parse', '--is-inside-work-tree'], { allowFail: true }) !== 'true') continue;
    return fs.realpathSync(dir);
  }
  throw new Error(
    `找不到 XiaoShi-Rune-Console 仓库。已尝试：\n  ${candidates.join('\n  ')}\n用 --repo <path> 或 $RUNE_CONSOLE_REPO 指定。`
  );
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv.slice(2));
  const anchor = readAnchor();
  const repo = resolveRepo(anchor, args.repo);

  const anchorSha = args.anchor || anchor.anchor?.commit;
  if (!anchorSha) throw new Error('anchor.json 里没有 anchor.commit');

  const hasAnchor = git(repo, ['rev-parse', '--verify', '--quiet', `${anchorSha}^{commit}`], {
    allowFail: true,
  });
  if (!hasAnchor) {
    throw new Error(
      `锚点提交 ${anchorSha} 在 ${repo} 里不存在。浅克隆会导致这个问题：先 git fetch --unshallow。`
    );
  }

  if (args.fetch) {
    const fetched = git(repo, ['fetch', '--quiet', 'origin', anchor.source?.branch || 'main'], { allowFail: true });
    if (fetched === null) console.error('⚠️  fetch 失败（离线？），改用本地已有的 origin/main。');
  }

  const branchRef = `origin/${anchor.source?.branch || 'main'}`;
  const head = git(repo, ['rev-parse', branchRef]);
  const headInfo = describeCommit(repo, head);

  const diverged = git(repo, ['merge-base', '--is-ancestor', anchorSha, head], { allowFail: true }) === null;
  if (diverged) {
    console.error(
      `⚠️  锚点 ${anchorSha.slice(0, 8)} 不是 ${branchRef} 的祖先（force push 或锚点写错？）。\n` +
        '    下面的 diff 仍按「head 可达且锚点不可达」计算，请人工确认范围。'
    );
  }

  const skipSet = new Set((anchor.skip || []).map((s) => s.commit).filter(Boolean));

  const raw = git(repo, [
    'log',
    '--reverse',
    '--format=%H%x1f%ad%x1f%s',
    '--date=iso-strict',
    `${anchorSha}..${head}`,
  ]);
  const lines = raw ? raw.split('\n').filter(Boolean) : [];

  const commits = [];
  const skipped = [];

  for (const line of lines) {
    const [sha, date, subject] = line.split('\x1f');
    if (skipSet.has(sha)) {
      skipped.push({ sha, short: sha.slice(0, 8), date, subject });
      continue;
    }

    const files = changedFiles(repo, sha);
    const classified = files.map((f) => {
      const rule = classify(f.path);
      return { ...f, area: rule.area, verdict: rule.verdict, docs: rule.docs };
    });

    // 合并提交默认不展开 diff（内容已经由父提交体现），补一条说明避免看起来「什么都没改」
    if (!classified.length) {
      classified.push({
        status: '-',
        path: '(merge commit，内容见其父提交)',
        area: 'merge',
        verdict: 'none',
        docs: '—',
      });
    }

    const verdict = classified.reduce(
      (acc, f) => (VERDICT_RANK[f.verdict] > VERDICT_RANK[acc] ? f.verdict : acc),
      'none'
    );
    const areas = [...new Set(classified.map((f) => f.area))].filter((a) => a !== 'merge');
    const docsHints = [...new Set(classified.filter((f) => f.verdict !== 'none').map((f) => f.docs))];

    commits.push({
      sha,
      short: sha.slice(0, 8),
      date,
      subject,
      verdict,
      areas,
      docsHints,
      files: classified,
    });
  }

  const summary = {
    must: commits.filter((c) => c.verdict === 'must').length,
    maybe: commits.filter((c) => c.verdict === 'maybe').length,
    none: commits.filter((c) => c.verdict === 'none').length,
    files: commits.reduce((n, c) => n + c.files.filter((f) => f.status !== '-').length, 0),
  };

  const areas = new Map();
  for (const c of commits) {
    for (const f of c.files) {
      if (f.status === '-') continue;
      const key = f.area;
      const cur = areas.get(key) || { area: key, verdict: 'none', files: 0, docs: f.docs, commits: new Set() };
      cur.files += 1;
      cur.commits.add(c.short);
      if (VERDICT_RANK[f.verdict] > VERDICT_RANK[cur.verdict]) cur.verdict = f.verdict;
      areas.set(key, cur);
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    repo,
    branch: branchRef,
    anchor: { commit: anchorSha, ...describeCommit(repo, anchorSha) },
    head: headInfo,
    pending: commits.length,
    skipped: skipped.length,
    summary,
    commits,
    areas: [...areas.values()]
      .map((a) => ({ ...a, commits: [...a.commits] }))
      .sort((a, b) => VERDICT_RANK[b.verdict] - VERDICT_RANK[a.verdict] || b.files - a.files),
  };

  const text = args.json ? `${JSON.stringify(report, null, 2)}\n` : renderMarkdown(report);
  if (args.out) {
    fs.writeFileSync(args.out, text);
    console.log(`已写入 ${args.out}`);
  } else {
    process.stdout.write(text);
  }

  if (args.failOnPending && commits.length > 0) process.exit(2);
}

function describeCommit(repo, sha) {
  const rawLine = git(repo, ['log', '-1', '--format=%H%x1f%ad%x1f%s', '--date=iso-strict', sha]);
  const [commit, date, subject] = rawLine.split('\x1f');
  return { commit, short: commit.slice(0, 8), date, subject };
}

function changedFiles(repo, sha) {
  const raw = git(repo, ['show', '--name-status', '--format=', '-M', sha]);
  if (!raw) return [];
  return raw
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('\t');
      const code = parts[0];
      // R100 old new / C100 old new：取新路径
      const filePath = parts.length >= 3 ? parts[2] : parts[1];
      return { status: code.startsWith('R') ? 'R' : code.startsWith('C') ? 'C' : code, path: filePath };
    })
    .filter((f) => f.path);
}

function renderMarkdown(r) {
  const out = [];
  out.push('# Rune Console → docs 变更清单', '');
  out.push(`- 锚点：\`${r.anchor.short}\` ${r.anchor.date} — ${r.anchor.subject}`);
  out.push(`- 目标：\`${r.head.short}\` ${r.head.date} — ${r.head.subject}`);
  out.push(`- 待评估提交：**${r.pending}**（已记录跳过 ${r.skipped}）`);
  out.push(`- 结论分布：需同步 ${r.summary.must} / 待判断 ${r.summary.maybe} / 不改 ${r.summary.none}，共 ${r.summary.files} 个文件`);
  out.push('');

  if (r.pending === 0) {
    out.push('✅ 没有新提交，文档与代码一致，无需更新。');
    return `${out.join('\n')}\n`;
  }

  out.push('## 一、按区域概览', '');
  out.push('| 区域 | 提交 | 文件 | 结论 | 对应文档 |', '| --- | --- | --- | --- | --- |');
  for (const a of r.areas) {
    out.push(`| ${a.area} | ${a.commits.join(', ')} | ${a.files} | ${VERDICT_LABEL[a.verdict]} | ${a.docs} |`);
  }
  out.push('');

  out.push('## 二、提交明细', '');
  out.push('| # | 提交 | 日期 | 主题 | 区域 | 结论 |', '| --- | --- | --- | --- | --- | --- |');
  r.commits.forEach((c, i) => {
    out.push(
      `| ${i + 1} | \`${c.short}\` | ${c.date.slice(0, 16).replace('T', ' ')} | ${c.subject.replace(/\|/g, '\\|')} | ${c.areas.join(', ') || '—'} | ${VERDICT_LABEL[c.verdict]} |`
    );
  });
  out.push('');

  out.push('## 三、文件清单', '');
  for (const c of r.commits) {
    out.push(`### \`${c.short}\` ${c.subject}`, '');
    if (c.docsHints.length) out.push(`> 可能落在：${c.docsHints.join('；')}`, '');
    for (const f of c.files) {
      out.push(`- \`${f.status}\` **${f.area}**（${VERDICT_LABEL[f.verdict]}）\`${f.path}\``);
    }
    out.push('');
  }

  out.push('## 四、下一步', '');
  if (r.summary.must > 0) {
    out.push(`1. 逐个打开「需同步」的提交，读 \`$REPO\` 里的实际实现（不要只看提交标题）。`);
    out.push('2. 按 `references/mapping.md` 找到对应页面，`grep` 页面里的菜单名/字段名确认落点。');
    out.push('3. 中英成对修改，跑 Step 5 的五条校验。');
  } else {
    out.push('1. 没有「需同步」提交；若「待判断」也为空，本轮只需推进锚点（见 SKILL.md Step 7）。');
  }
  out.push('4. 发布后在同一个 PR（或紧随的 PR）里 `bump-anchor.mjs`，把锚点推到最新 main。');
  out.push('');

  return `${out.join('\n')}\n`;
}

main();
