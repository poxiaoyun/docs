---
title: 日志与调度器
updated: '2026-09-12'
author: Rune Docs Team
description: 集群级监控、事件、日志查询与 Volcano 调度配置页面说明。
tags:
  - boss
  - rune-admin
  - observability
---

# 日志与调度器

集群详情页提供多个运维入口，从不同维度观察集群状态并调整调度策略。

## 页面能力

| 页面 | 前端路由 | 当前能力 |
| --- | --- | --- |
| 监控告警 | `/rune/clusters/:cluster/metrics` | 预留页，前端为 ComingSoon 占位（不在侧边栏导航中） |
| 事件日志 | `/rune/clusters/:cluster/events` | 预留页，前端为 ComingSoon 占位（不在侧边栏导航中） |
| 日志管理 | `/rune/clusters/:cluster/logs` | 提供日志查询、标签过滤与实时流式查看 |
| 调度器管理 | `/rune/clusters/:cluster/schedulers` | 提供 Volcano 调度配置的拖拽式编排与保存 |

## 日志页

日志页使用统一的 `LogViewer` 组件，支持：

- 自定义查询语句
- 按标签查询，并对标签值做联想
- 历史日志查询
- WebSocket 实时日志流（跟随模式）
- 在「全部 / 节点」两个范围之间切换

适合用于排查：

- 平台组件异常
- 集群服务启动失败
- 调度、存储或网关侧报错

> 💡 提示: 日志能力依赖集群中已部署日志采集组件。若页面无数据，请检查是否已通过系统应用安装对应组件。

## 调度器页

调度器页面向高级管理员，用于维护集群的 Volcano 调度配置。当前前端支持：

- 加载调度参数（`actions` / `plugins` / `presets`）与现有配置（`actions` / `metrics` / `tiers`）
- 通过拖拽调整 action 顺序、在同 tier 内调整 plugin 顺序、跨容器拖入 action / plugin
- 编辑本地配置副本（不即时下发）
- 预览配置、刷新最新配置、保存并下发到后端

> ⚠️ 注意: 调度配置会直接影响集群的作业调度行为，建议先在测试环境验证，再变更生产集群。
