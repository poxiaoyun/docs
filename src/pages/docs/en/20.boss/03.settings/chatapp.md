---
title: Gateway Settings
updated: '2026-09-12'
description: 'Gateway display settings — logo, product title and product description.'
tags:
  - boss
  - settings
---

## Feature overview

ChatApp settings maintain the display information for the gateway product in the console: logo, product title and product description. Values are written into the `chatapp` field of the platform global configuration.

This page corresponds to **Platform management → Gateway Settings** in the Boss console (menu label from `navbar.chatapp_setting`).

## Access path

Boss console → Platform management → **Gateway Settings**

Console route: `/settings/chatapp`

## Settings

| UI label | Field | Type | Constraint | Notes |
|----------|-------|------|-----------|-------|
| (Logo upload) | `chatapp.logo` | Image upload | Max **128 KB**, **PNG / SVG** | Stored as Base64 |
| Product title | `chatapp.title` | Text | Max **10 characters** | Navbar title |
| Product description | `chatapp.description` | Multiline | Max **100 characters**, 4 rows | Product summary |

> ⚠️ Note: the field name for "product title" is **`chatapp.title`** (the UI label is `navbar_title`).

Written structure:

```yaml
chatapp:
  logo: "data:image/png;base64,iVBORw0KGgo..."
  title: "ChatApp"
  description: "Product summary"
```

A successful save shows "Updated, please refresh the page".

## Compared with Rune / Moha settings

All three share the same structure but are independent and write to different fields:

| Page | Fields | Request |
|------|--------|---------|
| [Rune settings](/boss/settings/rune) | `rune.{logo,title,description}` + `mohaAddress` / `kmsAddress` | `/api/iam/global-config` |
| [Moha settings](/boss/settings/moha) | `moha.{logo,title,description}` + `space.*` | `/api/iam/global-config`, `/api/moha/global-config` |
| ChatApp settings | `chatapp.{logo,title,description}` | `/api/iam/global-config` |

## Requests

| Request | Method | Notes |
|---------|--------|-------|
| `/api/iam/global-config` | `GET` / `PUT` | Read / save the global configuration |

## Permissions

Requires the **system administrator** role.
