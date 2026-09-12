---
title: 概览
updated: '2026-09-12'
author: Rune Docs Team
description: 面向平台管理员、运维和运营团队的 Boss 用户文档，覆盖 IAM、多租户治理、LLM 网关、Rune 资源治理和产品级设置。
tags:
  - boss
  - overview
---

# 概览

Boss 是整套产品的管理中枢，负责账号与租户治理、集群资源管理、LLM 网关运营、产品设置以及 Moha 资源审核。平台管理员通常通过 Boss 统一完成「资源供给、权限控制、策略发布和运维巡检」。

## 当前产品结构

下表「典型入口」列给出的是**前端控制台的真实路由**（控制台 BOSS 路由根为 `/`），文档站自身的页面地址统一带 `/boss/` 前缀。

| 模块 | 作用 | 控制台入口 | 对应文档 |
| --- | --- | --- | --- |
| 仪表盘 | 查看平台整体运营状态与关键统计 | `/`、`/dashboard` | [首页仪表盘](/boss/dashboard) |
| IAM 身份管理 | 管理用户、租户及成员关系 | `/iam/users`、`/iam/tenants` | [IAM 身份管理](/boss/iam) |
| Rune 智算管理 | 管理集群、资源池、规格、系统镜像与租户资源分配 | `/rune/clusters`、`/rune/tenants` | [Rune 智算管理](/boss/rune-admin) |
| LLM 网关 | 管理渠道、模型元数据、令牌、调用日志与内容审查 | `/service-registrations`、`/tokens`、`/gateway/*` | [LLM 网关](/boss/gateway) |
| 网关内容审查 | 维护审核策略、词库与命中记录 | `/gateway/moderation/*` | [内容审查](/boss/gateway/moderation) |
| Moha 仓库管理 | 管理模型、数据集、镜像、Space 以及仓库运营内容 | `/moha/*`、`/moha/mirrors/*` | [Moha 仓库管理](/boss/moha-admin) |
| 系统设置 | 维护平台、Rune、Moha、ChatApp 和许可证配置 | `/settings/*` | [系统设置](/boss/settings) |

> ⚠️ 注意: 文档站侧边栏历史上存在过一个「平台治理」分组（`/boss/operations`），该路由在前端控制台中**并不存在**（`src/routes/sections/boss.tsx` 中无 `operations` 顶级路径），相关页面已归档。集群、租户配额、网关审核这些能力分散在 Rune 智算管理、IAM 与 LLM 网关模块中，见上表。

## 典型管理员路径

1. 在 IAM 中创建用户（`/iam/users`）和租户（`/iam/tenants`）。
2. 在 Rune 智算管理中接入集群（`/rune/clusters`）、配置资源池与算力规格。
3. 给租户分配配额与工作空间（`/rune/tenants/:tenant/quotas`、`/rune/tenants/:tenant/workspaces`）。
4. 在 LLM 网关中维护渠道与模型元数据、发放令牌、配置内容审查（`/service-registrations`、`/gateway/model-metadata`、`/tokens`、`/gateway/moderation`）。
5. 在系统设置中维护品牌、Logo、开关项和许可证信息（`/settings/*`）。

## 推荐阅读

- [首页仪表盘](/boss/dashboard)
- [IAM 身份管理](/boss/iam)
- [LLM 网关](/boss/gateway)
- [Moha 仓库管理](/boss/moha-admin)
- [Rune 智算管理](/boss/rune-admin)
- [系统设置](/boss/settings)
