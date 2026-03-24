---
title: LLM 网关
updated: '2026-03-23'
description: LLM 网关管理——渠道接入、API Key 发放、内容审核、审计日志等全链路管控。
tags:
  - boss
  - gateway
---

## 概述

LLM 网关是晓石智算平台的统一大模型接入层，由 Boss 平台管理员集中管理。它实现了多供应商渠道聚合、统一 API 接入、流量管控、内容安全审核和完整的审计追踪能力。

## 核心功能

| 模块 | 说明 |
|------|------|
| [渠道管理](/docs/boss/gateway/channels) | 配置上游 LLM 服务提供方（OpenAI、本地推理等） |
| [API Key](/docs/boss/gateway/api-keys) | 创建与管理网关 API Key，设置调用限额 |
| [网关配置](/docs/boss/gateway/config) | 全局参数、路由策略、负载均衡等配置 |
| [内容审核](/docs/boss/gateway/moderation) | 输入/输出内容安全过滤与审核规则 |
| [运营管理](/docs/boss/gateway/operations) | 调用统计、用量分析与限流配置 |
| [审计日志](/docs/boss/gateway/audit) | 完整的调用记录查询与审计 |
| [服务注册](/docs/boss/gateway/service-reg) | 将推理服务注册为网关可用的渠道 |
