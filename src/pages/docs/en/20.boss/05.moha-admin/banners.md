---
title: Banners
updated: '2026-09-12'
description: 'List columns, image upload/crop, and create/edit form of platform banners.'
---

## Overview

Banner Management maintains the banner slots on the platform homepage. Administrators can create, edit, and delete banners and set the link and effective time range.

## Access Path

BOSS Console → System Settings → **Banner Management**

Frontend route: `/moha/banners`

---

## List

| Column | Field Path | Description |
| --- | --- | --- |
| Image | `image` | Thumbnail (64×40, cropped proportionally) |
| Title | `title` | — |
| Content | `content` | Truncated to a single line |
| Link | `link` | Clickable external link, truncated when too wide |
| Start Date | `startAt` | — |
| End Date | `endAt` | — |

### Status Behavior

- Banners whose `endAt` is earlier than the current time are treated as **expired** and the whole row is grayed out.
- Supports searching by title; actions: edit, delete (with a confirmation dialog; batch supported).

---

## Create / Edit Banner

Frontend routes:

- Create: `/moha/banners?action=create`
- Edit: `/moha/banners/:id?action=edit`

### Form Fields

| Field | Field Name | Required | Description |
| --- | --- | --- | --- |
| Title | `title` | — | Text |
| Content | `content` | — | Multi-line text |
| Link | `link` | — | URL; must be a valid address |
| Start Date | `startAt` | ✅ | Date-time picker |
| End Date | `endAt` | ✅ | Date-time picker |
| Image | `image` | ✅ | Uploaded image (Base64) |

### Image Requirements

- Supports JPEG / PNG / APNG / WebP / GIF / AVIF / SVG.
- Can be **cropped** on upload; the output is Base64 cropped to a fixed aspect ratio.
- Size limit is about 3MB.

Validation rules:

- `startAt` and `endAt` are required, and `endAt` must be later than `startAt`.
- `link`, if filled, must be a valid URL.
- `isActive = true` is always sent on submit.

---

## Permission Requirements

Requires the **System Administrator** role.
