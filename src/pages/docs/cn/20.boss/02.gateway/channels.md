---
title: '渠道管理'
updated: '2026-09-12'
description: '配置上游模型服务渠道——提供商、端点、上游密钥、可见性与速率限制。'
tags:
  - boss
  - gateway
---

## 功能简介

渠道（Channel）代表一个**上游模型服务端点**，是 LLM 网关对接外部或内部推理服务的接入配置。网关按照渠道的可见性与优先级，把客户端请求路由到匹配的渠道处理。

本页对应 BOSS 控制台「大模型网关 → 模型服务 → **渠道管理**」（菜单文案取自 `navbar.model_list`）。

## 进入路径

BOSS 控制台 → 大模型网关 → 模型服务 → **渠道管理**

前端真实路由：`/service-registrations`

| 操作 | 前端路由 |
|------|---------|
| 列表 | `/service-registrations` |
| 创建渠道 | `/service-registrations/new` |
| 编辑渠道 | `/service-registrations/:id/edit` |

> ⚠️ 注意: 上表是 BOSS 控制台前端代码中的真实路径（`src/routes/paths.ts`），不是文档站 URL。

## 渠道列表

| 列 | 字段 | 说明 |
|----|------|------|
| 名称 | `name` | 渠道名称 |
| 模型服务供应商 / 端点 | `provider` + `apiBase` | 第一行为提供商标识，第二行为 API 基础地址 |
| 可见性 | `visibility` | 标签颜色：`public`=success、`tenant`=warning、`private`=default |
| 适用模型 | `supportedModels` | 折叠展示模型列表，为空显示 `-` |
| 优先级 | `priority` | `> 0` 时用 info 色标签展示 |
| RPM / TPM | `rateLimitRPM` / `rateLimitTPM` | `0` 显示为无穷符号（不限制）；TPM 以 `K` 为单位展示 |
| 状态 | `enabled` | 启用/未启用图标 |
| 租户 / 工作空间 | `tenant` / `workspace` | 仅租户级/私有渠道有值 |
| 所有者 | `owner` | 渠道创建者 |
| 创建时间 | `createdAt` | 日期时间格式 |

列表支持多选，并提供刷新按钮。

### 筛选条件

| 筛选器 | 可选值 |
|--------|--------|
| 可见性 | `public` / `private` / `tenant` |
| 模型服务供应商 | 见下方「支持的模型提供商」 |

> ⚠️ 注意: 筛选器里的提供商枚举**只有 9 项**（不含 `deepseek`），而创建/编辑表单的提供商下拉有 **10 项**（含 `deepseek`）。两者在代码中不一致（`list.tsx` 的 filters 与 `service-registration-new-edit-form.tsx` 的下拉选项），文档按表单为准。

## 支持的模型提供商

创建/编辑表单内置 10 种提供商，选择后会自动带出默认 API 端点（编辑模式下不覆盖已有值）：

| 下拉显示名 | 标识 `provider` | 默认 `apiBase` | Chat 端点路径 |
|-----------|----------------|---------------|--------------|
| openai | `openai` | `https://api.openai.com` | `/v1/chat/completions` |
| openai-compatible | `openai-compatible` | （空，需手填） | `/chat/completions` |
| dashscope (通义千问) | `dashscope` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `/chat/completions` |
| baidu (百度千帆) | `baidu` | `https://qianfan.baidubce.com/v2` | `/chat/completions` |
| moonshot (月之暗面) | `moonshot` | `https://api.moonshot.cn/v1` | `/chat/completions` |
| zhipu (智谱) | `zhipu` | `https://open.bigmodel.cn/api/paas/v4` | `/chat/completions` |
| siliconflow (硅基流动) | `siliconflow` | `https://api.siliconflow.cn/v1` | `/chat/completions` |
| openrouter | `openrouter` | `https://openrouter.ai/api/v1` | `/chat/completions` |
| doubao (豆包) | `doubao` | `https://ark.cn-beijing.volces.com/api/v3` | `/chat/completions` |
| deepseek (DeepSeek) | `deepseek` | `https://api.deepseek.com/v1` | `/chat/completions` |

端点输入框下方会实时提示最终 Chat 调用地址：`{apiBase}{端点路径}`。

> 💡 提示: 自建推理服务（如 vLLM、TGI）通常选择 `openai-compatible`，并手填其 API 基础地址。

## 创建 / 编辑渠道

点击右上角 **创建渠道** 进入创建页；在列表操作中选择 **编辑** 进入编辑页。创建页与编辑页共用同一套表单。

### 表单字段

| 字段 | 标识 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| 租户 | `tenantId` | 租户选择 | ✅ | 下拉搜索租户；已被禁用的租户不可选 |
| 工作空间 | `workspace` | 文本 | — | 工作空间标识 |
| 名称 | `name` | 文本 | ✅ | 渠道名称 |
| 模型服务供应商 | `provider` | 选择 | ✅ | 10 种提供商，默认 `openai` |
| 端点 | `apiBase` | 文本 | ✅ | API 基础地址，默认 `https://api.openai.com` |
| 可见性 | `visibility` | 选择 | ✅ | `public` / `tenant` / `private`，默认 `public` |
| 优先级 | `priority` | 数字 | ✅ | 最小值 `0`，默认 `0`；数值越大越优先 |
| 启用 | `enabled` | 开关 | ✅ | 默认开启 |
| RPM | `rateLimitRPM` | 数字 | — | `0`–`10000`，留空表示不限制 |
| TPM(K) | `rateLimitTPM` | 数字 | — | `0`–`100000`，留空表示不限制 |
| 上游 API 密钥 | `apiKeys` | 多行文本 | — | 每行一个密钥，提交时按行拆分 |
| 支持模型 | `supportedModels` | 多行文本 | — | 每行一个模型名，提交时按行拆分 |

> 💡 提示: `RPM` / `TPM` 已填写 `0` 时按不限制处理；表单留空时提交值同样为 `0`。

### 类型中存在但表单未暴露的字段

`Channel` 类型还定义了 `description`、`modelAliasMap`、`modelMetadata`（`supportsThinking` / `maxContextTokens` 等）、`engine`、`adapters`，i18n 中也有对应的文案键，但**当前创建/编辑表单未渲染这些控件**。

> ⚠️ 注意: 上述字段既无表单入口，本仓库前端也未提供其他编辑入口，其服务端行为未确认，文档暂不展开。

## 渠道操作

列表每一行提供以下操作（收在折叠菜单中）：

| 操作 | 说明 |
|------|------|
| 启用 / 禁用 | 切换 `enabled`，切换后自动刷新列表 |
| 更新可见性 | 弹出对话框，仅可切换 `visibility`（`public` / `tenant` / `private`） |
| 编辑 | 跳转到 `/service-registrations/:id/edit` |
| 删除 | 需二次确认（输入渠道名称），调用删除接口后刷新 |

> ⚠️ 注意: 「更新可见性」对话框**只提交 `visibility` 一个字段**，不会同时调整租户或工作空间；缩小可见性范围后，原先可用的用户将无法再路由到该渠道。

## 与其他模块的关系

- 渠道的**计费、限流、审计、内容审查**由 [网关配置](/boss/gateway/config) 的全局开关控制。
- 模型的上下文长度、价格等元数据在 [模型元数据](/boss/gateway/model-metadata) 中维护，与渠道的 `supportedModels` 是两套配置。
- 请求经渠道转发后，可在 [调用日志](/boss/gateway/audit) 与 [运营概览](/boss/gateway/operations) 中查看。

## 权限要求

需要 **系统管理员** 角色。系统管理员可以创建、编辑、启用/禁用和删除全部渠道。
