#!/usr/bin/env python3
"""Phase 3: Clean Rune Console module (10.rune) - remove dev content + migrate alerts."""
import re
import os

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/10.rune'


def migrate_alerts(content):
    """Migrate > 💡/⚠️/📖/[!TIP]/[!WARNING] to :::tip/:::warning/:::info."""
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


def remove_component_names(content):
    """Replace React component names with user-facing descriptions."""
    # Replace component name references in text
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
        # Replace backtick-wrapped: `SchemaForm` → 表单
        content = content.replace(f'`{old}`', new)
        # Also plain references in context
        content = re.sub(rf'\b{old}\b(?!\w)', new, content)

    return content


def remove_debounce_details(content):
    """Remove specific frontend implementation details like debounce timing."""
    content = re.sub(r'(?:（|[\(])?(?:\d+ms\s*)?防抖（debounce）(?:）|[\)])?', '', content)
    content = re.sub(r'(?:（|[\(])?(?:\d+)ms\s*debounce(?:）|[\)])?', '', content)
    return content


def remove_api_endpoint_sections(content):
    """Remove API endpoint tables at the bottom of files."""
    # Match "### 相关 API" or "### API 路径" sections
    content = re.sub(
        r'\n#{2,3}\s*(?:相关\s*)?API\s*(?:接口|路径|端点|层级).*?(?=\n#{1,3}\s[^#]|\n---|\Z)',
        '', content, flags=re.DOTALL
    )
    return content


def remove_internal_category_refs(content):
    """Remove internal category identifiers like category=app, category=im."""
    content = re.sub(r'`?category\s*=\s*\w+`?', '', content)
    # Clean up resulting empty or double-space sentences
    content = re.sub(r'\s{2,}', ' ', content)
    return content


def remove_internal_data_paths(content):
    """Remove internal data paths like instance.values.pipe.from[0].username."""
    content = re.sub(r'`instance\.values\.[^`]+`', '内部配置', content)
    return content


def sanitize_mermaid_api_endpoints(content):
    """Replace API endpoint paths in Mermaid diagrams."""
    # Replace typical REST endpoint patterns in Mermaid
    content = re.sub(
        r'(?:GET|POST|PUT|DELETE|PATCH)\s*/api/v1/tenants/\{[^}]+\}/clusters/[^\n"]+',
        '请求平台服务',
        content
    )
    return content


def remove_values_schema_refs(content):
    """Remove references to values.schema.json (Helm internal)."""
    content = re.sub(r'[（(]?`?values\.schema\.json`?[）)]?', '', content)
    return content


def remove_sse_api_details(content):
    """Remove SSE sequence diagrams with API body structures from chatapp."""
    # This is a targeted removal for experience.md and compare.md SSE details
    # Remove API body/structure blocks within mermaid
    return content  # Keep mermaid diagrams but component names already cleaned


def remove_hook_names(content):
    """Remove React hook references."""
    content = re.sub(r'`?useWorkspaceContext`?', '工作空间上下文', content)
    content = re.sub(r'`?usePermission`?', '权限检查', content)
    return content


def process_file(filepath):
    """Process a single file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Apply cleanups
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

    # Clean up multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        lines_diff = len(original.splitlines()) - len(content.splitlines())
        print(f"  ✅ {os.path.relpath(filepath, BASE)}: {alert_count} alerts, {lines_diff:+d} lines")
    else:
        print(f"  ⬜ {os.path.relpath(filepath, BASE)}: no changes")


# Process all files
for root, dirs, files in os.walk(BASE):
    dirs.sort()
    for fname in sorted(files):
        if fname.endswith('.md'):
            process_file(os.path.join(root, fname))

print("\nDone! Rune module cleaned.")
