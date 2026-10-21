---
title: 'Tenant Resources'
updated: '2026-10-21'
description: Manage the tenants enabled on a cluster, review enablement requests, and grant quotas, flavor access and workspaces.
tags:
  - boss
  - rune-admin
---

# Tenant Resources

**Tenant Resources** is tenant management seen from the cluster: which tenants are enabled on this cluster, who asked to be enabled, how much each may use, which flavors they may pick, and which workspaces exist.

After reading this page you can review enablement requests, open a tenant, create quotas, grant flavor access and create workspaces.

:::tip Tenant Resources versus Tenant Clusters

- **AI Platform → Tenant Clusters** starts from a tenant and shows which clusters it is enabled on.
- **Cluster → Tenant Resources** starts from a cluster and shows which tenants it hosts.

Both are two views of the same enablement relationships.

:::

## Before you start

- You need a **system administrator** account.
- The tenant must already be enabled on this cluster, otherwise it does not appear on the **Enabled** tab.
- At least one [resource pool](/boss/rune-admin/resource-pools) must exist, because quotas are granted from a pool.

## Getting there

1. Click **AI Platform** in the top bar, then **Cluster Management** in the sidebar.
2. Open the target cluster.
3. Click **Tenant Resources** under **Resource Management**.

## Two tabs

| Tab | Contents |
| --- | --- |
| Enabled | Tenants already enabled on this cluster |
| Enablement Requests | Requests submitted by tenants, plus review records |

### Enabled

| Column | Meaning |
| --- | --- |
| Tenant | Tenant name and ID; click to open its in-cluster details |
| Enablement status | Not Opened / Opening / Enabled / Failed |
| Created at | When the enablement record was created |

Row actions include **Configure** (open the tenant details) and deleting the enablement.

### Enablement Requests

| Column | Meaning |
| --- | --- |
| Tenant | The tenant that submitted the request |
| Reason | What the tenant wrote as the justification |
| Review status | Pending / Approved / Rejected |
| Review note | The reason recorded during review |
| Created at | — |

Row actions:

| Action | Effect |
| --- | --- |
| Approve | Opens the request and, after **Approve and enable**, the platform starts preparing cluster resources |
| Reject | Requires a reason; the request leaves the enablement flow and the tenant may resubmit with an adjusted reason |
| Delete request | Removes the request and its review record; it does **not** close or delete an existing enablement |

:::warning Deleting a request is not disabling a tenant
Deleting a request only clears the paperwork. To stop a tenant from using this cluster, work on the enablement under **Enabled**.
:::

## Four tabs in the tenant details

Opening an enabled tenant shows four tabs:

| Tab | Purpose |
| --- | --- |
| Overview | Name, ID, enablement status, enablement time, description, status message |
| Quota | Grant capacity to this tenant |
| Flavor Access | Which flavors this tenant may use in this cluster |
| Workspace | Workspaces under this tenant and their quotas |

![Tenant Resources: the tenant list on the left and the overview, quota, flavor access and workspace tabs on the right](/assets/screenshots/boss/rune-tenant-quota-01.png)

## Grant a quota

1. Open the tenant and switch to **Quota**.
2. Click **Create Quota** in the top-right corner.
3. Fill in:

   | Field | How to fill it | Notes |
   | --- | --- | --- |
   | Resource pool | Pick the pool the capacity comes from | Switching pools reloads the resource items |
   | Resources | Per item, set the limit and the guaranteed amount | Every item can carry a **limit** and a **guaranteed** value; at least one item is required |

4. Click **OK**.

Each quota record can be **edited** or **deleted**, and the list can be filtered by **type / vendor / model**.

:::tip A quota is not a flavor
A quota is "pool + per-item ceiling". A [flavor](/boss/rune-admin/flavors) describes what one instance looks like; a quota describes how much the tenant may use in total.
:::

## Flavor access

The **Flavor Access** tab lists the flavors available to this tenant in this cluster, with the flavor, its resource pool and whether it is granted.

Only flavors marked **Globally available** can be used without extra grants. Flavors that **require tenant authorization** must be granted here, otherwise users cannot pick them. See [Flavor](/boss/rune-admin/flavors).

## Workspaces

1. Switch to the **Workspace** tab.
2. Click **Create Workspace**, fill in the name, cluster (fixed to this cluster) and description.
3. Afterwards each workspace row offers **Quota**, **Edit** and **Delete**.

Workspace quotas subdivide the tenant's total quota; open a workspace and use its **Quota** tab.

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| A request was handled | The review status on the **Enablement Requests** tab |
| The tenant is really enabled | Its status on the **Enabled** tab reads **Enabled** |
| The quota took effect | A record appears on the **Quota** tab, and users can consume it when creating instances |
| A flavor is selectable | It appears under **Flavor Access** and users can pick it |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The resource pool dropdown is empty | The cluster has no resource pool yet | Create one in [Resource Pools](/boss/rune-admin/resource-pools) |
| The tenant is missing from **Enabled** | It was never enabled, or enablement failed | Check **Enablement Requests**, or use **Open in Cluster** under **Tenant Clusters** |
| Users cannot pick a flavor | The flavor requires authorization and this tenant has none | Grant it under **Flavor Access** |
| Status stays "Opening" after approval | Resources are still being prepared, or provisioning failed | Wait and refresh; check the status message |
| Quota save fails | It exceeds the pool's capacity, or no resource item was added | Lower the limit, or keep at least one item |

## Related

- [Tenant Clusters](/boss/rune-admin/tenant-clusters)
- [Resource Pools](/boss/rune-admin/resource-pools)
- [Flavors](/boss/rune-admin/flavors)
- [Cluster Management](/boss/rune-admin/clusters)
