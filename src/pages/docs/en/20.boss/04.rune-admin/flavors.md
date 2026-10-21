---
title: Flavor
updated: '2026-10-21'
description: Define "how many cores / how much memory / how many cards" plans, and decide whether they are globally available or need per-tenant authorisation.
tags:
  - boss
  - rune-admin
---

# Flavor

A flavor is a "plan table" that states in one line how much compute a bundle contains: for example "2 CPU cores + 4Gi memory" or "8 CPU cores + 32Gi memory + 1 GPU". Administrators define these plans at cluster level, and users pick from them when creating an instance.

After this page you will be able to read the four key pieces of information in the flavor list, create a flavor, enable or disable it, and decide whether it is globally available or needs tenant authorisation.

:::tip Two terms compared

- **Flavor** ≈ a plan table stating "how many cores / how much memory / how many cards".
- **Quota** ≈ the total a tenant may use; not the same thing as a plan, see [Tenant Resources](/boss/rune-admin/tenants).

:::

## Before you start

- You need a **system administrator** account. This is the administrator view, where you can create, edit, enable, disable and delete; the tenant side can only view and pick authorised flavors.
- Prerequisite: the cluster is connected to the platform. If you want a flavor to land only on some machines, create the [Resource Pool](/boss/rune-admin/resource-pools) first.

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar, and open the target cluster.
2. Under the **Resource Management** group in the left-hand menu, click **Flavor**.

## Reading the flavor list

| Column | Meaning |
| --- | --- |
| Name | Flavor name (followed by a resource type tag) with the description in small text below |
| Resource configuration | Tags for the resource items in this flavor, for example CPU, memory, number of cards |
| Resource pool | The bound pool shown as "name (ID)"; shows `-` when unbound |
| Availability | Two labels: **Enabled / Disabled**, and **Globally available / Requires tenant authorisation** |

The top bar is a single filter strip, not several groups of buttons:

| Filter | Meaning |
| --- | --- |
| Type | Resource type, for example CPU, GPU, shared GPU |
| Vendor | For example NVIDIA, Ascend, AMD, Intel |
| Model | For example RTX 3080, A100 |
| Status | Enabled / Disabled |
| Search | Search by flavor name |

Filters stack, so "GPU + NVIDIA + A100" narrows down to that family of flavors.

![Flavor list: name (with type tag), resource configuration, resource pool and availability, with the type / vendor / model / status filter strip above](/assets/screenshots/boss/cluster-flavors-01.png)

## Create a flavor

1. Click **Create flavor** at the top right of the list.
2. The **Resource configuration** card has a name preview at the top that is generated from the configuration and pool; you can still edit it manually at the end.
3. Click **Add resource** to add at least one resource item:

   | Field | Meaning | How to fill it |
   | --- | --- | --- |
   | Category | Resource category such as CPU / memory / GPU | Pick from the drop-down |
   | Resource | The specific resource | Pick after choosing a category |
   | Model | Card or device model | Optional; leaving it empty means "all models" |
   | Limit | The maximum this flavor grants, **required** | For example `2` for CPU, `4Gi` for memory, `1` for cards |
   | Node label | Restricts the flavor to machines carrying a label | Only on accelerator items; key and value must be filled together |

4. Choose a **resource pool** (optional): once set, the flavor only lands on machines in that pool.
5. Decide **Globally available** under **Usage scope**:

   | Switch | Effect |
   | --- | --- |
   | On | Every tenant can pick this flavor with **no separate authorisation** |
   | Off | Only authorised tenants can pick it (requires tenant authorisation) |

6. Fill in a **description** (optional) and click **OK** to save.

:::info Globally available only matters when the flavor is enabled
"Globally available" only has meaning while the flavor is **enabled**: a disabled flavor will not appear in the selectable list even if it is marked globally available.
:::

:::info Selectable resource types come from the cluster
Resource types and models come from what the current cluster reports, so different clusters may show different types.
:::

## Edit a flavor

1. Click the edit entry on a row.
2. The name is regenerated from the resource configuration and pool but can still be edited; what you can change is the resource configuration, pool, usage scope and description.
3. Click **OK** to save.

## Enable / disable a flavor

| Action | Effect |
| --- | --- |
| Enable | Enters the selectable range; usable globally or by authorised tenants |
| Disable | Hidden from the selectable list; **instances already running on this flavor are unaffected** |

Both actions show a confirmation dialog, for example "Disable this flavor?".

## How flavors reach tenants

The flavor page does not pick tenants directly. The rules are:

1. The flavor must be **enabled** before it enters the selectable range.
2. With **Globally available** on, every tenant can pick it; with it off, you must enable it for specific tenants under [Tenant Resources → Flavor authorisation](/boss/rune-admin/tenants).
3. The tenant also needs a matching **quota** before it can actually create an instance.

In other words: **flavor enabled + either globally available or tenant-authorised + a quota** — all three are needed before it can be selected.

## Delete a flavor

A confirmation dialog appears first. After deletion, historical instances created with this flavor keep running, but **no new instance can be based on it**.

:::warning Check for references before deleting
Confirm no tenant quota or workspace quota still references this flavor, otherwise later allocation may be affected.
:::

## Confirming the result

- The new flavor appears in the list with the expected name.
- The **availability** column shows **Enabled**, plus **Globally available** or **Requires tenant authorisation** as appropriate.
- The tenant side can see this flavor when creating an instance (provided a quota exists and authorisation is in place).

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| Saving fails with "below the minimum limit" or "above the maximum limit" | The limit is outside the range this resource model allows | Bring the limit into range as prompted, or switch model |
| The node label reports an error | Only the key or only the value was filled in | Fill both together, or leave both empty |
| A tenant cannot see the flavor | Not enabled, not globally available and not authorised, or no quota | Check those three in order |
| "Globally available" is on but nobody can pick it | The flavor itself is not enabled | Enable the flavor first |
| Very few resource types are selectable | That is what the cluster actually provides | This is expected |

## Related

- [Resource Pool](/boss/rune-admin/resource-pools)
- [Tenant Resources](/boss/rune-admin/tenants)
- [Accelerator Status](/boss/rune-admin/accelerator-status)
