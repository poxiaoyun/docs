---
title: 'Ecological documents'
updated: '2026-09-17'
author: Rune Docs Team
description: 'What to install for Ascend, DCU, NVIDIA, Alibaba Cloud PPU and open-source components, in what order, and how to confirm it works.'
tags:
  - ecosystem
  - overview
---

# Ecological documents

This chapter is for delivery engineers and operations engineers: you have one or more servers with accelerator cards
installed and need to bring them into the platform cluster. It tells you which components to install, in what order, and
how to confirm the result.

Regular users can skip it. If all you do is create inference services or run fine-tuning jobs in the console, seeing and
selecting a card is enough — how it got connected is not your problem.

There is one test, and it has three parts: **the card is physically in the machine → the host has the driver and runtime
installed → a cluster component has registered the card as a schedulable resource**. All three must line up before the
card appears in the console. Miss one and it will not.

Alibaba Cloud PPU is the exception: its middle layer belongs to the cloud provider. Details below.

## What each ecosystem needs

| Ecosystem | Hardware / components covered | What you install | Order |
| --- | --- | --- | --- |
| [Huawei (Ascend)](/ecosystem/huawei) | Ascend NPU on Atlas training/inference servers | Driver and firmware, container runtime, NPU Exporter, Ascend Device Plugin, NodeD (optionally the Ascend-customized Volcano) | Strictly left to right, see below |
| [Hygon (DCU)](/ecosystem/hygon) | Hygon DCU accelerator cards | Driver and runtime, DCU-Label-Node, DCU-Exporter, DCU-Device-Plugin | Strictly left to right |
| [NVIDIA (GPU)](/ecosystem/nvidia) | NVIDIA data-centre GPUs | Host driver, GPU Operator (container toolkit, device plugin, DCGM Exporter), Volcano (optionally vGPU splitting) | Driver → GPU Operator → Volcano |
| [Alibaba Cloud (PPU)](/ecosystem/aliyun) | Zhenwu PPU on Alibaba Cloud Lingjun nodes | Lingjun node pool, the ppu and rdma device plugins on the ACK side (driver and firmware are the cloud provider's job) | Node pool → device plugins → scheduling policies |
| [Open source communities](/ecosystem/open-source) | Kubernetes, containers, inference frameworks, observability, artifact security | Install as needed; most of it is already part of the cluster foundation | As needed |

The first three are installed on your own machines. The fourth connects a cloud node pool. The objects of work are
different enough that procedures do not carry over — do not assume one applies to the other.

## Scheduling stacks inside the platform

The platform bundles two complete hardware scheduling packages — **NVIDIA** (GPU Operator + Volcano + Volcano vGPU) and
**Ascend** (Ascend Device Plugin + NPU Exporter + Ascend-customized Volcano) — both installable in one step from
**Cluster Management → Operations → System Apps**.

There is no platform-side package for Hygon yet; install those components by hand following
[Hygon (DCU)](/ecosystem/hygon). The Alibaba Cloud PPU add-ons are installed from the Alibaba Cloud console rather than
System Apps, and the platform only handles resource recognition and scheduling.

One cluster keeps a single scheduling stack. Do not install both.

## Common installation order

Whatever the vendor, the landing order follows the same rule: **let the host see the card first, then let the cluster see
the card**.

1. **Driver and firmware**, on every machine that has a card. Afterwards the host can use the card, but the cluster still
   does not know about it.
2. **Container runtime extension**, also on every machine that has a card. This lets containers see the card too.
3. **Monitoring exporter**, cluster-wide. It exposes temperature, utilisation, memory, and other metrics for the platform
   to scrape.
4. **Device plugin**, cluster-wide. It registers the card as a schedulable Kubernetes resource; only now does the cluster
   actually see it.
5. **Scheduler and node status components**, cluster-wide and optional. Job queuing, fault rescheduling, and resumable
   training depend on them.

:::warning Do not reverse the order
The device plugin checks at startup whether the container runtime extension is installed and restarted. Install the runtime
first, the plugin second. Reverse it and the plugin usually needs a reinstall or restart before it can recognise the card.
:::

## Where to start

- Connecting an Ascend machine for the first time: start with [Huawei (Ascend)](/ecosystem/huawei) and follow the order inside.
- Connecting a Hygon machine for the first time: see [Hygon (DCU)](/ecosystem/hygon).
- Connecting an NVIDIA machine for the first time: see [NVIDIA (GPU)](/ecosystem/nvidia); the cluster-side components install in one step from the platform.
- Running PPU on Alibaba Cloud for the first time: see [Alibaba Cloud (PPU)](/ecosystem/aliyun), node pool first.
- Filling in one component or troubleshooting: jump straight to the page you need.

## Related

- [Huawei (Ascend)](/ecosystem/huawei)
- [Hygon (DCU)](/ecosystem/hygon)
- [NVIDIA (GPU)](/ecosystem/nvidia)
- [Alibaba Cloud (PPU)](/ecosystem/aliyun)
- [Open source communities](/ecosystem/open-source)
