---
title: Token Management
updated: '2026-09-12'
description: 'Admin-side API key management — list, create and edit platform tokens with rate limits and IP allowlists.'
tags:
  - boss
  - gateway
---

## Feature overview

Token management is the **admin-side API key** surface of the LLM gateway, letting system administrators inspect and manage every API key on the platform. An API key is the credential used to call the gateway.

This page corresponds to **LLM gateway → User management → Tokens** in the Boss console (menu label from `navbar.apikey`).

## Access path

Boss console → LLM gateway → User management → **Tokens**

| Action | Console route |
|--------|--------------|
| List | `/tokens` |
| Create | `/tokens?action=create` |
| Edit | `/tokens/:id?action=edit` |

> ⚠️ Note: these are the real console routes from `src/routes/paths.ts`, not docs-site URLs.

## Key list

| Column | Field | Description |
|--------|-------|-------------|
| Name | `name` | Key name |
| API key | `apiKey` | Masked (see below) with a copy button |
| Owner | `belongTo` | Key owner |
| RPM | `rateLimitRPM` | `undefined` or `0` renders as infinity (unlimited) |
| TPM(K) | `rateLimitTPM` | `undefined` or `0` renders as infinity, otherwise `{value}K` |
| Allowed IPs | `allowedIPs` | `*` when empty or only `*`, otherwise collapsed |
| Expires at | `expiresAt` | "Never expires" when unset; expired keys show a red `expired` chip and red timestamp |
| Created at | `createdAt` | Date-time |

### Key masking

The list shows only the first 6 characters and covers the rest with 12 asterisks:

```
sk-abc************
```

The copy button copies the **full key from the list payload** (`item.apiKey`), not the mask.

> ⚠️ Note: there is **no** "full key shown only once at creation" logic. After a successful create the page simply returns to the list, and the create page has no success dialog.

The list supports multi-select; each row offers **Edit** and **Delete** (delete requires confirmation).

### Filters

| Filter | Description |
|--------|-------------|
| Owner | Search users; filtering by the selected user (via `searchUsers`) |

> ⚠️ Note: owner is the only filter — there is no RPM / TPM / status / expiry filter.

## Create / edit a key

| Field | Key | Type | Required | Default | Notes |
|-------|-----|------|----------|---------|-------|
| Name | `name` | Text | ✅ | empty | Disabled in edit mode |
| Owner | `account` | User select | ✅ | empty | Submitted as both `account` and `belongTo` |
| RPM | `rateLimitRPM` | Number | — | empty | `0`–`10000`; omitted from the payload when empty or `0` |
| TPM(K) | `rateLimitTPM` | Number | — | empty | `0`–`100000`; omitted when empty or `0` |
| Allowed IPs | `allowedIPs` | Multiline | — | `*` | See format below |
| Never expires | `noExpires` | Switch | — | on | Turning it off requires an expiry date |
| Expires at | `expiresAt` | Date-time | conditional | — | Only shown when "never expires" is off |

Submit behaviour:

- `expiresAt` is converted to **Unix seconds**; with "never expires" it submits `0`
- `allowedIPs` is split on newlines or commas and trimmed; an empty result submits `['*']`
- RPM / TPM are only included when greater than `0`

> 💡 Tip: numeric inputs block `e` / `E` / `+` / `-` / `.` — integers only.

## IP allowlist format

`allowedIPs` accepts the following, separated by commas or newlines:

| Form | Example | Notes |
|------|---------|-------|
| Single IPv4 | `192.168.1.100` | Exact match |
| CIDR | `10.0.0.0/8` | Prefix `0`–`32` |
| Wildcard | `*` | Allow all IPs (default) |

Validation (`isValidIPOrCIDR` in `form.tsx`):

- **IPv4 only**, exactly 4 octets, each `0`–`255`
- Leading zeros are rejected (`01`, `001`)
- CIDR prefix `0`–`32`
- **IPv6 is not supported**

> ⚠️ Note: the global allowlist in gateway config is also IPv4-only.

## Delete a key

Click **Delete** and confirm in the dialog.

> ⚠️ Note: no frontend logic claims that requests fail immediately after deletion; the actual behaviour depends on the server and is not documented here.

## Fields defined but unused by the page

The `ApiKey` type defines `status` (`active` / `expired`); it does **not** contain `usage` / `remain` fields. The i18n bundle does have strings for "used quota", "remaining quota", "usage overview" and "cost estimate" — but the current list and form use none of them.

> ⚠️ Note: quota/usage capabilities have no UI entry; server support is unconfirmed.

## Permissions

Requires the **system administrator** role.
