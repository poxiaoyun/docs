---
title: Models
updated: '2026-09-12'
description: 'Model repository list columns at the BOSS level, type-specific columns, and visibility/recommendation management.'
---

## Overview

BOSS-level model repository management provides **platform-level** global management of model repositories. Unlike the Console side, it is aimed at system administrators who can view, review, and manage repositories created by **all tenants / users / organizations** (including private models).

## Access Path

BOSS Console → Data Repository → **Models**

Frontend route: `/moha/models`

---

## List and Tabs

Models, Datasets, Image Registry, and Spaces share the same "Data Management" list component (`data-managers`), distinguished by the `type` in the URL:

| type | Page |
| --- | --- |
| `models` | Models |
| `datasets` | Datasets |
| `images` | Image Registry |
| `spaces` | Spaces |

### Statistics Cards Above the List

Cards above the list are five: total resources (the helper text shows the current page's total repository storage), public count, **encrypted or private count** (encrypted for `models` / `datasets`, private for the other types), downloads, and popular resource count.

### Columns

The columns differ by `type`. First, the columns shared by models and datasets:

| Column | Field Path | Description |
| --- | --- | --- |
| Alias / Name | `name` / `alias` | The name column shows `alias || name`; includes a description tooltip; encrypted models show a 🔒 icon; mirror origin (`hidden-from-index = true`) shows a "Mirroring..." tag |
| Organization | `organization` | Organization avatar + name |
| Visibility | `visibility` | Public / private / tenant-only tag; private adds the creator |
| Repository Storage | `repositoryStorageSize` | Shown only when the repository stats `status = ready`, otherwise `-` |
| Downloads | `annotations.downloads` | Formatted number |
| Tasks | `metadata.tasks` | Collapsible tag group |
| Tags | `metadata.tags` | Collapsible tag group |
| Recommendation Score | `annotations.recommendation-score` | Recommendation status |
| Updated At | `modified` | Time |

> ⚠️ Note: The list has **no "license" column**.

### Type-Specific Columns

| type | Exclusive Columns |
| --- | --- |
| `spaces` | Run status (`spaceMetadata.status.phase`), domain (`metadata.domain`), scene (`metadata.scene`) |
| `images` | Category (`metadata.category`), accelerate (`metadata.accelerate`), arch (`metadata.arch`), and **no** recommendation-score column |
| `models` / `datasets` | Tasks, tags, recommendation score |

### Filtering

- **Name search**, **organization filter**, **visibility filter**.
- **Advanced filter**: filter by metadata facets (task category, tags, etc.); applied conditions are shown as chips.

---

## Management Operations

The actions column contains:

| Action | Description | Applicable Types |
| --- | --- | --- |
| Visibility | Opens the visibility dialog to toggle public / private | All |
| Recommend | Opens the recommendation dialog to configure the score and screenshot | All except `images` |
| Edit | Opens the edit page | All |
| Delete | With a confirmation dialog; batch supported | All |

> ⚠️ Note: Models / datasets have **no runtime operations such as "Restart", "Stop", or "View Logs"**; those are not provided in the data management list.

---

## Differences from the Console Moha View

| Dimension | BOSS Model Management | Console Model Management |
| --- | --- | --- |
| Data Scope | All platform models (including private) | Only models the current user / organization can access |
| Visibility Management | Can modify any model | Can only manage models created by oneself |
| Recommendation Management | Can set recommendation score and screenshot | Not available |
| Deletion Permission | Can delete any model repository | Can only delete one's own |

---

## Permission Requirements

Requires the **System Administrator** role. Regular users should manage their own model repositories through Console → Moha.

Related pages: [Dataset Management](./datasets), [Image Registry Management](./images), [Space Management](./spaces).
