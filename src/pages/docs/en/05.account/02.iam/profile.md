---
title: 'User Profile'
updated: '2026-09-12'
description: View and edit your avatar and display name; username is read-only.
---

## Overview

The Profile page maintains the current account's avatar and display name. Only these two items are editable here.

- Route: `/iam/account/general`
- View: `src/pages/iam/account/general.tsx`

## Navigation

Top-right avatar → Settings → top Tab "General"

## Layout

| Area | Content |
|------|---------|
| Left | Avatar upload with crop; the current `displayName` is shown below |
| Right | Username (read-only) + display name (editable) + Save |

### Fields

| Field | Key | Editable | Validation |
|-------|-----|----------|------------|
| Username | `name` | ❌ | Non-empty (read-only, lock icon) |
| Display name | `displayName` | ✅ | Non-empty |

> ⚠️ Note: The page does **not** show "User ID (UUID)", "Registered At", or "MFA status" (`general.tsx:164-179` renders only `name` and `displayName`).

## Avatar

| Item | Value |
|------|-------|
| Max file size | `3145728` bytes (3 MB) |
| Crop | Supported (`preserveAspectRatio`) |
| Upload endpoint | `POST /api/iam/current/avatar` (multipart, field `avatar`) |

On successful upload the page re-fetches the profile, checks the session, and shows a success message.

## Endpoints

| Action | Endpoint |
|--------|----------|
| Load | `GET /api/iam/current/profile` |
| Save | `PUT /api/iam/current/profile` |
| Upload avatar | `POST /api/iam/current/avatar` |

On save the front-end submits `{ ...user, ...data }` — the merged full user object (`general.tsx:84-88`).

## Notes

- The username cannot be changed here
- Avatars larger than 3 MB cannot be uploaded
- On success the front-end calls `checkUserSession()`
