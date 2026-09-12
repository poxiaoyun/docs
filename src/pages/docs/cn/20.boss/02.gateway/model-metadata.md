---
title: 模型配置
updated: '2026-09-12'
description: '维护模型基础信息与价格——名称、类型、厂家、类别、上下文与计费单价。'
tags:
  - boss
  - gateway
---

## 功能简介

模型元数据用于维护模型的展示信息与计费单价，包括名称、类型、厂家、类别、上下文长度、参数规模和四类价格。这些数据用于网关的模型展示、价格计算与费用换算。

本页对应 BOSS 控制台「大模型网关 → 模型服务 → **模型配置**」（菜单文案取自 `navbar.model_metadata`）。

> ⚠️ 注意: 模型配置只管理模型元数据，**不参与模型调度**（`model_metadata.dispatch_note`）。调度由渠道管理中的 `supportedModels` 决定。

## 进入路径

BOSS 控制台 → 大模型网关 → 模型服务 → **模型配置**

| 操作 | 前端路由 |
|------|---------|
| 列表 | `/gateway/model-metadata` |
| 创建 | `/gateway/model-metadata/new` |
| 编辑 | `/gateway/model-metadata/edit?name=...`（按模型名指定） |

> ⚠️ 注意: 编辑入口用查询参数 `name` 指定模型，不是路径参数。

## 模型列表

| 列 | 字段 | 说明 |
|----|------|------|
| 模型名称 | `name` | 模型标识 |
| 类型 | `type` | 见下表 |
| 厂家 | `provider` | 见下表 |
| 类别 | `categories` | 可多选 |
| 上下文 | `contextTokens` | 上下文 Token 数 |
| 参数规模 | `parameterScaleB` | 以 B（十亿）为单位 |
| 价格 | `prices` | 输入 / 补全 / 缓存读 / 缓存写 |
| 渠道商 | `channels` | 使用该模型的渠道及其优先级 |

筛选条件：**类型**、**厂家**。

每行提供 **编辑** 与 **删除**（删除需确认）。

## 创建 / 编辑模型

| 字段 | 标识 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| 模型名称 | `name` | 文本 | ✅ | 空 | 编辑时禁用，不可修改 |
| 类型 | `type` | 选择 | — | `chat` | 见下表 |
| 厂家 | `provider` | 选择 | — | `openai` | 见下表 |
| 模型描述 | `description` | 多行文本 | — | 空 | — |
| 类别 | `categories` | 多选 | — | 空 | 见下表 |
| 自定义标签 | `tags` | 多值输入 | — | 空 | 自由输入 |
| 上下文 | `contextTokens` | 数字 | — | 空 | 提交时 `Number(...) || 0` |
| 参数规模 | `parameterScaleB` | 数字 | — | 空 | 单位 B，可含小数 |
| 输入价格 | `prices.inputPrice` | 文本 | — | 空 | 单位 CNY / 1M Tokens |
| 补全价格 | `prices.completionPrice` | 文本 | — | 空 | 同上 |
| 缓存读价格 | `prices.cacheReadPrice` | 文本 | — | 空 | 同上 |
| 缓存写价格 | `prices.cacheWritePrice` | 文本 | — | 空 | 同上 |

还可以为模型上传图标（`accept="image/*"`）。

编辑已有模型时，表单底部会额外展示 **使用该模型的渠道列表**（渠道名、`provider` / `tenant` / `workspace`、优先级）。

### 类型枚举（`ModelType`）

| 标识 | 界面文案 |
|------|---------|
| `chat` | 对话 |
| `image` | 生图 |
| `video` | 视频 |
| `audio` | 语音 |
| `embedding` | 嵌入 |
| `rerank` | 重排序 |

### 厂家枚举（`ModelProvider`）

| 标识 | 界面文案 |
|------|---------|
| `deepseek` | DeepSeek |
| `qwen` | Qwen |
| `zhipu` | 智谱 |
| `kimi` | Kimi |
| `openai` | OpenAI |
| `anthropic` | Anthropic |
| `google` | Google |
| `minimax` | MiniMax |
| `doubao` | 豆包 |

> ⚠️ 注意: 这里的厂家枚举与 [渠道管理](/boss/gateway/channels) 的提供商枚举是**两套不同的取值**，不要混用。

### 类别枚举（`ModelCategory`）

| 标识 | 界面文案 |
|------|---------|
| `vision` | 视觉 |
| `moe` | MoE |
| `reasoning` | 推理 |
| `tools` | Tools |
| `fim` | FIM |
| `math` | Math |
| `coder` | Coder |

## 价格与币种

价格统一以 **CNY / 1M Tokens** 填写。当 [币种设置](/boss/gateway/currency-settings) 选择以美元展示时，系统按 `cnyToUsdRate` 做定点换算。

> ⚠️ 注意: 提交时写入的是 `prices.inputPrice` / `completionPrice` / `cacheReadPrice` / `cacheWritePrice`；读取已有模型时表单读取的是 `inputPriceCny` 等 `Cny` 后缀字段。两组字段名在类型定义中同时存在，服务端的实际读写约定以后端契约为准，文档暂不确认。

## 权限要求

需要 **系统管理员** 角色。
