---
title: Platform Settings
updated: '2026-09-12'
description: 'Platform branding and sign-in display — title, logo, subtitle, header navigation and access management.'
tags:
  - boss
  - settings
---

## Feature overview

Platform settings maintain the branding shown in the console and on the sign-in page, plus header navigation and access management switches. All values are written to the platform global configuration and apply to the whole platform UI.

This page corresponds to **Platform management → Platform settings** in the Boss console (menu label from `navbar.platform_setting`).

## Access path

Boss console → Platform management → **Platform settings**

Console route: `/settings/platform`

## Page structure

Three configuration cards, top to bottom:

| Card | Component | i18n title |
|------|-----------|-----------|
| Title and Logo | `LogoAndTitleConfig` | `title_and_logo` |
| Platform header config | `HeaderConfig` | `header_config` |
| Access management config | `IamConfig` | `iam_config` |

Each card has its own **Confirm** button; a successful save shows "Updated, please refresh the page".

## Title and Logo

| Field | Key | Type | Validation |
|-------|-----|------|-----------|
| Platform title | `title` | Text | Max **10 characters** |
| Logo | `logo` | Image upload | Max **3 MB**, **PNG / SVG** only |
| Subtitle | `subTitle` | Text | Max **20 characters** |

> ⚠️ Note: the `subTitle` limit is **20 characters**, not 10.

Logo upload behaviour:

1. Pick a PNG or SVG file (max 3 MB)
2. Upload happens immediately (`POST /api/iam/logo/avatar`, form field `avatar`); the new logo URL is returned
3. Cropping preserves the aspect ratio (`preserveAspectRatio`)
4. Clicking **Confirm** on the card is what persists the logo URL into the global configuration

> 💡 Tip: uploading only obtains an image URL; the configuration is saved by **Confirm**.

## Platform header config

| Field | Key | Type | Default | Notes |
|-------|-----|------|---------|-------|
| Show document entry | `enableDocument` | Switch | on | Hides the document entry when off |
| Document URL | `documentUrl` | Text | empty | Only shown when "show document entry" is on |
| Enable language switch | `enableLanguageSwitch` | Switch | on | Controls the header language switcher |

> ⚠️ Note: the schema and defaults also define `enableNavbarIndex` (default on), but the corresponding switch is **commented out** in the UI and cannot be changed from the page.

## Access management config

| Field | Key | Type | Default | Notes |
|-------|-----|------|---------|-------|
| Enable BOSS signup | `enableBossSignup` | Switch | off | Whether users may self-register |

> ⚠️ Note: for private deployments, keep this off and create accounts manually.

## Requests

| Request | Method | Notes |
|---------|--------|-------|
| `/api/iam/global-config` | `GET` | Read the platform global configuration |
| `/api/iam/global-config` | `PUT` | Save it (each save merges the current config) |
| `/api/iam/logo/avatar` | `POST` | Upload the logo (`multipart/form-data`, field `avatar`) |

> ⚠️ Note: all three cards submit `{ ...current, ...formValues }`, so changing one field rewrites the whole global configuration.

## Permissions

Requires the **system administrator** role.
