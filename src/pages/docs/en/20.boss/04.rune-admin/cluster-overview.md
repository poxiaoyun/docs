---
title: Cluster Status
updated: '2026-10-21'
author: Rune Docs Team
description: Check whether one cluster's CPU, memory, nodes and services are healthy, and learn how the three dashboards divide the work and where the dynamic dashboard lives.
tags:
  - boss
  - rune-admin
  - cluster
---

# Cluster Status

Cluster Status is the main dashboard you get after stepping into a "data-centre building" (a cluster): CPU, memory, node counts and core services on one screen, so you can judge whether the cluster is healthy overall. To drill into a single machine or a single card, go on to **Node Status** and **Accelerator Status** in the left-hand menu.

## Before you start

- You need a **system administrator** account.
- Prerequisite: a cluster is already connected to the platform, see [Cluster Management](/boss/rune-admin/clusters).

## Open the cluster overview

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. In the cluster list, click the name of the cluster you want to inspect.
3. In the left-hand sub-menu, click **Cluster Status**.

:::info All three dashboards share one renderer
**Cluster Status**, **Node Status** and **Accelerator Status** are the same dashboard page. Only the last segment of the address decides which set of monitoring charts is loaded: `basic` loads the baseline dashboard, `nodes` loads the node dashboard, `accelerator` loads the accelerator dashboard. So the three pages work exactly the same way — only the content differs.
:::

![Cluster information page: a cluster summary row (nodes, ready nodes, pods, CPU capacity) above hourly monitoring charts](/assets/screenshots/boss/cluster-overview-01.png)

This is the cluster health report: the **Cluster summary** cards give the current snapshot, the trend charts below default to a one-hour window, and the top right lets you shorten the interval or turn on automatic refresh.

## What is on the page

| Area | Content |
| --- | --- |
| Baseline monitoring charts | Cluster metrics such as CPU, memory, node count and core services |
| Variable filters | Drop-down filters at the top mean this monitoring template offers switchable views |
| Time window and refresh | Top right: switch the time range and the automatic refresh interval |
| Drill-down entries | The left-hand sub-menu leads on to nodes, accelerators, resources and operations pages |

## Dynamic dashboard

Besides the three fixed dashboards, a cluster also has a **Dynamic Dashboard** page: edit the dashboard definition in YAML on the left, preview it live on the right, and click reset to restore it. It is **not in the left-hand menu**, must be opened by address directly, and has no save button — an advanced page for assembling dashboards ad hoc. See [Dynamic Dashboard](/boss/rune-admin/dynamic-dashboard).

## Confirming the result

- If the charts draw normally (rather than spinning forever), the cluster monitoring data is connected.
- If the charts stay blank for a long time, the cluster usually has no monitoring components installed yet — check **System Apps** to see whether the monitoring components are deployed.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The charts keep spinning or stay blank | The cluster has no monitoring collection component | Deploy the monitoring components from **System Apps** |
| Only baseline metrics are shown, no cards | Accelerator dashboards live on another sub-page | Click **Accelerator Status** in the left-hand menu |
| No "Dynamic Dashboard" in the left sidebar | It is not in the menu | Open it by address directly, or follow the link on this page |

## Related

- [Node Status](/boss/rune-admin/node-status)
- [Accelerator Status](/boss/rune-admin/accelerator-status)
- [Dynamic Dashboard](/boss/rune-admin/dynamic-dashboard)
- [Workloads](/boss/rune-admin/resources)
