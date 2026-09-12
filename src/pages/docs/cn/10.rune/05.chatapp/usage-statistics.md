---
title: '调用分析'
updated: '2026-09-12'
description: 'ChatApp 调用分析看板：时间范围、指标卡、图表与刷新机制。'
---

## 功能简介

调用分析（用量统计，`src/pages/chatapp/usage-statistics.tsx`）是 ChatApp 的调用分析看板，前端路由为 `/chatapp/analysis`，界面标题为「调用分析」。它汇总当前账号在所选时间范围内的调用量、Token 消耗、费用、成功率与 API Key 数量。

## 进入路径

顶部导航切换到 **ChatApp** → **调用分析**（`/chatapp/analysis`）。

## 时间范围

默认范围为 **今日**（`rangePreset = 'today'`），可选预设（`usage-statistics-utils.ts:7-16`）：

| 预设 | 含义 | 时间粒度 |
|------|------|----------|
| `today` | 今日（默认） | 按小时 |
| `yesterday` | 昨日 | 按小时 |
| `3d` | 近 3 日 | 按天 |
| `7d` | 近 1 周 | 按天 |
| `30d` | 近一月 | 按天 |
| `custom` | 自定义起止时间 | 按小时（跨度 ≤ 240 小时）/ 按天（> 240 小时） |

- 时间粒度（`interval`）由所选范围推导，界面上为只读展示。
- 筛选栏提供 **刷新数据** 与 **重置筛选**（重置回「今日」）。

## 自动刷新

看板每 **30 秒** 自动刷新一次（`usage-statistics.tsx:47,99-102`，`REFRESH_INTERVAL_MS = 30_000`），无需手动操作；也可点击「刷新数据」立即刷新。

## 指标卡

顶部展示 5 张指标卡，均附带「较上一周期」的变化率：

| 指标 | 字段 | 说明 |
|------|------|------|
| **总调用量** | `summary.requestCount` | 请求总数 |
| **Token 消耗** | `summary.totalTokens` | 总 Token 数 |
| **总消费** | `summary.costAmount` | 金额，格式化显示为 `¥` |
| **成功率** | `summary.successCount / summary.requestCount` | 无上一周期数据时显示「暂无上一周期数据」 |
| **API Key 数量** | `activeTokenCount` | 活跃令牌数 |

## 图表

| 图表 | 数据 | 说明 |
|------|------|------|
| **调用趋势** | `timeseries` | 按时间桶展示请求数 |
| **模型用量** | `modelDistribution` | 按模型堆叠的用量分布，超出 Top N 的归入「其他模型」 |
| **费用趋势** | `timeseries.costAmount` | 按时间桶展示费用 |
| **模型排行** | `topModels` | 取调用量前 **10** 名，展示调用量 / Token / 费用 |

> 💡 提示: 请求参数固定为 `topN = 10`，`seriesLimit` 按时间桶数量推导，`start` / `end` 由所选范围换算为 ISO 时间字符串。

## 空态与异常

- 当前区间无模型调用数据时，模型用量与模型排行显示空态文案。
- 请求失败时页面顶部显示错误提示。

> ⚠️ 注意: 看板数据来自管理面接口（`GET /api/airouter/v1/me/usage/dashboard`，`src/services/usage.ts:110-122`）；浏览器会话使用 Cookie `user_session` 鉴权，与对话数据面（`/airouter-data`）是两条链路。
