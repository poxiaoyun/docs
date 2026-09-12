---
title: '调用日志'
updated: '2026-09-12'
description: '查询网关调用记录——按时间、用户、Token、渠道商、模型筛选并查看调用详情。'
tags:
  - boss
  - gateway
---

## 功能简介

调用日志记录每一次经网关转发的请求，包含请求者、渠道、模型、耗时、Token 与计费数据，以及可选的请求/响应负载和内容审查报告。该页用于问题排查、用量核对与敏感内容追溯。

本页对应 BOSS 控制台「大模型网关 → 用户管理 → **调用日志**」（菜单文案取自 `navbar.call_logs`）。

## 进入路径

BOSS 控制台 → 大模型网关 → 用户管理 → **调用日志**

| 操作 | 前端路由 |
|------|---------|
| 记录列表 | `/gateway/audit` |
| 独立详情页 | `/gateway/audit/:id` |

> ⚠️ 注意: 列表点击时间列打开的是**弹窗**（`AuditDetailDialog`），并不跳转到 `/gateway/audit/:id`；该独立详情页路由虽然在代码中注册，但列表页未提供入口。

## 筛选条件

页面顶部为筛选工具条，支持范围预设与自定义起止日期：

| 筛选器 | 类型 | 说明 |
|--------|------|------|
| 时间范围 | 预设 | 今日 / 昨日 / 近 3 日 / 近一周 / 自定义 |
| 开始日期、结束日期 | 日期选择 | 仅「自定义」时生效 |
| 用户 | 文本 | 按用户名模糊查询 |
| Token | 文本 | 按 Token 查询 |
| 渠道商 | 下拉 | 选项来自渠道列表（`channelName`），含「全部」 |
| 模型 | 文本 | 按模型名模糊查询 |

工具条还提供 **刷新** 与 **重置**（重置会把时间范围恢复为「今日」）。

> ⚠️ 注意: 界面**没有「结果」筛选器**。后端查询参数虽支持 `result`，但当前 UI 未暴露；同样地，i18n 里的「租户」筛选文案也未在界面上使用。

## 记录列表

| 列 | 字段 | 说明 |
|----|------|------|
| 时间 | `requestStarted` | 点击打开详情弹窗 |
| 渠道 | `channelName` | 路由到的渠道 |
| 用户 | `username` | 请求用户 |
| Token | `tokenId` | 使用的令牌 ID |
| 模型 | `model` | 请求的模型 |
| 耗时 | `latencyMillis` | 端到端耗时（毫秒） |
| Token 数 | `totalTokens` | 本次消耗的总 Token |
| 费用 | `billedTokens` | 计费 Token，结合币种设置换算展示 |
| 标准 | `modelPriceStandard` | 按模型价格表计算的标准价格 |

结果非 `success` 的行会在左侧固定列显示一条红色竖线作为提示。

列表禁用搜索框与工具栏，使用独立分页。

## 调用详情

点击「时间」列打开调用详情弹窗，包含以下标签页：

| 标签页 | 内容 |
|--------|------|
| 基本信息 | 见下表 |
| 请求数据 | 请求负载（JSON，只读编辑器） |
| 响应数据 | 响应负载（JSON，只读编辑器） |
| 元数据 | 元数据（JSON，只读编辑器） |
| 内容审查 | 敏感内容报告（仅当 `sensitiveDetected` 为真时出现） |

各标签页内容为空时显示「无数据」。

### 基本信息字段

| 字段 | 标识 |
|------|------|
| 自增 ID | `id` |
| 请求 ID | `requestId` |
| 追踪 ID | `traceId` |
| Token ID / 名称 / 值 | `tokenId` / `tokenName` / `tokenValue` |
| 租户 | `tenantId` |
| 用户 ID / 用户名 | `userId` / `username` |
| 渠道 ID / 渠道名称 | `channelId` / `channelName` |
| 工作空间 | `workspace` |
| 供应商 | `provider` |
| 模型 | `model` |
| 方法 / 端点 | `method` / `endpoint` |
| 请求时间 / 响应时间 | `requestStarted` / `responseEnded` |
| 耗时 | `latencyMillis` |
| 状态码 | `statusCode` |
| 结果 | `result`（`success` 绿色，其余红色） |
| 错误信息 | `errorMessage`（仅出错时展示） |
| 输入 / 输出 / 总 Token | `promptTokens` / `completionTokens` / `totalTokens` |
| 计费 Token | `billedTokens` |
| 流式 | `isStream` |
| 敏感内容 | `sensitiveDetected` |
| 处理策略 | `moderationDecision`（仅命中敏感内容时展示） |

## 结果状态

| 结果 | 含义 |
|------|------|
| `success` | 成功 |
| `error` | 失败 |
| `blocked` | 已拦截 |
| `quota_exceeded` | 超出配额 |

> ⚠️ 注意: 上表枚举来自审计模块的 i18n 文案；列表中实际只会把 `success` 与非 `success` 区分着色，`result` 的完整取值范围取决于服务端返回。

## 关于数据清理

服务层提供了清理接口 `cleanupAuditRecords(before)`（`DELETE /api/airouter/v1/audit/cleanup?before=...`），审计 i18n 中也有对应的清理弹窗文案，但**当前前端没有任何页面调用它**（全仓搜索 `cleanupAuditRecords` 仅命中定义处）。

> ⚠️ 注意: 界面上**没有数据清理入口**。清理接口的可用性与权限要求需以后端契约为准，文档暂不提供操作说明。

## 权限要求

需要 **系统管理员** 角色。调用详情可能包含请求/响应负载中的隐私与敏感信息，请按数据安全规范控制访问。
