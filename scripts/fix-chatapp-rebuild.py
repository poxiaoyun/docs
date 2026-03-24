#!/usr/bin/env python3
"""Rebuild chatapp files: add frontmatter + apply Phase 3 cleanups (fixed)."""
import re
import os

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/10.rune/05.chatapp'

FRONTMATTER = {
    'index.md': ('ChatApp 智能对话', 'ChatApp 智能对话平台的功能概述与使用指南。'),
    'compare.md': ('模型对比', '多模型对话能力横向对比与评估。'),
    'debug.md': ('Prompt 调试', 'Prompt 调试与优化工具的使用指南。'),
    'experience.md': ('对话体验', '智能对话体验功能的使用与配置。'),
    'token.md': ('Token 用量', 'Token 用量统计、配额管理与成本优化。'),
}

def remove_component_names(content):
    component_map = {
        'ProductListView': '产品列表', 'ProductDetailLayout': '产品详情',
        'VersionPopover': '版本选择', 'SchemaForm': '表单',
        'UrlSelectButton': '地址选择', 'InstancePVCList': '存储卷列表',
        'ServiceInfoCard': '服务信息', 'PodList': '实例列表',
        'LogViewer': '日志查看器', 'AbortController': '取消操作',
    }
    for old, new in component_map.items():
        content = content.replace(f'`{old}`', new)
        content = re.sub(rf'\b{old}\b(?!\w)', new, content)
    return content

def remove_debounce_details(content):
    content = re.sub(r'(?:（|[\(])?(?:\d+ms\s*)?防抖（debounce）(?:）|[\)])?', '', content)
    content = re.sub(r'(?:（|[\(])?(?:\d+)ms\s*debounce(?:）|[\)])?', '', content)
    return content

def remove_api_endpoint_sections(content):
    content = re.sub(
        r'\n#{2,3}\s*(?:相关\s*)?API\s*(?:接口|路径|端点|层级).*?(?=\n#{1,3}\s[^#]|\n---|\Z)',
        '', content, flags=re.DOTALL)
    return content

def remove_internal_category_refs(content):
    content = re.sub(r'`?category\s*=\s*\w+`?', '', content)
    content = re.sub(r'  +', ' ', content)
    return content

def remove_internal_data_paths(content):
    content = re.sub(r'`instance\.values\.[^`]+`', '内部配置', content)
    return content

def sanitize_mermaid_api_endpoints(content):
    content = re.sub(
        r'(?:GET|POST|PUT|DELETE|PATCH)\s*/api/v1/tenants/\{[^}]+\}/clusters/[^\n"]+',
        '请求平台服务', content)
    return content

def remove_values_schema_refs(content):
    content = re.sub(r'[（(]?`?values\.schema\.json`?[）)]?', '', content)
    return content

def remove_hook_names(content):
    content = re.sub(r'`?useWorkspaceContext`?', '工作空间上下文', content)
    content = re.sub(r'`?usePermission`?', '权限检查', content)
    return content

def migrate_alerts(content):
    changes = 0
    def replace_tip(m):
        nonlocal changes; changes += 1
        return f':::tip\n{m.group(1).strip()}\n:::'
    def replace_warning(m):
        nonlocal changes; changes += 1
        return f':::warning\n{m.group(1).strip()}\n:::'
    def replace_info(m):
        nonlocal changes; changes += 1
        return f':::info\n{m.group(1).strip()}\n:::'

    content = re.sub(r'> 💡\s*\*{0,2}提示\*{0,2}[：:]\s*(.+)', replace_tip, content)
    content = re.sub(r'> 💡\s+(?!\*{0,2}提示)(.+)', replace_tip, content)
    content = re.sub(r'> ⚠️\s*\*{0,2}注意\*{0,2}[：:]\s*(.+)', replace_warning, content)
    content = re.sub(r'> ⚠️\s+(?!\*{0,2}注意)(.+)', replace_warning, content)
    content = re.sub(r'> 📖\s+(.+)', replace_info, content)

    def replace_github_alert(marker, rt):
        def _replace(m):
            nonlocal changes; changes += 1
            lines = m.group(0).split('\n')
            body_lines = []
            for line in lines[1:]:
                if line.startswith('> '):
                    body_lines.append(line[2:])
                elif line.strip() == '>':
                    body_lines.append('')
                else:
                    break
            body = '\n'.join(body_lines).strip()
            return f':::{rt}\n{body}\n:::'
        return _replace

    content = re.sub(r'> \[!TIP\]\n(?:> .+\n?)+', replace_github_alert('[!TIP]', 'tip'), content)
    content = re.sub(r'> \[!WARNING\]\n(?:> .+\n?)+', replace_github_alert('[!WARNING]', 'warning'), content)
    return content, changes

def add_frontmatter(content, fname):
    if content.startswith('---\n'):
        return content
    title, desc = FRONTMATTER.get(fname, (fname.replace('.md', ''), ''))
    fm = f"""---
title: {title}
updated: '2025-12-04'
author: Rune Docs Team
description: {desc}
tags:
  - rune
  - chatapp
---

"""
    return fm + content

def process_file(filepath):
    fname = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = add_frontmatter(content, fname)
    content = remove_component_names(content)
    content = remove_debounce_details(content)
    content = remove_api_endpoint_sections(content)
    content = remove_internal_category_refs(content)
    content = remove_internal_data_paths(content)
    content = sanitize_mermaid_api_endpoints(content)
    content = remove_values_schema_refs(content)
    content = remove_hook_names(content)
    content, alert_count = migrate_alerts(content)
    content = re.sub(r'\n{3,}', '\n\n', content)
    # Clean up empty parens from category removal
    content = re.sub(r'（\s*，\s*）', '', content)
    content = re.sub(r'（\s*）', '', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    lines = len(content.splitlines())
    print(f'  ✅ {fname}: {lines} lines, {alert_count} alerts migrated')

for fname in sorted(os.listdir(BASE)):
    if fname.endswith('.md'):
        process_file(os.path.join(BASE, fname))

print('\nDone! ChatApp files rebuilt.')
