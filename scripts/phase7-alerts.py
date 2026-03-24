#!/usr/bin/env python3
"""Phase 7: Global alert sweep - migrate remaining old alerts."""
import re
import os

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn'

def migrate_blockquote_alerts(content):
    """Migrate > 💡/⚠️ blockquote alerts to :::tip/:::warning."""
    changes = 0

    def replace_multiline_tip(m):
        nonlocal changes; changes += 1
        lines = m.group(0).split('\n')
        body_lines = []
        for line in lines:
            if line.startswith('> '):
                cleaned = re.sub(r'^> 💡\s*\*{0,2}提示\*{0,2}[：:]\s*', '', line)
                cleaned = re.sub(r'^> ', '', cleaned)
                body_lines.append(cleaned)
            elif line.strip() == '>':
                body_lines.append('')
        body = '\n'.join(body_lines).strip()
        return f':::tip\n{body}\n:::'

    def replace_multiline_warning(m):
        nonlocal changes; changes += 1
        lines = m.group(0).split('\n')
        body_lines = []
        for line in lines:
            if line.startswith('> '):
                cleaned = re.sub(r'^> ⚠️\s*\*{0,2}注意\*{0,2}[：:]\s*', '', line)
                cleaned = re.sub(r'^> ', '', cleaned)
                body_lines.append(cleaned)
            elif line.strip() == '>':
                body_lines.append('')
        body = '\n'.join(body_lines).strip()
        return f':::warning\n{body}\n:::'

    content = re.sub(r'> 💡\s*\*{0,2}提示\*{0,2}[：:].*(?:\n>.*)*', replace_multiline_tip, content)
    content = re.sub(r'> ⚠️\s*\*{0,2}注意\*{0,2}[：:].*(?:\n>.*)*', replace_multiline_warning, content)
    content = re.sub(r'> 💡\s+(?!\*{0,2}提示)(.+)', lambda m: f':::tip\n{m.group(1).strip()}\n:::', content)
    content = re.sub(r'> ⚠️\s+(?!\*{0,2}注意)(.+)', lambda m: f':::warning\n{m.group(1).strip()}\n:::', content)
    content = re.sub(r'> 📖\s+(.+)', lambda m: f':::info\n{m.group(1).strip()}\n:::', content)

    return content, changes


def migrate_div_alerts(content):
    """Migrate <div data-alert="xxx">...</div> to :::xxx format."""
    changes = 0

    def replace_div(m):
        nonlocal changes; changes += 1
        alert_type = m.group(1)
        body = m.group(2).strip()
        return f':::{alert_type}\n{body}\n:::'

    content = re.sub(
        r'<div data-alert="(\w+)">\s*\n(.*?)\n\s*</div>',
        replace_div, content, flags=re.DOTALL
    )
    return content, changes


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content

    content, bq_count = migrate_blockquote_alerts(content)
    content, div_count = migrate_div_alerts(content)

    content = re.sub(r'\n{3,}', '\n\n', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        relpath = os.path.relpath(filepath, BASE)
        print(f"  ✅ {relpath}: {bq_count} blockquote + {div_count} div alerts migrated")
    return bq_count + div_count


total = 0
for root, dirs, files in os.walk(BASE):
    dirs.sort()
    for fname in sorted(files):
        if fname.endswith('.md'):
            total += process_file(os.path.join(root, fname))

print(f"\nDone! {total} alerts migrated globally.")
