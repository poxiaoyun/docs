---
title: 'Theme & Preferences'
updated: '2026-09-12'
description: Appearance preferences with automatic save.
---

## Overview

The Theme page maintains the current account's appearance preferences. Every change is **auto-saved to the server** — there is no Save button.

- Route: `/iam/account/theme`
- View: `src/pages/iam/account/theme.tsx`

## Navigation

Top-right avatar → Settings → top Tab "Theme"

## Configurable Options

Only the following five groups are rendered:

| Option | Key | Values |
|--------|-----|--------|
| Color mode | `mode` | Light / Dark (shows a `System` label when following the system) |
| Contrast | `contrast` | `default` / `hight` |
| Compact layout | `compactLayout` | On / Off |
| Primary color | `primaryColor` | `default`, `preset1` – `preset5` (6 swatches) |
| Font family | `fontFamily` | 4 options (below) |
| Font size | `fontSize` | Slider, range 12–20, step 1 |

> ⚠️ Note: The `visibility` object also computes `navLayout`, `navColor`, and `direction`, but the render code does **not** use them (`theme.tsx:69-79`). Therefore this page has **no** "Nav Layout", "Nav Color", or "Direction" sections.

### Font Family

The 4 `fontFamily` options (`theme.tsx:190-195`):

1. `themeConfig.fontFamily.primary` (default primary font)
2. `Inter Variable`
3. `DM Sans Variable`
4. `Nunito Sans Variable`

The `Variable` suffix is stripped in the UI.

### Defaults

Defaults come from `src/settings/user/settings-config.ts:10-21`:

| Option | Default |
|--------|---------|
| `contrast` | `default` |
| `compactLayout` | `false` |
| `primaryColor` | `preset1` |
| `fontSize` | `16` |
| `fontFamily` | `themeConfig.fontFamily.primary` |
| `mode` | `themeConfig.defaultMode` |

> ⚠️ Note: The `mode` default ultimately depends on `themeConfig.defaultMode`, whose concrete value is not expanded here.

## Auto-Save

| Item | Description |
|------|-------------|
| Read | `GET` current user settings (`getCurrentUserSettings`) |
| Save | Each change auto-calls `setCurrentUserSettings` with the current settings |

> ⚠️ Note: The exact save endpoint path is defined in `src/services/setting.ts`; the response shape is not expanded field by field here.

## Notes

- Changes are saved immediately; there is no Save button
- Nav layout / nav color / direction are not part of this page
- Font size is a slider from 12 to 20px
