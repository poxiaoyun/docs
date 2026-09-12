---
title: '网关设置'
updated: '2026-09-12'
description: '网关的展示配置——Logo、产品标题与产品描述。'
tags:
  - boss
  - settings
---

## 功能简介

网关设置维护网关相关产品在控制台中的展示信息，包括 Logo、产品标题与产品描述。配置写入平台全局配置的 `chatapp` 字段。

本页对应 BOSS 控制台「平台管理 → **网关设置**」（菜单文案取自 `navbar.chatapp_setting`）。

## 进入路径

BOSS 控制台 → 平台管理 → **网关设置**

前端真实路由：`/settings/chatapp`

## 配置项

| 界面标签 | 字段 | 类型 | 约束 | 说明 |
|---------|------|------|------|------|
| （Logo 上传） | `chatapp.logo` | 图片上传 | 最大 **128 KB**，仅 **PNG / SVG** | 以 Base64 存储 |
| 产品标题 | `chatapp.title` | 文本 | 最大 **10 个字符** | 导航栏标题 |
| 产品描述 | `chatapp.description` | 多行文本 | 最大 **100 个字符**，4 行 | 产品简介 |

> ⚠️ 注意: 「产品标题」的字段名是 **`chatapp.title`**（界面标签为 `navbar_title`），不是 `navbar_title` 字段。

写入的配置结构：

```yaml
chatapp:
  logo: "data:image/png;base64,iVBORw0KGgo..."
  title: "ChatApp"
  description: "产品简介"
```

保存成功后提示「更新成功,请刷新页面」。

## 与 Rune / Moha 设置的区别

三者结构一致、互相独立，各自写入全局配置下的不同字段：

| 页面 | 配置字段 | 接口 |
|------|---------|------|
| [Rune 设置](/boss/settings/rune) | `rune.{logo,title,description}` + `mohaAddress` / `kmsAddress` | `/api/iam/global-config` |
| [Moha 设置](/boss/settings/moha) | `moha.{logo,title,description}` + `space.*` | `/api/iam/global-config`、`/api/moha/global-config` |
| 网关设置 | `chatapp.{logo,title,description}` | `/api/iam/global-config` |

## 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/iam/global-config` | `GET` / `PUT` | 读取 / 保存全局配置 |

## 权限要求

需要 **系统管理员** 角色。
