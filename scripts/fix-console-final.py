#!/usr/bin/env python3
"""
Final comprehensive fix: join all body text and re-tokenize from scratch.

Approach:
1. Extract frontmatter
2. Flatten body to one string (preserve code/mermaid blocks)
3. Re-split at ALL structural boundaries
4. Reassemble with proper markdown spacing
"""
import os
import re

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/10.rune/03.console'


def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    lines = content.split('\n')

    # ── Step 1: Extract frontmatter ──
    fm_lines = []
    body_start = 0
    if lines[0].strip() == '---':
        fm_lines.append(lines[0])
        for i in range(1, min(len(lines), 30)):
            if lines[i].strip() == '---':
                fm_lines.append(lines[i])
                body_start = i + 1
                break
            elif lines[i].strip().startswith('---'):
                # --- merged with content
                fm_lines.append('---')
                body_start = i
                # Capture the rest after --- as body
                rest = lines[i].strip()[3:].strip()
                if rest:
                    lines[i] = rest
                else:
                    body_start = i + 1
                break
            else:
                fm_lines.append(lines[i])

    # ── Step 2: Extract code blocks before flattening ──
    body_lines = lines[body_start:]
    body_text = '\n'.join(body_lines)

    # Replace code/mermaid blocks with placeholders
    code_blocks = []

    def save_code_block(match):
        idx = len(code_blocks)
        code_blocks.append(match.group(0))
        return f'\n\n__CODE_BLOCK_{idx}__\n\n'

    # Match ```...``` blocks (including mermaid)
    body_text = re.sub(r'```[\s\S]*?```', save_code_block, body_text)

    # ── Step 3: Flatten body to single line ──
    # Replace newlines with spaces, collapse multiple spaces
    flat = re.sub(r'\s+', ' ', body_text).strip()

    # ── Step 4: Insert structural breaks ──

    # Before headings ## ### ####
    flat = re.sub(r'\s+(#{2,4}\s)', r'\n\n\1', flat)
    # Also at the very start
    if flat.startswith('#'):
        pass  # already at start
    else:
        flat = re.sub(r'^(#{2,4}\s)', r'\n\n\1', flat)

    # Before --- horizontal rules (but not |---|)
    flat = re.sub(r'(?<!\|)\s+---(?=\s|$)', r'\n\n---\n', flat)

    # Before images ![
    flat = re.sub(r'\s+(!\[)', r'\n\n\1', flat)

    # Before :::tip/warning/error/info/success
    flat = re.sub(r'\s+(:::(tip|warning|error|info|success)\b)', r'\n\n\1\n', flat)

    # After :::tip/warning content + before next heading/hr/:::
    # (handled later in block fixing)

    # Before table separator rows |---|---|
    flat = re.sub(r'\s+(\|[-:\s|]+\|)', r'\n\1', flat)

    # ── Step 5: Split into lines and process ──
    result_lines = flat.split('\n')

    # Now process line by line to fix remaining issues
    final = []
    i = 0
    while i < len(result_lines):
        line = result_lines[i].strip()
        if not line:
            final.append('')
            i += 1
            continue

        # Check for code block placeholders
        m = re.match(r'^__CODE_BLOCK_(\d+)__$', line)
        if m:
            final.append('')
            final.append(code_blocks[int(m.group(1))])
            final.append('')
            i += 1
            continue

        # ── Headings: split content after heading title ──
        hm = re.match(r'^(#{2,4})\s+(.+)$', line)
        if hm:
            level = hm.group(1)
            rest = hm.group(2)

            # Find where heading title ends and content begins
            # Heading titles are short phrases (Chinese: 2-10 chars, English: 2-30 chars)
            # Content starts with: |, -, !, [, 1., Chinese sentence, or after 20+ chars

            # Try to find split point
            split_found = False

            # Pattern: heading text then table row
            tm = re.match(r'^(.{2,20}?)\s+(\|.+\|.+)$', rest)
            if tm:
                final.append(f'{level} {tm.group(1)}')
                final.append('')
                # Process table part
                remaining = tm.group(2)
                final.append(remaining)
                split_found = True

            if not split_found:
                # Pattern: heading text then list item
                tm = re.match(r'^(.{2,20}?)\s+([-\d].+)$', rest)
                if tm and (tm.group(2).startswith('- ') or re.match(r'^\d+\.\s', tm.group(2))):
                    final.append(f'{level} {tm.group(1)}')
                    final.append('')
                    final.append(tm.group(2))
                    split_found = True

            if not split_found:
                # Pattern: heading text then image
                tm = re.match(r'^(.{2,20}?)\s+(!\[.+)$', rest)
                if tm:
                    final.append(f'{level} {tm.group(1)}')
                    final.append('')
                    final.append(tm.group(2))
                    split_found = True

            if not split_found:
                # Pattern: heading text then paragraph (Chinese)
                # Heading ends with CJK char or closing paren, content starts with CJK
                tm = re.match(r'^([\u4e00-\u9fff\w（）\s]{2,20}?[\u4e00-\u9fff）])\s+([\u4e00-\u9fff\*].{10,})$', rest)
                if tm:
                    final.append(f'{level} {tm.group(1)}')
                    final.append('')
                    final.append(tm.group(2))
                    split_found = True

            if not split_found:
                final.append(f'{level} {rest}')

            i += 1
            continue

        # ── Table rows: split mixed table+heading lines ──
        if line.startswith('|'):
            # Check if heading is embedded in the table row
            hm = re.search(r'\|\s*(#{2,4}\s+.+)$', line)
            if hm:
                table_part = line[:hm.start()].strip()
                heading_part = hm.group(1)
                if table_part:
                    if not table_part.endswith('|'):
                        table_part += ' |'
                    final.append(table_part)
                final.append('')
                # Re-process the heading part
                result_lines.insert(i + 1, heading_part)
                i += 1
                continue

            # Check for table rows with --- heading etc mixed in
            if '---' in line and not re.match(r'^\|[-:\s|]+\|$', line):
                parts = re.split(r'\s*---\s*', line)
                if len(parts) > 1:
                    for j, part in enumerate(parts):
                        p = part.strip()
                        if p:
                            if not p.startswith('|') and not p.endswith('|'):
                                final.append(p)
                            else:
                                if not p.endswith('|'):
                                    p += ' |'
                                final.append(p)
                        if j < len(parts) - 1:
                            final.append('')
                            final.append('---')
                            final.append('')
                    i += 1
                    continue

            final.append(line)
            i += 1
            continue

        # ── Regular lines: split at paragraph boundaries ──
        if len(line) > 150:
            # Split at Chinese period boundaries
            parts = re.split(r'(?<=。)\s+(?=[^\s|!#\-\d`>])', line)
            if len(parts) > 1:
                for j, part in enumerate(parts):
                    final.append(part.strip())
                    if j < len(parts) - 1:
                        final.append('')
                i += 1
                continue

        final.append(line)
        i += 1

    # ── Step 6: Fix :::tip/warning blocks ──
    content_lines = final
    final2 = []
    j = 0
    in_block = False
    while j < len(content_lines):
        line = content_lines[j]
        stripped = line.strip()

        if re.match(r'^:::(tip|warning|error|info|success)', stripped):
            if in_block:
                final2.append(':::')
                final2.append('')
            in_block = True
            final2.append(line)
            j += 1
            continue

        if in_block:
            if (re.match(r'^#{2,4}\s', stripped) or
                stripped == '---' or
                re.match(r'^:::(tip|warning|error|info|success)', stripped) or
                re.match(r'^__CODE_BLOCK_', stripped)):
                final2.append(':::')
                final2.append('')
                in_block = False
                final2.append(line)
                j += 1
                continue

            if stripped == '':
                # Check if next non-empty line is a heading
                k = j + 1
                while k < len(content_lines) and content_lines[k].strip() == '':
                    k += 1
                if k < len(content_lines):
                    next_s = content_lines[k].strip()
                    if (re.match(r'^#{2,4}\s', next_s) or
                        next_s == '---' or
                        re.match(r'^:::(tip|warning|error|info|success)', next_s)):
                        final2.append(':::')
                        final2.append('')
                        in_block = False
                        j += 1
                        continue

        final2.append(line)
        j += 1

    if in_block:
        final2.append(':::')

    # ── Step 7: Restore code blocks ──
    content_out = '\n'.join(final2)
    for idx, block in enumerate(code_blocks):
        content_out = content_out.replace(f'__CODE_BLOCK_{idx}__', block)

    # ── Step 8: Cleanup ──
    # Ensure blank line before headings
    content_out = re.sub(r'([^\n])\n(#{2,4} )', r'\1\n\n\2', content_out)
    # Ensure blank line before ---
    content_out = re.sub(r'([^\n-])\n---', r'\1\n\n---', content_out)
    # Ensure blank line after ---
    content_out = re.sub(r'\n---\n([^\n-])', r'\n---\n\n\1', content_out)
    # Normalize multiple blank lines
    content_out = re.sub(r'\n{3,}', '\n\n', content_out)
    # Trailing newline
    content_out = content_out.rstrip() + '\n'

    # Prepend frontmatter
    fm = '\n'.join(fm_lines)
    result = fm + '\n\n' + content_out.lstrip('\n')

    if result != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(result)
        return True
    return False


changed = 0
for fname in sorted(os.listdir(BASE)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(BASE, fname)
    try:
        if fix_file(fpath):
            changed += 1
            with open(fpath, 'r', encoding='utf-8') as f:
                n = len(f.readlines())
            print(f'  FIXED: {fname} → {n} lines')
        else:
            print(f'  OK:    {fname}')
    except Exception as e:
        print(f'  ERROR: {fname}: {e}')

print(f'\nDone! Fixed {changed} files.')
