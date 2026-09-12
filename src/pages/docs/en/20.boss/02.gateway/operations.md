---
title: Dashboard
updated: '2026-09-12'
description: 'LLM gateway dashboard — requests, success rate, tokens, TTFT, rankings and gateway health.'
tags:
  - boss
  - gateway
---

## Feature overview

The operations overview is the LLM gateway dashboard. It shows requests, success rate, token usage, sensitive hits, TTFT, active keys and uptime, plus model/user rankings, model usage distribution and gateway health.

This page corresponds to **LLM gateway → Data dashboard** in the Boss console (menu label from `navbar.data_dashboard`).

## Access path

Boss console → LLM gateway → **Data dashboard**

Console route: `/gateway/operations`

> ⚠️ Note: this is the real console route, not a docs-site URL.

## Filters

| Filter | Type | Description |
|--------|------|-------------|
| Time range | Preset | Today / Last 7 days / Last 30 days / Custom |
| Start date, end date | Date picker | Only used with "Custom" |
| Tenant | Select | Options come from the tenant facet |
| Channel | Select | Options come from the channel facet |
| Model | Select | Options come from the model facet |

The toolbar also offers:

- **Refresh**: re-fetch manually
- **Reset**: clears the three facet filters and restores "Today"
- **Bucket** (read-only): derived from the range and shown as hour or day

> ⚠️ Note: only the three facet filters exist — there is no token, user or provider filter.

The page auto-refreshes every **30 seconds**.

Range-to-bucket mapping (`resolveDashboardInterval`):

| Range | Bucket |
|-------|--------|
| Today | hour |
| Last 7 / 30 days | day |
| Custom | hour when the span is `<=` 240 hours, otherwise day |

## Metric cards

**7** cards are shown at the top (responsive 1 / 2 / 4 / 7 columns):

| Metric | Field | Description |
|--------|-------|-------------|
| Requests | `summary.requestCount` | Total requests, with period-over-period change |
| Success rate | `summary.successCount` / `summary.requestCount` | Percentage, change in percentage points |
| Tokens | `summary.totalTokens` | Abbreviated with K/M, with change rate |
| Sensitive hits | `sensitiveHitCount` | Requests that hit sensitive content, with change rate |
| TTFT | `recentTTFTMaxMillis` | Max time-to-first-token in the recent window; lower is better |
| Active keys | `activeTokenCount` | Active token count, with change rate |
| Uptime | `uptimeSeconds` | Formatted as days/hours/minutes, no change rate |

> 💡 Tip: when there is no comparison period, the success-rate card shows the note "No previous data" (i18n `dashboard_no_previous`).

## Charts and rankings

Two charts sit side by side:

| Chart | Content |
|-------|---------|
| Trend | Requests per bucket at the current granularity (single-series bars) |
| Model usage distribution | Stacked bars by model, top 10 models plus "other models" |

Below is a three-column layout:

| Card | Content |
|------|---------|
| Model ranking | Requests, tokens and cost per model |
| User ranking | Rank, user, requests and total tokens (with a share bar) |
| TTFT trend + gateway health | See below |

### TTFT trend

A line chart with two series:

| Series | Field |
|--------|-------|
| Max TTFT | `maxTTFTMillis` |
| P95 TTFT | `p95TTFTMillis` |

TTFT uses its own granularity: minute when the span is `<= 24 hours`, hour when `<= 31 days`, otherwise day; series are capped at 1500 points.

### Gateway health

| Metric | Field | Description |
|--------|-------|-------------|
| Availability | `gatewayHealth.availablePercent` | Percentage plus a 60-cell bar |
| Upstream channels | `healthyChannels` / `totalChannels` | Healthy channels / total channels |
| Rate-limit events | `rateLimitEvents` | Number of rate-limit events in the range |
| Abnormal requests | `abnormalRequests` | Number of abnormal requests in the range |

> ⚠️ Note: there is **no usage record table and no export**. Use [Call logs](/boss/gateway/audit) for details. Older docs describing a "usage record table", "data export" and "ranking dimension switching" have no counterpart in the current code.

## Data sources

| Purpose | Request |
|---------|---------|
| Summary, rankings, health | `getUsageDashboard` (`summary` / `previousSummary` / `timeseries` / `topModels` / `topUsers` / `filterOptions` / `gatewayHealth`) |
| TTFT time series | `getUsageTimeseries` (`order: 'asc'`) |

## Permissions

Requires the **system administrator** role.
