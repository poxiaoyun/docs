#!/usr/bin/env python3
"""Second pass: fix headings/images merged with content on same line."""
import os
import re

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/10.rune/03.console'


def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    lines = content.split('\n')
    fixed = []

    for line in lines:
        stripped = line.strip()

        # ── Fix 1: Table row has heading mixed in ──
        # Pattern: "| xxx | yyy | ### heading | more |"
        if stripped.startswith('|') and re.search(r'\|\s*(#{2,4}\s+)', stripped):
            parts = re.split(r'(?=#{2,4}\s+\S)', stripped)
            for j, part in enumerate(parts):
                p = part.strip().rstrip('|').strip()
                if p:
                    if j > 0:
                        fixed.append('')
                    fixed.append(p)
            continue

        # ── Fix 2: Heading with content on same line ──
        # "## 功能概述 开发环境（Interactive...）"
        # "### 核心能力 - **VSCode SSH**..."
        # "## 进入路径 Rune 工作台 → ..."
        m = re.match(r'^(#{2,4}\s+\S+(?:[\u4e00-\u9fff\w（）/\s]*?\S)?)\s+([-|!:\d\[（].+|[\u4e00-\u9fff].{10,})$', stripped)
        if m and len(stripped) > 30:
            heading = m.group(1).rstrip()
            rest = m.group(2).lstrip()
            # Make sure the heading part is reasonable (not too long)
            heading_text = re.sub(r'^#{2,4}\s+', '', heading)
            if len(heading_text) <= 20:
                fixed.append(heading)
                fixed.append('')
                fixed.append(rest)
                continue

        # ── Fix 3: Image followed by text on same line ──
        # "![alt](url) 列表页展示当前..."
        m = re.match(r'^(!\[.*?\]\(.*?\))\s+(.{10,})$', stripped)
        if m:
            fixed.append(m.group(1))
            fixed.append('')
            fixed.append(m.group(2))
            continue

        # ── Fix 4: "--- " at end of line ──
        # "## 进入路径 Rune 工作台 → 左侧导航 → **开发环境** ---"
        # Already handled if heading was split, but catch standalone
        m = re.match(r'^(.{10,}?)\s+---$', stripped)
        if m and not stripped.startswith('|') and not stripped.startswith('```'):
            fixed.append(m.group(1))
            fixed.append('')
            fixed.append('---')
            continue

        fixed.append(line)

    content = '\n'.join(fixed)

    # ── Fix 5: Ensure blank line before headings ──
    content = re.sub(r'([^\n])\n(#{2,4} )', r'\1\n\n\2', content)

    # ── Fix 6: Normalize multiple blank lines ──
    content = re.sub(r'\n{3,}', '\n\n', content)

    # ── Fix 7: Ensure single trailing newline ──
    content = content.rstrip() + '\n'

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


changed = 0
for fname in sorted(os.listdir(BASE)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(BASE, fname)
    if fix_file(fpath):
        changed += 1
        with open(fpath, 'r', encoding='utf-8') as f:
            n = len(f.readlines())
        print(f'  FIXED: {fname} → {n} lines')
    else:
        print(f'  OK:    {fname}')

print(f'\nDone! Fixed {changed} files.')
