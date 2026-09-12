---
title: AI Platform Settings
updated: '2026-09-12'
description: 'Rune display settings — logo, product title, description and the Moha / KMS addresses.'
tags:
  - boss
  - settings
---

## Feature overview

Rune settings maintain the display information for the Rune intelligent computing platform: logo, product title, product description, and the Moha and KMS service addresses; the page also has a second **development-service idle monitor** card. The display values are written into the `rune` field and top-level address fields of the platform global configuration.

This page corresponds to **Platform management → AI Platform Settings** in the Boss console (menu label from `navbar.rune_setting`).

## Access path

Boss console → Platform management → **AI Platform Settings**

Console route: `/settings/rune`

## Settings

| UI label | Field | Type | Constraint | Notes |
|----------|-------|------|-----------|-------|
| (Logo upload) | `rune.logo` | Image upload | Max **128 KB**, **PNG / SVG** | Stored as Base64 |
| Product title | `rune.title` | Text | Max **10 characters** | Navbar title |
| Product description | `rune.description` | Multiline | Max **100 characters**, 4 rows | Product summary |
| Moha address | `mohaAddress` | Text | — | Moha service address |
| KMS address | `kmsAddress` | Text | — | KMS service address |

> ⚠️ Note: the field name for "product title" is **`rune.title`** (the UI label is `navbar_title`), not a `navbar_title` field.

> ⚠️ Note: the logo limit (128 KB) is much smaller than the platform logo (3 MB) because it is embedded in the configuration as Base64.

## Development-service idle monitor

Below the display-settings card there is a second card, "Development-service idle monitor", which automatically suspends a development service when its GPU / vGPU utilization stays at 0% for a continuous period. It saves independently into `rune.idleMonitor.im`.

| UI label | Field | Type | Constraint | Default |
|----------|-------|------|-----------|---------|
| Enable automatic suspension of idle development services | `rune.idleMonitor.im.enabled` | Switch | — | Off |
| Idle duration (minutes) | `rune.idleMonitor.im.idleMinutes` | Number | Integer, **1–10080** minutes | **30** |

- The "idle duration" field is disabled while the switch is off.
- Submitting writes `rune.idleMonitor.im.{enabled, idleMinutes}` and shows the same "Updated, please refresh the page" message on success.

## Save behaviour

- **Logo upload**: triggers a save immediately (writing `rune.logo`, `rune.title`, `rune.description`, `mohaAddress` and `kmsAddress` together)
- **Confirm**: saves all form fields

Written structure:

```yaml
mohaAddress: "https://moha.example.com"
kmsAddress: "https://kms.example.com"
rune:
  logo: "data:image/png;base64,iVBORw0KGgo..."
  title: "Rune"
  description: "Product summary"
```

A successful save shows "Updated, please refresh the page".

## Requests

| Request | Method | Notes |
|---------|--------|-------|
| `/api/iam/global-config` | `PUT` | Save the global configuration (Rune settings live in `rune`) |

## Permissions

Requires the **system administrator** role.
