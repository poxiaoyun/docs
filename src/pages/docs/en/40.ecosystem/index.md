---
title: 'Ecological documents'
updated: '2026-09-12'
author: Rune Docs Team
description: 'What to install for Ascend, DCU, and open-source components, in what order, and how to confirm it works.'
tags:
  - ecosystem
  - overview
---

# Ecological documents

This chapter is for **delivery engineers and operations engineers**: you have one or more servers with accelerator cards
installed, and you need to bring them into the platform cluster. It tells you which components to install, in what order,
and how to confirm the result. **Regular users do not need this chapter** — if you only create inference services or run
fine-tuning jobs in the console, you just need to see and select a card; you do not need to know how it was connected.

:::info The one-sentence test

An accelerator card is actually usable on the platform only when all three layers line up:
**the card is physically in the machine → the host has the driver and runtime installed → a cluster component has registered the card as a schedulable resource**.

If any layer is missing, the card will not appear in the console.

:::

## What each ecosystem needs

| Ecosystem | Hardware / components covered | What you install | Order |
| --- | --- | --- | --- |
| [Huawei (Ascend)](/ecosystem/huawei) | Ascend NPU on Atlas training/inference servers | Driver and firmware, container runtime, NPU Exporter, Ascend Device Plugin, NodeD (optionally the Ascend-customized Volcano) | Strictly left to right, see below |
| [Hygon (DCU)](/ecosystem/hygon) | Hygon DCU accelerator cards | Driver and runtime, DCU-Label-Node, DCU-Exporter, DCU-Device-Plugin | Strictly left to right |
| [Open source communities](/ecosystem/open-source) | Kubernetes, containers, inference frameworks, observability, artifact security | Install as needed; most of it is already part of the cluster foundation | As needed |

## Common installation order

Whatever the vendor, the landing order follows the same rule: **let the host see the card first, then let the cluster see the card**.

1. **Install the driver and firmware** (on every machine that has a card). After this the host can use the card, but the cluster still does not know about it.
2. **Install the container runtime extension** (on every machine that has a card). This lets containers see the card too.
3. **Install the monitoring exporter** (cluster-wide). It exposes card temperature, utilization, HBM and other metrics for the platform monitoring to scrape.
4. **Install the device plugin** (cluster-wide). It registers the card as a schedulable Kubernetes resource; only after this step does the cluster actually "see" the card.
5. **Install the scheduler and node status components** (cluster-wide, optional). Multi-card job queuing, fault rescheduling, and resumable training need them.

:::warning The order cannot be reversed

The device plugin checks at startup whether the container runtime extension is installed and restarted.
**Install the runtime first, then the device plugin.** If you reverse the order, the plugin usually has to be reinstalled or restarted before it can recognize the card.

:::

## Where to start

- Connecting an Ascend machine for the first time: start with [Huawei (Ascend)](/ecosystem/huawei) and follow the order inside.
- Connecting a Hygon machine for the first time: see [Hygon (DCU)](/ecosystem/hygon).
- Only filling in one component or troubleshooting: jump straight to the component page you need.

## Related

- [Huawei (Ascend)](/ecosystem/huawei)
- [Hygon (DCU)](/ecosystem/hygon)
- [Open source communities](/ecosystem/open-source)
