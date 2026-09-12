---
title: '网关配置'
updated: '2026-09-12'
description: 'LLM 网关全局运行时参数——功能开关、缓存、路由偏好、渠道回退与 IP 白名单。'
tags:
  - boss
  - gateway
---

## 功能简介

网关配置页集中管理 LLM 网关的全局运行时参数，包括核心功能开关、缓存、路由偏好、渠道回退策略、全局 IP 白名单和缓存重建。配置保存在全局设置中，保存后作用于整个网关。

本页对应 BOSS 控制台「大模型网关 → 平台设置 → **网关配置**」（菜单文案取自 `navbar.gateway_config`）。

## 进入路径

BOSS 控制台 → 大模型网关 → 平台设置 → **网关配置**

前端真实路由：`/gateway/config`

配置读写走 `/api/airouter/v1/settings`（`GET` 读取、`PUT` 保存）。

## 页面结构

表单按以下板块自上而下排列：

1. 路由配置
2. 核心开关
3. 安全配置
4. 缓存配置
5. 渠道回退策略
6. 缓存管理

页面底部提供 **保存** 与 **重置**：未修改时保存按钮禁用；重置会把表单恢复为最近一次加载的服务端配置。

## 核心开关

| 配置项 | 字段 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| 启用限流 | `rateLimitEnabled` | Boolean | `true` | 关闭后所有 RPM/TPM 限制立即失效 |
| 启用审计日志 | `auditEnabled` | Boolean | `true` | 关闭后不再记录请求元数据 |
| 启用内容审核 | `moderationEnabled` | Boolean | `true` | 关闭后输入输出不再经敏感词检测 |
| 启用计费 | `billingEnabled` | Boolean | `true` | 关闭后不记录计费数据 |
| 允许欠费使用 | `billingAllowOverdraft` | Boolean | `false` | 关闭后余额 `<= 0` 时返回 `402 Payment Required` |

> ⚠️ 注意: `billingEnabled` 的默认值是 **`true`**（`DEFAULT_GLOBAL_SETTINGS`），部分旧文档写为 `false`，以代码为准。

## 路由配置

| 配置项 | 字段 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| 首选供应商 | `routingPreferredProviders` | String[] | `[]` | 多个供应商同时可用时优先路由到该列表 |
| 屏蔽供应商 | `routingBlockedProviders` | String[] | `[]` | 列表中的供应商全局禁用，即使其渠道已启用 |

两个字段都是可自由输入的多值输入框（`freeSolo`），没有预置选项，取值即为提供商标识。

```yaml
routingPreferredProviders: ["siliconflow"]
routingBlockedProviders: ["openai"]
```

> 💡 提示: 首选是「偏好」而非硬性约束；屏蔽是硬性限制。

## 安全配置

| 配置项 | 字段 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| 全局 IP 白名单 | `globalWhitelist` | String[] | `[]` | 仅白名单来源可访问网关 API；留空表示允许所有来源 |

支持的格式：

| 格式 | 示例 | 说明 |
|------|------|------|
| 单个 IPv4 | `192.168.1.100` | 精确匹配 |
| IPv4 CIDR | `10.0.0.0/8` | 前缀 `0`–`32` |

校验规则与令牌的 IP 白名单一致：仅 IPv4、每段 `0`–`255`、禁止前导零；**不接受 `*`，也不支持 IPv6**。

输入非网络地址的 CIDR（如 `192.168.1.100/24`）时，页面会显示规范化提示，给出规范后的网段与实际覆盖范围。

> ⚠️ 注意: 配置白名单前请确认管理节点 IP 已包含在内，否则管理员自身的请求也会被拒绝。

## 缓存配置

| 配置项 | 字段 | 类型 | 默认值 | 校验 |
|--------|------|------|--------|------|
| 启用渠道缓存 | `cacheChannelEnabled` | Boolean | `true` | — |
| 渠道缓存 TTL (秒) | `cacheChannelTTL` | Number | `300` | `>= 0` |
| 启用用户/租户缓存 | `cacheUserTenantEnabled` | Boolean | `true` | — |
| 用户/租户缓存 TTL (秒) | `cacheUserTenantTTL` | Number | `600` | `>= 0` |
| 启用计费缓存 | `cacheBillingEnabled` | Boolean | `true` | — |
| Token 缓存 TTL (秒) | `cacheTokenTTL` | Number | `300` | `>= 1` |
| 计费账户缓存 TTL (秒) | `cacheBillingAccountTTL` | Number | `300` | `>= 1` |
| Token 绑定缓存 TTL (秒) | `cacheTokenBindingTTL` | Number | `300` | `>= 1` |

> ⚠️ 注意: 计费缓存的 TTL 字段是 **`cacheBillingAccountTTL`**（不是 `cacheBillingTTL`）。页面上「启用计费缓存」开关与「Token 缓存 TTL」同列排布，`cacheBillingAccountTTL` 与 `cacheTokenBindingTTL` 两个输入框没有配套开关。

### 缓存管理

点击 **重建缓存** 按钮可强制清除并重建所有缓存索引。

- 请求：`POST /api/airouter/v1/cache/rebuild`
- 成功提示：`缓存重建成功：{channels} 个渠道，{users} 个用户`

> 💡 提示: 当渠道启用/禁用状态与实际不一致时使用该功能，重建会短暂增加数据库负载。

## 渠道回退策略

渠道回退定义上游渠道失败时的重试与降级行为，字段都位于 `channelFallback` 对象内。

页面可编辑的字段：

| 配置项 | 字段 | 类型 | 默认值 | 校验 |
|--------|------|------|--------|------|
| 启用渠道回退 | `channelFallback.enabled` | Boolean | `true` | — |
| 单渠道最大重试次数 | `channelFallback.maxRetryPerChannel` | Number | `1` | `0`–`5` |
| 最大降级次数 | `channelFallback.maxFallbackCount` | Number | `2` | `0`–`10` |
| 重试间隔 (毫秒) | `channelFallback.retryDelayMs` | Number | `0` | `>= 0` |

类型中还定义了 `channelFallback.retryableStatusCodes`（默认 `[500, 502, 503, 504, 429]`）和 `channelFallback.fallbackDelayMs`（默认 `0`），但**表单未渲染这两个控件**。

> ⚠️ 注意: `channelFallback` 是**嵌套字段**，不是扁平的 `fallbackEnabled`。旧文档中的 `fallbackEnabled`、把重试次数写成 `2`、降级次数写成 `3`、延迟写成 `100`/`200` 等均与代码不符，请以本表为准。

> ⚠️ 注意: 由于 `retryableStatusCodes` 与 `fallbackDelayMs` 在界面上不可编辑，其实际生效值取决于服务端保存的配置，文档不做保证。

### 回退行为说明

- `maxRetryPerChannel = 1` 表示同一渠道最多请求 2 次（含首次）
- `maxFallbackCount = 2` 表示最多尝试 3 个渠道

> 💡 提示: 重试与降级都会增加端到端延迟，延迟敏感场景应适当下调这两个值。

## 配置生效范围

| 配置 | 生效时机 |
|------|---------|
| 功能开关、路由、白名单 | 保存后即时生效 |
| 缓存相关 TTL | 需等待缓存过期或手动重建缓存 |
| 渠道回退 | 保存后即时生效 |

## 权限要求

需要 **系统管理员** 角色。网关配置影响整个平台的 API 服务行为。
