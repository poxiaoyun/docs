---
title: Nodes & Accelerators
updated: '2026-09-14'
description: 'See the cluster from the machine side: node health on one page, and each card''s utilisation, VRAM and temperature on the other.'
tags:
- boss
- rune-admin
- node
- gpu
---

# Nodes & Accelerators

These two pages show the cluster from the **machine side**:

- **Node Status** shows the health and load of every machine (node).
- **Accelerator Status** shows the utilisation, VRAM and temperature of every accelerator card (GPU / NPU — the "engine" inside a server that does the AI maths).

They are the main entry points for working out "is a machine broken, or have we simply run out of cards?".

## Before you start

- You need a **system administrator** account.
- Prerequisite: the cluster is connected to the platform and the monitoring collection components are installed.

## How to open them

1. In the left-hand menu, click **AI Platform** → **Cluster**, then open the target cluster.
2. Under the **Cluster Status** group in the left-hand menu:
   - To look at machines, click **Node Status**.
   - To look at cards, click **Accelerator Status**.

:::info These two pages are dashboards, not machine inventories

Both are rendered by **grouping monitoring dashboards by name**. They have **no node table** of their own and do not show node roles, IPs, CPU or memory detail, labels or taints. For that kind of node object information, go to the **Node** tab of **Operations Management → Workloads**.

:::

## What Node Status shows

Node Status gathers the monitoring dashboards whose names contain `node`, and is the right place to watch:

- Whether nodes are online (Ready / NotReady).
- CPU and memory utilisation.
- Node pressure alerts (memory pressure, disk pressure and so on).
- Whether load is balanced across nodes.

## What Accelerator Status shows

Accelerator Status gathers the monitoring dashboards whose **name or title contains `gpu` or `npu`**, and is the right place to watch:

- Accelerator utilisation.
- VRAM occupancy.
- Whether load is balanced from card to card.
- Which devices of a given model are busy and which are idle.

:::info The order of accelerator dashboards

If a cluster has both NPU dashboards and NVIDIA GPU dashboards, **the NPU dashboards are placed before the NVIDIA GPU dashboards** (the platform moves a later NPU dashboard forward), so that domestic accelerator cards are shown first.

:::

## A recommended investigation order

1. Look at **Cluster Status** first to judge whether the problem is cluster-wide or local.
2. If you suspect a machine fault, open **Node Status** to identify which machines are involved.
3. If you suspect a shortage of compute or uneven card allocation, open **Accelerator Status** to look at the cards.
4. To pin it down to a specific object, cross-check in **Workloads** or **Log Management**.

## Confirming the result

- If the dashboards draw normally, node and accelerator monitoring data is being collected.
- If the dashboards stay blank, check in **System Apps** whether the node monitoring and accelerator monitoring components are deployed.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| No cards appear in Accelerator Status | The accelerator monitoring component is not installed | Deploy the matching component from **System Apps** |
| You want node IPs, roles and similar detail | These two pages do not provide it | Look in **Workloads → Node** instead |
| Only an aggregate capacity is shown for a model | That model does not report per-device metrics | This is expected; the aggregate capacity is still useful |

## Related

- [Cluster Status](/boss/rune-admin/cluster-overview)
- [Workloads](/boss/rune-admin/resources)
- [Resource Pools](/boss/rune-admin/resource-pools)
