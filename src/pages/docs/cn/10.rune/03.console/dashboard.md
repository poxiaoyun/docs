---
title: 首页
updated: '2026-09-12'
description: Rune 控制台首页的实际区块构成、上下文选择与使用方式。
tags:
  - rune
  - console
  - dashboard
---

# 首页

Rune 首页是进入 Rune 控制台后的默认页面，用于展示当前租户、集群和工作空间上下文下的资源概览与工作负载状态。

## 进入路径

Rune 控制台 → 首页

路径：`/rune/dashboard`

## 使用前提

- 已登录并选择租户。
- 当前账号具备 Rune 产品访问权限。
- 需要在顶部选择集群与工作空间；未选择工作空间时页面会提示先选择工作空间。

## 页面区块

首页按以下顺序渲染（`src/pages/rune/home/dashboard.tsx`）：

| 区块 | 组件 | 说明 |
| --- | --- | --- |
| 页头 | `OverviewHeader` | 标题与刷新按钮，展示刷新中状态 |
| 关注提示 | `AttentionBanner` | 当存在需要关注的事项时展示 |
| 概览卡片 | `OverviewCards` | 当前工作空间的资源/工作负载汇总卡片 |
| 资源概览 | `ResourceOverview` | 资源用量与配额对比 |
| 存储概览 | `StorageOverview` | 存储卷用量概览 |
| 工作负载状态 | `WorkloadStatus` | 各类工作负载的状态分布 |
| 操作总览 | `ActionOverview` | 常用操作入口 |

若部分数据源返回失败，页面顶部会显示一条 warning 提示（`overview:partial_data_warning`：「部分概览数据暂时不可用，其余模块仍可正常使用。」）。

> ⚠️ 注意: 旧版本文档提到仪表盘包含「最近活动」「资源使用趋势」两个区块，但当前首页并未引用对应组件（`recent-activities.tsx`、`resource-usage-chart.tsx` 存在于代码库中但未被 `dashboard.tsx` 渲染），因此按实际区块为准。

## 顶部上下文选择

首页左上角结合产品配置展示：

- 区域/集群选择器：切换当前可操作的集群。
- 工作空间选择器：切换当前工作空间，所有区块数据随之变化。

> 💡 提示: 如果页面显示为空或提示选择工作空间，优先检查是否切到了错误的工作空间，或当前集群下还没有工作空间。

## 常见操作

1. 进入首页确认当前工作上下文。
2. 通过概览卡片与资源概览判断配额是否充足。
3. 通过工作负载状态定位异常实例，再进入对应列表或详情排查。
4. 通过操作总览快速进入部署或管理页面。

## 相关页面

- [工作空间](/rune/console/workspace)
- [配额](/rune/console/quota)
- [日志](/rune/console/logging)
