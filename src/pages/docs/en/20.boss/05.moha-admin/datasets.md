---
title: Datasets
updated: '2026-09-12'
description: 'Dataset repository list columns at the BOSS level, and visibility/recommendation management.'
---

## Overview

BOSS-level dataset management provides **platform-level** global management of dataset repositories. System administrators can view and manage dataset repositories created by all tenants / users / organizations on the platform (including private datasets).

## Access Path

BOSS Console → Data Repository → **Datasets**

Frontend route: `/moha/datasets`

---

## List

Datasets share the data management list component with Models, Image Registry, and Spaces, with `type = datasets`.

### Columns

| Column | Field Path | Description |
| --- | --- | --- |
| Alias / Name | `name` / `alias` | The name column shows `alias || name`, with a description tooltip and a mirror-origin tag (`hidden-from-index = true`) |
| Organization | `organization` | Organization avatar + name |
| Visibility | `visibility` | Public / private / tenant-only tag |
| Repository Storage | `repositoryStorageSize` | Shown when repository stats `status = ready`, otherwise `-` |
| Downloads | `annotations.downloads` | — |
| Tasks | `metadata.tasks` | Collapsible tag group |
| Tags | `metadata.tags` | Collapsible tag group |
| Recommendation Score | `annotations.recommendation-score` | Recommendation status |
| Updated At | `modified` | — |

> ⚠️ Note: The list has **no "license" column**. Datasets also have no encryption column beyond the icon (encryption status is reflected by the icon in the name column).

### Filtering

Name search, organization filter, visibility filter, and advanced filtering based on metadata facets (task category, tags, etc.).

---

## Management Operations

| Action | Description |
| --- | --- |
| Visibility | Toggle public / private |
| Recommend | Configure the recommendation score and screenshot |
| Edit | Opens the edit page |
| Delete | With a confirmation dialog; batch supported |

---

## Permission Requirements

Requires the **System Administrator** role. Regular users and tenant administrators should manage their own dataset repositories through Console → Moha.

Related pages: [Model Repository Management](./models), [Image Registry Management](./images), [Space Management](./spaces).
