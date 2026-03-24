#!/usr/bin/env python3
"""Phase 4: Clean Boss module (20.boss) - remove dev content + migrate alerts."""
import re
import os

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/20.boss'


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

    # Multiple-line blockquotes: > 💡 text\n> more text
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

    # Multiline blockquote tips (lines starting with > 💡 followed by continuation > lines)
    content = re.sub(r'> 💡\s*\*{0,2}提示\*{0,2}[：:].*(?:\n>.*)*', replace_multiline_tip, content)
    # Multiline blockquote warnings
    content = re.sub(r'> ⚠️\s*\*{0,2}注意\*{0,2}[：:].*(?:\n>.*)*', replace_multiline_warning, content)
    # Single-line remaining 💡 (without 提示: prefix)
    content = re.sub(r'> 💡\s+(?!\*{0,2}提示)(.+)', lambda m: f':::tip\n{m.group(1).strip()}\n:::', content)
    # Single-line remaining ⚠️ (without 注意: prefix)
    content = re.sub(r'> ⚠️\s+(?!\*{0,2}注意)(.+)', lambda m: f':::warning\n{m.group(1).strip()}\n:::', content)
    # 📖 → info
    content = re.sub(r'> 📖\s+(.+)', replace_info, content)

    # GitHub-style [!TIP] / [!WARNING]
    def replace_github_alert(replacement_type):
        def _replace(m):
            nonlocal changes; changes += 1
            lines = m.group(0).split('\n')
            body_lines = []
            for line in lines[1:]:
                if line.startswith('> '):
                    body_lines.append(line[2:])
                elif line.strip() == '>':
                    body_lines.append('')
            body = '\n'.join(body_lines).strip()
            return f':::{replacement_type}\n{body}\n:::'
        return _replace

    content = re.sub(r'> \[!TIP\]\n(?:> .+\n?)+', replace_github_alert('tip'), content)
    content = re.sub(r'> \[!WARNING\]\n(?:> .+\n?)+', replace_github_alert('warning'), content)

    return content, changes


def remove_component_names(content):
    """Replace React component names with user-facing descriptions."""
    component_map = {
        'CollapseItem': '折叠面板',
        'FilterBar': '筛选栏',
        'FlavorFilterBar': '规格筛选栏',
        'ObjectStatus': '状态标识',
        'StatusWrapped': '状态标识',
        'InstanceListView': '实例列表',
        'ProductListView': '产品列表',
        'DeployInstanceView': '部署视图',
        'TaskSelector': '任务选择器',
        'GenealogyField': '关联关系',
        'DataManager': '数据管理器',
        'LexiconImportDialog': '词库导入对话框',
        'PolicyRuleConfig': '策略规则配置',
        'Monaco Editor': '代码编辑器',
    }
    for old, new in component_map.items():
        content = content.replace(f'`{old}`', new)
        content = re.sub(rf'\b{re.escape(old)}\b', new, content)
    return content


def remove_api_sections(content):
    """Remove API endpoint tables/sections."""
    # Remove "### 相关 API" or "## API 接口" sections
    content = re.sub(
        r'\n#{2,3}\s*(?:相关\s*)?API\s*(?:接口|路径|端点).*?(?=\n#{1,3}\s[^#]|\n---|\Z)',
        '', content, flags=re.DOTALL
    )
    return content


def remove_data_structure_sections(content):
    """Remove data structure/data model sections."""
    content = re.sub(
        r'\n#{2,3}\s*(?:数据模型|数据结构|TypeScript\s*接口).*?(?=\n#{1,3}\s[^#]|\n---|\Z)',
        '', content, flags=re.DOTALL
    )
    return content


def sanitize_mermaid_api(content):
    """Replace API endpoints in Mermaid diagrams."""
    api_replacements = {
        'POST /api/iam/users': '创建用户',
        'PUT /api/iam/users': '更新用户',
        'DELETE /api/iam/users': '删除用户',
        'GET /api/iam/users': '获取用户',
        'POST /api/iam/tenants': '创建租户',
        'POST /api/airouter/v1/cache/rebuild': '重建缓存',
    }
    for old, new in api_replacements.items():
        content = content.replace(old, new)
    # Generic REST API patterns in text
    content = re.sub(
        r'`(?:GET|POST|PUT|DELETE|PATCH)\s*/api/[^`]+`',
        lambda m: '相关接口',
        content
    )
    return content


def remove_inline_api_refs(content):
    """Remove inline API endpoint references."""
    content = re.sub(
        r'系统(?:会)?(?:自动)?调用\s*`(?:GET|POST|PUT|DELETE)\s*/api/[^`]+`\s*(?:接口)?',
        '系统',
        content
    )
    return content


def remove_debounce_details(content):
    """Remove debounce timing details."""
    content = re.sub(r'(?:（)?(?:\d+ms\s*)?防抖[（(]?debounce[）)]?(?:）)?', '', content)
    return content


def remove_internal_fields(content):
    """Remove internal data path references."""
    content = re.sub(r'`config\.\w+`', '配置项', content)
    content = re.sub(r'`status\.\w+(?:\.\w+)*`', '状态字段', content)
    content = re.sub(r'`kube\.config`', 'kubeconfig', content)
    return content


def remove_typescript_interfaces(content):
    """Remove TypeScript interface blocks."""
    content = re.sub(
        r'```(?:typescript|ts)\n(?:export\s+)?interface\s+\w+.*?```',
        '', content, flags=re.DOTALL
    )
    return content


def remove_method_refs(content):
    """Remove internal method references."""
    content = re.sub(r'`\w+(?:Instance|Endpoint|Token)\(\w*\)`', '相关操作', content)
    content = re.sub(r'`getToken\(\)`', '获取令牌', content)
    content = re.sub(r'`createSystemInstance\([^)]*\)`', '创建实例', content)
    content = re.sub(r'`listExperimentEndpoints`', '获取实验端点', content)
    return content


def remove_mock_data_refs(content):
    """Remove references to Mock data."""
    content = re.sub(r'(?:（)?Mock\s*数据(?:）)?', '（示例数据）', content)
    return content


def process_file(filepath):
    """Process a single file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Apply cleanups
    content = remove_component_names(content)
    content = remove_api_sections(content)
    content = remove_data_structure_sections(content)
    content = sanitize_mermaid_api(content)
    content = remove_inline_api_refs(content)
    content = remove_debounce_details(content)
    content = remove_internal_fields(content)
    content = remove_typescript_interfaces(content)
    content = remove_method_refs(content)
    content = remove_mock_data_refs(content)

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

print("\nDone! Boss module cleaned.")
