#!/usr/bin/env python3
"""Rebuild console files: add frontmatter + apply Phase 3 cleanups (without the \\s{2,} bug)."""
import re
import os

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/10.rune/03.console'

# Frontmatter for each file (title, description)
FRONTMATTER = {
    'index.md': ('Rune 控制台', 'Rune 智算平台控制台的完整操作指南，涵盖工作空间、开发环境、模型训练、推理部署等核心功能。'),
    'workspace.md': ('工作空间', '工作空间的创建、管理、成员权限与资源配额配置。'),
    'devenv.md': ('开发环境', '交互式开发环境的创建、SSH/JupyterLab 访问与存储挂载。'),
    'finetune.md': ('模型微调', '模型微调任务的创建、参数配置、训练监控与结果导出。'),
    'experiment.md': ('实验管理', '实验的创建、运行跟踪、指标对比与版本管理。'),
    'inference.md': ('推理服务', '推理服务的部署、版本管理、流量配置与监控。'),
    'app.md': ('应用管理', '应用的创建、部署、版本管理与服务配置。'),
    'app-market.md': ('应用市场', '应用市场的浏览、安装与管理。'),
    'evaluation.md': ('模型评测', '模型评测任务的创建、评测指标配置与结果分析。'),
    'logging.md': ('日志与监控', '工作负载日志查询、资源监控与告警配置。'),
    'storage.md': ('存储管理', '存储卷的创建、挂载、数据管理与生命周期配置。'),
    'quota.md': ('配额管理', '资源配额的查看、申请与使用跟踪。'),
    'flavor.md': ('规格管理', '计算资源规格的查看、选择与自定义配置。'),
}

# Phase 3 cleanups (FIXED - no destructive \s{2,} regex)

def remove_component_names(content):
    component_map = {
        'ProductListView': '产品列表',
        'ProductDetailLayout': '产品详情',
        'VersionPopover': '版本选择',
        'SchemaForm': '表单',
        'UrlSelectButton': '地址选择',
        'InstancePVCList': '存储卷列表',
        'ServiceInfoCard': '服务信息',
        'PodList': '实例列表',
        'LogViewer': '日志查看器',
        'AbortController': '取消操作',
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
        '', content, flags=re.DOTALL
    )
    return content


def remove_internal_category_refs(content):
    """Remove internal category identifiers - FIXED version."""
    content = re.sub(r'`?category\s*=\s*\w+`?', '', content)
    # FIX: Only collapse multiple SPACES on the same line, NOT newlines
    content = re.sub(r'  +', ' ', content)
    return content


def remove_internal_data_paths(content):
    content = re.sub(r'`instance\.values\.[^`]+`', '内部配置', content)
    return content


def sanitize_mermaid_api_endpoints(content):
    content = re.sub(
        r'(?:GET|POST|PUT|DELETE|PATCH)\s*/api/v1/tenants/\{[^}]+\}/clusters/[^\n"]+',
        '请求平台服务',
        content
    )
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

    def replace_github_alert(marker, replacement_type):
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
            return f':::{replacement_type}\n{body}\n:::'
        return _replace

    content = re.sub(r'> \[!TIP\]\n(?:> .+\n?)+', replace_github_alert('[!TIP]', 'tip'), content)
    content = re.sub(r'> \[!WARNING\]\n(?:> .+\n?)+', replace_github_alert('[!WARNING]', 'warning'), content)

    return content, changes


def add_frontmatter(content, fname):
    """Add YAML frontmatter if not present."""
    if content.startswith('---\n'):
        return content  # Already has frontmatter

    title, desc = FRONTMATTER.get(fname, (fname.replace('.md', ''), ''))
    fm = f"""---
title: {title}
updated: '2025-12-04'
author: Rune Docs Team
description: {desc}
tags:
  - rune
  - console
---

"""
    return fm + content


def process_file(filepath):
    fname = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Add frontmatter
    content = add_frontmatter(content, fname)

    # Apply all Phase 3 cleanups (FIXED)
    content = remove_component_names(content)
    content = remove_debounce_details(content)
    content = remove_api_endpoint_sections(content)
    content = remove_internal_category_refs(content)
    content = remove_internal_data_paths(content)
    content = sanitize_mermaid_api_endpoints(content)
    content = remove_values_schema_refs(content)
    content = remove_hook_names(content)

    # Migrate alerts
    content, alert_count = migrate_alerts(content)

    # Clean up multiple blank lines (3+ → 2)
    content = re.sub(r'\n{3,}', '\n\n', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    lines = len(content.splitlines())
    print(f"  ✅ {fname}: {lines} lines, {alert_count} alerts migrated")


# Process only console files
for fname in sorted(os.listdir(BASE)):
    if fname.endswith('.md'):
        process_file(os.path.join(BASE, fname))

print("\nDone! Console files rebuilt with frontmatter + Phase 3 cleanups (fixed).")
