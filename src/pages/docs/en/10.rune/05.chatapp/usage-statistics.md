---
title: 'Usage analysis'
updated: '2026-09-12'
description: 'ChatApp usage dashboard: time ranges, metric cards, charts and refresh behaviour.'
---

## Overview

Usage Statistics (`src/pages/chatapp/usage-statistics.tsx`) is ChatApp's usage dashboard, served at `/chatapp/analysis` and titled "Usage". It summarises the current account's request volume, token consumption, cost, success rate and API key count for the selected time range.

## How to get there

Top navigation → **ChatApp** → **Usage** (`/chatapp/analysis`).

## Time range

The default range is **Today** (`rangePreset = 'today'`). Available presets (`usage-statistics-utils.ts:7-16`):

| Preset | Meaning | Granularity |
|--------|---------|-------------|
| `today` | Today (default) | Hourly |
| `yesterday` | Yesterday | Hourly |
| `3d` | Last 3 days | Daily |
| `7d` | Last week | Daily |
| `30d` | Last month | Daily |
| `custom` | Custom start/end | Hourly (span ≤ 240 hours) / daily (> 240 hours) |

- The granularity (`interval`) is derived from the selected range and shown read-only in the UI.
- The filter bar provides **refresh** and **reset** (reset back to "Today").

## Auto refresh

The dashboard refreshes every **30 seconds** (`usage-statistics.tsx:47,99-102`, `REFRESH_INTERVAL_MS = 30_000`) without manual action; **refresh** triggers an immediate update as well.

## Metric cards

Five metric cards are shown at the top, each with a change rate versus the previous period:

| Metric | Field | Description |
|--------|-------|-------------|
| **Total requests** | `summary.requestCount` | Total number of requests |
| **Tokens** | `summary.totalTokens` | Total tokens |
| **Total cost** | `summary.costAmount` | Amount, formatted with `¥` |
| **Success rate** | `summary.successCount / summary.requestCount` | Shows "no previous period data" when there is no comparison data |
| **API keys** | `activeTokenCount` | Number of active tokens |

## Charts

| Chart | Data | Description |
|-------|------|-------------|
| **Request trend** | `timeseries` | Request count per time bucket |
| **Model usage** | `modelDistribution` | Stacked usage distribution by model; anything beyond the top N is grouped as "other models" |
| **Cost trend** | `timeseries.costAmount` | Cost per time bucket |
| **Model ranking** | `topModels` | Top **10** by request count, showing requests / tokens / cost |

> 💡 **Tip**: Request parameters are fixed to `topN = 10`; `seriesLimit` is derived from the number of time buckets, and `start` / `end` are converted from the selected range into ISO time strings.

## Empty and error states

- When there is no model usage data in the selected range, the model usage and model ranking charts show an empty state.
- On request failure an error message is shown at the top of the page.

> ⚠️ **Note**: The dashboard data comes from a management-plane endpoint (`GET /api/airouter/v1/me/usage/dashboard`, `src/services/usage.ts:110-122`); the browser session authenticates with the `user_session` cookie, which is a different path from the conversation data plane (`/airouter-data`).
