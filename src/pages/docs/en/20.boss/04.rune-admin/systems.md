---
title: System Apps
updated: '2026-09-12'
description: 'Instance list, deployment entry, and deletion notes for cluster-level system apps.'
---

## Overview

System instances are **infrastructure-level components** deployed in a cluster (such as monitoring, logging, and storage) that serve the operations and management needs of the whole cluster. They are deployed with one click from templates in the System Template Market and are backed by Helm Charts.

## Access Path

BOSS Console → Cluster Management → select a cluster → **System Apps**

Frontend route: `/rune/clusters/:cluster/systems`

---

## Instance List

System Apps and Storage Clusters share the same instance list component, distinguished by `category`: system apps are `category = system`, storage clusters are `category = storage`.

| Column | Field Path | Description |
| --- | --- | --- |
| Name | `name` | Instance name (with icon); click to open instance details |
| Version | `product.version` | Template version used for deployment |
| Status | `status.phase` | Rendered by `ObjectStatus` |
| Created At | `creationTimestamp` | — |

Actions: edit, delete (with a confirmation dialog); multi-select is supported.

> ⚠️ Note: The list has **no separate "template" column**. The deployment source (template) is reflected in the version field and details.

---

## Deploy a System Instance

1. On the instance list, click **Add**.
2. The system navigates to the system template market (`/rune/clusters/:cluster/system-market`).
3. Select the target template and version.
4. Fill in the deployment parameters (dynamically generated from the template Schema).
5. After submission a system instance is created, and its status can be viewed in the instance list.

---

## Manage Instances

- **View details**: click the instance name to open the detail page (`/rune/clusters/:cluster/systems/:instance`) and view basic information, status, and related resources.
- **Edit**: modify the instance's configurable items.
- **Delete**: with a confirmation dialog; related resources are released after deletion.

> ⚠️ Note: Deleting a system instance may make cluster monitoring or logging unavailable. Confirm there are no dependencies before proceeding.

---

## Differences from App Instances

| Comparison | System Instance | App Instance |
| --- | --- | --- |
| Deployment Source | System Template Market (`domain = system`) | User App Market (`domain = user`) |
| Scope | Cluster level | Workspace level |
| Management Entry | Cluster → System Apps | Console → Apps |

---

## Permission Requirements

Requires the **System Administrator** role. You can view, deploy, and manage cluster-level system instances. For more details, see [System Template Market](./system-market).
