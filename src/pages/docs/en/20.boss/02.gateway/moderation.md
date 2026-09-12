---
title: Content Moderation
updated: '2026-09-12'
description: 'Content safety — lexicon maintenance, moderation policies and sensitive hit records.'
tags:
  - boss
  - gateway
---

## Feature overview

Content moderation inspects requests and responses passing through the gateway. Three modules work together:

- **Lexicon**: maintains terms (`term`) and their risk score (`score`) as the matching base
- **Policies**: define "when the score meets a condition, run which action"
- **Sensitive hits**: queries calls that triggered detection

Moderation is governed by the `moderationEnabled` switch in [Gateway config](/boss/gateway/config); turning it off suspends all policies without losing configuration.

## Access path

Boss console → LLM gateway → Security service

| Page | Menu label | Console route |
|------|-----------|--------------|
| Lexicon | `navbar.moderation_lexicon` | `/gateway/moderation/lexicon` |
| Policies | `navbar.moderation_policies` | `/gateway/moderation/policies` |
| Sensitive hits | `navbar.sensitive_hits` | `/gateway/moderation/sensitive-hits` |

Create/edit sub-routes: `/gateway/moderation/lexicon/new` (`/gateway/moderation/lexicon/:term/edit` to edit) and `/gateway/moderation/policies/new` (`/gateway/moderation/policies/:id/edit` to edit).

## Policies

### Policy list

| Column | Field | Description |
|--------|-------|-------------|
| Name | `name` | Policy name |
| Trigger condition | `operator` + `threshold` | e.g. "greater than or equal (≥) 50" |
| Action | `action` | See below |
| Priority | `priority` | `1`–`10` |
| Enabled | `enabled` | — |
| Updated at | `updatedAt` | Date-time |

Search matches name/description. The filter offers enabled state (all / enabled / disabled).

### Create / edit a policy

| Field | Key | Type | Required | Default | Notes |
|-------|-----|------|----------|---------|-------|
| Name | `name` | Text | ✅ | empty | — |
| Description | `description` | Multiline | — | empty | — |
| Operator | `operator` | Select | ✅ | `ge` | See below |
| Threshold | `threshold` | Number | ✅ | `50` | `0`–`100` |
| Action | `action` | Select | ✅ | `block` | See below |
| Priority | `priority` | Select | — | `1` | `1`–`10` |
| Enabled | `enabled` | Switch | — | on | — |

> ⚠️ Note: the threshold range is **`0`–`100`, default `50`** (not 0–1 / 0.8 as older docs claim).

**Operators** (`CompareOperator` — only four; there is **no `=`**):

| Id | Label | Meaning |
|----|-------|---------|
| `ge` | greater than or equal (≥) | `score >= threshold` |
| `gt` | greater than (>) | `score > threshold` |
| `le` | less than or equal (≤) | `score <= threshold` |
| `lt` | less than (<) | `score < threshold` |

**Actions** (`PolicyAction`):

| Id | Label | Description |
|----|-------|-------------|
| `log` | Log only | Record without altering content |
| `replace` | Replace terms | Mask matched content per replace config |
| `webhook` | Delegate to external service | Call an external service to decide |
| `block` | Block request | Block directly |

### Action-specific config

On submit, a JSON string is written to `config` based on the action.

**`replace`**

| Field | Default | Description |
|-------|---------|-------------|
| `maskChar` | `*` | Mask character |
| `maskMode` | `char_repeat` | `char_repeat` (per character) / `fixed_length` / `single_char` |

**`webhook`**

| Field | Default | Description |
|-------|---------|-------------|
| `webhookUrl` | empty | External service URL (required) |
| `webhookMethod` | `POST` | HTTP method |
| `webhookTimeout` | `5` | Timeout in seconds |
| `webhookHeaders` | empty | Custom headers (key/value, add/remove) |
| `decisionPath` | empty | JSON path of the decision field in the response |
| `passValues` | empty | Values treated as pass (options include `pass` / `allow` / `true` / `1` / `ok`) |
| `blockValues` | empty | Values treated as block (options include `block` / `deny` / `reject` / `false` / `0`) |
| `defaultAction` | `block` | Action when undecidable (`block` / `pass`) |
| `messagePath` | empty | JSON path of the block message |

> ⚠️ Note: the schema and defaults also define `notification` and `notifyEmails` (`false` / empty array), but **the form renders no controls and the submit payload omits them**. Email notification is therefore not documented.

### Policy actions

Each row offers enable/disable, edit and delete (collapsed menu).

> ⚠️ Note: deleting requires **typing the policy name** in the confirm dialog (`secondaryConfirmText`).

## Lexicon

### Stats and list

Four stat cards sit at the top: total terms, enabled count (with ratio), new this month and hits this week.

| Column | Field | Description |
|--------|-------|-------------|
| Term | `term` | Sensitive term |
| Enabled | `enabled` | — |
| Risk score | `score` | `1`–`10` |
| Category | `category` / `categories` | One or more |
| Tags | `tags` | Multiple |
| Hits | `hitCount` | Cumulative hits |
| Updated at | `updatedAt` | Date-time |
| Actions | — | Enable/disable, edit, delete |

Filters: keyword search, category scope, risk level, tag, updated time (all / today / 7 days / 30 days).

Multi-select supports **batch enable / batch disable / batch delete**.

### Create / edit a term

| Field | Key | Type | Required | Default | Notes |
|-------|-----|------|----------|---------|-------|
| Term | `term` | Text | ✅ | empty | — |
| Risk score | `score` | Number | ✅ | `5` | `1`–`10` |
| Categories | `categories` | Multi-value | — | empty | Preset or custom |
| Part of speech | `partOfSpeech` | Text | — | empty | — |
| Tags | `tags` | Multi-value | — | empty | Preset or custom |

> ⚠️ Note: the risk score range is **`1`–`10`, default `5`** (not a 0–1 decimal).

**Preset categories** (`PRESET_LEXICON_CATEGORIES`, see `lexicon/constants.ts`): 政治, 暴恐, 民生, 涉枪涉爆, 色情, 非法网站, 广告, GFW, 反动.

**Preset tags** (`PRESET_LEXICON_TAGS`): 中文, 英文, 拼音, 政治敏感, 选举相关, 人名, 个人信息, 网址, 营销, 高风险.

> 💡 Tip: on submit, `category` is set to `categories[0]` and the full `categories` array is written too.

### Import and export

- **Import**: batch import terms from a file through the import dialog
- **Export**: export the lexicon to a file for backup or migration

## Sensitive hits

See the dedicated [Sensitive hits](/boss/gateway/sensitive-hits) page.

## Permissions

Requires the **system administrator** role.
