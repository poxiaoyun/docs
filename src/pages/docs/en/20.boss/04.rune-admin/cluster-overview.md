---
title: Cluster Status
updated: '2026-09-14'
description: 'Judge whether one cluster is healthy overall — CPU, memory, nodes and core services — then drill down.'
tags:
- boss
- rune-admin
- cluster
---

# Cluster Status

Cluster Status is the main dashboard you get after stepping into a "data-centre building" (a cluster): CPU, memory, node counts and core services on one screen, so you can judge whether the cluster is healthy overall. To drill into a single machine or a single card, go on to **Node Status** and **Accelerator Status** in the left-hand menu.

## Before you start

- You need a **system administrator** account.
- Prerequisite: a cluster is already connected to the platform, see [Cluster](/boss/rune-admin/clusters).

## Open the cluster overview

1. Click **AI Platform** in the top navigation bar, then click **Cluster** under the **AI Platform** group in the left sidebar.
2. In the cluster list, click the name of the cluster you want to inspect.
3. In the left-hand sub-menu, click **Cluster Status**.

:::info This page is the baseline dashboard

The Cluster Status page renders only baseline monitoring dashboards and **does not include accelerator dashboards**. To see utilisation, VRAM and temperature per card, open the **Accelerator Status** sub-page.

:::

![Cluster information page: a cluster summary row (nodes, ready nodes, pods, CPU capacity) above hourly monitoring charts](/assets/screenshots/boss/cluster-overview-01.png)

This is the cluster health report: the four **Cluster summary** cards give the current snapshot, the trend charts below default to a one-hour window, and the top right lets you shorten the interval from `1 hour` or flip `refresh` from `off` to automatic.

## What is on the page

| Area | Content |
| --- | --- |
| Baseline monitoring charts | Cluster metrics such as CPU, memory, node count and core services |
| Variable filters | Drop-down filters at the top mean this monitoring template offers switchable views |
| Drill-down entries | The left-hand sub-menu leads on to nodes, accelerators, storage, logs and more |

## Confirming the result

- If the charts draw normally (rather than spinning forever), the cluster monitoring data is connected.
- If the charts stay blank for a long time, the cluster usually has no monitoring components installed yet — check **System Apps** to see whether the monitoring components are deployed.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The charts keep spinning or stay blank | The cluster has no monitoring collection component | Deploy the monitoring components from **System Apps** |
| Only baseline metrics are shown, no cards | Accelerator dashboards live on another sub-page | Click **Accelerator Status** in the left-hand menu |

## Related

- [Nodes & Accelerators](/boss/rune-admin/nodes-gpu)
- [Logs & Scheduler](/boss/rune-admin/observability)
- [Workloads](/boss/rune-admin/resources)
