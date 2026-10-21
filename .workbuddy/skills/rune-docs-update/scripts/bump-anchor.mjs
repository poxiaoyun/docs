#!/usr/bin/env node
/**
 * bump-anchor.mjs — 把 anchor.json 的锚点推进到新的 console 提交（通常是最新 origin/main），
 * 并在 history 里留一条可追溯的记录。
 *
 * 用法：
 *   node scripts/bump-anchor.mjs                                  # 推到 origin/main
 *   node scripts/bump-anchor.mjs --to 82b826d0                    # 推到指定提交
 *   node scripts/bump-anchor.mjs --pr "#12" --note "同步 #215~#217"
 *   node scripts/bump-anchor.mjs --skip 7ac994c0 --reason "门户 CTA，文档站不描述"
 *   node scripts/bump-anchor.mjs --dry-run                        # 只看会写成什么
 *
 * 规则（脚本会强制检查）：
 *   - 新锚点必须是 origin/main 的祖先（否则说明还没合进 main）；
 *   - 新锚点不能比当前锚点旧（除非 --force）；
 *   - skip 里已被新锚点覆盖的条目会自动清掉。
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

function parseArgs(argv) {
  const out = { to: 'origin/main', pr: null, note: '', skips: [], dryRun: false, force: false, repo: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--to') out.to = argv[++i];
    else if (a === '--pr') out.pr = argv[++i];
    else if (a === '--note') out.note = argv[++i];
    else if (a === '--skip') out.skips.push({ commit: argv[++i], reason: '' });
    else if (a === '--reason') {
      if (!out.skips.length) throw new Error('--reason 必须跟在 --skip <sha> 之后');
      out.skips[out.skips.length - 1].reason = argv[++i];
    } else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--force') out.force = true;
    else if (a === '--repo') out.repo = argv[++i];
    else if (a === '-h' || a === '--help') {
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]);
      process.exit(0);
    } else throw new Error(`未知参数：${a}`);
  }
  return out;
}

function git(repo, args, { allowFail = false } = {}) {
  try {
    return execFileSync('git', ['-C', repo, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    if (allowFail) return null;
    throw new Error(`git ${args.join(' ')} 失败：${err.stderr?.toString().trim() || err.message}`);
  }
}

/** 本地时区 ISO8601，带 +08:00 这类偏移（锚点里不用 UTC，读的人不用换算）。 */
function isoLocal(d = new Date()) {
  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
    `${sign}${pad(offset / 60)}:${pad(offset % 60)}`
  );
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
    if (dir && fs.existsSync(dir) && git(dir, ['rev-parse', '--is-inside-work-tree'], { allowFail: true }) === 'true') {
      return fs.realpathSync(dir);
    }
  }
  throw new Error(`找不到 console 仓库，用 --repo <path> 指定。已尝试：\n  ${candidates.join('\n  ')}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const anchorFile = JSON.parse(fs.readFileSync(ANCHOR_FILE, 'utf8'));
  const repo = resolveRepo(anchorFile, args.repo);
  const branch = anchorFile.source?.branch || 'main';

  const prev = anchorFile.anchor?.commit;
  if (!prev) throw new Error('anchor.json 缺少 anchor.commit');

  const target = git(repo, ['rev-parse', args.to]) || git(repo, ['rev-parse', `${args.to}^{commit}`]);
  const targetInfo = describe(repo, target);

  if (git(repo, ['merge-base', '--is-ancestor', target, `origin/${branch}`], { allowFail: true }) === null) {
    throw new Error(`${target.slice(0, 8)} 还不在 origin/${branch} 上。等它合进 main 再推进锚点，否则下一轮会重复分析。`);
  }
  if (!args.force && git(repo, ['merge-base', '--is-ancestor', prev, target], { allowFail: true }) === null) {
    throw new Error(
      `新锚点 ${target.slice(0, 8)} 不是当前锚点 ${prev.slice(0, 8)} 的后代（会回退历史）。确认无误再加 --force。`
    );
  }

  const count = Number(git(repo, ['rev-list', '--count', `${prev}..${target}`]) || 0);
  if (count === 0 && !args.force) {
    console.log('锚点未变化：没有新提交需要推进。');
    return;
  }

  // 新锚点覆盖到的 skip 条目不再需要（它们已经在范围内了）
  const remainingSkips = (anchorFile.skip || []).filter(
    (s) => git(repo, ['merge-base', '--is-ancestor', s.commit, target], { allowFail: true }) === null
  );
  const absorbedSkips = (anchorFile.skip || []).length - remainingSkips.length;

  const now = isoLocal();
  const docsHead = git(DOCS_ROOT, ['rev-parse', 'HEAD'], { allowFail: true });

  const next = {
    ...anchorFile,
    anchor: {
      commit: target,
      committed_at: targetInfo.date,
      subject: targetInfo.subject,
    },
    recorded_at: now,
    docs_head_at_record: docsHead || anchorFile.docs_head_at_record || null,
    skip: remainingSkips,
    history: [
      ...(anchorFile.history || []),
      {
        anchor: target,
        short: target.slice(0, 8),
        range: `${prev.slice(0, 8)}..${target.slice(0, 8)}`,
        commits: count,
        docs_pr: args.pr,
        note: args.note,
        recorded_at: now,
      },
    ],
  };

  for (const s of args.skips) {
    const sha = git(repo, ['rev-parse', s.commit]);
    next.skip.push({ commit: sha, short: sha.slice(0, 8), reason: s.reason, recorded_at: now });
  }

  const json = `${JSON.stringify(next, null, 2)}\n`;

  console.log(`锚点：${prev.slice(0, 8)} → ${target.slice(0, 8)}（${count} 个提交）`);
  console.log(`  目标提交：${targetInfo.date} ${targetInfo.subject}`);
  console.log(`  文档 HEAD：${(docsHead || 'unknown').slice(0, 8)}`);
  if (absorbedSkips) console.log(`  清理已覆盖的 skip：${absorbedSkips} 条`);
  if (args.skips.length) console.log(`  新增 skip：${args.skips.map((s) => s.commit.slice(0, 8)).join(', ')}`);

  if (args.dryRun) {
    console.log('\n--dry-run，未写文件。将写入：\n');
    process.stdout.write(json);
    return;
  }

  fs.writeFileSync(ANCHOR_FILE, json);
  console.log(`\n已写入 ${path.relative(DOCS_ROOT, ANCHOR_FILE)}`);
  console.log('下一步：把这个文件与本次文档改动放在同一个 PR；本轮没有任何文档改动时，也要单独提一个只改锚点的 PR。');
}

function describe(repo, sha) {
  const [commit, date, subject] = git(repo, ['log', '-1', '--format=%H%x1f%ad%x1f%s', '--date=iso-strict', sha]).split('\x1f');
  return { commit, short: commit.slice(0, 8), date, subject };
}

main();
