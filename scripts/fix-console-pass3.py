#!/usr/bin/env python3
"""Pass 3: Fix specific issues from pass 2, more carefully."""
import os
import re

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/10.rune/03.console'


def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    lines = content.split('\n')
    fixed = []
    i = 0

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # ── Fix A: Stray single "#" line ──
        if stripped == '#':
            i += 1
            continue

        # ── Fix B: "## heading word\n\n工作台" → rejoin heading ──
        # Pattern: heading line looks too short AND next non-empty line is
        # clearly a continuation (starts with lowercase/Chinese non-heading text)
        m_heading = re.match(r'^(#{2,4})\s+(.+)$', stripped)
        if m_heading:
            heading_level = m_heading.group(1)
            heading_text = m_heading.group(2)
            # Check if this heading looks split: very short heading like "进入路径 Rune"
            # followed by a plain text line that should be part of the "进入路径" section
            # Look ahead for content that was incorrectly split
            if i + 1 < len(lines):
                next_stripped = lines[i+1].strip() if i+1 < len(lines) else ''
                next_next = lines[i+2].strip() if i+2 < len(lines) else ''
                # If next line is empty and line after starts with plain text (not heading/table/list)
                if (next_stripped == '' and next_next and
                    not next_next.startswith('#') and
                    not next_next.startswith('|') and
                    not next_next.startswith('-') and
                    not next_next.startswith('!') and
                    not next_next.startswith('```') and
                    not next_next.startswith(':::') and
                    not next_next.startswith('1.') and
                    not next_next.startswith('---')):
                    # Check if the next_next content looks like it should be UNDER this heading
                    # (i.e., it's a paragraph, not a sub-heading topic)
                    # If heading text ends with an English word but the content starts with CJK,
                    # they might have been incorrectly split
                    if re.search(r'[A-Za-z]$', heading_text) and re.match(r'^[\u4e00-\u9fff]', next_next):
                        # Rejoin: heading + content on separate lines (not same line!)
                        # But the heading title itself needs to be fixed
                        # e.g., "## 进入路径 Rune" → should be "## 进入路径"
                        # and "Rune 工作台 → ..." should be the content
                        # Find the last CJK char in heading text to identify where the title ends
                        last_cjk = -1
                        for ci, ch in enumerate(heading_text):
                            if '\u4e00' <= ch <= '\u9fff' or ch in '（）':
                                last_cjk = ci
                        if last_cjk >= 0 and last_cjk < len(heading_text) - 1:
                            real_title = heading_text[:last_cjk+1]
                            spillover = heading_text[last_cjk+1:].strip()
                            fixed.append(f'{heading_level} {real_title}')
                            fixed.append('')
                            fixed.append(spillover + ' ' + next_next)
                            i += 3  # Skip heading, blank line, content line
                            continue

        # ── Fix C: Heading merged with table on same line ──
        # "### 列表列说明 | 列 | 说明 | 示例 |"
        m = re.match(r'^(#{2,4}\s+\S+(?:[\u4e00-\u9fff]+)?)\s+(\|.+)$', stripped)
        if m:
            heading_part = m.group(1).strip()
            table_part = m.group(2).strip()
            heading_text_only = re.sub(r'^#{2,4}\s+', '', heading_part)
            if len(heading_text_only) <= 15:
                fixed.append(heading_part)
                fixed.append('')
                fixed.append(table_part)
                i += 1
                continue

        # ── Fix D: Table row ending without | followed by heading ──
        # "| xxx | yyy | zzz" (missing trailing |)
        # followed by ## or ### heading on next line that was split from the table
        if stripped.startswith('|') and not stripped.endswith('|') and not stripped.endswith('```'):
            # Check if there's a heading embedded after the table content
            m = re.search(r'\|\s*(#{2,4}\s+.+)$', stripped)
            if m:
                table_part = stripped[:m.start()].strip() + ' |'
                heading_part = m.group(1).strip()
                fixed.append(table_part)
                fixed.append('')
                fixed.append(heading_part)
                i += 1
                continue
            # Otherwise just add missing trailing |
            if re.match(r'^\|.*\|.*[^|]$', stripped) and '|' in stripped[1:]:
                fixed.append(stripped + ' |')
                i += 1
                continue

        # ── Fix E: "## 状态说明 | 状态 | 颜色 | 含义" ──
        # Heading promoted incorrectly (was ### inside table, now ## alone)
        # This is the result of table-heading splitting gone wrong
        # Look for heading + table header pattern
        m = re.match(r'^(#{2,4})\s+(\S+)\s+(\|.+\|)$', stripped)
        if m:
            heading = f'{m.group(1)} {m.group(2)}'
            table = m.group(3)
            fixed.append(heading)
            fixed.append('')
            fixed.append(table)
            i += 1
            continue

        # ── Fix F: Long single line with --- and heading mixed ──
        # "| Failed | ... | --- ## 创建开发环境 ### 操作步骤 1. ..."
        if len(stripped) > 100 and '---' in stripped and re.search(r'#{2,4}\s+', stripped):
            # Split at structural markers
            parts = re.split(r'\s+(?=---(?:\s|$))|(?<=---)\s+(?=\S)|(?=#{2,4}\s+\S)', stripped)
            if len(parts) > 1:
                for part in parts:
                    p = part.strip()
                    if p:
                        if p.startswith('#'):
                            fixed.append('')
                        fixed.append(p)
                i += 1
                continue

        # ── Fix G: Content with --- at end ──
        # "工作台 → 左侧导航 → **开发环境** ---"
        m = re.match(r'^(.{5,}?)\s+---$', stripped)
        if m and not stripped.startswith('|') and not stripped.startswith('#'):
            fixed.append(m.group(1))
            fixed.append('')
            fixed.append('---')
            i += 1
            continue

        fixed.append(line)
        i += 1

    content = '\n'.join(fixed)

    # Ensure blank line before headings
    content = re.sub(r'([^\n])\n(#{2,4} )', r'\1\n\n\2', content)
    # Normalize blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
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
