---
title: AI助手设置
updated: '2026-09-12'
description: '配置 AI 助手的名称、头像与 Holmes API Key，并查看服务就绪状态。'
tags:
  - boss
  - settings
---

## 功能简介

AI 助手设置用于配置平台内 AI 诊断助手的名称、头像与 Holmes API Key，并展示 AI 诊断服务的健康状态。只有服务健康且已加载模型时，才允许启用助手。

本页对应 BOSS 控制台「平台管理 → **AI助手设置**」（菜单文案取自 `navbar.ai_assistant_manager`）。

## 进入路径

BOSS 控制台 → 平台管理 → **AI助手设置**

前端真实路由：`/settings/ai-assistant`

## 配置项

| 界面标签 | 字段 | 类型 | 约束 | 说明 |
|---------|------|------|------|------|
| 助手头像 | `aiDiagnostics.avatar` | 图片上传 | 最大 **128 KB**，仅 **PNG / JPG / WEBP** | 裁剪输出 160px，Base64 存储 |
| 名称 | `aiDiagnostics.name` | 文本 | 最大 **32 个字符** | 默认为 `晓石 AI助手` |
| Holmes API Key | （独立提交，见下） | 密码输入 | — | 用于 Holmes 插件鉴权 |
| AI助手 | `aiDiagnostics.enabled` | 开关 | 需服务就绪 | 是否启用助手 |

> 💡 提示: 名称留空保存时会回退为默认值 `晓石 AI助手`。

### Holmes API Key

Holmes API Key 通过独立接口保存（`PUT /api/cloud/diagnostics/config`），不写入平台全局配置。输入框下方的提示按服务端返回的两种状态给出：

| 状态 | 提示含义 |
|------|---------|
| `holmesAPIKeyConfigured = true` 且 `holmesAPIKeyManaged = true` | 已由 Boss 设置管理；留空保存保持当前密钥，输入新密钥后更新 |
| `holmesAPIKeyConfigured = true` 且 `holmesAPIKeyManaged = false` | 当前使用服务端兼容配置；输入新密钥保存后改由 Boss 设置管理 |
| `configured = false` | 未配置，需输入 Holmes 插件中的 API Key |

留空时不会覆盖已有密钥；只有填写了新值才会调用保存接口。

## 服务状态

页面展示 AI 诊断服务的状态标签与说明文案，并提供 **刷新状态** 按钮（`GET /api/cloud/diagnostics/status`）。

| 条件 | 标签 | 文案 |
|------|------|------|
| `healthy && ready && models.length > 0` | success | 就绪 `{模型数}` |
| `healthy` 但未就绪或无模型 | warning | 未就绪 |
| 不健康 | error | 不可用 |

> ⚠️ 注意: 当服务不健康、未就绪或模型数为 0 时，**AI助手开关会被强制置为关闭且不可操作**；此时保存也会把 `enabled` 写为 `false`。

## 保存行为

点击 **确认** 时：

1. 若填写了新的 Holmes API Key，先调用 `PUT /api/cloud/diagnostics/config`
2. 再调用 `PUT /api/iam/global-config` 保存 `aiDiagnostics.{name, avatar, enabled}`
3. 成功后刷新配置与服务状态

头像在上传时只更新本地预览，**必须点确认才会写入配置**（上传时提示「头像已选择，保存后生效。」）。

写入的配置结构：

```yaml
aiDiagnostics:
  name: "晓石 AI助手"
  avatar: "data:image/png;base64,iVBORw0KGgo..."
  enabled: true
```

## 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/iam/global-config` | `GET` / `PUT` | 读取 / 保存助手名称、头像、启用状态 |
| `/api/cloud/diagnostics/status` | `GET` | 读取诊断服务状态 |
| `/api/cloud/diagnostics/config` | `GET` / `PUT` | 读取 / 更新 Holmes API Key 配置 |
| `/api/cloud/diagnostics/models` | `GET` | 读取可用模型列表 |

## 权限要求

需要 **系统管理员** 角色。
