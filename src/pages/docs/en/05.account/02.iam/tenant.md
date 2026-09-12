---
title: 'Tenant Management'
updated: '2026-09-12'
description: Tenant overview and member management (tabs, fields, permissions).
---

## Overview

The tenant management page provides the current tenant's overview and member management. It is organized by top tabs under `/iam/tenants/{tenant}`.

## Navigation

> ⚠️ Note: There is **no** "Personal Center → Tenant Management" entry. `AccountLayout`'s tabs are profile/password/email/mobile/API key/SSH key/MFA/theme — no tenant (`account/layouts/layout.tsx:20-61`).

Actual entry: the **tenant item** in the top-right avatar menu (shows the current tenant name). It opens `/iam/tenants/{tenant}`, which redirects to the overview (`/iam/tenants/{tenant}/overview?tab=overview&provider=rune`).

## Tabs

| Tab | Key | Required role |
|-----|-----|---------------|
| Overview | `overview` | ADMIN / DEVELOPER |
| Members | `members` | ADMIN only |
| Quotas | `quotas` | ADMIN / DEVELOPER |
| Flavors | `flavors` | ADMIN / DEVELOPER |
| Workspaces | `workspaces` | ADMIN / DEVELOPER |

Role checks are in `src/pages/iam/tenant/layouts/layout.tsx:58-103`.

> ⚠️ Note: Tabs are also filtered by the URL `provider`: when there is no `provider`, or it is `moha` / `chatapp`, only `overview` and `members` are shown.

## Overview Page

Route: `/iam/tenants/{tenant}/overview`

The overview combines: tenant info, member stats, member list, quotas, workspace list, and event log.

### 1. Tenant Info Card

Editable fields (only a tenant ADMIN can edit, `tenant-info.tsx:194-238`):

| Field | Key | Editable | Validation |
|-------|-----|----------|------------|
| Tenant name | `name` | ✅ | Non-empty |
| Email | `email` | ✅ | Non-empty + email format |
| Phone | `phone` | ✅ | Non-empty |
| Created at | `creationTimestamp` | ❌ | — |

The card top is a tenant avatar upload with crop, disabled for non-admins.

> ⚠️ Note: There is **no** "Tenant ID", "Enabled status", or "Default language" field in the info card.

### 2. Member Stats

Shows the member distribution by role: `ADMIN` / `DEVELOPER` / `MEMBER`.

### 3. Member List

A table of members; fields are covered under "Member Management" below.

### 4. Quotas and Workspaces

Show the tenant's quota information and workspace list.

### 5. Event Log

Sourced from audit records queried per tenant (`tenant-events.tsx:33-39`, `pageSize: 20`). Each event shows:

| Field | Description |
|-------|-------------|
| `method` + `endpoint` | HTTP method and endpoint, used as the title |
| `username` (falls back to `userId`) | Actor |
| `result` | Operation result |
| `createdAt` | Shown as relative time (`fToNow`) |

> ⚠️ Note: The event fields are `method` + `endpoint` / `username` / `result`; there are **no** "operation type" or "target resource" fields.

## Member Management

Route: `/iam/tenants/{tenant}/members` (visible to ADMIN only)

### List Columns

| Column | Description |
|--------|-------------|
| `name` | Member username (with avatar, from `member.user`) |
| `userInfo.email` | Member email |
| `role` | Role (translated via `role:{role}`) |
| `creationTimestamp` | Joined at |

Multi-select delete is supported; the toolbar has an "Add member" button and each row has an edit entry.

### Add / Edit Member

Form fields (`members/components/form.tsx:92-95`):

| Field | Key | Description |
|-------|-----|-------------|
| User | `user` | Searchable dropdown from the user list; disabled when editing |
| Role | `role` | Dropdown from `GET /api/iam/tenants/{tenant}/roles` |

> ⚠️ Note: Role options come from the tenant roles endpoint (`{ id, name }` items), not a hard-coded three-role enum; the full backend list is unconfirmed.

### Member Endpoints

| Action | Endpoint |
|--------|----------|
| List | `GET /api/iam/tenants/{tenant}/members` |
| Detail | `GET /api/iam/tenants/{tenant}/members/{member}` |
| Delete | `DELETE /api/iam/tenants/{tenant}/members/{member}` |
| Update | `PUT /api/iam/tenants/{tenant}/members/{user}` |
| Role options | `GET /api/iam/tenants/{tenant}/roles` |

## Notes

- The Members tab is ADMIN-only; the Overview tab needs ADMIN or DEVELOPER
- Tenant info editing is likewise restricted to a tenant ADMIN
- The tenant entry is in the avatar menu, not in the Personal Center tabs
