---
title: Model Configuration
updated: '2026-09-12'
description: 'Maintain model basics and prices — name, type, provider, categories, context and unit prices.'
tags:
  - boss
  - gateway
---

## Feature overview

Model metadata maintains a model's display information and billing prices: name, type, provider, categories, context length, parameter scale and four price fields. The data drives model display, price calculation and currency conversion in the gateway.

This page corresponds to **LLM gateway → Model service → Model config** in the Boss console (menu label from `navbar.model_metadata`).

> ⚠️ Note: model config manages metadata only and **does not participate in routing** (`model_metadata.dispatch_note`). Routing is driven by `supportedModels` on channels.

## Access path

Boss console → LLM gateway → Model service → **Model config**

| Action | Console route |
|--------|--------------|
| List | `/gateway/model-metadata` |
| Create | `/gateway/model-metadata/new` |
| Edit | `/gateway/model-metadata/edit?name=...` |

> ⚠️ Note: edit uses a `name` query parameter rather than a path parameter.

## Model list

| Column | Field | Description |
|--------|-------|-------------|
| Name | `name` | Model id |
| Type | `type` | See below |
| Provider | `provider` | See below |
| Categories | `categories` | Multi-select |
| Context | `contextTokens` | Context token count |
| Parameter scale | `parameterScaleB` | In billions (B) |
| Price | `prices` | Input / completion / cache read / cache write |
| Channels | `channels` | Channels using the model and their priority |

Filters: **type** and **provider**. Each row offers **Edit** and **Delete** (with confirmation).

## Create / edit a model

| Field | Key | Type | Required | Default | Notes |
|-------|-----|------|----------|---------|-------|
| Model name | `name` | Text | ✅ | empty | Disabled in edit mode |
| Type | `type` | Select | — | `chat` | See below |
| Provider | `provider` | Select | — | `openai` | See below |
| Description | `description` | Multiline | — | empty | — |
| Categories | `categories` | Multi-select | — | empty | See below |
| Custom tags | `tags` | Multi-value | — | empty | Free input |
| Context | `contextTokens` | Number | — | empty | Submitted as `Number(...) || 0` |
| Parameter scale | `parameterScaleB` | Number | — | empty | Unit B, decimals allowed |
| Input price | `prices.inputPrice` | Text | — | empty | CNY / 1M tokens |
| Completion price | `prices.completionPrice` | Text | — | empty | Same unit |
| Cache read price | `prices.cacheReadPrice` | Text | — | empty | Same unit |
| Cache write price | `prices.cacheWritePrice` | Text | — | empty | Same unit |

You can also upload a model icon (`accept="image/*"`).

When editing, the form additionally shows the **channels using this model** (channel name, `provider` / `tenant` / `workspace`, priority).

### Types (`ModelType`)

| Id | Label |
|----|-------|
| `chat` | Chat |
| `image` | Image |
| `video` | Video |
| `audio` | Audio |
| `embedding` | Embedding |
| `rerank` | Rerank |

### Providers (`ModelProvider`)

`deepseek`, `qwen`, `zhipu`, `kimi`, `openai`, `anthropic`, `google`, `minimax`, `doubao`.

> ⚠️ Note: these are a **different value set** from the providers used by [Channels](/boss/gateway/channels). Do not mix them.

### Categories (`ModelCategory`)

`vision`, `moe`, `reasoning`, `tools`, `fim`, `math`, `coder`.

## Prices and currency

Prices are always entered in **CNY / 1M tokens**. When [Currency settings](/boss/gateway/currency-settings) selects USD, the system converts using `cnyToUsdRate` with fixed-point arithmetic.

> ⚠️ Note: submit writes `prices.inputPrice` / `completionPrice` / `cacheReadPrice` / `cacheWritePrice`, while the edit form reads `inputPriceCny` and friends. Both sets exist in the types; the server-side read/write convention is unconfirmed.

## Permissions

Requires the **system administrator** role.
