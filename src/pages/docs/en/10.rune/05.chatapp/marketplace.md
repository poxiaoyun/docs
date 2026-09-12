---
title: 'Models'
updated: '2026-09-12'
description: 'ChatApp Model Marketplace: browsing, filtering, channels, prices and API docs.'
---

## Overview

The Model Marketplace (`src/pages/chatapp/marketplace.tsx`) is ChatApp's **model browsing entry**, served at `/chatapp/marketplace` and titled "Model Marketplace".

> ⚠️ **Note**: This marketplace is ChatApp's conversation-model marketplace. It is **not** the Rune App Market (`/rune/console/app-market`), which is used to deploy application templates.

## Page structure

| Area | Description |
|------|-------------|
| Left filter bar (shown from `md` up) | Filter by type, category, provider, context length and parameter scale |
| Top visibility tabs | All / Public / Tenant / Private, each with a count |
| Search and sort | Search by name; sort by "Name" or "Newest" |
| Model card grid | Adaptive 1 / 2 / 4 columns; each card shows the model ID, provider, visibility, type, categories, context and parameter scale tags |
| Detail drawer | Slides in from the right with model information, available channels, prices and API docs |

## Filter dimensions

Filters come from model metadata (`model-utils.ts` and `types/model-metadata`):

| Filter group | Values |
|--------------|--------|
| Type (`metadata.type` / inferred) | LLM / VLM / Embedding, etc. |
| Category (`metadata.categories`) | Defined by the model metadata |
| Provider (`metadata.vendor` / `provider`) | Defined by the model metadata |
| Context length | `<32K`, `32K~128K`, `128K~1M`, `≥1M` |
| Parameter scale | `<10`, `10~30`, `30~100`, `100~300`, `≥300` (unit B) |

> 💡 **Tip**: Like the filters, the card list only shows chat-capable models (`isChatModel`: `metadata.type` present, or `metadata.task` empty or `generate`).

## Visibility tabs

| Tab | `visibility` | Counting rule |
|-----|--------------|---------------|
| All | — | De-duplicated model count |
| Public | `public` | Count of de-duplicated model IDs |
| Tenant | `tenant` | Same as above |
| Private | `private` | Same as above |

## Model card

The card shows (`marketplace.tsx:198-357`):

- The model icon and **model ID**
- The provider name
- Top-right: a **New** tag (when the metadata marks it as recently created) and the visibility tag
- The description (up to two lines)
- Bottom tags: type, up to 2 categories, context length, parameter scale, up to 2 custom tags

## Detail drawer

Clicking a card opens a drawer from the right (`50vw` wide, full width on small screens):

| Block | Content |
|-------|---------|
| Header | Model ID, visibility, provider, description, all tags, and two action buttons |
| **Go to playground** | Opens the Experience page with the model selected (carrying `model` / `channel_id`) |
| **API docs** | Shows call samples for this model inside the drawer |
| Available channels | All channels for this model ID, with their **channel priority** and owning tenant |
| Prices | Input price, output price, cache read price and cache write price (shown as `-` when missing) |

> 💡 **Tip**: The same model ID may map to several channels (different access paths for the same model). The drawer lists them by channel priority and selects the highest-priority channel by default when entering the playground.

## API docs content

The "API docs" block uses the ChatApp data-plane address (`model-docs-content.tsx:39-40`):

```text
{origin}/airouter-data/v1/chat/completions
```

| Sample | Language |
|--------|----------|
| cURL | `curl --request POST ... --header 'Authorization: Bearer YOUR_TOKEN'` |
| Python | `requests.post` |
| Go | `net/http` |

> ⚠️ **Note**: Replace `YOUR_TOKEN` in the samples with a ChatApp token created in [Token Management](./token.md), and `YOUR_MODEL` with the model ID from the card.
