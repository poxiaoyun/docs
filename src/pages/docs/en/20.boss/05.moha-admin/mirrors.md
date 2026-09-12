---
title: Mirror
updated: '2026-09-12'
description: 'Mirror task management for syncing models and datasets from HuggingFace / ModelScope.'
---

## Overview

Mirror Source Configuration syncs models and datasets from external platforms (HuggingFace, ModelScope) to this platform. Administrators can create mirror tasks, trigger / stop syncs, and view sync status.

## Access Path

BOSS Console → Data Sync → **Mirrors**

Frontend route: `/moha/mirrors/models` (datasets: `/moha/mirrors/datasets`)

---

## List

Tabs at the top switch between **Models** and **Datasets**.

### Columns

| Column | Field Path | Description |
| --- | --- | --- |
| Name | `name` | Mirror task name (the name on this platform after sync) |
| Source | `source.url` | Identified from the URL origin: `www.modelscope.cn` → ModelScope, `huggingface.co` → HuggingFace, others `-` |
| Organization | `organization` | Organization avatar + name |
| Status | `status` | Rendered by `ObjectStatus` (namespace `data`) |
| Last Sync Time | `status.lastSyncTime` | Time of the last sync |

### Actions

| Action | Description |
| --- | --- |
| Sync / Stop | Dynamic toggle: **Stop** is shown only when `status.phase === 'syncing'`, otherwise **Sync**; both have a confirmation dialog |
| Edit | Opens the edit page |
| Delete | With a confirmation dialog; batch supported |

> ⚠️ Note: Status is based on `ObjectStatus` (the backend's `status`). The frontend has **no** `paused` field and no "pause / resume auto-sync" toggle.

---

## Create Mirror Task

Frontend route: `/moha/mirrors/:type?action=create`

### Form Fields

| Field | Field Name | Required | Description |
| --- | --- | --- | --- |
| Organization | `organization` | — | Which organization to sync into; disabled in edit mode |
| Source | `source` | ✅ | Dropdown: ModelScope (`https://www.modelscope.cn`) / HuggingFace (`https://huggingface.co`); disabled in edit mode |
| Repository Name | `fullName` | ✅ | Source repository path (e.g. `org/repo`); disabled in edit mode |
| Password | `password` | Conditionally required | Used for the HuggingFace source; transmitted as a password field on submit |
| Token | `token` | Conditionally required | Used for the ModelScope source |
| Sync All Refs | `allRefs` | — | Toggle, default `false` (main branch only) |

> ⚠️ Note: The form has **no username input**. The username field in the request is fixed by the frontend: it is `oauth2` for the HuggingFace source and an empty string for others.

### Repository Detection

- After the source and repository name are filled in (debounced), the system automatically detects whether the repository exists and whether it is accessible.
- Only when the repository **exists but is not accessible** are the password / token inputs shown and made required.
- When the repository does not exist, the submit button is disabled.

> 💡 Tip: Public repositories need no credentials; restricted repositories (such as Gated Models) require a token.

---

## Permission Requirements

Requires the **System Administrator** role.

Related pages: [Model Repository Management](./models), [Dataset Management](./datasets), [Image Registry Management](./images).
