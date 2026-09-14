---
title: 'Resources & Quotas'
updated: '2026-09-14'
description: 'Understand how much resource and which configurations you can use: what templates, quota, flavors, and workspaces are and where to find them.'
tags:
  - rune
  - resources
---

# Resources & Quotas

This group of pages is not about how a single instance runs, but about the **shared configuration and resource boundaries you use before and after creating instances**:
which templates you can reuse, how much resource this tenant can use in total, which flavors you can pick, and which workspace an instance lives in.
After reading it you will be able to tell these four concepts apart and know where to look each one up.

:::tip The one-line difference
A template decides **how to deploy**, quota decides **how much you can deploy**, flavor decides **how good a machine you get**, and the workspace decides **where it is deployed**.
:::

![Tenant quota list: the cluster switchable in the page header, and each resource listed as quota type / model / resource pool / quota with used and total](/assets/screenshots/rune/quota-01.png)

Quotas are counted **per cluster**, hence the **Cluster** dropdown at the top; CPU reads as used / total. This table is the answer to "can I deploy one more?", and it is worth a look before creating anything.

## The four pages at a glance

| Page | What question it answers | Where to find it |
| --- | --- | --- |
| [Templates](/rune/resources/templates) | Is there a ready-made, tuned configuration I can use directly | **Workbench → Templates** in the left sidebar |
| [Quota](/rune/console/quota) | How much CPU, memory, accelerator, and storage this tenant can use at most | Click the avatar in the top-right to open the account panel, click **Tenant**, then choose the **Quota** tab at the top |
| [Flavor](/rune/console/flavor) | Which machine configurations are selectable when creating an instance | The same place, with the **Flavor** tab selected |
| [Workspace](/rune/console/workspace) | Which office the instance sits in and who can see it | The same place, with the **Workspace** tab selected |

:::info It is normal not to see the Quota / Flavor / Workspace tabs
These three tabs belong to tenant settings and are visible only to a tenant **Administrator** or **Developer**.
If only some tabs appear, that is a permission setting; contact your tenant administrator when necessary.
:::

## Recommended reading order

1. Read [Templates](/rune/resources/templates) first: understand how a configuration is saved and reused with one click next time.
2. Then read [Quota](/rune/console/quota): confirm this tenant's resource ceiling so you do not get stuck halfway through creating something.
3. Then read [Flavor](/rune/console/flavor): confirm which machine configurations are actually selectable in the current region.
4. Finally read [Workspace](/rune/console/workspace): understand how instances are isolated from one another.

## Related

- [Create Workloads](/rune/guide/workloads)
- [Rune Console](/rune/console)
- [Rune platform overview](/rune)
