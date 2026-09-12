---
title: 'Space Management'
updated: '2026-09-12'
description: 'Space list columns at the BOSS level, the source of run status, and visibility/recommendation management.'
---

## Overview

BOSS-level Space management provides **platform-level** global management of Spaces. A Space is an interactive web application built from a code repository; administrators can view and manage Spaces created by all organizations here.

## Access Path

BOSS Console → Data Repository → **Spaces**

Frontend route: `/moha/spaces`

---

## List

Spaces share the data management list component with Models, Datasets, and Image Registry, with `type = spaces`.

### Columns

| Column | Field Path | Description |
| --- | --- | --- |
| Alias / Name | `name` / `alias` | The name column shows `alias || name`, with a description tooltip and a mirror-origin tag |
| Organization | `organization` | Organization avatar + name |
| Visibility | `visibility` | Public / private / tenant-only tag |
| Repository Storage | `repositoryStorageSize` | Shown when repository stats are ready, otherwise `-` |
| Run Status | `spaceMetadata.status.phase` | Runtime phase status |
| Downloads | `annotations.downloads` | — |
| Domain | `metadata.domain` | Collapsible tag group |
| Scene | `metadata.scene` | Collapsible tag group |
| Recommendation Score | `annotations.recommendation-score` | Recommendation status |
| Updated At | `modified` | — |

> ⚠️ Note: The list has **no "license" column**.

### Run Status Values

A Space's run status is based on `spaceMetadata.status.phase` (the frontend also prefers the phase returned by the real-time status API), rendered through the status component with `space_phase` as the translation prefix.

> ⚠️ Note: The frontend does not hard-code the Space phase enumeration (it is not a fixed set of states); the actual values come from the backend and are not listed here.

### Filtering

Name search, organization filter, visibility filter, and advanced filtering based on metadata facets.

---

## Management Operations

The actions column contains:

| Action | Description |
| --- | --- |
| Visibility | Opens the visibility dialog to toggle public / private |
| Recommend | Opens the recommendation dialog to configure the score and screenshot |
| Edit | Opens the edit page |
| Delete | With a confirmation dialog; batch supported |

> ⚠️ Note: The BOSS Space list has **only the operations above**; there are no runtime operations such as "Restart", "Stop", or "View Logs".

---

## Permission Requirements

Requires the **System Administrator** role. Regular users and tenant administrators should manage their own Spaces through Console → Moha → Spaces.

Related pages: [Model Repository Management](./models), [Dataset Management](./datasets), [Image Registry Management](./images).
