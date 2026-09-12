---
title: 智算平台设置
updated: '2026-09-12'
description: '智算平台的展示配置——Logo、产品标题、产品描述与 Moha / KMS 地址。'
tags:
  - boss
  - settings
---

## 功能简介

Rune 设置维护智算平台（Rune）在控制台中的展示信息，包括 Logo、产品标题、产品描述，以及 Moha 服务地址与 KMS 服务地址；页面下方还有一张**开发服务闲置监控**功能卡。展示配置写入平台全局配置的 `rune` 字段与顶层地址字段。

本页对应 BOSS 控制台「平台管理 → **智算平台设置**」（菜单文案取自 `navbar.rune_setting`）。

## 进入路径

BOSS 控制台 → 平台管理 → **智算平台设置**

前端真实路由：`/settings/rune`

## 配置项

| 界面标签 | 字段 | 类型 | 约束 | 说明 |
|---------|------|------|------|------|
| （Logo 上传） | `rune.logo` | 图片上传 | 最大 **128 KB**，仅 **PNG / SVG** | 以 Base64 存储 |
| 产品标题 | `rune.title` | 文本 | 最大 **10 个字符** | 导航栏标题 |
| 产品描述 | `rune.description` | 多行文本 | 最大 **100 个字符**，4 行 | 产品简介 |
| Moha 地址 | `mohaAddress` | 文本 | — | Moha 服务地址 |
| KMS 地址 | `kmsAddress` | 文本 | — | KMS 服务地址 |

> ⚠️ 注意: 「产品标题」的字段名是 **`rune.title`**（界面标签为 `navbar_title`），不是 `navbar_title` 字段。旧文档写 `navbar_title` 与代码不符。

> ⚠️ 注意: Logo 的大小上限（128 KB）远小于平台设置的 3 MB，因为它以 Base64 形式直接存进配置中。

## 开发服务闲置监控

页面在展示配置卡下方还有第二张卡「开发服务闲置监控」，用于在实例 GPU / vGPU 使用率连续一段时间为 0% 时自动暂停开发服务。该卡独立保存，写入 `rune.idleMonitor.im`。

| 界面标签 | 字段 | 类型 | 约束 | 默认值 |
|---------|------|------|------|--------|
| 启用开发服务闲置自动暂停 | `rune.idleMonitor.im.enabled` | 开关 | — | 关闭 |
| 闲置时长（分钟） | `rune.idleMonitor.im.idleMinutes` | 数字 | 整数，**1–10080** 分钟 | **30** |

- 「闲置时长」在开关关闭时禁用。
- 提交时写入 `rune.idleMonitor.im.{enabled, idleMinutes}`，保存成功后同样提示「更新成功,请刷新页面」。

## 保存行为

- **Logo 上传**：选择文件后立即触发一次保存（把 `rune.logo`、`rune.title`、`rune.description`、`mohaAddress`、`kmsAddress` 一并写入）
- **确认**：保存表单中的全部字段

写入的配置结构：

```yaml
mohaAddress: "https://moha.example.com"
kmsAddress: "https://kms.example.com"
rune:
  logo: "data:image/png;base64,iVBORw0KGgo..."
  title: "Rune"
  description: "智算平台产品简介"
```

保存成功后提示「更新成功,请刷新页面」。

## 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/iam/global-config` | `PUT` | 保存全局配置（Rune 配置位于其中的 `rune` 字段） |

## 权限要求

需要 **系统管理员** 角色。
