#!/usr/bin/env python3
"""Fix broken markdown formatting in console doc files.

The Phase 3 script corrupted these files by collapsing newlines between
structural markdown elements (headings, images, :::blocks, etc.) into spaces.

This script performs multi-pass correction:
1. Fix frontmatter closing --- merged with body content
2. Fix inline YAML tags
3. Split long lines at structural boundaries (headings, ---, images, :::blocks)
4. Remove misplaced standalone ::: lines
5. Add proper ::: closers for :::tip/warning blocks
6. Split remaining long paragraph lines
7. Fix mermaid blocks compressed onto single lines
8. Normalize blank lines
"""
import os
import re

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/10.rune/03.console'


def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    lines = content.split('\n')

    # ── Pass 1: Fix frontmatter ──────────────────────────────────────────
    fm_close_idx = None
    if lines and lines[0].strip() == '---':
        for i in range(1, min(len(lines), 20)):
            if lines[i].strip().startswith('---'):
                fm_close_idx = i
                break

    if fm_close_idx is not None:
        # Fix inline tags: "tags: - rune - console" → multiline
        for i in range(1, fm_close_idx):
            m = re.match(r'^(\s*)tags:\s*(- .+)$', lines[i])
            if m:
                indent = m.group(1)
                tags_str = m.group(2)
                tags = re.findall(r'-\s*(\S+)', tags_str)
                lines[i] = indent + 'tags:\n' + '\n'.join(f'{indent}  - {t}' for t in tags)

        # Separate --- from body content on the same line
        close_line = lines[fm_close_idx].strip()
        if len(close_line) > 3 and close_line.startswith('---'):
            rest = close_line[3:].strip()
            lines[fm_close_idx] = '---'
            lines.insert(fm_close_idx + 1, '')
            lines.insert(fm_close_idx + 2, rest)

    content = '\n'.join(lines)

    # ── Pass 2: Split long lines at structural markers ───────────────────
    # We do multiple sub-passes, each targeting one marker type.
    # After each split, lines get shorter, making subsequent passes easier.

    def split_pass(text, pattern, blank_before=True, blank_after=False):
        """Split lines where `pattern` appears mid-line (not at position 0)."""
        out = []
        for line in text.split('\n'):
            stripped = line.strip()
            # Skip table rows, code fences, and short lines
            if len(line) < 80 or stripped.startswith('|') or stripped.startswith('```'):
                out.append(line)
                continue
            # Split before the pattern when preceded by non-whitespace
            parts = re.split(r'(?<=\S) (?=' + pattern + r')', line)
            if len(parts) > 1:
                for j, part in enumerate(parts):
                    p = part.strip()
                    if not p:
                        continue
                    if j > 0 and blank_before:
                        out.append('')
                    out.append(p)
                    if blank_after:
                        out.append('')
            else:
                out.append(line)
        return '\n'.join(out)

    # Split before headings: ## , ### , ####
    content = split_pass(content, r'#{2,4} \S')
    # Split before --- horizontal rules (standalone, not in frontmatter)
    content = split_pass(content, r'---$', blank_before=True)
    # Also handle --- followed by more content: "xxx --- ## yyy"
    # Pattern: " --- " mid-line
    lines = content.split('\n')
    expanded = []
    for line in lines:
        if len(line) < 80:
            expanded.append(line)
            continue
        stripped = line.strip()
        if stripped.startswith('|') or stripped.startswith('```'):
            expanded.append(line)
            continue
        # Match "content --- " or "content ---\n"
        m = re.match(r'^(.+?)\s+(---)\s*$', line)
        if m and len(m.group(1)) > 10:
            expanded.append(m.group(1).strip())
            expanded.append('')
            expanded.append('---')
            continue
        # Match "--- content" at start of non-frontmatter line
        m = re.match(r'^---\s+(.+)$', line)
        if m and len(m.group(1)) > 10:
            expanded.append('---')
            expanded.append('')
            expanded.append(m.group(1).strip())
            continue
        expanded.append(line)
    content = '\n'.join(expanded)

    # Split before images ![
    content = split_pass(content, r'!\[')
    # Split before :::tip/warning/error/info/success
    content = split_pass(content, r':::(tip|warning|error|info|success)')
    # Split before ```mermaid
    content = split_pass(content, r'```mermaid')
    # Split before ``` (closing code fence) when preceded by content
    content = split_pass(content, r'```\s*$', blank_before=False)

    # ── Pass 3: Remove misplaced standalone ::: lines ────────────────────
    # These are orphaned closers that got separated from their blocks.
    # We'll remove them all and re-add proper closers in Pass 4.
    lines = content.split('\n')
    cleaned = []
    for line in lines:
        if line.strip() == ':::':
            continue  # Remove all standalone ::: — we'll re-add properly
        cleaned.append(line)
    content = '\n'.join(cleaned)

    # ── Pass 4: Fix :::tip/warning blocks ────────────────────────────────
    # Ensure each :::tip/warning has content and a closing :::
    lines = content.split('\n')
    fixed = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Check for :::tip/warning opener
        if re.match(r'^:::(tip|warning|error|info|success)', stripped):
            fixed.append(line)
            i += 1
            # Collect content lines until next structural marker
            block_content = []
            while i < len(lines):
                next_line = lines[i]
                next_stripped = next_line.strip()
                # Stop at: heading, hr rule, another :::block, table start, code fence, image
                if (re.match(r'^#{2,4} ', next_stripped) or
                    next_stripped == '---' or
                    re.match(r'^:::(tip|warning|error|info|success)', next_stripped) or
                    next_stripped == '' and i + 1 < len(lines) and
                        (re.match(r'^#{2,4} ', lines[i+1].strip()) or
                         lines[i+1].strip() == '---' or
                         re.match(r'^:::(tip|warning|error|info|success)', lines[i+1].strip()))):
                    break
                block_content.append(next_line)
                i += 1
            # Add content lines
            for cl in block_content:
                fixed.append(cl)
            # Add closing :::
            fixed.append(':::')
            fixed.append('')
            continue

        fixed.append(line)
        i += 1

    content = '\n'.join(fixed)

    # ── Pass 5: Split remaining long lines (paragraph breaks) ────────────
    lines = content.split('\n')
    expanded = []
    for line in lines:
        stripped = line.strip()
        if len(line) < 180 or stripped.startswith('|') or stripped.startswith('```') or stripped.startswith('- ') or stripped.startswith('!['):
            expanded.append(line)
            continue
        # Split at "。 " followed by Chinese character or bold/link start
        parts = re.split(r'(?<=。)\s+(?=[^\s\|!#\-\d`>：])', line)
        if len(parts) > 1:
            for j, part in enumerate(parts):
                p = part.strip()
                if p:
                    expanded.append(p)
                    if j < len(parts) - 1:
                        expanded.append('')
        else:
            expanded.append(line)
    content = '\n'.join(expanded)

    # ── Pass 6: Fix mermaid blocks ───────────────────────────────────────
    # Split single-line mermaid content into proper multi-line format
    def fix_mermaid(match):
        inner = match.group(1).strip()
        if '\n' in inner and len(inner.split('\n')) > 2:
            return match.group(0)  # Already multi-line

        # Split at mermaid structural keywords
        result = []
        # First, identify diagram type (first word)
        tokens = inner.split(' ')
        if not tokens:
            return match.group(0)

        # Known patterns to split before
        split_patterns = [
            r'(?<=\S)\s+(?=subgraph\s)',
            r'(?<=\S)\s+(?=end\b)',
            r'(?<=\S)\s+(?=style\s)',
            r'(?<=\S)\s+(?=participant\s)',
            r'(?<=\S)\s+(?=Note\s)',
            r'(?<=\S)\s+(?=\[\*\]\s*-->)',
            r'(?<=\S)\s+(?=[A-Z]\d*\[)',
            r'(?<=\S)\s+(?=[A-Z]\d*\s*-->)',
            r'(?<=\])\s+(?=[A-Z]\d*)',
            r'(?<=")\s+(?=[A-Z]\d*)',
            r'(?<=\))\s+(?=[A-Z]\d*)',
        ]

        current = inner
        for pat in split_patterns:
            current = re.sub(pat, '\n    ', current)

        return '```mermaid\n' + current + '\n```'

    content = re.sub(r'```mermaid\n(.+?)\n```', fix_mermaid, content, flags=re.DOTALL)

    # ── Pass 7: Normalize blank lines ────────────────────────────────────
    # Max 2 consecutive newlines
    content = re.sub(r'\n{3,}', '\n\n', content)
    # Ensure blank line before headings
    content = re.sub(r'([^\n])\n(#{2,4} )', r'\1\n\n\2', content)
    # Ensure blank line after --- horizontal rules
    content = re.sub(r'\n---\n([^\n])', r'\n---\n\n\1', content)
    # Ensure blank line before --- horizontal rules
    content = re.sub(r'([^\n-])\n---', r'\1\n\n---', content)
    # Remove trailing whitespace
    lines = content.split('\n')
    lines = [l.rstrip() for l in lines]
    content = '\n'.join(lines)
    # Ensure single trailing newline
    content = content.rstrip() + '\n'

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


# ── Main ─────────────────────────────────────────────────────────────────
changed_count = 0
for fname in sorted(os.listdir(BASE)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(BASE, fname)
    if fix_file(fpath):
        changed_count += 1
        # Report new line count
        with open(fpath, 'r', encoding='utf-8') as f:
            new_lines = len(f.readlines())
        print(f'  FIXED: {fname} → {new_lines} lines')
    else:
        print(f'  OK:    {fname}')

print(f'\nDone! Fixed {changed_count} files.')
