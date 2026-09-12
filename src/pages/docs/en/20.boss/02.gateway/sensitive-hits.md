---
title: Hit Records
updated: '2026-09-12'
description: 'Query calls that triggered content moderation — matched terms, risk level and decision.'
tags:
  - boss
  - gateway
---

## Feature overview

Sensitive hits collects every call that **triggered content detection**, for tracing matched terms, risk level and the final decision.

This page corresponds to **LLM gateway → Security service → Sensitive hits** in the Boss console (menu label from `navbar.sensitive_hits`).

## Access path

Boss console → LLM gateway → Security service → **Sensitive hits**

Console route: `/gateway/moderation/sensitive-hits`

> ⚠️ Note: this is the real console route, not a docs-site URL.

## Query behaviour

The request always includes `sensitiveDetected: true`, so only calls that hit content detection appear. Results are ordered by request time (`requestStarted`) **descending**, paged **15** per page by default.

The default time range looks back **1 month** (start = 00:00 one month ago, end = 24:00 today).

## Filters

| Filter | Type | Description |
|--------|------|-------------|
| Start time | Date-time | Minute precision |
| End time | Date-time | Minute precision |
| User | Text | Match on username |
| Channel | Select | Options come from the channel list, with "All" |

The toolbar offers **Refresh** and **Reset** (reset restores the default 1-month range).

## Record list

| Column | Field | Description |
|--------|-------|-------------|
| Time | `requestStarted` | — |
| User | `username` | With avatar and tenant name |
| Model | `model` | With model icon |
| Type | `sensitiveType` | Sensitive content type |
| Terms | `sensitiveTerms` | Matched terms joined by "、" |
| Risk level | `riskLevel` | Coloured label |
| Token | `tokenId` | `tokenName` when available, otherwise the masked token |
| Decision | `moderationDecision` | Policy action |

Empty multi-value cells show a placeholder.

### Risk level

Derived from the **highest score** among matches:

| Score | Level | Label |
|-------|-------|-------|
| `>= 8` | `high` | High |
| `>= 5` | `medium` | Medium |
| otherwise | `low` | Low |

### Decision

Shows the policy action: `log` / `replace` / `webhook` / `block` — the same values as [Policies](/boss/gateway/moderation).

## Hit details

Clicking a record opens a dialog showing:

- The matched terms (as tags)
- The request content with matched terms highlighted

> ⚠️ Note: this page is **read-only** — no delete, export or remediation actions.

## Relations to other modules

- Terms and scores are maintained in [Lexicon](/boss/gateway/moderation)
- Conditions and actions are configured in [Policies](/boss/gateway/moderation)
- All call records (including non-sensitive ones) live in [Call logs](/boss/gateway/audit)

## Permissions

Requires the **system administrator** role.
