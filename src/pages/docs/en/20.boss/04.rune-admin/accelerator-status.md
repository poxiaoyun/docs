---
title: Accelerator Status
updated: '2026-10-21'
author: Rune Docs Team
description: Look at the cluster from the accelerator's point of view — utilisation, memory use, power and temperature per GPU / NPU, and whether load is balanced between cards.
tags:
  - boss
  - rune-admin
  - gpu
---

# Accelerator Status

Accelerator Status is the dashboard that looks at the cluster **card by card**: GPU and NPU utilisation, memory, power draw, temperature, and whether the load is balanced across cards. Look here when you suspect "there is not enough compute" or "the cards are unevenly allocated".

After this page you will know where the entry is, what the summary cards and trend charts mean, and how to troubleshoot a page that is empty.

:::tip Two terms compared

- **Accelerator** ≈ the engine inside a server that does AI maths; covers both GPUs and NPUs.
- **Device memory (HBM / VRAM)** ≈ the memory built into the card; larger models take more of it.

:::

## Before you start

- You need a **system administrator** account.
- Prerequisite: the cluster is connected to the platform and the accelerator monitoring component is installed (you can deploy it from **System Apps**).

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Cluster Status** group in the left-hand menu, click **Accelerator Status**.

## What this page shows

Accelerator Status gathers the monitoring dashboards whose **name or title contains `gpu` or `npu`**:

| What to watch | Meaning |
| --- | --- |
| Card utilisation | How many cards are computing and the average utilisation |
| Device memory use | Whether memory is nearly full and whether another model still fits |
| Load balance | Whether some cards are busy while others idle |
| Model distribution | How busy or idle devices of a given model are |
| Power and temperature | Whether values are near the limit or at thermal risk |

![Accelerator status page: five summary cards above utilisation, memory and power trend charts](/assets/screenshots/boss/cluster-gpu-01.png)

The top of the page holds summary cards (for example total NPUs, node count, average utilisation, average memory usage, total cluster power), with trend charts below. If the page is all zeros or shows no cards, that usually means **this cluster simply has no such cards** — the page is not broken.

:::info NPU dashboards come first
If a cluster has both NPU and NVIDIA GPU dashboards, **the NPU dashboard is listed first** so domestic accelerators are shown up front.
:::

## Confirming the result

- If the dashboards draw, accelerator monitoring data is being collected.
- If the charts stay blank, check **System Apps** to see whether the accelerator monitoring component is deployed.

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| No cards at all | The cluster has no accelerators, or the accelerator monitoring component is missing | First confirm the cluster really has cards, then deploy the component from **System Apps** |
| A model shows only aggregate capacity | That model does not report per-device metrics | Normal; the aggregate capacity is still usable |
| Utilisation stays 0 while jobs are running | Monitoring lag, or the collector is broken | Try a longer time window; if it is still 0, check the component in **System Apps** |
| You want to know which workload holds a card | This page only looks at cards | Cross-check in **Workloads** or **Scheduling** |

## Related

- [Cluster Status](/boss/rune-admin/cluster-overview)
- [Node Status](/boss/rune-admin/node-status)
- [Workloads](/boss/rune-admin/resources)
- [Flavor](/boss/rune-admin/flavors)
