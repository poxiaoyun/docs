---
title: Moha Hub Settings
updated: '2026-09-12'
description: 'Moha display settings and space settings — logo, title, description, base domain and TLS certificates.'
tags:
  - boss
  - settings
---

## Feature overview

Moha settings maintain the display information for Moha Hub and the Moha space domain and TLS configuration. The page has two cards: **Moha Hub config** and **Space config**.

This page corresponds to **Platform management → Moha settings** in the Boss console (menu label from `navbar.moha_setting`).

## Access path

Boss console → Platform management → **Moha settings**

Console route: `/settings/moha`

## Moha Hub config

| UI label | Field | Type | Constraint | Notes |
|----------|-------|------|-----------|-------|
| (Logo upload) | `moha.logo` | Image upload | Max **128 KB**, **PNG / SVG** | Stored as Base64 |
| Product title | `moha.title` | Text | Max **10 characters** | Navbar title |
| Product description | `moha.description` | Multiline | Max **100 characters**, 4 rows | Product summary |

> ⚠️ Note: the field name for "product title" is **`moha.title`** (the UI label is `navbar_title`).

Written structure:

```yaml
moha:
  logo: "data:image/svg+xml;base64,PHN2ZyB..."
  title: "Moha"
  description: "Product summary"
```

Request: `PUT /api/iam/global-config`.

## Space config

Space config is separate from display settings and is saved to the Moha global configuration (`PUT /api/moha/global-config`).

| UI label | Field | Type | Required | Default | Notes |
|----------|-------|------|----------|---------|-------|
| Base domain | `space.base` | Text | ✅ | empty | e.g. `develop.xiaoshiai.cn` |
| Enable TLS | `space.tlsEnabled` | Switch | — | off | Requires both certificate and key |
| TLS certificate | `space.tlsCert` | Multiline | conditional | empty | PEM certificate |
| TLS private key | `space.tlsKey` | Multiline | conditional | empty | PEM key |

Validation:

- `base` must be non-empty after trimming
- With TLS on, both certificate and key are required
- Certificate and key must be **provided together or both empty**; providing only one is an error
- All values are trimmed before submit

```yaml
space:
  base: "develop.xiaoshiai.cn"
  tlsEnabled: true
  tlsCert: "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
  tlsKey: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

> ⚠️ Note: the two cards save independently.

## Requests

| Request | Method | Notes |
|---------|--------|-------|
| `/api/iam/global-config` | `PUT` | Save the Moha Hub display config |
| `/api/moha/global-config` | `GET` / `PUT` | Read / save space config |

## Permissions

Requires the **system administrator** role.
