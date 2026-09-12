---
title: 'License'
updated: '2026-09-12'
description: 'View cluster fingerprint and product entitlement, update the license and drill into license records.'
tags:
  - boss
  - settings
  - license
---

## Feature overview

The license page shows the cluster fingerprint, license status and product quota status, and allows pasting a new license to update it. Each feature in the product quotas links to a resource authorization detail page.

This page corresponds to **Platform management → License** in the Boss console (menu label from `navbar.license`).

## Access path

Boss console → Platform management → **License**

| Action | Console route |
|--------|--------------|
| License home | `/settings/license` |
| Resource authorization detail | `/settings/license/records?product=...&feature=...` (or `&service=...`) |

> ⚠️ Note: these are the real console routes. The docs-site page URL is `/boss/settings/license`.

## Cluster fingerprint

The fingerprint returned by `getClusterSerial` (`fingerprint`) is shown in a monospace box with a copy button.

> 💡 Tip: the page says "provide this fingerprint to the license issuer" — a license must match the cluster.

## License status

| Item | Field | Notes |
|------|-------|-------|
| Status indicator | `status.phase` | See the enum below |
| Status message | `status.code` / `status.message` | Message per error code |
| Serial | `serial` | — |
| Company | `company` | — |
| Email | `email` | — |
| Edition | `edition` | — |
| Issued at | `issueAt` | Date-time |
| Expires | `expires` | Date-time |

When no license is configured (`serial` empty), only a "no license configured" message is shown.

### Status enum (`LicensePhase`)

| Id | Label |
|----|-------|
| `Active` | Normal |
| `Warning` | Needs attention |
| `Pending` | Checking |
| `Invalid` | Invalid |
| `Error` | Check failed |

Codes cover: valid, expiring, not installed, not ready, read failed, invalid, fingerprint mismatch, expired, usage check failed, product not entitled, feature not entitled, limit exceeded.

## Product quota status

When the license includes product statuses, quotas are grouped per product:

| Column | Field | Notes |
|--------|-------|-------|
| Feature | `feature.name` | Clickable link to the resource authorization detail |
| Usage | `feature.used` | Used / limit |
| Status | `feature.phase` | Same enum as license status |

Built-in feature labels: `clusters`, `nodes`, `accelerators`.

## Update the license

Click **Update license** in the top-right corner:

1. Paste the license string into the multiline field
2. Click **Submit**, which calls `POST /api/license/global` with `{ license }`
3. On success the page shows "License updated", closes the dialog and refreshes the status

> ⚠️ Note: Submit is disabled while the field is empty, and the dialog cannot be closed during submission.

## Resource authorization detail

Clicking a feature name (or opening a URL with `service`) opens the resource authorization detail page, which requires:

- `product` plus (`feature` or `service`)

Without context the page shows an empty state asking you to return to the license page and pick a quota entry.

Requests:

| Request | Method | Notes |
|---------|--------|-------|
| `/api/license/global` | `GET` | Read license info |
| `/api/license/cluster-serial` | `GET` | Read the cluster fingerprint |
| `/api/license/global` | `POST` | Update the license |
| `/api/license/records` | `GET` | Query license records |
| `/api/license/record-scopes` | `GET` | Query record scopes |
| `/api/license/records:refresh` | `POST` | Request a usage check (updated in the background) |

> ⚠️ Note: an expired or invalid license restricts part of the product; the page shows "license validation failed, some features may be limited".

## Permissions

Requires the **system administrator** role.
