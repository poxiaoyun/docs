#!/usr/bin/env python3
"""校验 docs 站的内容一致性与侧边栏可达性。

规则来自 src/pages/docs/viewer.tsx:102-132 —— 每段剥离 ^\\d+\\. 前缀，
index.md 映射到其父目录的 URL，viewer 用 Object.keys(files).find() 取首个命中，
因此同 URL 的多份 md 会互相遮蔽。

内链解析规则来自 src/components/markdown/markdown.tsx 的 a 渲染器：
相对链接按「当前页面 URL 的目录」为基准，逐段剥离 ^\\d+\\. 与 \\.md 后缀，
处理 . / ..，末尾 index 段丢弃；绝对链接直接当站内 URL。

表格规则来自同一文件的 remarkGfm：GFM 切单元格时不保护代码段，行内 code 里的
裸 | 会被当成分隔符，多切出来的格子被直接丢弃 ⇒ 页面上静默少内容。

用法: python3 check-docs-consistency.py [--root docs 仓库根]
"""
import os
import re
import subprocess
import sys
import collections

def _parse_root(argv):
    """支持 `--root <dir>` 与位置参数；默认取脚本所在目录的父目录（即仓库根）。"""
    if '--root' in argv:
        i = argv.index('--root')
        if i + 1 >= len(argv):
            sys.exit('--root 需要一个目录参数')
        return argv[i + 1]
    positional = [a for a in argv if not a.startswith('-')]
    if positional:
        return positional[0]
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


ROOT = _parse_root(sys.argv[1:])
CONTENT = os.path.join(ROOT, 'src/pages/docs')
if not os.path.isdir(CONTENT):
    sys.exit(f'找不到内容目录: {CONTENT}（用 --root 指定 docs 仓库根）')
STRIP = re.compile(r'^\d+\.')

TITLE_RE = re.compile(r"^title:\s*['\"]?(.+?)['\"]?\s*$", re.M)
TOC_PATH_RE = re.compile(r"path:\s*'([^']+)'")
MD_LINK_RE = re.compile(r'(!?)\[[^\]]*\]\(([^)\s]+)\)')
# 告示块语法由 src/components/markdown/remark-alerts.ts 实现，只认这 5 种类型
ALERT_OPEN_RE = re.compile(r'^:::(info|success|warning|error|tip)(\s+.+)?$')
ALERT_ANY_RE = re.compile(r'^:::')
# markdown 管线是 react-markdown + remark-gfm（src/components/markdown/markdown.tsx），
# 表格按 GFM 切单元格，分隔行形如 | --- | :--: |
TABLE_DELIM_RE = re.compile(r'^\s*\|[\s:|-]+\|\s*$')
SKIP_SCHEME = ('http://', 'https://', 'mailto:', 'tel:', 'data:', '#', '//')


def split_table_row(row):
    """按 GFM 规则切一行表格的单元格。

    关键：`\\|` 是字面竖线，但**代码段不保护竖线** —— 行内的 `error|exception`
    照样是分隔符，会把这一行多切出一格，多出来的格子被 GFM 直接丢弃，页面上
    就静默少了内容。所以这里不能先剥代码段再切。
    """
    s = row.strip()
    if s.startswith('|'):
        s = s[1:]
    if s.endswith('|') and not s.endswith('\\|'):
        s = s[:-1]
    cells, cur, i = [], '', 0
    while i < len(s):
        if s[i] == '\\' and i + 1 < len(s):
            cur += s[i:i + 2]
            i += 2
            continue
        if s[i] == '|':
            cells.append(cur)
            cur = ''
            i += 1
            continue
        cur += s[i]
        i += 1
    cells.append(cur)
    return [c.strip() for c in cells]


def strip(part: str) -> str:
    return STRIP.sub('', part)


def md_to_url(rel_parts):
    """cn/10.rune/03.console/app.md -> ('cn', '/rune/console/app')"""
    lang, *rest = rel_parts
    parts = list(rest)
    parts[-1] = parts[-1][:-3]  # 去掉 .md
    parts = [strip(p) for p in parts]
    if parts and parts[-1] == 'index':
        parts = parts[:-1]
    return lang, '/' + '/'.join(parts)


def collect_files():
    """返回 {lang: {url: [文件相对路径, ...]}}（同 URL 多文件即遮蔽）"""
    langs = collections.defaultdict(lambda: collections.defaultdict(list))
    for dirpath, _dirnames, filenames in os.walk(CONTENT):
        for fn in filenames:
            if not fn.endswith('.md'):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, CONTENT).split(os.sep)
            if len(rel) < 2:
                continue
            lang, url = md_to_url(rel)
            langs[lang][url].append('/'.join(rel))
    return langs


