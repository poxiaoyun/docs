---
title: 存储集群与运行时
updated: '2026-09-12'
author: Rune Docs Team
description: 介绍 Boss 中集群存储实例、系统实例和系统模板市场的管理方式。
tags:
  - boss
  - rune-admin
  - storage
  - system
---

# 存储集群与运行时

在单集群视角下，Boss 除管理业务工作负载外，也管理平台运行所需的存储与系统级实例。

## 相关页面

| 页面 | 前端路由 | 作用 |
| --- | --- | --- |
| 存储集群 | `/rune/clusters/:cluster/storages` | 以实例列表展示集群的存储类实例，可新增、查看和删除 |
| 系统应用 | `/rune/clusters/:cluster/systems` | 展示系统级实例与其运行状态 |
| 系统模板市场 | `/rune/clusters/:cluster/system-market` | 从市场选择模板并部署新的系统 / 存储实例 |

## 存储集群

存储集群与系统应用**共用同一套实例列表组件**，通过 `category` 区分：存储为 `category = storage`。

列表列字段：`name`、`product.version`、`status.phase`、`creationTimestamp`；操作支持编辑与删除。

常见使用方式：

1. 进入集群「存储集群」页查看已有存储实例。
2. 点击新增，跳转到系统模板市场选择存储类模板。
3. 填写部署参数并提交，回到列表确认运行状态。

## 系统应用与系统市场

系统应用面向整集群或平台侧基础设施，部署来源为系统模板市场。细节参见 [系统实例管理](./systems) 与 [系统模板市场](./system-market)。

## 适用场景

- 初始化新集群的基础能力。
- 补装公共运行时组件。
- 排查平台级存储实例运行异常。
