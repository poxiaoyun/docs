#!/usr/bin/env python3
"""Migrate alert syntax in introduction.md, quick-start.md, glossary.md."""
import re
import os

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn'


def migrate_alerts(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changes = 0

    # Pattern 1: > 💡 **提示**：text  or  > 💡 提示: text
    # These are single-line blockquote tips
    def replace_tip(m):
        nonlocal changes
        changes += 1
        text = m.group(1).strip()
        return f':::tip\n{text}\n:::'

    content = re.sub(
        r'> 💡\s*\*{0,2}提示\*{0,2}[：:]\s*(.+)',
        replace_tip,
        content
    )

    # Pattern 2: > ⚠️ **注意**：text  or  > ⚠️ 注意: text
    def replace_warning(m):
        nonlocal changes
        changes += 1
        text = m.group(1).strip()
        return f':::warning\n{text}\n:::'

    content = re.sub(
        r'> ⚠️\s*\*{0,2}注意\*{0,2}[：:]\s*(.+)',
        replace_warning,
        content
    )

    # Pattern 3: > [!TIP]\n> text (GitHub-style)
    def replace_github_tip(m):
        nonlocal changes
        changes += 1
        # Collect all subsequent > lines
        lines = m.group(0).split('\n')
        body_lines = []
        for line in lines[1:]:  # skip the [!TIP] line
            if line.startswith('> '):
                body_lines.append(line[2:])
            elif line.strip() == '>':
                body_lines.append('')
            else:
                break
        body = '\n'.join(body_lines).strip()
        return f':::tip\n{body}\n:::'

    content = re.sub(
        r'> \[!TIP\]\n(?:> .+\n?)+',
        replace_github_tip,
        content
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  {os.path.basename(filepath)}: {changes} alerts migrated")
    else:
        print(f"  {os.path.basename(filepath)}: no changes")


files = [
    os.path.join(BASE, '01.introduction.md'),
    os.path.join(BASE, '02.guide', '01.quick-start.md'),
    os.path.join(BASE, '02.guide', '03.glossary.md'),
]

for f in files:
    migrate_alerts(f)

print("Done!")
