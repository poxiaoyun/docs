---
title: Call Logs
updated: '2026-09-12'
description: 'Query gateway call records by time, user, token, channel and model, and open call details.'
tags:
  - boss
  - gateway
---

## Feature overview

Call logs record every request forwarded through the gateway, including the requester, channel, model, latency, tokens and billing data, plus optional request/response payloads and moderation reports. The page is used for troubleshooting, usage reconciliation and sensitive-content tracing.

This page corresponds to **LLM gateway → User management → Call logs** in the Boss console (menu label from `navbar.call_logs`).

## Access path

Boss console → LLM gateway → User management → **Call logs**

| Action | Console route |
|--------|--------------|
| Record list | `/gateway/audit` |
| Standalone detail page | `/gateway/audit/:id` |

> ⚠️ Note: clicking the time column opens a **dialog** (`AuditDetailDialog`) rather than navigating to `/gateway/audit/:id`. The standalone route is registered but the list provides no entry point to it.

## Filters

The filter bar supports range presets and a custom range:

| Filter | Type | Description |
|--------|------|-------------|
| Time range | Preset | Today / Yesterday / Last 3 days / Last week / Custom |
| Start date, end date | Date picker | Only used with "Custom" |
| User | Text | Fuzzy match on username |
| Token | Text | Match on token |
| Channel | Select | Options come from the channel list (`channelName`), with "All" |
| Model | Text | Fuzzy match on model name |

The bar also offers **Refresh** and **Reset** (reset restores the range to "Today").

> ⚠️ Note: there is **no "Result" filter** in the UI. The backend query supports `result`, but it is not exposed; the "tenant" filter string in i18n is likewise unused.

## Record list

| Column | Field | Description |
|--------|-------|-------------|
| Time | `requestStarted` | Click to open the detail dialog |
| Channel | `channelName` | Channel the request was routed to |
| User | `username` | Requesting user |
| Token | `tokenId` | Token id used |
| Model | `model` | Requested model |
| Duration | `latencyMillis` | End-to-end latency (ms) |
| Tokens | `totalTokens` | Total tokens consumed |
| Cost | `billedTokens` | Billed tokens, rendered with the currency setting |
| Standard | `modelPriceStandard` | Standard price from the model price table |

Rows whose result is not `success` show a red bar in the sticky column.

The list disables the search box and toolbar and uses its own pagination.

## Call details

Clicking the Time column opens a dialog with these tabs:

| Tab | Content |
|-----|---------|
| Basic info | See the table below |
| Request data | Request payload (read-only JSON editor) |
| Response data | Response payload (read-only JSON editor) |
| Metadata | Metadata (read-only JSON editor) |
| Moderation | Sensitive-content report (only when `sensitiveDetected` is true) |

Empty tabs show "No data".

### Basic info fields

| Field | Key |
|-------|-----|
| Numeric id | `id` |
| Request id | `requestId` |
| Trace id | `traceId` |
| Token id / name / value | `tokenId` / `tokenName` / `tokenValue` |
| Tenant | `tenantId` |
| User id / username | `userId` / `username` |
| Channel id / name | `channelId` / `channelName` |
| Workspace | `workspace` |
| Provider | `provider` |
| Model | `model` |
| Method / endpoint | `method` / `endpoint` |
| Request / response time | `requestStarted` / `responseEnded` |
| Duration | `latencyMillis` |
| Status code | `statusCode` |
| Result | `result` (`success` green, otherwise red) |
| Error message | `errorMessage` (only on failure) |
| Prompt / completion / total tokens | `promptTokens` / `completionTokens` / `totalTokens` |
| Billed tokens | `billedTokens` |
| Streaming | `isStream` |
| Sensitive | `sensitiveDetected` |
| Moderation decision | `moderationDecision` (only when sensitive) |

## Result values

| Result | Meaning |
|--------|---------|
| `success` | Succeeded |
| `error` | Failed |
| `blocked` | Blocked |
| `quota_exceeded` | Quota exceeded |

> ⚠️ Note: these values come from the audit i18n bundle; the list only distinguishes `success` from everything else by colour. The full set returned by the server is unconfirmed.

## About data cleanup

The service layer exposes a cleanup request `cleanupAuditRecords(before)` (`DELETE /api/airouter/v1/audit/cleanup?before=...`) and the i18n bundle has cleanup dialog strings, but **no page calls it** (a repo-wide search for `cleanupAuditRecords` only hits its definition).

> ⚠️ Note: there is **no cleanup entry in the UI**. Availability and permissions must follow the backend contract.

## Permissions

Requires the **system administrator** role. Call details may contain private and sensitive data; restrict access accordingly.
