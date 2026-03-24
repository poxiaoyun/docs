---
title: Boss 运营平台
updated: '2026-03-24'
author: Rune Docs Team
description: 面向平台管理员、运维和运营团队的 Boss 用户文档，覆盖 IAM、多租户治理、LLM 网关、Rune 资源治理和产品级设置。
tags:
  - boss
  - overview
---

# Boss 运营平台

Boss 是整套产品的管理中枢，负责账号与租户治理、集群资源管理、LLM 网关运营、产品设置以及 Moha 资源审核。平台管理员通常通过 Boss 统一完成“资源供给、权限控制、策略发布和运维巡检”。

## 当前产品结构

| 模块 | 作用 | 典型入口 |
| --- | --- | --- |
| 仪表盘 | 查看平台整体运营状态与关键统计 | `/docs/boss` |
| IAM 身份管理 | 管理用户、租户及成员关系 | `/docs/boss/iam` |
| 平台治理 | 从平台层面管理集群、租户与网关治理流程 | `/docs/boss/operations` |
| LLM 网关 | 配置 API Key、模型服务、审核和审计能力 | `/docs/boss/gateway` |
| Rune 智算管理 | 管理集群、资源池、规格、系统镜像与租户资源分配 | `/docs/boss/rune-admin` |
| Moha 管理 | 审核模型、数据集、镜像、Space 以及仓库运营内容 | `/docs/boss/moha-admin` |
| 系统设置 | 维护平台、Rune、Moha、ChatApp 和许可证配置 | `/docs/boss/settings` |

## 典型管理员路径

1. 在 IAM 中创建用户和租户。
2. 在 Rune 智算管理中接入集群、配置资源池与算力规格。
3. 给租户分配配额、工作空间和可用模板。
4. 在 LLM 网关中注册模型服务、发放 API Key、设置审核策略。
5. 在系统设置中维护品牌、Logo、开关项和许可证信息。

## 推荐阅读

- [平台仪表盘](/docs/boss)
- [IAM 身份管理](/docs/boss/iam)
- [LLM 网关](/docs/boss/gateway)
- [Rune 智算管理](/docs/boss/rune-admin)
- [系统设置](/docs/boss/settings)
