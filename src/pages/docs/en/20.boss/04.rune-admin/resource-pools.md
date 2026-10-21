---
title: Resource Pool
updated: '2026-10-21'
description: Divide a cluster's machines into resource pools shared by different teams — create a pool, read its capacity, move node membership and delete it.
tags:
  - boss
  - rune-admin
---

# Resource Pool

A resource pool divides the machines in a cluster — think of the cluster as a data-centre building — into a few functional zones: one pool for inference, one for training, one kept for the platform itself. A machine belongs to **only one resource pool at a time**; any machine not explicitly moved elsewhere sits in the system-reserved **Default** pool.

After this page you will be able to create a resource pool, read a pool's capacity and node membership, move a machine to another pool, and delete a pool you no longer need.

:::tip Three terms compared

- **Cluster** ≈ a data-centre building.
- **Node** ≈ one server inside that building.
- **Resource pool** ≈ dividing the building's machines into functional zones that different departments share.

:::

## Before you start

- You need a **system administrator** account.
- Prerequisite: the cluster is connected to the platform and resource-pool initialisation has finished.
- Quotas pick a resource pool, so create pools before issuing quotas.

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Resource Management** group in the left-hand menu, click **Resource Pool**.

## What the page looks like

The page is a two-column "pool list on the left, details on the right" layout:

| Area | Content |
| --- | --- |
| Left column | Card list of pools with "N resource pools · Default pool pinned on top"; searchable, paged (20 per page), with a refresh interval you can set (**off by default**, so no automatic refresh) |
| Right column | The selected pool's health labels, capacity snapshot, node and accelerator tree, and the **Edit information / Delete** menu |

Status labels at the top of the right column help you judge whether the pool is healthy:

| Label | Meaning |
| --- | --- |
| Sync | Whether node membership has synchronised successfully |
| Node health | Whether the machines in the pool are Ready and under no pressure |

The **capacity snapshot** gives the node count, allocatable CPU, allocatable memory and physical device supply; the **node and accelerator tree** below expands as Node → device so you can check membership machine by machine.

![Resource pool management: the Default pool pinned on top, pools listed on the left, capacity snapshot and node / accelerator tree on the right](/assets/screenshots/boss/cluster-pools-01.png)

The header reads "partition cluster nodes and inspect capacity, health and current monitoring per Node → device; **scheduling is not included yet**" — that last clause matters: the pools you draw here do not by themselves decide scheduling; scheduling depends on flavors and quotas together.

## Create a resource pool

1. On the resource pool page, click **Create resource pool** at the top right.
2. Fill in three items:

   | Field | How to fill it | Meaning |
   | --- | --- | --- |
   | Display name | For example `Inference pool` | The name shown in the UI |
   | Unique ID | For example `pool-inference` | Unique identifier in the system, cannot be changed after creation |
   | Description | For example "Dedicated to inference" | Optional, one sentence about the purpose |

3. Click **OK** to save.

:::info No machine selection at creation
The create form has **no** node selection step. A new pool starts empty, and machine membership is adjusted one by one under **Node Membership**.
:::

## Adjust node membership

1. Open **Node Membership** from the resource pool page (the workbench whose address carries `?intent=node-membership`).
2. The node list is on top, with search, status filtering and page size controls.
3. Find the machine you want to move and click **Edit resource pool** on its row.
4. Choose the target resource pool and click **Confirm adjustment**.
5. That row's membership updates immediately; repeat per machine for bulk changes.

:::tip Why it is one machine at a time
Node membership is maintained **per node**; there is no "select a batch and move them all" entry. That keeps each change's blast radius clear and easy to roll back.
:::

## Edit resource pool information

1. Select the target pool in the left column.
2. In the right column menu click **Edit information**.
3. Change the display name or description (the unique ID cannot be changed).
4. Save.

## Delete a resource pool

1. Select the target pool in the left column (**the Default pool has no delete entry**).
2. In the right column menu click **Delete**.
3. The confirmation reads "Delete {name}? This cannot be undone." Confirm to delete.

After deletion the pool's machines return to **Default**. If you delete the Default pool the system says "Scheduling will automatically rebuild the default resource pool" — the Default pool is a system fallback structure and gets rebuilt.

:::warning Make sure nothing still uses it before deleting
When a flavor or quota still references the pool, the related workloads lose their usable machine range. Confirm those pools are no longer in use first.
:::

## How resources relate to tenants

A resource pool is not handed to a tenant directly; it becomes related in two steps:

1. A **flavor** can be bound to a resource pool, which decides which machines that flavor can land on — see [Flavor](/boss/rune-admin/flavors).
2. **Quotas** grant capacity to a tenant at the "resource pool + resource item" level — see [Tenant Resources](/boss/rune-admin/tenants).

## The Default resource pool

- The system keeps one Default pool, **pinned on top**, and does not show sync or monitoring status for it.
- Machines not assigned to another pool all belong to Default.
- After another pool is deleted, its machines return to Default.
- If the Default pool is deleted, the system rebuilds it automatically.

## Confirming the result

- The left column count changes from "N resource pools" to N+1 and a new card appears.
- Select the new pool: the **capacity snapshot** shows a node count and allocatable CPU / memory (assuming machines have been assigned).
- After adjusting membership, a machine's **Sync** status eventually becomes synchronised.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The new pool has no machines | No machines are selected at creation | Set them one by one under **Node Membership** |
| The page does not refresh by itself | The refresh interval is off by default | Click refresh manually, or set an interval |
| A machine's membership cannot be changed | Insufficient permission, or the machine is unhealthy | Check the account's permission and the node's health |
| The Default pool cannot be deleted | It is the system fallback | Expected; it would be rebuilt anyway |
| Workloads report no available nodes after a pool is deleted | A flavor or quota still points at that pool | Create a pool again and point the flavors and quotas at it |

## Related

- [Flavor](/boss/rune-admin/flavors)
- [Tenant Resources](/boss/rune-admin/tenants)
- [Node Status](/boss/rune-admin/node-status)
