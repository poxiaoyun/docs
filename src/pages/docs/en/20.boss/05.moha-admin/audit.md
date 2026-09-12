---
title: Audit Logs
updated: '2026-09-12'
description: 'Filtering, list columns, and export of the platform-level Moha operation audit log.'
---

## Overview

The audit log records platform-side operations on Moha resources (models / datasets / images / Spaces / organizations, etc.), letting administrators trace the operator, action, target, and result.

## Access Path

BOSS Console → Security Audit → **Audit Log**

Frontend route: `/moha/audit`

---

## Filters

The filter card at the top contains:

| Filter | Field | Default |
| --- | --- | --- |
| Start Date | `startTime` | The last **1 month** (one month back from the current month, at 00:00 of that day) |
| End Date | `endTime` | Today 23:59:59 |
| Organization | `organization` | All |
| Action | `action` | All |
| Resource Type | `resourceType` | All |

- Adjusting the start / end date automatically corrects the range (start is not later than end).
- Click **Search** to apply the filters, or **Reset** to restore the defaults.
- Changing any filter resets pagination to page 1.

### Action Enumeration (`action`)

| Value | Description |
| --- | --- |
| `create` | Create |
| `update` | Update |
| `delete` | Delete |
| `push` | Push |
| `pull` | Pull |
| `online` | Online |
| `restart` | Restart |

> 💡 Tip: When a record has no explicit `action`, the frontend infers one from the request method: `POST → create`, `PUT/PATCH → update`, `DELETE → delete`; when `resourceType = commit` it infers `push`.

### Resource Types

The resource type is a selectable set (`AUDIT_RESOURCE_OPTIONS`), including `models`, `datasets`, `images`, `spaces`, `organizations`, `favorite`, `discussion`, `comments`, `commit`, `freezes`, `scans`, `announcements`, `banners`, `mirrors`, `members`, `users`, `pods`, `logs`, `encryption`, `rating`, `readme`, `refs`, `contents`, `raw`, `downloads`, `cover`, `summary`, `resolve`, `mirror-requests`, and more.

---

## List Columns

| Column | Field Path | Description |
| --- | --- | --- |
| Time | `startTime` | `YYYY-MM-DD HH:mm:ss.SSS` |
| User | `subject` | Acting subject; shows `-` when empty |
| Organization | `organization` | Organization identifier |
| Action | `action` | Colored tag (colored by action) |
| Resource Type / Name | `resourceType` / `resourceName` | Type on the first line, resource name on the second (falls back to the request path when absent) |
| Method | `request.method` | POST / PUT / PATCH / DELETE, etc., as a colored tag |
| Status Code | `response.statusCode` | 2xx green, 4xx yellow, 5xx red |
| Duration | `endTime - startTime` | Milliseconds |
| Actions | — | View details (opens the detail dialog) |

- Default of **20** per page, sorted by time descending (`time-`).
- The list disables search and the toolbar, and uses a paginator to page through.

---

## Export

The **Download** button in the top right exports all records under the current filters as a JSON file:

- The export pulls page by page at **500 per page** until exhausted.
- The filename looks like `moha-audit-YYYYMMDD-HHmmss.json`.
- There are messages for no data, success, and failure.

---

## Permission Requirements

Requires the **System Administrator** role.
