---
title: Tenant Quotas
updated: '2026-09-12'
description: 'Allocate cluster resource quotas to tenants and manage workspaces: list columns, quota form, and workspace form.'
---

## Overview

Rune Tenant Resource Management extends standard tenant information with **cluster resource quota** and **workspace** management, used to control each tenant's resource allocation across clusters.

Unlike [IAM Tenant Management](/boss/iam/tenants), this page focuses on the **compute resource layer**.

## Access Path

BOSS Console → Tenant Resources

Frontend route: `/rune/tenants`

---

## Tenant List

| Column | Field Path | Description |
| --- | --- | --- |
| Name | `name` | Avatar + name + tenant ID; click to open tenant details (defaults to "Quotas") |
| Quota | `quota` | `TenantQuota` component (600px wide), showing per-cluster quota usage for each resource type |
| Created At | `creationTimestamp` | Tenant creation time |

> ⚠️ Note: The list has **only these three columns**; there is no "members" column and **no actions column**. All detail operations are reached by clicking the tenant name.

---

## Tenant Detail Subpages

The sidebar actually has only **2 subpages**:

| Subpage | Frontend Route |
| --- | --- |
| Quotas | `/rune/tenants/:tenant/quotas` |
| Workspaces | `/rune/tenants/:tenant/workspaces` |

> ⚠️ Note: The "Overview" and "Flavors" navigation items are **commented out and disabled** in the code and are not currently shown.

---

## Quota Management

### Filtering

- **Cluster selection**: switch the target cluster (left side of the toolbar).
- **Quota filter bar**: filter by type / vendor / model (options come from the tenant quota selector).

### Columns

| Column | Field Path | Description |
| --- | --- | --- |
| Type | `type` | Resource type |
| Model | `model` | Model (combined with `vendor`) |
| Resource Pool | `resourcePool` | Associated resource pool |
| Quota | `quota` | Quota usage component |

Actions: create (top right), edit, delete.

### Create / Edit Quota

| Field | Field Name | Description |
| --- | --- | --- |
| Cluster | `cluster` | Select the target cluster on creation |
| Resource Pool | `resourcePool` | Switching the cluster clears the resource pool |
| Resource Configuration | `config[]` | Array of resource items with the same fields as a flavor: `resourceName` / `name` / `type` / `limit` / `request`, etc. |

> ⚠️ Note: The quota form **does not select a Flavor**; instead it selects cluster + resource pool + per-item resource configuration. The selectable resource items are returned dynamically by `listClusterQuotaResources(cluster, tenant, resourcePool)`.

> 💡 Tip: On creation, the default values for CPU / memory come from the resource item's own `default` (then `min`), falling back to `2` and `4Gi`.

---

## Workspace Management

### Columns

| Column | Field Path | Description |
| --- | --- | --- |
| Name | `name` | Name + description in the same column |
| Namespace | `namespace` | Kubernetes Namespace; shows `-` when empty |
| Status | `status` | Status component |
| Created At | `creationTimestamp` | — |

Actions: Quota (navigates to workspace quotas), Edit, Delete; the left side of the toolbar allows filtering by cluster.

### Create / Edit Workspace

| Field | Field Name | Required | Description |
| --- | --- | --- | --- |
| Name | `name` | ✅ | Workspace name (ID auto-generated, manually adjustable) |
| Cluster | `cluster` | ✅ | Select the owning cluster; disabled in edit mode (with a lock indicator) |
| Description | `description` | — | Textarea |

> 💡 Tip: The workspace detail page (frontend `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace`) also has **Workspace Quotas** and **Members** subpages for subdividing tenant quota into workspaces.

---

## Permission Requirements

Requires the **System Administrator** role. You can view all tenants' resource allocations and manage quotas and workspaces.
