---
title: Flavor
updated: '2026-09-14'
description: Define packages that say how many cores, how much memory and how many accelerators you get, then enable them for tenants.
---

# Flavor

A flavor is a "specification menu" that states in one line what a slice of compute contains: for example "2 CPU cores + 4Gi memory", or "8 CPU cores + 32Gi memory + 1 GPU". Administrators define these packages at the cluster level, and users pick from them when creating an instance.

By the end of this page you can: create a flavor, understand every field, enable or disable a flavor, and delete one you no longer use.

:::tip Two terms compared

- **Flavor** is a specification menu that says "how many cores / how much memory / how many cards".
- **Accelerator (GPU / NPU)** is the "engine" inside a server that is dedicated to AI computation.

:::

## Before you start

- You need a **System Administrator** account. This is the administrator view, where you can create / edit / enable / disable / delete; on the tenant side users can only view and pick authorized flavors.
- Prerequisite: the cluster is connected to the platform. If you want the flavor to land on only part of the machines, create the [Resource Pool](/boss/rune-admin/resource-pools) first.

## Getting there

1. In the left sidebar click **AI Platform** → **Cluster**, then open the target cluster.
2. In the left sidebar under **Resource Management**, click **Flavor**.

## Reading the flavor list

| Column | Meaning |
| --- | --- |
| Name | The flavor name, with the description in small text underneath |
| Type | Resource type such as CPU or GPU |
| Model | The model of the card or device |
| Flavor | Tags of the resource items this flavor contains, e.g. CPU, memory, number of cards |
| Resource Pool | The bound resource pool, shown as "name (ID)"; shows `-` when none is bound |
| Status | Enabled / Not enabled |

Filters at the top:

- **Status**: Enabled / Not enabled.
- **Type / Vendor / Model** filter bar: the options come from what the current cluster actually has, and they update as you choose.

Actions on each row:

| Action | Meaning |
| --- | --- |
| Enable / Disable | Toggles the flavor status, with a confirmation dialog |
| Edit | Opens the edit page |
| Delete | Deletes the flavor, with a confirmation dialog; multi-select batch deletion is supported |

## Create a flavor

1. On the flavor list, click **Create Flavor** in the top right.
2. At the top of the **Resource Configuration** card there is a name preview box; it generates the name in real time as you fill in resource items, so you never type a name yourself.
3. Under **Resource Configuration**, click **Create Resource** to add a resource item (at least one):

| Field | Meaning | What to enter |
| --- | --- | --- |
| Category | The resource category, e.g. CPU / Memory / GPU | Pick from the drop-down |
| Resource | The concrete resource, e.g. CPU or Memory | Pick after choosing the category |
| Model | The card or device model | Optional; when left empty it shows **All Models**, meaning every device of that resource kind in this cluster |
| Limit | The maximum this flavor grants, **required** | For example `2` for CPU, `4Gi` for memory, `1` for a card |
| Node Label | Restricts the flavor to machines carrying a given label | Only appears for the accelerator item; Key and Value must be filled in as a pair, filling only one reports an error |

4. Choose a **Resource Pool** (optional): once chosen, this flavor only lands on machines in that pool; if you leave it empty the range is wider.
5. Fill in a **Description** (optional).
6. Click **Confirm** to save.

:::tip Defaults are pre-filled for you on creation

If you have already chosen a resource pool and the resource items have loaded, the platform pre-fills `2` for CPU and `4Gi` for memory, and you can change them as needed.

:::

:::info Types are not a fixed short list

The selectable resource types and models come from what the current cluster can actually do, so different clusters may show different types. Do not worry if you cannot see a particular category.

:::

## Edit a flavor

1. Click **Edit** on a row in the list.
2. On the edit page the name is generated the same way and cannot be changed on its own; what you can adjust is the resource configuration, the resource pool and the description.
3. Click **Confirm** to save.

## Enable / Disable a flavor

| Action | Effect |
| --- | --- |
| Enable | Visible to users who have quota, and selectable |
| Disable | Hidden from the selection list; **instances already running with this flavor are not affected** |

## How a flavor reaches tenants

The flavor page itself does not pick tenants directly. The rule is:

1. A flavor must first be **enabled** to enter the selectable range.
2. Which flavors a specific tenant can use is decided by the **quota** that tenant holds; quotas are granted in [Tenant Quotas](/boss/rune-admin/tenants) by "cluster + resource pool + resource item".

In other words: **enable the flavor + grant the tenant quota** — only when both are done can the tenant select the flavor when creating an instance.

## Delete a flavor

Click **Delete** and confirm. Instances already running from this flavor keep running, but **you can no longer create new instances from it**.

:::warning Make sure nothing references it before deleting

Before deleting, confirm that no tenant quota or workspace quota still references this flavor, otherwise later allocations may be affected.

:::

## Confirming the result

- After creation the flavor appears in the list, named with the auto-generated name.
- After enabling, **Status** shows Enabled, and the flavor becomes selectable in the matching tenant quota and in the instance creation page.

## Common questions

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| On save, "Below minimum value" or "Exceeds maximum value" | The limit falls outside what this resource model allows | Bring the limit into range as prompted, or pick a different resource model |
| Node Label reports an error | Only one of Key / Value was filled in | Fill both as a pair, or leave both empty |
| Very few resource types are available | That is what the cluster can actually do | This is normal; pick from what is shown |
| The tenant cannot see the flavor | The flavor is not enabled, or the tenant has no matching quota | Enable the flavor first, then check the quota |

## Related

- [Resource Pool](/boss/rune-admin/resource-pools)
- [Tenant Quotas](/boss/rune-admin/tenants)
- [Nodes & Accelerators](/boss/rune-admin/nodes-gpu)
