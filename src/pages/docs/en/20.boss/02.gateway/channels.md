---
title: Channel Management
updated: '2026-09-12'
description: 'Configure upstream model channels — provider, endpoint, upstream keys, visibility and rate limits.'
tags:
  - boss
  - gateway
---

## Feature overview

A channel represents one **upstream model service endpoint** and is the gateway's access configuration for external or internal inference services. The gateway routes client requests to matching channels based on visibility and priority.

This page corresponds to **LLM gateway → Model service → Channels** in the Boss console (menu label from `navbar.model_list`).

## Access path

Boss console → LLM gateway → Model service → **Channels**

| Action | Console route |
|--------|--------------|
| List | `/service-registrations` |
| Create | `/service-registrations/new` |
| Edit | `/service-registrations/:id/edit` |

> ⚠️ Note: these are the real console routes from `src/routes/paths.ts`, not docs-site URLs.

## Channel list

| Column | Field | Description |
|--------|-------|-------------|
| Name | `name` | Channel name |
| Provider / endpoint | `provider` + `apiBase` | Provider id on the first line, API base URL on the second |
| Visibility | `visibility` | Label color: `public`=success, `tenant`=warning, `private`=default |
| Supported models | `supportedModels` | Collapsed list, `-` when empty |
| Priority | `priority` | Shown as an info label when `> 0` |
| RPM / TPM | `rateLimitRPM` / `rateLimitTPM` | `0` renders as an infinity icon; TPM is shown in `K` |
| Status | `enabled` | Enabled / disabled icon |
| Tenant / workspace | `tenant` / `workspace` | Only for tenant or private channels |
| Owner | `owner` | Channel creator |
| Created at | `createdAt` | Date-time |

The list supports multi-select and a refresh button.

### Filters

| Filter | Values |
|--------|--------|
| Visibility | `public` / `private` / `tenant` |
| Provider | see "Supported providers" |

> ⚠️ Note: the provider filter lists only **9** values (no `deepseek`) while the create/edit form offers **10** (including `deepseek`). The two differ in the source (`list.tsx` filters vs `service-registration-new-edit-form.tsx` select); this document follows the form.

## Supported providers

The create/edit form ships 10 providers; selecting one fills in its default API base (edit mode does not overwrite existing values):

| Select label | `provider` | Default `apiBase` | Chat path |
|--------------|-----------|------------------|-----------|
| openai | `openai` | `https://api.openai.com` | `/v1/chat/completions` |
| openai-compatible | `openai-compatible` | (empty, fill manually) | `/chat/completions` |
| dashscope (通义千问) | `dashscope` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `/chat/completions` |
| baidu (百度千帆) | `baidu` | `https://qianfan.baidubce.com/v2` | `/chat/completions` |
| moonshot (月之暗面) | `moonshot` | `https://api.moonshot.cn/v1` | `/chat/completions` |
| zhipu (智谱) | `zhipu` | `https://open.bigmodel.cn/api/paas/v4` | `/chat/completions` |
| siliconflow (硅基流动) | `siliconflow` | `https://api.siliconflow.cn/v1` | `/chat/completions` |
| openrouter | `openrouter` | `https://openrouter.ai/api/v1` | `/chat/completions` |
| doubao (豆包) | `doubao` | `https://ark.cn-beijing.volces.com/api/v3` | `/chat/completions` |
| deepseek (DeepSeek) | `deepseek` | `https://api.deepseek.com/v1` | `/chat/completions` |

The endpoint field shows the resulting Chat URL live: `{apiBase}{chat path}`.

> 💡 Tip: for self-hosted inference services (vLLM, TGI, …) pick `openai-compatible` and fill in the base URL manually.

## Create / edit a channel

Use **Create channel** in the top-right corner or **Edit** in a row action. Both share the same form.

| Field | Key | Type | Required | Notes |
|-------|-----|------|----------|-------|
| Tenant | `tenantId` | Tenant select | ✅ | Searchable; disabled tenants cannot be selected |
| Workspace | `workspace` | Text | — | Workspace id |
| Name | `name` | Text | ✅ | Channel name |
| Provider | `provider` | Select | ✅ | 10 providers, default `openai` |
| Endpoint | `apiBase` | Text | ✅ | Default `https://api.openai.com` |
| Visibility | `visibility` | Select | ✅ | `public` / `tenant` / `private`, default `public` |
| Priority | `priority` | Number | ✅ | Min `0`, default `0`; higher wins |
| Enabled | `enabled` | Switch | ✅ | On by default |
| RPM | `rateLimitRPM` | Number | — | `0`–`10000`; empty means unlimited |
| TPM(K) | `rateLimitTPM` | Number | — | `0`–`100000`; empty means unlimited |
| Upstream API keys | `apiKeys` | Multiline | — | One key per line, split on submit |
| Supported models | `supportedModels` | Multiline | — | One model per line, split on submit |

> 💡 Tip: a value of `0` (or an empty field) is submitted as `0`, meaning unlimited.

### Fields defined but not exposed

The `Channel` type also defines `description`, `modelAliasMap`, `modelMetadata` (`supportsThinking`, `maxContextTokens`, …), `engine` and `adapters`, and i18n keys exist for them, but the current form renders **no controls** for them.

> ⚠️ Note: these fields have no UI entry and no other editing surface in this repo; their server behaviour is unconfirmed and not documented here.

## Channel actions

| Action | Description |
|--------|-------------|
| Enable / disable | Toggles `enabled` then refreshes |
| Update visibility | Dialog that submits **only** `visibility` (`public` / `tenant` / `private`) |
| Edit | Navigates to `/service-registrations/:id/edit` |
| Delete | Requires typing the channel name to confirm |

> ⚠️ Note: the visibility dialog does not adjust tenant or workspace; narrowing visibility immediately blocks users who previously could route to the channel.

## Relations to other modules

- Billing, rate limiting, auditing and moderation are governed by global switches in [Gateway config](/boss/gateway/config).
- Context length and prices live in [Model metadata](/boss/gateway/model-metadata), separate from a channel's `supportedModels`.
- Requests handled by channels can be inspected in [Call logs](/boss/gateway/audit) and [Operations overview](/boss/gateway/operations).

## Permissions

Requires the **system administrator** role.
