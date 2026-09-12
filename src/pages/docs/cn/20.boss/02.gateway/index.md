---
title: 大模型网关
updated: '2026-09-12'
description: 'LLM 网关管理——渠道接入、AI 网关配置、内容审查、调用日志与审计等全链路管控。'
tags:
  - boss
  - gateway
---

## 概述

LLM 网关是晓石智算平台的统一大模型接入层，由 Boss 平台管理员集中管理。它实现了多供应商渠道聚合、统一 API 接入、流量管控、内容安全审查和完整的调用审计能力。

网关功能按 Boss 控制台左侧「LLM 网关」菜单的子分组组织，各页面对应的控制台真实路由如下表（路由不含 `/boss` 前缀）。

## 模块总览

| 菜单分组 | 页面 | 控制台路由 | 文档 |
|----------|------|-----------|------|
| 大模型网关 | 数据看板 | `/gateway/operations` | [运营概览](/boss/gateway/operations) |
| 模型服务 | 渠道管理 | `/service-registrations` | [渠道管理](/boss/gateway/channels) |
| 模型服务 | 模型配置 | `/gateway/model-metadata` | [模型元数据](/boss/gateway/model-metadata) |
| 用户管理 | 令牌管理 | `/tokens` | [令牌管理](/boss/gateway/api-keys) |
| 用户管理 | 调用日志 | `/gateway/audit` | [调用日志](/boss/gateway/audit) |
| 安全服务 | 敏感词管理 | `/gateway/moderation/lexicon` | [内容审查](/boss/gateway/moderation) |
| 安全服务 | 策略管理 | `/gateway/moderation/policies` | [内容审查](/boss/gateway/moderation) |
| 安全服务 | 命中记录 | `/gateway/moderation/sensitive-hits` | [敏感命中](/boss/gateway/sensitive-hits) |
| 平台设置 | 网关配置 | `/gateway/config` | [网关配置](/boss/gateway/config) |
| 平台设置 | 货币配置 | `/gateway/currency-settings` | [币种设置](/boss/gateway/currency-settings) |

> ⚠️ 注意: 上表中的路由是 Boss 控制台前端代码里的真实路径（`src/routes/paths.ts`），不是文档站 URL。文档站页面 URL 统一以 `/boss/gateway/...` 开头。

## 相关能力

| 能力 | 说明 |
|------|------|
| 渠道与模型 | 配置上游供应商渠道、模型元数据与币种换算规则 |
| 访问凭证 | 管理网关令牌及其限流、IP 白名单、过期时间 |
| 内容安全 | 通过策略与词库对请求/响应做敏感内容检测，并查询命中记录 |
| 运行管控 | 全局开关、缓存、路由偏好、渠道回退与 IP 白名单 |
| 可观测 | 运营看板指标与完整调用日志、审计详情 |
