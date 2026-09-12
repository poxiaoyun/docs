---
title: 'Select / Register Tenant'
updated: '2026-09-12'
description: Tenant selection (Autocomplete) and new-tenant registration form after login.
---

## Overview

The platform is multi-tenant. After a successful Console login, the user always lands on the tenant selection page and picks one of the tenants the account can access. If the account has only one tenant, the page auto-enters it.

- Route: `/auth/select-tenant`
- View: `src/auth/view/centered/centered-tenant-view.tsx`

## Tenant List Data Source

| Item | Value |
|------|-------|
| Endpoint | `GET /api/iam/current/tenants` |
| Response | `Tenant[]` |
| Option shape | `{ id, name, enabled }` |

Options are sorted so disabled tenants come last.

## Page Description

The main control is a dropdown, not a card list:

| Element | Description |
|---------|-------------|
| Title | A personalized greeting using `displayName` / `name` / `email`, with a generic fallback |
| Select | `Field.Autocomplete`, field name `tenant`, label "Tenant" |
| Disabled options | Options with `enabled === false` cannot be selected and show an error-label "Disabled" |
| Enter button | Enters the selected tenant |

> ⚠️ Note: There is **no** tenant card list, and **no** tenant ID, role, member count, status column, search box, or sorting.

## Single-Tenant Auto-Entry

When the tenant count is exactly 1, the page automatically selects and enters that tenant (`centered-tenant-view.tsx:138-142`).

## Entering a Tenant

After selecting and submitting (`centered-tenant-view.tsx:120-136`):

1. `setDefaultTenant(tenantId)`
2. Clears the default region and default workspace context
3. Redirects:
   - If the URL has `returnTo`, go back to it; if it also has `oldTenantId`, replace the old ID inside `returnTo` with the new tenant ID
   - Otherwise go to `paths.rune.dashboard`

## Register a New Tenant

The "Create Tenant" button at the bottom opens the registration form:

- Route: `/auth/regist-tenant`
- View: `centered-regist-tenant-view.tsx`

Fields (all required):

| Field | Type | Front-end Validation |
|-------|------|----------------------|
| `name` | Text | Non-empty |
| `email` | Text | Email format |
| `phone` | Text | Non-empty + 6–16 digits |

Submit:

| Item | Value |
|------|-------|
| Endpoint | `POST /api/iam/tenant-register` |
| Body | `{ name, email, phone }` |

On success (`centered-regist-tenant-view.tsx:71-79`): re-check the session → store the new tenant ID in `localStorage` (key `tenant`) → redirect to `paths.rune.dashboard`.

> ⚠️ Note: The registration form has **no** "Tenant ID" field and **no** "Description" field; `email` and `phone` are plain text inputs without verification codes.

## Notes

- Tenant selection is an Autocomplete dropdown, not a card grid
- A single tenant skips selection automatically
- Disabled tenants cannot be entered
- Approval mode and quota allocation for new tenants are backend concerns and unconfirmed here
