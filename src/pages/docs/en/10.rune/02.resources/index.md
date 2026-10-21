---
title: 'Resources & Quotas'
updated: '2026-10-21'
description: 'Understand how much resource and which configurations you can use: what presets, quota, flavors, and workspaces are and where to find them.'
tags:
  - rune
  - resources
---

# Resources & Quotas

This group of pages is not about how a single instance runs, but about the **shared configuration and resource boundaries you use before and after creating instances**:
which configurations you can reuse, how much resource this tenant can use in total, which flavors you can pick, and which workspace an instance lives in.
After reading it you will be able to tell these four concepts apart and know where to look each one up.

:::tip The one-line difference
A preset decides **how to deploy**, quota decides **how much you can deploy**, flavor decides **how good a machine you get**, and the workspace decides **where it is deployed**.
:::

## The four pages at a glance

| Page | What question it answers | Where to find it |
| --- | --- | --- |
| [Presets](/rune/resources/presets) | Is there a ready-made, tuned configuration I can use directly | **Workbench → Presets** in the left sidebar |
| [Quota](/rune/console/quota) | How much CPU, memory, accelerator, and storage this tenant can use at most | Avatar → **Tenant <your tenant>** → **Tenant Clusters** → cluster name → **Quota** tab |
| [Flavor](/rune/console/flavor) | Which machine configurations are selectable when creating an instance | Same as above, with the **Flavor** tab |
| [Workspace](/rune/console/workspace) | Which office the instance sits in and who can see it | Same as above, with the **Workspace** tab |

The four steps in the "Where to find it" column are worth memorising, because many people look for these entries in the console sidebar and never find them:

1. Click the avatar in the top-right to open the account drawer.
2. Click **Tenant <your tenant name>** in the menu.
3. Click **Tenant Clusters** in the left navigation to open the cluster list.
4. Click the **cluster name**; only then do the **Overview / Quota / Flavor / Workspace** tabs appear.

:::info Not seeing the Quota / Flavor / Workspace tabs is normal
The four cluster tabs are visible only to a tenant **Administrator** or **Developer**.
The tenant overview and members pages are a different screen that belongs to account management; see [Tenant Management](/account/iam/tenant).
:::

:::info Do not confuse this with the console
Quota, flavor, and workspace are **not** in the console's three sidebar groups (Home / Workbench / Observability).
The console sidebar holds instances and storage; these three are tenant-level settings.
:::

## Recommended reading order

1. Read [Presets](/rune/resources/presets) first: understand how a configuration is saved and reused with one click next time.
2. Then read [Quota](/rune/console/quota): confirm this tenant's resource ceiling so you do not get stuck halfway through creating something.
3. Then read [Flavor](/rune/console/flavor): confirm which machine configurations are actually selectable in the current cluster.
4. Finally read [Workspace](/rune/console/workspace): understand how instances are isolated from one another.

## Related

- [Tenant Clusters](/rune/console/tenant-clusters)
- [Create Workloads](/rune/guide/workloads)
- [Rune Console](/rune/console)
- [Rune platform overview](/rune)
