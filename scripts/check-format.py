#!/usr/bin/env python3
"""Check formatting issues in console doc files."""
import os, glob

base = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/10.rune/03.console'

for f in sorted(glob.glob(os.path.join(base, '*.md'))):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
        lines = content.split('\n')
    
    name = os.path.basename(f)
    issues = []
    
    # Check if frontmatter closing --- has content on same line
    for i, line in enumerate(lines):
        if i >= 2 and line.startswith('---') and len(line.strip()) > 3:
            issues.append(f"  Line {i+1}: frontmatter --- merged with content: '{line[:80]}...'")
            break
    
    # Check for long lines (> 200 chars) that suggest merged content
    long_lines = 0
    for i, line in enumerate(lines):
        if len(line) > 200 and not line.startswith('|') and not line.startswith('```'):
            long_lines += 1
            if long_lines <= 3:
                issues.append(f"  Line {i+1}: very long ({len(line)} chars): '{line[:80]}...'")
    
    # Check for unclosed ::: blocks
    open_fences = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith(':::') and len(stripped) > 3:
            open_fences += 1
        elif stripped == ':::':
            open_fences -= 1
    if open_fences != 0:
        issues.append(f"  Unclosed ::: blocks: {open_fences}")
    
    if issues:
        print(f"\n{name} ({len(lines)} lines) - PROBLEMS:")
        for issue in issues:
            print(issue)
    else:
        print(f"{name} ({len(lines)} lines) - OK")

print("\nDone checking.")
