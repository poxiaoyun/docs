---
title: 平台
updated: '2026-09-12'
description: 'Boss 平台全局配置——品牌与登录页、子产品设置、AI 助手、许可证与成员管理。'
tags:
  - boss
  - settings
---

## 概述

系统设置是 Boss 运营平台的全局配置中心，对应控制台左侧「平台管理」菜单分组。管理员在此维护平台品牌与登录页展示、各子产品的展示配置、AI 助手、许可证与平台成员。

## 模块总览

| 页面 | 菜单文案（i18n key） | 控制台路由 | 文档 |
|------|---------------------|-----------|------|
| 平台设置 | `navbar.platform_setting` = 平台设置 | `/settings/platform` | [平台设置](/boss/settings/platform) |
| 智算平台设置 | `navbar.rune_setting` = 智算平台设置 | `/settings/rune` | [Rune 设置](/boss/settings/rune) |
| 魔哈Hub设置 | `navbar.moha_setting` = 魔哈Hub设置 | `/settings/moha` | [Moha 设置](/boss/settings/moha) |
| 网关设置 | `navbar.chatapp_setting` = 网关设置 | `/settings/chatapp` | [网关设置](/boss/settings/chatapp) |
| AI助手设置 | `navbar.ai_assistant_manager` = AI助手设置 | `/settings/ai-assistant` | [AI 助手设置](/boss/settings/ai-assistant) |
| 许可证 | `navbar.license` = 许可证 | `/settings/license` | [许可证管理](/boss/settings/license) |
| 系统成员 | `navbar.system_member` = 系统成员 | `/settings/members` | [系统成员管理](/boss/settings/members) |

> ⚠️ 注意: 上表的路由是 Boss 控制台前端代码中的真实路径（`src/routes/paths.ts`），统一带 `/settings` 前缀，不是文档站 URL。

## 说明

- **平台设置**、**Rune 设置**、**Moha 设置**、**网关设置** 都是「子产品展示配置」：维护该产品在控制台中的名称、Logo、描述等展示信息，并写入平台的全局配置（`/api/iam/global-config`、`/api/moha/global-config`）。其中 **Rune 设置** 还额外包含「开发服务闲置监控」功能卡（写入 `rune.idleMonitor.im`）。
- **AI助手设置** 与 **许可证** 是功能配置，分别管理 AI 诊断助手的启用状态与产品授权。
- **成员管理** 维护 Boss 平台侧的成员账号。

> ⚠️ 注意: 「动态仪表盘」不是平台管理菜单下的页面，它位于 **Rune 智算管理 → 集群 → 动态仪表盘**，路由为 `/rune/clusters/:cluster/dynamic-dashboard`。详见 [动态仪表盘](/boss/rune-admin/dynamic-dashboard)。

## 权限要求

需要 **系统管理员** 角色。
