---
title: Model Gateway
updated: '2026-09-12'
description: 'LLM gateway management — channel access, model metadata, tokens, moderation, call logs and operations.'
tags:
  - boss
  - gateway
---

## Overview

The LLM gateway is the unified large model access layer of the Xiaoshi Intelligent Computing Platform, centrally managed by the Boss platform administrator. It provides multi-provider channel aggregation, unified API access, traffic control, content moderation and full call auditing.

Gateway pages follow the "LLM gateway" menu groups in the Boss console. The real console routes are listed below (they do **not** include a `/boss` prefix).

## Module overview

| Menu group | Page | Console route | Docs |
|-----------|------|--------------|------|
| LLM gateway | Data dashboard | `/gateway/operations` | [Operations overview](/boss/gateway/operations) |
| Model service | Channels | `/service-registrations` | [Channels](/boss/gateway/channels) |
| Model service | Model config | `/gateway/model-metadata` | [Model metadata](/boss/gateway/model-metadata) |
| User management | Tokens | `/tokens` | [Tokens](/boss/gateway/api-keys) |
| User management | Call logs | `/gateway/audit` | [Call logs](/boss/gateway/audit) |
| Security service | Lexicon | `/gateway/moderation/lexicon` | [Content moderation](/boss/gateway/moderation) |
| Security service | Policies | `/gateway/moderation/policies` | [Content moderation](/boss/gateway/moderation) |
| Security service | Sensitive hits | `/gateway/moderation/sensitive-hits` | [Sensitive hits](/boss/gateway/sensitive-hits) |
| Platform settings | Gateway config | `/gateway/config` | [Gateway config](/boss/gateway/config) |
| Platform settings | Currency config | `/gateway/currency-settings` | [Currency settings](/boss/gateway/currency-settings) |

> ⚠️ Note: the routes above are the real paths in the Boss console source (`src/routes/paths.ts`), not docs-site URLs. Docs-site pages use the `/boss/gateway/...` prefix.

## Related capabilities

| Capability | Description |
|-----------|-------------|
| Channels & models | Upstream provider channels, model metadata and currency conversion |
| Credentials | Gateway tokens with rate limits, IP allowlists and expiry |
| Content safety | Policy and lexicon based detection plus hit records |
| Runtime control | Global switches, caches, routing preferences, channel fallback and IP allowlist |
| Observability | Operations dashboard metrics and full call log / detail |
