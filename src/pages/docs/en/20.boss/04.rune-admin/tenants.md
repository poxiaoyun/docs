---
title: Tenant Quotas
updated: '2026-09-14'
description: Hand out cluster CPU, memory and accelerator allowances to tenants and their workspaces.
---

# Tenant Quotas

To use the platform's compute, a tenant (think of it as a company's own account space) must first be given an allowance. This page is where you hand out that allowance: you grant a usage cap for CPU, memory and accelerators at the "cluster + resource pool + resource item" level, and then subdivide the tenant's allowance down to its workspaces.

By the end of this page you can: assign resource quotas to a tenant, create a workspace, and subdivide the quota into workspaces.

:::tip Three terms compared

- **Tenant** is a company's own account space.
- **Workspace** is one office inside the building, shared by colleagues.
- **Quota** is the spending cap you have for this month.

:::

## Before you start

- You need a **System Administrator** account.
- Prerequisite: the cluster is connected to the platform and a [Resource Pool](/boss/rune-admin/resource-pools) has already been created (a quota must pick a resource pool).

## Getting there

Click **AI Platform** in the top navigation bar, then click **Tenant Resource** under the **AI Platform** group in the left sidebar.

## Tenant list

| Column | Meaning |
| --- | --- |
| Name | Avatar + tenant name + tenant ID; click to open the details, which start on **Quota** |
| Quota | This tenant's quota usage per resource type, shown per cluster |
| Created At | When the tenant was created |

:::info The list has no actions column

Every operation is done after clicking the tenant name to open the details; the list itself only has the three columns above.

:::

![Tenant resources list: one row per tenant, with progress bars for CPU / memory / GPU / storage usage against quota](/assets/screenshots/boss/rune-tenant-list-01.png)

**Tenant Resources** and **Tenant Management** cover the same tenants with different emphasis: here every row lays out four quota progress bars. `chart-test` shows CPU at `18core / 20core` (90%) with the bar turned amber — the kind of tenant worth checking for a quota increase.

## The two subpages in tenant details

After entering a tenant, there are two subpages on the left:

| Subpage | Purpose |
| --- | --- |
| Quota | Assign resource allowance to this tenant |
| Workspace | Manage the workspaces under this tenant |

## Assign a quota to a tenant

1. In the tenant details, click **Quota** on the left.
2. On the left of the toolbar, select a **Cluster** (the quota list follows when you switch clusters).
3. Click **Create Quota** in the top right.
4. Fill in the form:

| Form item | What to enter | Notes |
| --- | --- | --- |
| Cluster | Choose which cluster the resources go to | Selected at creation |
| Resource Pool | Choose the pool to draw the allowance from | **Switching the cluster clears this, so pick it again** |
| Resource | Fill in the allowance for each resource item one by one | Enter a limit per resource type; at least one item is required |

5. Click **Confirm** to save.

:::tip You do not pick a flavor here

A quota does not choose a ready-made flavor; instead you pick "cluster + resource pool + per-item resources". The selectable resource items are given dynamically by the platform for the current cluster and resource pool, and CPU / memory come with default values you can change directly.

:::

Each row in the quota list can be **Edit**ed or **Delete**d; the top of the list can also be filtered by **Type / Vendor / Model** to help you locate rows.

![Tenant quota page: a cluster dropdown at the top, then a table of quota type, model, resource pool and used / total](/assets/screenshots/boss/rune-tenant-quota-01.png)

Quotas are counted **per cluster**, hence the **Cluster** dropdown at the top (Beijing A here) — switching it swaps the whole table. A **Type** filter (CPU / memory / disk) sits on the left, and the **Quota** column reads as used / total, such as `0 / 3`.

## Create a workspace

1. In the tenant details, click **Workspace** on the left.
2. Click **Create Workspace** in the top right.
3. Fill in the form:

| Form item | What to enter | Notes |
| --- | --- | --- |
| Name | e.g. "Algorithm Team 1" | Required; the ID below is generated automatically and can be adjusted by hand |
| Cluster | Choose the owning cluster | Required; **cannot be changed when editing** (a lock indicator is shown) |
| Description | Optional | One sentence about what it is for |

4. Click **Confirm** to save.

Each row in the workspace list can:

| Action | Meaning |
| --- | --- |
| Quota | Jumps to this workspace's quota page |
| Edit | Change the name or description (the cluster cannot be changed) |
| Delete | Deletes the workspace, with a confirmation dialog |

At the top left of the list you can filter by **Cluster**.

![Workspaces inside a tenant: cluster, name, namespace, status and creation time](/assets/screenshots/boss/rune-tenant-workspace-01.png)

This list also carries a **Cluster** dropdown, since a workspace belongs to a cluster, and shows every space the tenant owns there. The **Namespace** column is the underlying Kubernetes namespace (`dev` here), and **Status** must read `Ready` before the workspace is usable.

## Subdivide the quota into workspaces

After a tenant receives its total quota, you usually still need to share the allowance out among its workspaces:

1. In the **Workspace** list, find the target workspace and click **Quota**.
2. You enter the workspace details, which have two subpages: **Quota** and **Member**.
3. On the **Quota** page, create a workspace quota the same way to split the tenant's allowance down.

## Confirming the result

- The **Quota** column in the tenant list shows the allowance usage per cluster.
- The records you just created appear on the tenant details' **Quota** page.
- The new workspace appears in the **Workspace** list with a normal status.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The resource pool drop-down is empty | No cluster is selected in the quota form, or that cluster has no resource pool | Select a cluster first; if there is no pool, go and create a [Resource Pool](/boss/rune-admin/resource-pools) |
| The resource pool is cleared after switching clusters | This is intentional | Pick the target resource pool again |
| The cluster is greyed out when editing a workspace | The cluster cannot be changed after creation | This is normal |

## Related

- [Resource Pool](/boss/rune-admin/resource-pools)
- [Flavor](/boss/rune-admin/flavors)
- [Cluster](/boss/rune-admin/clusters)
