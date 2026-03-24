#!/usr/bin/env python3
"""Phase 2: Clean account module (05.account) - remove dev content + migrate alerts."""
import re
import os

BASE = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/05.account'


def migrate_alerts(content):
    """Migrate > 💡/⚠️/📖/[!TIP]/[!WARNING] to :::tip/:::warning/:::info."""
    changes = 0

    def replace_tip(m):
        nonlocal changes
        changes += 1
        text = m.group(1).strip()
        return f':::tip\n{text}\n:::'

    def replace_warning(m):
        nonlocal changes
        changes += 1
        text = m.group(1).strip()
        return f':::warning\n{text}\n:::'

    def replace_info(m):
        nonlocal changes
        changes += 1
        text = m.group(1).strip()
        return f':::info\n{text}\n:::'

    # > 💡 **提示**：text  or  > 💡 提示: text  or  > 💡 text
    content = re.sub(r'> 💡\s*\*{0,2}提示\*{0,2}[：:]\s*(.+)', replace_tip, content)
    content = re.sub(r'> 💡\s+(?!\*{0,2}提示)(.+)', replace_tip, content)

    # > ⚠️ **注意**：text  or  > ⚠️ 注意: text
    content = re.sub(r'> ⚠️\s*\*{0,2}注意\*{0,2}[：:]\s*(.+)', replace_warning, content)
    content = re.sub(r'> ⚠️\s+(?!\*{0,2}注意)(.+)', replace_warning, content)

    # > 📖 text
    content = re.sub(r'> 📖\s+(.+)', replace_info, content)

    # > [!TIP]\n> text...
    def replace_github_tip(m):
        nonlocal changes
        changes += 1
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
        return f':::tip\n{body}\n:::'

    content = re.sub(r'> \[!TIP\]\n(?:> .+\n?)+', replace_github_tip, content)

    # > [!WARNING]\n> text...
    def replace_github_warning(m):
        nonlocal changes
        changes += 1
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
        return f':::warning\n{body}\n:::'

    content = re.sub(r'> \[!WARNING\]\n(?:> .+\n?)+', replace_github_warning, content)

    return content, changes


def remove_api_section(content):
    """Remove '相关 API 接口' sections (tables of API endpoints at bottom)."""
    # Match "### 相关 API 接口" or "## 相关 API 接口" followed by table until next section or end
    pattern = r'\n#{2,3}\s*相关\s*API\s*接口.*?(?=\n#{1,3}\s|\n---|\Z)'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    return content


def remove_data_structure_section(content):
    """Remove data structure sections (TypeScript-style field tables)."""
    # Match sections like "### 用户数据结构", "### 租户数据结构", "### SSH Key 数据结构",
    # "### 设置数据结构" etc.
    pattern = r'\n#{2,3}\s*(?:用户|租户|SSH Key|设置|MFA)数据结构.*?(?=\n#{1,3}\s[^#]|\n---|\Z)'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    return content


def sanitize_mermaid_api(content):
    """Replace API endpoints in Mermaid diagrams with user-facing descriptions."""
    replacements = {
        'POST /api/iam/login': '提交登录请求',
        'POST /api/iam/register': '提交注册请求',
        'POST /api/iam/send-code': '发送验证码',
        'POST /api/iam/reset-password': '提交密码重置',
        'POST /api/iam/verify-mfa': '验证 MFA',
        'POST /api/iam/init-mfa': '初始化 MFA',
        'POST /api/iam/tenant-register': '提交租户注册',
        'GET /api/iam/current/tenants': '获取租户列表',
        'GET /api/iam/login-config': '加载登录配置',
        'GET /api/iam/captcha': '获取验证码图片',
        'PUT /api/iam/current/preferences': '保存偏好设置',
        'POST /api/iam/current/apikeys': '生成密钥对',
        'POST /api/iam/current/avatar': '上传头像',
    }
    for old, new in replacements.items():
        content = content.replace(old, new)
    return content


