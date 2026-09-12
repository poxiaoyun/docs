---
title: Platform
updated: '2026-09-12'
description: 'Boss platform global configuration — branding, sub-product settings, AI assistant, license and members.'
tags:
  - boss
  - settings
---

## Overview

System settings is the global configuration center of the Boss platform, corresponding to the "Platform management" menu group in the console. Administrators maintain branding and sign-in page content, sub-product display settings, the AI assistant, the license and platform members here.

## Module overview

| Page | Menu label (i18n key) | Console route | Docs |
|------|----------------------|--------------|------|
| Platform settings | `navbar.platform_setting` | `/settings/platform` | [Platform settings](/boss/settings/platform) |
| Rune settings | `navbar.rune_setting` | `/settings/rune` | [Rune settings](/boss/settings/rune) |
| Moha settings | `navbar.moha_setting` | `/settings/moha` | [Moha settings](/boss/settings/moha) |
| ChatApp settings | `navbar.chatapp_setting` | `/settings/chatapp` | [ChatApp settings](/boss/settings/chatapp) |
| AI assistant | `navbar.ai_assistant_manager` | `/settings/ai-assistant` | [AI assistant](/boss/settings/ai-assistant) |
| License | `navbar.license` | `/settings/license` | [License](/boss/settings/license) |
| System members | `navbar.system_member` | `/settings/members` | [Members](/boss/settings/members) |

> ⚠️ Note: the routes above are the real console paths from `src/routes/paths.ts`, all under `/settings`, not docs-site URLs.

## Notes

- **Platform**, **Rune**, **Moha** and **Gateway** settings are sub-product display configurations: they maintain the product name, logo and description shown in the console and write to the platform global configuration (`/api/iam/global-config`, `/api/moha/global-config`). **Rune** settings additionally include a "development-service idle monitor" card (written to `rune.idleMonitor.im`).
- **AI assistant** and **License** are functional settings for the AI diagnostics assistant and product entitlement.
- **Members** manages Boss platform member accounts.

> ⚠️ Note: "Dynamic dashboard" is **not** under Platform management. It lives at **Rune management → Cluster → Dynamic dashboard** with route `/rune/clusters/:cluster/dynamic-dashboard`. See [Dynamic dashboard](/boss/rune-admin/dynamic-dashboard).

## Permissions

Requires the **system administrator** role.
