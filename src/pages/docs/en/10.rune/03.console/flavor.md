---
title: 'Flavor'
updated: '2026-09-12'
description: 'What a flavor is, how it decides the size of machine you can request, and how to filter the list.'
tags:
  - rune
  - console
---

# Flavor

A flavor answers "**how big a machine can I request**". A flavor is a packaged set of resources — how many CPU cores, how much memory, whether there are accelerator cards and which model — and you simply pick one from a dropdown when creating an instance. The platform then allocates that combination to you.

Flavors are configured by platform administrators on the backend. On your side you **can view them but cannot create or modify them**.

:::tip Flavor vs. quota

- **Flavor**: how big a single machine can be, meaning which resource combinations you can pick.
- **Quota**: how much allowance you can spend over this period.

Only when both are satisfied can an instance be created.

:::

## Before you start
- Role: your tenant role must be **Administrator** or **Developer**.
- Region: select a **cluster** at the top of the page first. With no cluster selected, the Flavor page issues no query and shows no data.

## Where to find flavors
1. Click your avatar in the top-right corner.
2. In the menu, go to **Tenant** (your tenant name appears next to it).
3. On the tenant page, click the **Flavor** tab.

## Reading the flavor list
| Column | Description |
| --- | --- |
| Name | The flavor name; its description appears in smaller text below |
| Type | The resource category, for example CPU, GPU, VGPU |
| Model | The accelerator card model (including the vendor) |
| Flavor | The resource combination this flavor contains, for example how many CPU cores, how much memory, how many cards |

This page has no search. Use the filter bar to narrow the list.

## Filtering flavors
Above the list there is a filter bar that narrows results step by step through **Type → Vendor → Model**:

1. Click **Type** first (for example GPU); the Vendor and Model options below change accordingly.
2. Then click **Vendor**.
3. Finally click **Model**, and the list keeps only the matching flavors.

Click a condition that is already selected to clear it again.

## Where to see how much allowance is left
The Flavor page only tells you **what you can pick**; it does not show usage. To see how much is left, go to **Quota** in the same set of tenant tabs:

1. Avatar → **Tenant** → **Quota** tab.
2. In the **Quota** column you see "used / total" and a progress bar — that is the usage.

To see how much allowance a particular **workspace** received, open **Workspace** in the tenant tabs, open that workspace, and then click the **Quota** tab.

:::tip Why can't I select a certain flavor
Even if a flavor appears in the list, that does not guarantee it can be deployed. The current workspace must also have remaining quota on the matching resource. When creation fails, check your allowance on the Quota page instead of only checking whether the flavor exists.
:::

## Related
- [Quota](/rune/console/quota)
- [Create a workload](/rune/guide/workloads)
