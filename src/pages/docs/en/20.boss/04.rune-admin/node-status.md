---
title: Node Status
updated: '2026-10-21'
author: Rune Docs Team
description: Look at the cluster from the machine's point of view — which nodes are online, CPU and memory usage, node pressure and whether load is balanced.
tags:
  - boss
  - rune-admin
  - node
---

# Node Status

Node Status is the dashboard that looks at the cluster **machine by machine**: whether each server in the cluster is online, how much CPU and memory is used, whether any node is under pressure, and whether load is balanced across machines. When you suspect "one particular machine has a problem", start here.

After this page you will know where the **Node Status** entry is, what each block of charts on the page answers, and how it differs from **Workloads → Nodes**.

:::tip Three terms compared

- **Cluster** ≈ a building full of servers.
- **Node** ≈ one server in that building.
- **Accelerator (GPU / NPU)** ≈ the "engine" inside a server that does AI maths; look at those on **Accelerator Status**.

:::

## Before you start

- You need a **system administrator** account.
- Prerequisite: the cluster is connected to the platform and the node monitoring collector is installed (you can deploy it from **System Apps**).

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Cluster Status** group in the left-hand menu, click **Node Status**.

## What this page shows

Node Status gathers the monitoring dashboards whose name contains `node`, to answer:

| Question | Where to look |
| --- | --- |
| Are the machines online | Whether nodes are Ready / NotReady |
| How busy are the machines | CPU and memory usage |
| Any hidden trouble | Node pressure (memory pressure, disk pressure and so on) |
| Is load balanced | Usage comparison across nodes |

At the top of the page you can switch host and set the time window and automatic refresh; below are a resource overview table and trend charts.

![Node status page: a server resource overview table above seven-day P99 usage and overall load trend charts](/assets/screenshots/boss/cluster-nodes-01.png)

Node Status is the physical-machine health check: the resource overview table lists one row per host and the charts below show trends. The scrape address in the small text at the top (for example `192.168.0.107:9100`) is the node-exporter address — useful for tracing the monitoring source when investigating one machine.

:::info This is a dashboard, not a node inventory
This page has **no** node table. It does not show node roles, IPs, labels or taints. For those, go to **Operations Management → Workloads** and switch to the **Nodes** tab.
:::

## A sensible troubleshooting order

1. Start with **Cluster Status** to judge whether the problem is cluster-wide or local.
2. If you suspect a faulty machine, open **Node Status** to see which machines are involved.
3. If you suspect insufficient compute or uneven card allocation, open **Accelerator Status**.
4. To pin it down to a concrete object, cross-check in **Workloads** or **Log Management**.

## Confirming the result

- If the dashboards draw, node monitoring data is being collected.
- If the charts stay blank, check **System Apps** to see whether the node monitoring component is deployed.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The charts stay blank | The cluster has no node monitoring collector | Deploy the monitoring components from **System Apps** |
| You want a node's IP, role and other details | This page does not provide them | Go to **Workloads → Nodes** |
| One machine has no data | That machine's collector is broken or isolated | Check the collector and network on that node |

## Related

- [Cluster Status](/boss/rune-admin/cluster-overview)
- [Accelerator Status](/boss/rune-admin/accelerator-status)
- [Workloads](/boss/rune-admin/resources)
- [Resource Pool](/boss/rune-admin/resource-pools)
