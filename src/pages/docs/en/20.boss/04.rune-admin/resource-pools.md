---
title: Resource Pool
updated: '2026-09-12'
description: Divide a cluster's machines into resource pools for different teams, and create, re-partition or delete a pool step by step.
---

# Resource Pool

A resource pool is how you divide the machines in a cluster — think of the cluster as a data-centre building — into a few functional zones: one pool for inference, one for training, one kept for the platform itself. A machine can belong to **only one resource pool at a time**; any machine you have not moved out belongs to the system-reserved **Default** pool.

By the end of this page you can: create a resource pool, move machines into it, rename it, and return its machines before deleting it.

:::tip Three terms compared

- **Cluster** is a data-centre building.
- **Node** is one server inside that building.
- **Resource pool** groups the machines in the building into functional zones that different departments share.

:::

## Before you start

- You need a **System Administrator** account.
- Prerequisite: the cluster is connected to the platform and resource-pool initialization has finished (before it finishes, the **Create resource pool** button is disabled with a hint).
- A cluster supports at most **10** resource pools; once you reach the limit the button is disabled too.

## Getting there

1. In the left sidebar click **AI Platform** → **Cluster**, then open the target cluster.
2. In the left sidebar under **Resource Management**, click **Resource Pool**.

## What the page looks like

The page uses a two-column "list on the left, details on the right" layout:

| Area | Content |
| --- | --- |
| Left | Card list of resource pools, showing "used / limit 10" at the top; search by display name or unique ID |
| Right | The selected pool's capacity snapshot, accelerator view, last-hour trends and action buttons |

The top of the right column has three status labels that help you judge whether the pool is healthy:

| Label | Meaning |
| --- | --- |
| Sync | Whether machine ownership has synchronized successfully |
| Node health | Whether the machines in the pool are Ready and under no pressure |
| Monitoring | Whether monitoring data is collected completely |

The **Resource capacity view** on the right can be switched:

- **Accelerator view**: see each group's capacity by physical / virtual accelerator.
- **Host view**: see each accelerator's details per machine (utilization, memory, power, temperature, and so on).

:::info The page refreshes automatically

Normally it refreshes every 30 seconds. If the cluster is still initializing resource pools it refreshes every 2 seconds instead; if initialization fails, refreshing stops and a hint is shown.

:::

## Create a resource pool

1. On the resource pool page, click **Create resource pool** in the top right.
2. Fill in **Resource pool information**:

| Form item | What to enter | Notes |
| --- | --- | --- |
| Name | e.g. `pool-inference` | 1–128 characters, cannot be empty after trimming; this is the display name |
| Unique ID | Generated automatically | Generated as soon as you type the name, and cannot be changed after creation |
| Description | e.g. "Dedicated to inference" | Optional, ≤ 500 characters |

3. Under **Initial nodes (optional)**, tick the machines to include from the start:

   - You can only select machines that **currently belong to the Default pool**; machines already in another pool are greyed out and must be returned to Default first.
   - You can search by name and use **Select current page**; page size is 20 / 50 / 100.

4. Click **Review and create**; the system runs a change check first.
5. In the **Confirm resource pool creation** dialog:

   - Review the check conclusion: passed / needs confirmation / blocked / no actual change.
   - Check the **Initial node list** (No., node name, accelerators).
   - Tick each risk item that needs your acknowledgement.
   - Click **Create resource pool** to submit, or **Back to edit** to change things.

After submitting you see "The resource pool creation request was submitted and will run in the background", and the page returns to the list.

:::warning At creation, machines must come from the Default pool

If a machine already belongs to another resource pool you cannot select it on the create page. Go to that pool and move the machine back to Default first.

:::

## Edit a resource pool (name and description)

1. In the right column click **Edit information**.
2. Change the **Name** (1–128 characters) or the **Description** (≤ 500 characters).
3. Click **Save information**; "Resource pool information updated." means success.

:::tip Machines are not added or removed here

The edit page only changes the name and description. To move machines in or out of this pool, use **Adjust node partition** below.

:::

## Adjust the machine partition

1. In the right column click **Adjust node partition** to open the **Node partition workspace**.
2. **1. Select nodes**: tick the machines to move; you can search and use **Select current page**, page size 20 / 50 / 100.
3. **2. Select one target**: under **Target resource pool** pick one target pool (only one at a time; every selected machine goes to it).
4. Click **Check change**; the right side shows the "Desired membership updates" and "Unchanged and skipped" counts and any blocking reasons.
5. Tick the risk items that need confirming, then click **Submit node partition**.

After submitting you see "The node partition change was submitted and will run in the background."

:::warning Re-check after changing the selection

As soon as you re-tick machines, switch the target pool, page, or change the search, the previous check result is void and you must click **Check change** again before submitting.

:::

## Return the machines and delete the pool

1. In the right column click **Return nodes and delete** (the **Default** pool has no such button).
2. The dialog automatically checks whether the pool can be deleted:
   - If the pool is still referenced by a **Flavor** or a **Quota**, deletion is blocked; the dialog lists every reference and offers a **Manage** link.
   - With no blockers, type this pool's **unique ID** as a second confirmation.
3. Tick the risk acknowledgements and click **Return nodes and delete**.

:::warning Deletion is irreversible

After deleting a resource pool its machines go back to the **Default** pool, and the work runs in the background. Make sure no workload still depends on this pool first.

:::

## How resources relate to tenants

A resource pool is not handed to a tenant directly; it connects to tenants and workspaces in two steps:

1. A **Flavor** can be bound to a resource pool, which decides which machines that flavor can be scheduled onto — see [Flavors](/boss/rune-admin/flavors).
2. **Quotas** grant capacity to a tenant at the "cluster + resource pool + resource item" level, and workspace quotas subdivide a tenant quota further — see [Tenant Quotas](/boss/rune-admin/tenants).

So: **before deleting a pool, make sure no flavor or quota still references it**, otherwise the deletion is blocked for safety.

## The Default resource pool

- The system keeps one Default pool whose ID is fixed to `default`; it **cannot be deleted**.
- The Default pool is shown first, and does not display sync or monitoring status.
- When creating a resource pool you can only pick machines that currently belong to Default.
- After deleting another pool, its machines return to Default.

## Confirming the result

- The count at the top-left of the list goes from "n / 10" to "n+1 / 10", and a new card appears on the left.
- Open the new pool: the **Expected members**, **Allocatable CPU** and **Allocatable memory** in the **Capacity snapshot** now have values.
- After machines are moved in, their **Sync** status eventually becomes "Synchronized".

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| **Create resource pool** will not respond | You reached the limit of 10, or resource pools have not finished initializing | Delete an unused pool, or wait for initialization |
| A machine cannot be selected | It already belongs to another pool | Move that machine back to Default first |
| The submit button is greyed out | The check did not pass / there is no actual change / risks are not all ticked | Run **Check change** again and tick the risk items |
| Deletion is blocked | The pool is still referenced by a flavor or quota | Handle the reference the hint points to, then delete |

## Related

- [Flavors](/boss/rune-admin/flavors)
- [Tenant Quotas](/boss/rune-admin/tenants)
- [Nodes & Accelerators](/boss/rune-admin/nodes-gpu)
