---
title: 'Hygon (DCU)'
updated: '2026-09-12'
author: Rune Docs Team
description: 'Which components connect a Hygon DCU server to the platform, what order to install them in, and how to confirm each step worked.'
tags:
  - ecosystem
  - hygon
  - dcu
---

# Hygon (DCU)

This chapter covers how to connect a server with **Hygon DCU** cards to a platform cluster. It has two parts:
first install the **driver and runtime on every machine that has a card**, so the machine itself can use the card;
then install a **set of Kubernetes components in the cluster**, so the platform can schedule and monitor that card.
Do the steps below in order and the card becomes selectable on the platform pages.

:::tip Three things to remember

- **DCU** is the AI accelerator card made by Hygon. It does the same kind of job as a graphics card: speeding up model training and inference.
- The driver serves the **machine** — install it and the machine recognizes the card. The Kubernetes components serve the **cluster** — install them and the cluster recognizes the card.
- Only when both are in place is the card really connected to the platform.

:::

## What order to install in

Do not change the order: each step depends on the result of the previous one.

1. **Driver and runtime** — needed on every machine that has a card. When done, the host itself can use the card.
2. **DCU-Label-Node** — label the nodes so the cluster knows which card each machine has.
3. **DCU-Exporter** — report card temperature, power, and memory to the monitoring system. It can be installed before or after the next step.
4. **DCU-Device-Plugin** — register the card as a schedulable cluster resource. Only after this step does the cluster "see" the card.
5. **vDCU-Scheduler (only if needed)** — install only when a single card must be split dynamically among several tasks. It works together with the device plugin in dynamic segmentation mode.

## Pages in this chapter

| Page | Covers | What it solves |
| --- | --- | --- |
| [DCU driver installation](/ecosystem/hygon/driver-runtime) | Host driver and runtime | Make the machine recognize the card and confirm the driver is loaded with `lsmod` |
| [Kubernetes components](/ecosystem/hygon/k8s-components) | Cluster-side components at a glance | What each component does and in what order to install them |
| [Overview](/ecosystem/hygon/k8s-overview) | Component descriptions, image list, system requirements | Check hardware, software, and OS versions before you start |
| [DCU-Label-Node](/ecosystem/hygon/k8s-label-node) | Node labels | Tell the scheduler which card each machine has |
| [DCU-Exporter](/ecosystem/hygon/k8s-exporter) | Monitoring probe | Report the running state of the cards to the monitoring system |
| [DCU-Device-Plugin (standard mode)](/ecosystem/hygon/k8s-device-plugin-standard) | Device plugin | Register physical cards and pre-segmented vDCUs as schedulable resources |
| [DCU-Device-Plugin (MIG mode)](/ecosystem/hygon/k8s-device-plugin-mig) | Hardware-level segmentation | Use MIG to split one card into several isolated instances |
| [vDCU dynamic segmentation mode](/ecosystem/hygon/k8s-vdcu-dynamic-splitting) | Dynamic segmentation | Split a card on demand at submit time and reclaim it automatically |
| [FAQ](/ecosystem/hygon/k8s-faq) | Troubleshooting | When it does not work after installation, look up the symptom, cause, and command |

## Key terms

These words appear throughout the chapter. Learn them once here:

| Term | Plain explanation |
| --- | --- |
| DCU | The Hygon AI accelerator card — the "graphics card" inside the machine, used to speed up training and inference |
| Segmentation (virtualization) | Splitting one card into several shares so multiple tasks can use it at the same time instead of each owning the whole card |
| vDCU | One of those shares — a "virtual card" with its own compute and memory quota |
| MIG | A hardware-level way of splitting that gives stronger isolation between the resulting instances |
| Device plugin | The component that lets Kubernetes "see" and allocate accelerator cards |
| Exporter | A probe that periodically reports card temperature, power, and memory to the monitoring system |
| Label node | Putting labels on a node to tell the scheduler which card that machine has |

## Related

- [Ecosystem docs home](/ecosystem)
- [Huawei (Ascend)](/ecosystem/huawei)
- [DCU driver installation](/ecosystem/hygon/driver-runtime)
