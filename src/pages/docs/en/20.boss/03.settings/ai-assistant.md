---
title: AI Assistant Settings
updated: '2026-09-12'
description: 'Configure the AI assistant name, avatar and Holmes API key, and check service readiness.'
tags:
  - boss
  - settings
---

## Feature overview

AI assistant settings configure the platform's AI diagnostics assistant: name, avatar and Holmes API key, plus the health status of the diagnostics service. The assistant can only be enabled when the service is healthy and has loaded models.

This page corresponds to **Platform management → AI assistant** in the Boss console (menu label from `navbar.ai_assistant_manager`).

## Access path

Boss console → Platform management → **AI assistant**

Console route: `/settings/ai-assistant`

## Settings

| UI label | Field | Type | Constraint | Notes |
|----------|-------|------|-----------|-------|
| Assistant avatar | `aiDiagnostics.avatar` | Image upload | Max **128 KB**, **PNG / JPG / WEBP** | Cropped to 160px, stored as Base64 |
| Name | `aiDiagnostics.name` | Text | Max **32 characters** | Defaults to `晓石 AI助手` |
| Holmes API key | (separate submit) | Password | — | Used for Holmes plugin auth |
| AI assistant | `aiDiagnostics.enabled` | Switch | Requires readiness | Whether the assistant is enabled |

> 💡 Tip: saving an empty name falls back to the default `晓石 AI助手`.

### Holmes API key

The Holmes API key is saved through its own request (`PUT /api/cloud/diagnostics/config`) and is not stored in the platform global configuration. The helper text depends on server state:

| State | Meaning |
|-------|---------|
| `holmesAPIKeyConfigured = true` and `holmesAPIKeyManaged = true` | Managed by Boss settings; leaving it empty keeps the current key, entering a new one updates it |
| `holmesAPIKeyConfigured = true` and `holmesAPIKeyManaged = false` | Currently using the server-side compatible config; entering a new key and saving moves it under Boss management |
| `configured = false` | Not configured; enter the API key from the Holmes plugin |

An empty input never overwrites an existing key; only a new value triggers the save request.

## Service status

The page shows a status label and message, plus a **Refresh status** button (`GET /api/cloud/diagnostics/status`).

| Condition | Label | Message |
|-----------|-------|---------|
| `healthy && ready && models.length > 0` | success | Ready `{model count}` |
| `healthy` but not ready or no models | warning | Not ready |
| Unhealthy | error | Unavailable |

> ⚠️ Note: when the service is unhealthy, not ready or has no models, the **AI assistant switch is forced off and cannot be toggled**; saving also writes `enabled` as `false`.

## Save behaviour

Clicking **Confirm**:

1. If a new Holmes API key was entered, calls `PUT /api/cloud/diagnostics/config` first
2. Then calls `PUT /api/iam/global-config` with `aiDiagnostics.{name, avatar, enabled}`
3. On success, refreshes config and service status

The avatar only updates the local preview on upload and is **written to config only on Confirm** (the UI shows "Avatar selected; it takes effect after saving.").

Written structure:

```yaml
aiDiagnostics:
  name: "晓石 AI助手"
  avatar: "data:image/png;base64,iVBORw0KGgo..."
  enabled: true
```

## Requests

| Request | Method | Notes |
|---------|--------|-------|
| `/api/iam/global-config` | `GET` / `PUT` | Read / save name, avatar, enabled |
| `/api/cloud/diagnostics/status` | `GET` | Read diagnostics service status |
| `/api/cloud/diagnostics/config` | `GET` / `PUT` | Read / update the Holmes API key config |
| `/api/cloud/diagnostics/models` | `GET` | Read available models |

## Permissions

Requires the **system administrator** role.
