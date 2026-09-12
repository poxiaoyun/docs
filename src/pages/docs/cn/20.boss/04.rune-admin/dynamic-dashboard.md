---
title: '动态仪表盘'
updated: '2026-09-12'
description: '用 YAML 定义集群监控面板，编辑即预览，数据实时查询集群监控接口。'
tags:
  - boss
  - settings
---

## 功能简介

动态仪表盘是一个 YAML 驱动的集群监控面板编辑器：在左侧编辑 YAML 配置，右侧按配置实时渲染监控面板。面板数据通过集群监控接口实时查询，配置本身**不落库、不可保存**。

本页对应 BOSS 控制台 **Rune 智算管理 → 集群 → 动态仪表盘**。

## 进入路径

| 操作 | 前端路由 |
|------|---------|
| 动态仪表盘 | `/rune/clusters/:cluster/dynamic-dashboard` |

> ⚠️ 注意: 真实路由是 `/rune/clusters/:cluster/dynamic-dashboard`（`ROOTS.BOSS` 为空串，因此没有 `/boss` 前缀）。旧文档写的 `/boss/rune/clusters/...` 不存在。文档站页面 URL 为 `/boss/rune-admin/dynamic-dashboard`。

> ⚠️ 注意: 页面顶部面包屑的链接目标在代码中硬编码为 `/boss/clusters` 与 `/boss/clusters/:cluster`，与实际注册的路由不一致，属于代码中的遗留写法。

## 页面布局

页面上下两块：

| 区域 | 说明 |
|------|------|
| YAML 配置卡 | 固定高度 600px，标题栏含 **Reset** 按钮，下方为 YAML 编辑器（Monaco） |
| 预览卡 | 占剩余空间（`flexBasis: 70%`），渲染 `Dashboard` 组件 |

编辑器内容变更后，会经过 **1000ms 防抖**再解析并刷新预览。

> ⚠️ 注意: 页面**只有 Reset 按钮，没有保存按钮，也不调用任何写接口**。点击 Reset 会把编辑器恢复为内置的默认 YAML。旧文档中「点击保存 → 后端 API 保存成功」的流程在代码中不存在。

> ⚠️ 注意: YAML 解析失败时只在控制台打印错误，预览会停止更新，界面不会弹出提示。

## 配置结构

顶层字段（`DashboardConfiguration`）：

| 字段 | 说明 |
|------|------|
| `title` | 面板标题 |
| `description` | 描述 |
| `i18n` | 本地化文案，形如 `{ locale: { 原文: 译文 } }` |
| `panels` | 面板数组 |
| `templating` / `time` / `timezone` / `refresh` | 预留字段，默认配置未使用 |

每个面板（`DashboardPanel`）：

| 字段 | 说明 |
|------|------|
| `title` | 面板标题 |
| `type` | 面板类型（自由字符串，`DashboardPanelType \| string`） |
| `gridPos` | 网格位置 `{ h, w, x, y }`（24 列栅格） |
| `fieldConfig.defaults` | 默认字段配置：`unit`、`decimals`、`min`、`max`、`thresholds`、`color` |
| `targets[]` | 数据查询，元素为 `{ expr, legendFormat?, refId?, instant?, range? }` |
| `options`、`panels`、`transformations` 等 | 其余透传字段 |

> ⚠️ 注意: 查询表达式写在 **`targets[].expr`** 上，不是面板顶层的 `query`。旧文档的 `query:` 写法不会被解析。

### 默认配置用到的面板类型

默认 YAML 用到 5 种类型：

| 类型 | 用途 |
|------|------|
| `row` | 分组标题行（`gridPos.h: 1`，`w: 24`） |
| `stat` | 单个聚合数值 |
| `timeseries` | 时间序列折线 |
| `table` | 多行表格 |
| `gauge` | 仪表盘/环形，配合阈值变色 |

> 💡 提示: `type` 在类型定义中是开放字符串，实际可用的类型取决于 `Dashboard` 渲染组件；文档只列出默认配置确实使用到的 5 种。

## 默认配置内容

默认 YAML 的标题为 `Kubernetes Cluster Overview`，并通过 `i18n.zh-CN` 提供简体中文译文。

| 分组 | 面板 | 类型 | 查询表达式（`targets[].expr`） |
|------|------|------|------------------------------|
| Cluster Summary | Total Nodes | stat | `count(kube_node_info)` |
| Cluster Summary | Total Pods | stat | `count(kube_pod_info)` |
| Cluster Summary | CPU Capacity | stat | `sum(kube_node_status_capacity{resource="cpu"})` |
| Cluster Summary | Memory Capacity | stat | `sum(kube_node_status_capacity{resource="memory"})` |
| Node Resources | Node CPU Usage | timeseries | `sum(rate(node_cpu_seconds_total{mode!="idle"}[5m])) by (instance)` |
| Node Resources | Node Memory Usage | timeseries | `node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes` |
| Workload Metrics | Top 10 CPU Consuming Pods | table | `topk(10, sum(rate(container_cpu_usage_seconds_total{image!=""}[5m])) by (pod, namespace))` |
| Workload Metrics | Pod Restart Rate (Last 1h) | **timeseries** | `sum(increase(kube_pod_container_status_restarts_total[1h])) by (namespace, pod) > 0` |
| Workload Metrics | Node Disk Usage | gauge | `100 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100)` |

> ⚠️ 注意: 「Pod 重启次数（最近 1 小时）」在默认配置中的类型是 **`timeseries`**，不是 `stat`。

### 单位与阈值

- `fieldConfig.defaults.unit` 取值示例：`short`、`cores`、`bytes`、`percent`
- 阈值结构为嵌套在 `fieldConfig.defaults` 下的对象：

```yaml
fieldConfig:
  defaults:
    unit: "percent"
    min: 0
    max: 100
    thresholds:
      mode: "absolute"
      steps:
        - color: "green"
          value: 0
        - color: "#EAB308"
          value: 70
        - color: "red"
          value: 90
```

> ⚠️ 注意: 阈值是 `fieldConfig.defaults.thresholds.{mode, steps[]}`，`steps` 元素为 `{ color, value }`；不是面板顶层的 `thresholds: [{ value, color }]` 数组。

## 自定义示例

```yaml
panels:
  - title: "GPU 监控"
    type: "row"
    gridPos: { h: 1, w: 24, x: 0, y: 0 }

  - title: "GPU 使用率"
    type: "timeseries"
    gridPos: { h: 8, w: 12, x: 0, y: 1 }
    fieldConfig:
      defaults:
        unit: "percent"
    targets:
      - expr: 'avg(DCGM_FI_DEV_GPU_UTIL) by (gpu, instance)'
        legendFormat: "{{instance}} - GPU{{gpu}}"
```

## 数据来源

面板数据由集群监控接口实时返回：

- 面板查询：`queryClusterDynamicDashboard(cluster, config, params)`
- 查询参数：`getClusterDynamicDashboardParams(cluster, config, params)`

> ⚠️ 注意: 由于配置不持久化，刷新页面后编辑器会回到默认 YAML，自定义内容会丢失。如需长期使用，请在外部自行保存 YAML 文本。

## 权限要求

需要能够访问 Rune 智算管理对应集群的管理员角色。
