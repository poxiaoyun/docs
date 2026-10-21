---
title: 'AI Platform Administration'
updated: '2026-10-21'
description: 'Connect clusters, enable tenants, divide resource pools, define flavors and hand out quotas — the admin home for the compute base.'
tags:
  - boss
  - rune-admin
---

# AI Platform Administration

This is where a platform administrator maintains the **compute base**. Every node, accelerator and flavor that users can pick inside the AI Platform is connected and allocated here first.

After reading this page you know what each page in this group does, the order to do things in, and why some menus only appear after you open a cluster.

:::tip Key terms

- **Cluster** — a data centre building full of machines.
- **Node** — one server inside that building.
- **Accelerator (GPU / NPU)** — the engine inside a server that does the AI maths.
- **Resource pool** — a way to split the nodes into functional zones for different teams.
- **Flavor** — a specification sheet: so many CPU cores, so much memory, so many cards.
- **Quota** — the maximum a tenant may use in one cluster.
- **Application** — a pre-built deployment recipe that users or the platform can install in one click.

:::

## Before you start

- You need a **system administrator** account. Ordinary members cannot see the **AI Platform** group.
- Run through the whole flow on a test cluster before touching production.

## Recommended order

1. **Connect clusters**: bring a data centre into the platform, test the connection, then publish it.
2. **Enable tenants**: enable a tenant on a cluster before it can use anything there.
3. **Divide resource pools**: group the nodes by purpose.
4. **Define flavors**: describe the packages and decide which ones need per-tenant authorization.
5. **Hand out quotas**: grant capacity per resource pool and resource item, then subdivide it into workspaces.
6. **Deploy shared components**: add monitoring, logging and storage through System Apps and Storage Cluster.
7. **Set up operations**: alert rules, scheduling policy, log queries.

## What each page solves

| Page | What it solves |
| --- | --- |
| [Cluster Management](/boss/rune-admin/clusters) | Bring a new data centre in and publish it to tenants |
| [Tenant Clusters](/boss/rune-admin/tenant-clusters) | See which clusters a tenant is enabled on, and enable more |
| [Application](/boss/rune-admin/applications) | Maintain the deployable recipes and their versions |
| [Cluster Status](/boss/rune-admin/cluster-overview) | Check CPU, memory and node health for one cluster |
| [Node Status](/boss/rune-admin/node-status) | Per-machine load and pressure |
| [Accelerator Status](/boss/rune-admin/accelerator-status) | Per-card utilization, memory and temperature |
| [Dynamic Dashboard](/boss/rune-admin/dynamic-dashboard) | Build an ad-hoc dashboard in YAML (not in the menu) |
| [Resource Pool](/boss/rune-admin/resource-pools) | Split nodes into functional zones |
| [Flavor](/boss/rune-admin/flavors) | Define packages and their availability |
| [Tenant Resources](/boss/rune-admin/tenants) | Review enablement requests, grant quotas, flavors and workspaces |
| [Workloads](/boss/rune-admin/resources) | Browse the objects running in the cluster |
| [Storage Cluster](/boss/rune-admin/storage-cluster) | Deploy and manage storage components |
| [System Apps](/boss/rune-admin/systems) | Deploy and manage monitoring, logging and gateway components |
| [Scheduling](/boss/rune-admin/scheduling) | See queue capacity and where workloads are stuck |
| [Scheduler Management](/boss/rune-admin/schedulers) | Change the scheduling flow and plugins |
| [Log Management](/boss/rune-admin/logs) | Query and tail cluster logs |
| [Alerts](/boss/rune-admin/alerts) | Configure alert rules and review alert history |

## Confirm you are in the right place

- After clicking **AI Platform** in the top bar, the sidebar shows the **AI Platform** group with **Cluster Management**, **Tenant Clusters** and **Application**.
- Opening a cluster from **Cluster Management** replaces the sidebar with **Cluster Status / Resource Management / Operations Management** — these three groups only exist inside a cluster.
- **Dynamic Dashboard** is in no menu at all and can only be opened by URL.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The sidebar only shows Cluster Management | The top bar is on another area | Click **AI Platform** in the top bar |
| Cannot find "Tenant Resources" | It only exists inside a cluster | Open a cluster, then look under **Resource Management** |
| Cannot find "Alert channels" | It is a platform-level top-bar entry | Click **Alert channels** in the top bar |
| Cannot find "Dynamic Dashboard" | It has no menu entry | Open it by URL, or follow the link from [Cluster Status](/boss/rune-admin/cluster-overview) |

## Related

- [Cluster Management](/boss/rune-admin/clusters)
- [Tenant Clusters](/boss/rune-admin/tenant-clusters)
- [Tenant Resources](/boss/rune-admin/tenants)
- [Platform Settings](/boss/settings/platform)
