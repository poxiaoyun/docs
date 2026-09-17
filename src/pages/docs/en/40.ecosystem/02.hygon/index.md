---
title: 'Hygon (DCU)'
updated: '2026-09-17'
author: Rune Docs Team
description: 'Which components connect a Hygon DCU server to the platform, what order to install them in, how to confirm each step worked, and where the software stack layers above the driver fit.'
tags:
  - ecosystem
  - hygon
  - dcu
---

# Hygon (DCU)

Connecting a server with Hygon DCU cards to a platform cluster has two parts: install the driver and runtime on every
machine that has a card, so the machine itself can use it; then install a set of Kubernetes components in the cluster,
so the platform can schedule and monitor that card. Do the steps below in order and the card becomes selectable on the
platform pages.

## Key terms

| Term | Plain explanation |
| --- | --- |
| DCU | The Hygon AI accelerator card (Deep Computing Unit). It uses many compute units to do matrix math at once, aimed at AI training and inference. |
| Driver | The layer that lets the OS recognise and drive the DCU; installed on the host. |
| DTK | Hygon's heterogeneous computing platform (DCU Toolkit), ROCm-compatible; frameworks depend on it. |
| Segmentation (virtualization) | Splitting one card into several shares so multiple tasks can use it at the same time instead of each owning the whole card. |
| vDCU | One of those shares, a "virtual card" with its own compute and memory quota. |
| MIG | A hardware-level way of splitting that gives stronger isolation between the resulting instances. |
| Device plugin | The component that lets Kubernetes see and allocate accelerator cards. |
| Exporter | A probe that periodically reports card temperature, power, and memory to the monitoring system. |
| Label node | Putting labels on a node to tell the scheduler which card that machine has. |

The driver serves the machine: install it and the machine recognises the card. The Kubernetes components serve the
cluster: install them and the cluster recognises the card. Both are needed before the card is really connected.

## What order to install in

Do not change the order. Each step depends on the result of the previous one.

1. **Driver and runtime**: needed on every machine that has a card. When done, the host itself can use the card.
2. **DCU-Label-Node**: label the nodes so the cluster knows which card each machine has.
3. **DCU-Exporter**: report card temperature, power, and memory to the monitoring system. It can be installed before or after the next step.
4. **DCU-Device-Plugin**: register the card as a schedulable cluster resource. Only after this step does the cluster see the card.
5. **vDCU-Scheduler (only if needed)**: install only when a single card must be split dynamically among several tasks. It works together with the device plugin in dynamic segmentation mode.

## How it is installed on the platform

The platform ships **no one-click application for the Hygon cluster components**. You deploy the YAML in this
chapter by hand. This is where Hygon differs from the other vendors: **NVIDIA, Ascend and Alibaba Cloud PPU each
have a documented platform path** — NVIDIA and Ascend install in one step from Cluster Management → Operations →
System Apps, and the PPU add-ons install from the Alibaba Cloud console — while Hygon currently has to be done manually.

So the Hygon rollout is: get the host driver right first, then deploy the four cluster components in the order
given here. Their images come from the Hygon registry (`image.sourcefind.cn:5000/...`); confirm the cluster can pull
from it before you deploy.

:::info One cluster, one set of scheduling components
Do not install the Hygon scheduling components (DCU-Device-Plugin and friends) on the same nodes as NVIDIA's
GPU Operator or Ascend's Ascend Device Plugin. A given set of nodes serves one vendor.
:::

## Three software layers above the driver

The Hygon software stack has three layers with confusingly similar names. Connecting a card to the platform only needs
the driver step; DTK and everything above it belongs to the workload environment, installed in workload images or dev
environments rather than on the host at card-attach time:

| Layer | Full name | What it does | Needed for platform integration |
| --- | --- | --- | --- |
| Driver | Accelerator driver (`rock-*.run`) | Lets the OS recognize and drive the DCU | **Yes**, on every machine that has a card |
| DTK | Heterogeneous computing platform (DCU Toolkit) | ROCm-compatible; provides the compiler, math libraries, and runtime that frameworks depend on | No — lives in the workload environment |
| DAS | AI foundation software system | Operators and framework components (PyTorch / vLLM and friends), tightly bound to the DTK version | No — use the official images |
| DAP | AI application platform | Higher-level capabilities such as knowledge bases and agent orchestration | No |

:::warning Framework component versions must match DTK
The PyTorch / vLLM component wheels you use must match the installed DTK version exactly, otherwise you get the classic
"`hy-smi` sees the card, but any framework run fails" symptom. Never fill in a version from memory; use the combinations
published with the official images and component repository. For the driver and DTK mapping see
[DCU driver installation](/ecosystem/hygon/driver-runtime).
:::

## Which page to read

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

## Related

- [Ecosystem docs home](/ecosystem)
- [Huawei (Ascend)](/ecosystem/huawei)
- [NVIDIA (GPU)](/ecosystem/nvidia)
- [Alibaba Cloud (PPU)](/ecosystem/aliyun)
- [DCU driver installation](/ecosystem/hygon/driver-runtime)
