---
title: Images
updated: '2026-09-12'
description: 'Container image registry list columns at the BOSS level, category/accelerate/arch tags, and visibility management.'
---

## Overview

BOSS-level image registry management provides **platform-level** global management of container image registries. System administrators can view and manage container image registries created by all organizations on the platform.

> 💡 Tip: The "image registry" here refers to container images, which is not the same feature as data mirror sync ([Mirror Source Configuration](./mirrors)).

## Access Path

BOSS Console → Data Repository → **Image Registry**

Frontend route: `/moha/images`

---

## List

Image Registry shares the data management list component with Models, Datasets, and Spaces, with `type = images`.

### Columns

| Column | Field Path | Description |
| --- | --- | --- |
| Alias / Name | `name` / `alias` | The name column shows `alias || name`, with a description tooltip |
| Organization | `organization` | Organization avatar + name |
| Visibility | `visibility` | Public / private / tenant-only tag |
| Repository Storage | `repositoryStorageSize` | Shown when repository stats are ready, otherwise `-` |
| Downloads | `annotations.downloads` | — |
| Category | `metadata.category` | Collapsible tag group |
| Accelerate | `metadata.accelerate` | Collapsible tag group |
| Arch | `metadata.arch` | Collapsible tag group |
| Updated At | `modified` | — |

### Differences from Models / Datasets

Image Registry does **not** have the following columns:

- Tasks (`metadata.tasks`)
- Tags (`metadata.tags`)
- Recommendation Score (`annotations.recommendation-score`)

> ⚠️ Note: Accordingly, the image registry **actions column has no "Recommend"**, and it does not show encryption-related markers.

### Filtering

Name search, organization filter, visibility filter, and advanced filtering based on metadata facets.

---

## Management Operations

| Action | Description |
| --- | --- |
| Visibility | Toggle public / private |
| Edit | Opens the edit page |
| Delete | With a confirmation dialog; batch supported |

> ⚠️ Note: The list has **no "license" column**, nor any security-scan / vulnerability-level columns.

---

## Permission Requirements

Requires the **System Administrator** role. Regular users and tenant administrators should manage their own container images through Console → Moha.

Related pages: [Model Repository Management](./models), [Dataset Management](./datasets), [Mirror Source Configuration](./mirrors).
