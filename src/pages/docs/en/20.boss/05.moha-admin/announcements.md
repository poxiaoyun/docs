---
title: Announcements
updated: '2026-09-12'
description: 'List columns, validity period, and create/edit form of platform announcements.'
---

## Overview

Announcement Management maintains the announcements shown to users on the platform homepage. Administrators can create, edit, and delete announcements and set their effective time range.

## Access Path

BOSS Console → System Settings → **Announcement Management**

Frontend route: `/moha/announcements`

---

## List

| Column | Field Path | Description |
| --- | --- | --- |
| Title | `title` | Announcement title; supports searching by title |
| Content | `content` | Rich text; the list strips HTML tags and truncates for display |
| Start Date | `startAt` | — |
| End Date | `endAt` | — |

### Status Behavior

- Announcements whose `endAt` is earlier than the current time are treated as **expired** and the whole row is shown grayed out.
- Actions: edit, delete (with a confirmation dialog; batch supported).

---

## Create / Edit Announcement

Frontend routes:

- Create: `/moha/announcements?action=create`
- Edit: `/moha/announcements/:id?action=edit`

### Form Fields

| Field | Field Name | Required | Description |
| --- | --- | --- | --- |
| Title | `title` | ✅ | Text |
| Content | `content` | ✅ | Rich text editor; must not be empty after stripping tags |
| Start Date | `startAt` | ✅ | Date-time picker |
| End Date | `endAt` | ✅ | Date-time picker |

Validation rules:

- `startAt` and `endAt` are both required.
- `endAt` must be later than `startAt`, otherwise an error is raised.
- `isActive = true` is always sent on submit.

---

## Permission Requirements

Requires the **System Administrator** role.