def remove_inline_api_refs(content):
    """Remove inline API endpoint references like '系统调用 `POST /api/...` 接口'."""
    # Replace patterns like "系统调用 `POST /api/iam/xxx` 接口" with "系统"
    content = re.sub(
        r'系统(?:会)?(?:自动)?调用\s*`(?:GET|POST|PUT|DELETE)\s*/api/[^`]+`\s*(?:接口)?',
        '系统',
        content
    )
    # Replace "前端会调用 `GET /api/...` 接口获取..." with "系统会获取..."
    content = re.sub(
        r'前端(?:会)?调用\s*`(?:GET|POST|PUT|DELETE)\s*/api/[^`]+`\s*(?:接口)?',
        '系统',
        content
    )
    # Clean up "返回 Base64 编码" type API response details
    content = re.sub(r'，返回\s*Base64\s*编码(?:的[^。，]*)?', '', content)
    return content


def remove_jwt_section(content):
    """Remove JWT Token implementation details section."""
    pattern = r'\n#{2,3}\s*JWT\s*Token\s*(?:机制|实现|管理).*?(?=\n#{1,3}\s[^#]|\n---|\Z)'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    return content


def remove_frontend_permission_section(content):
    """Remove '前端权限控制机制' section from roles.md."""
    pattern = r'\n#{2,3}\s*前端权限控制机制.*?(?=\n#{1,3}\s[^#]|\n---|\Z)'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    return content


def remove_component_names(content):
    """Replace React component names with user-facing descriptions."""
    # In Mermaid diagrams, replace component names
    replacements = {
        'TenantInfo': '租户信息',
        'MemberStats': '成员统计',
        'MembersTable': '成员列表',
        'TenantQuota': '租户配额',
        'TenantWorkspaces': '工作空间列表',
        'TenantEvents': '操作日志',
        'UploadAvatarWithCrop': '上传并裁剪头像',
    }
    for old, new in replacements.items():
        content = content.replace(old, new)
    return content


def remove_canvas_qrcode_refs(content):
    """Remove references to Canvas rendering and qrcode library."""
    content = re.sub(r'(?:页面)?通过\s*Canvas\s*渲染(?:显示)?', '页面显示', content)
    content = re.sub(r'`qrcode`\s*库将\s*`url`\s*渲染为\s*QR\s*二维码（Canvas\s*渲染）', '页面将链接渲染为二维码', content)
    return content


def remove_api_json_blocks(content):
    """Remove JSON request/response examples embedded in text."""
    # Remove inline JSON-like descriptions: {action, target, type:"email", captcha?}
    content = re.sub(r'\s*`\{[^}]*action[^}]*\}`', '', content)
    return content


def clean_security_api_details(content):
    """Remove detailed API parameter tables from security.md."""
    # Remove "验证码机制" detailed API parameter section (but keep the user-facing description)
    pattern = r'\n\|\s*参数名\s*\|.*?(?=\n#{1,3}\s|\n---|\n\n[^|])'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    # Remove "API：POST /api/..." lines
    content = re.sub(r'\n\s*API[：:]\s*(?:GET|POST|PUT|DELETE)\s*/api/[^\n]+', '', content)
    # Remove MFAConf detailed structure
    content = re.sub(r'\n\|\s*字段\s*\|\s*类型\s*\|.*?(?=\n#{1,3}\s|\n---|\n\n[^|])', '', content, flags=re.DOTALL)
    return content


def process_file(filepath):
    """Process a single file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    fname = os.path.basename(filepath)

    # Apply all cleanups
    content = remove_api_section(content)
    content = remove_data_structure_section(content)
    content = remove_jwt_section(content)
    content = remove_frontend_permission_section(content)
    content = sanitize_mermaid_api(content)
    content = remove_inline_api_refs(content)
    content = remove_component_names(content)
    content = remove_canvas_qrcode_refs(content)
    content = remove_api_json_blocks(content)

    if 'security' in fname:
        content = clean_security_api_details(content)

    # Migrate alerts (last, after content changes)
    content, alert_count = migrate_alerts(content)

    # Clean up multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        lines_removed = len(original.splitlines()) - len(content.splitlines())
        print(f"  ✅ {os.path.relpath(filepath, BASE)}: {alert_count} alerts migrated, {lines_removed} lines removed")
    else:
        print(f"  ⬜ {os.path.relpath(filepath, BASE)}: no changes")


# Process all files
for root, dirs, files in os.walk(BASE):
    for fname in sorted(files):
        if fname.endswith('.md'):
            process_file(os.path.join(root, fname))

print("\nDone! Account module cleaned.")
