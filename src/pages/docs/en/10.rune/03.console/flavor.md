---
title: 'Flavor'
updated: '2026-10-21'
description: 'Understand the flavor list: it decides how big a machine you can pick when creating an instance, and how to filter by type and resource.'
tags:
  - rune
  - console
---

# Flavor

A flavor answers "**how big a machine can I request**". One flavor is a packaged combination of resources — how many CPU cores, how much memory, whether there is an accelerator — and you simply pick one from a dropdown when creating an instance; the platform allocates that combination.

Flavors are configured per cluster by platform administrators; on your side they are **read-only**.

:::tip Flavor versus quota
- **Flavor**: how big a single machine can be, that is which resource combinations you can pick.
- **Quota**: how much you can use in total over a period.
Both must be satisfied before an instance can be created.
:::

## Before you start

- Role: your tenant role must be **Administrator** or **Developer**, otherwise the four cluster tabs are hidden.
- Context: enter a cluster through the path below; flavors are counted per cluster.

## Where to see flavors

1. Click the avatar in the top-right and click **Tenant <your tenant name>**.
2. Click **Tenant Clusters** on the left to open the cluster list.
3. Click the **cluster name** you want to inspect.
4. Click the **Flavor** tab at the top of the page.

![Cluster detail, Flavor tab: four tabs, type/resource/status filters, name/resource configuration/resource pool columns](/assets/screenshots/rune/flavor-01.png)

There is **no Create flavor button** on this page — flavors are not maintained on the tenant side. If a configuration is missing, ask the platform administrator.

## Reading the flavor list

| Column | Description |
| --- | --- |
| Name | The flavor name, followed by a type tag (CPU / GPU / shared GPU and so on) |
| Resource configuration | The resource combination in this flavor: CPU cores, memory, cards and so on |
| Resource pool | Which resource pool this flavor belongs to |

The filter bar has four controls: **Type**, **Resource**, **Status**, and a search box, which can be combined.

## Filter flavors

1. Pick a **Type** (for example GPU) and the list narrows immediately.
2. Pick a **Resource** to narrow it to one model.
3. Pick a **Status** if needed.
4. Click a selected condition again to clear it, or reset the filter bar.

## Where to see how much quota is left

The flavor page only tells you **what you can pick**; it shows no usage. To see what is left, open the **Quota** tab of the same cluster:

1. Follow the path above to the cluster detail and click the **Quota** tab.
2. In the **Quota** column you can see used amount, guaranteed quota and quota limit for each resource.

To see how much a **workspace** was given, open the **Workspace** tab, open a workspace, and click **Quota**.

:::tip Why a flavor cannot be selected
Even if a flavor appears in the list, that does not guarantee you can deploy it — the current workspace also needs quota left on the matching resource. When creation fails, confirm the quota first instead of only checking whether the flavor exists.
:::

## Related

- [Tenant Clusters](/rune/console/tenant-clusters)
- [Quota](/rune/console/quota)
- [Create Workloads](/rune/guide/workloads)
