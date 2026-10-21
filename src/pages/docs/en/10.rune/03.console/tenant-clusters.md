---
title: 'Tenant Clusters'
updated: '2026-10-21'
description: 'Enter a cluster from the tenant area, handle cluster activation requests, and find the quota, flavor and workspace tabs.'
tags:
  - rune
  - console
  - tenant
---

# Tenant Clusters

"Tenant Clusters" is the list of clusters your tenant can use, and the only entry point to **quota, flavor, and workspace**.
Many people hunt through the console sidebar for these three and never find them — they are not there, they live in the tenant area.
After reading this page you will be able to enter a cluster correctly, read the activation state, and know what the four tabs manage.

:::tip The relationship in one line
A **tenant** is your company's account space, a **cluster** is a data center the tenant has enabled, and the **quota / flavor / workspace** inside that data center decide what instances you can create.
The order is: enable the cluster, allocate quota, create workspaces, and only then create instances.
:::

![Tenant Clusters page: Overview / Members / Tenant Clusters / Workbench under Tenant Management on the left, one cluster per table row (type + name) on the right](/assets/screenshots/rune/tenant-clusters-01.png)

## Core concepts

| Term | Plain explanation | Think of it as |
| --- | --- | --- |
| Tenant cluster | A cluster this tenant has enabled, or has applied to enable | The list of data centers under your company |
| Cluster activation state | Where this tenant's access to this cluster stands | How far the access pass has been processed |
| Quota | The resource ceiling this tenant was given in this cluster | How much power and how many racks you got |
| Flavor | The machine configurations selectable when creating instances | The catalogue of available machine types |
| Workspace | A resource boundary inside the cluster | A separate workshop inside the data center |

## Where to enter

1. Click the avatar in the top-right to open the account drawer.
2. Click **Tenant <your tenant name>** in the menu — this is the entry into the tenant.
3. Once inside, click **Tenant Clusters** in the left navigation.
4. To switch to another tenant, use **Switch tenant** at the bottom of the drawer.

![Account drawer: the tenant menu entry and the Switch tenant button at the bottom](/assets/screenshots/rune/tenant-drawer-01.png)

:::info Overview and members are not on this page
Inside the tenant area the left navigation also offers **Overview** and **Members** (administrators only). Those belong to account management; see [Tenant Management](/account/iam/tenant).
This page only covers **Tenant Clusters** on the Rune side.
:::

## The tenant cluster list

The list is simple: a single **Name** column holding the cluster name. Click the name to open that cluster's detail page.

If the list is empty, this tenant has no usable or pending cluster yet, and an activation request is needed first.

## Cluster activation

While a cluster is not enabled, the console content area is replaced by a full-page activation status screen (no dialog, no error). It shows the state and at most two buttons.

| Message | Meaning | Who can act | What can be done |
| --- | --- | --- | --- |
| The tenant has not enabled this cluster yet | No request submitted | Administrators can apply | Fill in the **Application reason** → **Apply** |
| The activation request is under review | Submitted, waiting for platform review | Everyone reads | **Refresh status** |
| The activation request was rejected | Rejected; the reason is shown too | Administrators can resubmit | Adjust the **Application reason** per the reason → **Resubmit** |
| The cluster is being activated | Approved, resources being prepared | Everyone reads | **Refresh status** |
| Cluster activation failed | The system could not finish | Everyone reads | **Refresh status** to retry; contact the platform administrator if it keeps failing |
| Cluster access for this tenant is disabled | The platform turned off this tenant's access | Everyone reads | Contact the platform administrator |
| This cluster is temporarily unavailable | Enabled, but cluster resources are unavailable | Everyone reads | **Refresh status** or contact an administrator |
| Unable to read cluster activation status | The status request failed (network and so on) | Everyone reads | Check the network and retry |

:::warning The application reason is read by a reviewer
**Application reason** is available to tenant administrators only, and it is what the reviewer uses to decide. State the purpose, the resource you need, and how long you need it — it gets approved much faster than "please enable".
:::

:::info Developers and members can only watch
If you are not a tenant administrator, the page shows the status and a **Refresh status** button but no input field. Ask an administrator to start the request.
:::

## Cluster detail: four tabs

After clicking a cluster name, four tabs appear at the top (visible only to **Administrators** and **Developers**):

| Tab | What it shows | Editable |
| --- | --- | --- |
| Overview | The cluster's name, ID, and description | Read-only |
| Quota | Guaranteed quota, quota limit, and usage for each resource in this cluster | Tenant-level read-only |
| Flavor | The machine configurations selectable when creating instances | Read-only, configured by the platform |
| Workspace | The workspaces in this cluster, and each workspace's quota | Administrators can create, edit, and delete |

### Quota

Three columns — **type / resource pool / quota** — with usage shown against both the guaranteed quota and the limit, and states within guarantee, above guarantee, at limit, over limit, and no quota. See [Quota](/rune/console/quota).

### Flavor

Three columns — **name / resource configuration / resource pool** — filterable by type, resource, and status; there is **no create button** on this page. See [Flavor](/rune/console/flavor).

### Workspace

Lists the workspaces in this cluster (name, namespace, status, created at); the row action opens its quota page, and create / edit / delete are administrator-only.
Opening a workspace shows only the **Overview** and **Quota** tabs — **there is no members tab**. See [Workspace](/rune/console/workspace).

:::warning You cannot add members inside a workspace
Workspace membership follows tenant membership. To give a colleague access, go to **Tenant Management → Members**, not into the workspace.
:::

## Confirm it worked

- The target cluster appears in the list and all four tabs open → the cluster is enabled and you have read permission.
- The quota tab shows amounts, and the workspace tab has at least one **Ready** workspace → you can go back to the console and create instances.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No "Quota / Flavor / Workspace" entry in the left sidebar | They are tabs on a cluster, not top-level menus | Avatar → tenant → **Tenant Clusters** → click the cluster |
| Only "Overview" appears inside a cluster | You are not an Administrator or Developer | Ask the tenant administrator |
| The whole content area says the cluster is not enabled | The tenant has not enabled this cluster | An administrator fills in the reason and applies |
| Creating a workspace reports no resource quota | The tenant has no quota in this cluster yet | Ask the platform administrator to allocate tenant quota first |
| I want to see tenant members | Members live in another account-management entry | See [Tenant Management](/account/iam/tenant) |

## Related

- [Quota](/rune/console/quota)
- [Flavor](/rune/console/flavor)
- [Workspace](/rune/console/workspace)
- [Prerequisites](/rune/guide/prerequisites)
- [Tenant Management](/account/iam/tenant)