def collect_toc_paths():
    """返回 {toc 文件: [path, ...]}"""
    out = {}
    for dirpath, _dirnames, filenames in os.walk(CONTENT):
        for fn in filenames:
            if fn != 'toc.ts':
                continue
            full = os.path.join(dirpath, fn)
            txt = open(full, encoding='utf-8').read()
            out[os.path.relpath(full, ROOT)] = TOC_PATH_RE.findall(txt)
    # 顶层汇总 toc.tsx（overview / account 等分区）
    top = os.path.join(CONTENT, 'toc.tsx')
    if os.path.exists(top):
        txt = open(top, encoding='utf-8').read()
        out[os.path.relpath(top, ROOT)] = TOC_PATH_RE.findall(txt)
    return out


def resolve_relative(current_url, is_index, href_path):
    """复刻 markdown.tsx 的 a 渲染器解析逻辑，返回站内绝对 URL。"""
    segs = [s for s in current_url.split('/') if s]
    base = list(segs) if is_index else segs[:-1]
    for raw in href_path.split('/'):
        clean = STRIP.sub('', raw)
        if clean.endswith('.md'):
            clean = clean[:-3]
        if clean in ('', '.'):
            continue
        if clean == '..':
            if base:
                base.pop()
        else:
            base.append(clean)
    if base and base[-1] == 'index':
        base.pop()
    return '/' + '/'.join(base)


def collect_md_links():
    """返回 [(文件相对路径, 行号, 链接目标, 是否图片)]，跳过代码块与行内代码。"""
    out = []
    for dirpath, _d, filenames in os.walk(CONTENT):
        for fn in sorted(filenames):
            if not fn.endswith('.md'):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT)
            in_fence = False
            for lineno, line in enumerate(open(full, encoding='utf-8'), 1):
                if line.lstrip().startswith('```'):
                    in_fence = not in_fence
                    continue
                if in_fence:
                    continue
                # 去掉行内代码，避免把正则/示例误判为链接
                stripped = re.sub(r'`[^`]*`', '', line)
                for m in MD_LINK_RE.finditer(stripped):
                    out.append((rel, lineno, m.group(2), m.group(1) == '!'))
    return out


def collect_archived_paths():
    """返回 archive/<日期>/ 下所有文件的「原相对路径」集合。"""
    base = os.path.join(ROOT, 'archive')
    out = set()
    if not os.path.isdir(base):
        return out
    for date_dir in sorted(os.listdir(base)):
        d = os.path.join(base, date_dir)
        if not os.path.isdir(d):
            continue
        for dirpath, _dirnames, filenames in os.walk(d):
            for fn in filenames:
                full = os.path.join(dirpath, fn)
                out.add(os.path.relpath(full, d).replace(os.sep, '/'))
    return out


def check_archive_coverage(archived):
    """工作区中已删除的文件都应在 archive/ 下有副本，保证删除可回溯。

    非 git 仓库或无删除项时返回 None（跳过该项检查）。
    """
    try:
        proc = subprocess.run(['git', '-C', ROOT, 'status', '--porcelain'],
                              capture_output=True, text=True)
    except FileNotFoundError:
        return None
    if proc.returncode != 0:
        return None
    rows = []
    for line in proc.stdout.splitlines():
        if not line.startswith(' D '):
            continue
        rel = line[3:].strip().replace(os.sep, '/')
        if rel not in archived:
            rows.append(rel)
    return rows


def main():
    langs = collect_files()
    toc = collect_toc_paths()
    problems = 0
    all_urls = {}
    for lang, url_map in langs.items():
        for url in url_map:
            all_urls.setdefault(url, set()).add(lang)

    # 1. frontmatter title 缺失
    missing_title = []
    for dirpath, _d, filenames in os.walk(CONTENT):
        for fn in filenames:
            if not fn.endswith('.md'):
                continue
            full = os.path.join(dirpath, fn)
            head = open(full, encoding='utf-8').read(800)
            if not TITLE_RE.search(head):
                missing_title.append(os.path.relpath(full, ROOT))

    # 2. 同 URL 遮蔽
    shadowed = []
    for lang, url_map in langs.items():
        for url, files in url_map.items():
            if len(files) > 1:
                shadowed.append((lang, url, sorted(files)))

    # 3. toc 死链 / 4. 孤儿
    dead = []
    referenced = set()
    for tocfile, paths in toc.items():
        for p in paths:
            referenced.add(p.rstrip('/') or '/')
            if p.rstrip('/') not in all_urls and p.rstrip('/') != '':
                dead.append((tocfile, p))
    orphans = []
    for lang, url_map in langs.items():
        for url, files in url_map.items():
            if url not in referenced:
                orphans.append((lang, url, files[0]))

    # 5. markdown 内链失效
    broken_links = []
    for rel, lineno, raw, is_img in collect_md_links():
        if raw.startswith(SKIP_SCHEME) or '://' in raw:
            continue
        path = raw.split('#')[0].split('?')[0]
        if not path:
            continue
        lang = os.path.relpath(rel, CONTENT).split(os.sep)[0]
        known = langs.get(lang, {})

        # 5a. 静态资源（图片等）走 public/，并经过 baseUri 处理。
        #     前缀必须是 /assets/：渲染器 resolveAssetPath 只对这一个前缀补 base，
        #     而 Docker 部署的 base 是 /docs，写成 /screenshots/ 之类在 Docker 下会 404。
        if is_img or path.startswith('/assets/'):
            if is_img and not path.startswith('/assets/'):
                broken_links.append(
                    (rel, lineno, raw, '图片前缀必须是 /assets/（Docker 部署 base=/docs，其他前缀会 404）')
                )
            elif not os.path.exists(os.path.join(ROOT, 'public', path.lstrip('/'))):
                broken_links.append((rel, lineno, raw, 'public 资源缺失'))
            continue
        if os.path.splitext(path)[1].lower() in ('.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'):
            if not os.path.exists(os.path.join(ROOT, 'public', path.lstrip('/'))):
                broken_links.append((rel, lineno, raw, 'public 资源缺失'))
            continue

        # 5b. 站内页面链接
        rel_parts = os.path.relpath(rel, CONTENT).split(os.sep)
        if len(rel_parts) < 2:
            continue
        file_url = md_to_url(rel_parts)[1]
        is_index = rel_parts[-1] == 'index.md'
        if path.startswith('/'):
            target = path.rstrip('/') or '/'
        else:
            target = resolve_relative(file_url, is_index, path).rstrip('/') or '/'
        if target not in known and target not in all_urls:
            if not os.path.exists(os.path.join(ROOT, 'public', target.lstrip('/'))):
                broken_links.append((rel, lineno, raw, f'解析为 {target}，无对应页面'))

    # 6. 告示块语法非法（:::tip 等由 remark-alerts 渲染，只支持 5 种类型且必须成对）
    alerts = []
    for dirpath, _d, filenames in os.walk(CONTENT):
        for fn in sorted(filenames):
            if not fn.endswith('.md'):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT)
            opened = 0
            lines = open(full, encoding='utf-8').read().split('\n')
            for lineno, line in enumerate(lines, 1):
                s = line.rstrip('\n')
                if not ALERT_ANY_RE.match(s):
                    continue
                if s.strip() == ':::':
                    opened -= 1
                    if opened < 0:
                        alerts.append((rel, lineno, '多余的结束标记 :::'))
                        opened = 0
                elif ALERT_OPEN_RE.match(s):
                    opened += 1
                    # 多段式（开标记下一行为空行）要求闭合 ::: 前也有空行，
                    # 否则 remark-alerts 匹配不到闭合，整块会原样显示成文字。
                    if lineno < len(lines) and lines[lineno].strip() == '':
                        j = lineno
                        while j < len(lines) and lines[j].strip() != ':::':
                            j += 1
                        if j < len(lines) and lines[j - 1].strip() != '':
                            alerts.append((rel, lineno,
                                           '多段式告示块的闭合 ::: 前缺空行，整块不会渲染'))
                else:
                    alerts.append((rel, lineno, f'不支持的类型（仅 info/success/warning/error/tip）：{s.strip()[:40]}'))
            if opened > 0:
                alerts.append((rel, 0, f'{opened} 个告示块未闭合'))

    # 6b. 表格行的竖线：GFM 切单元格时不保护代码段，行内 code 里的裸 `|`
    #（例：`error|exception`）会成为分隔符，多切出来的格子被 GFM 直接丢掉 —— 页面上
    # 静默少内容、单元格里还留一个没配对的 `。判据取「本行列数 > 表头列数」，零误报。
    table_pipes = []
    for dirpath, _d, filenames in os.walk(CONTENT):
        for fn in sorted(filenames):
            if not fn.endswith('.md'):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT)
            lines = open(full, encoding='utf-8').read().split('\n')
            i = 0
            while i < len(lines):
                if (lines[i].lstrip().startswith('|')
                        and i + 1 < len(lines) and TABLE_DELIM_RE.match(lines[i + 1])):
                    width = len(split_table_row(lines[i]))
                    j = i + 2
                    while j < len(lines) and lines[j].lstrip().startswith('|'):
                        got = len(split_table_row(lines[j]))
                        if got > width:
                            codes = re.findall(r'`[^`]*\|[^`]*`', lines[j])
                            why = f'代码段内有未转义的 |：{codes[0]}' if codes else '列数与表头不一致'
                            table_pipes.append(
                                (rel, j + 1, f'表头 {width} 列 / 本行 {got} 列，尾部单元格会被丢弃（{why}）'))
                        j += 1
                    i = j
                else:
                    i += 1

    # 7. 侧边栏文案与页面 title 差异（仅提示，不计入问题）
    file_titles = {}
    for dirpath, _d, filenames in os.walk(CONTENT):
        for fn in filenames:
            if not fn.endswith('.md'):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, CONTENT).split(os.sep)
            if len(rel) < 2:
                continue
            lang, url = md_to_url(rel)
            head = open(full, encoding='utf-8').read(600)
            m = TITLE_RE.search(head)
            if m:
                file_titles.setdefault((lang, url), m.group(1).strip())
    title_drift = []
    for tocfile, _paths in toc.items():
        is_top = os.path.basename(tocfile) == 'toc.tsx'
        lang = 'en' if (os.sep + 'en' + os.sep) in (tocfile + os.sep) else 'cn'
        txt = open(os.path.join(ROOT, tocfile), encoding='utf-8').read()
        for item in re.finditer(r"\{\s*title:\s*'([^']+)'[^}]*?path:\s*'([^']+)'", txt):
            label, p = item.group(1), item.group(2).rstrip('/')
            if is_top:
                actual = file_titles.get(('cn', p)) or file_titles.get(('en', p))
            else:
                actual = file_titles.get((lang, p))
            if actual and actual != label and len(actual) <= 12 and len(label) <= 12:
                title_drift.append((tocfile, p, label, actual))

    print('内容文件语言分布: ' + ', '.join(f'{k}={sum(len(v) for v in m.values())}' for k, m in sorted(langs.items())))
    print(f'toc 文件数: {len(toc)}，引用 path 总数: {sum(len(v) for v in toc.values())}')
    archived = collect_archived_paths()
    if archived:
        print(f'archive 归档文件数: {len(archived)}')
    print()

    def section(title, rows, fmt):
        nonlocal problems
        print(f'## {title}  ({len(rows)})')
        if not rows:
            print('   ✓ 无')
        else:
            problems += len(rows)
            for r in rows:
                print('   ' + fmt(r))
        print()

    section('frontmatter 缺 title', missing_title, lambda r: r)
    section('同 URL 遮蔽（后者永不可达）', shadowed,
            lambda r: f'[{r[0]}] {r[1]}  <- ' + ', '.join(r[2]))
    section('侧边栏死链（toc path 无对应文件）', dead, lambda r: f'{r[0]}  ->  {r[1]}')
    section('孤儿文件（无任何 toc 引用）', orphans, lambda r: f'[{r[0]}] {r[1]}  ({r[2]})')
    section('markdown 内链失效', broken_links, lambda r: f'{r[0]}:{r[1]}  {r[2]}  ({r[3]})')
    section('告示块语法（::: 类型非法 / 未闭合）', alerts, lambda r: f'{r[0]}:{r[1]}  {r[2]}')
    section('表格行竖线（裸 | 拆格致内容丢失）', table_pipes, lambda r: f'{r[0]}:{r[1]}  {r[2]}')

    uncovered = check_archive_coverage(archived)
    if uncovered is None:
        print('## 已删除文件缺归档副本  (跳过：非 git 仓库或无 git)')
        print()
    else:
        section('已删除文件缺归档副本', uncovered, lambda r: r)

    print(f'## 侧边栏文案与页面 title 不一致（提示，不计入问题）  ({len(title_drift)})')
    if not title_drift:
        print('   ✓ 无')
    else:
        for tocfile, p, label, actual in title_drift:
            print(f'   {tocfile}  {p}  侧边栏「{label}」/ 页面「{actual}」')
    print()

    print(f'== 合计问题: {problems} ==')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
