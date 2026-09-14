---
title: 'Huawei (Ascend)'
updated: '2026-09-14'
author: Rune Docs Team
description: 'The order for connecting an Ascend NPU server to the platform: driver and runtime first, MindCluster components after.'
tags:
  - ecosystem
  - huawei
  - ascend
---

# Huawei (Ascend)

This chapter covers how to connect a server with Ascend NPUs to the platform cluster. It has two parts:
**the first part installs the driver and runtime on the host**, so the machine itself can use the cards;
**the second part installs MindCluster components in the cluster**, so Kubernetes can schedule those cards.

## Two words to tell apart first

| Term | Plain explanation |
| --- | --- |
| NPU | Neural Processing Unit: an accelerator card designed for the tensor math inside large models. It and a general-purpose GPU both do parallel computing; the difference is focus — an NPU does matrix multiplication very efficiently but is good at little else. Think of it as a calculator built specifically for matrices. |
| CANN | Ascend's heterogeneous computing software stack (Compute Architecture for Neural Networks): it exposes interfaces upward to frameworks such as PyTorch and drives the NPU downward. It is the equivalent of a graphics card's driver plus runtime layer, so install it only after the driver is verified. |

:::info Decide three things before you start

**Hardware model**, **driver/runtime version**, and **framework version**. These three must match as a set, and every later
troubleshooting or compatibility decision depends on them. Do not guess a version from memory — always use the combination
shipped with the release package and the official installation guide.

:::

## What order to install in

1. **Driver and firmware** — install on every machine that has cards. When done, the host can recognize the NPUs.
2. **CANN and other runtime packages** — install after the driver is verified; service images and frameworks depend on them.
3. **MindCluster cluster scheduling components** — install in the cluster, in the order "packages → container runtime → monitoring exporter → device plugin → node status component".

## Pages in this chapter

| Page | What it solves |
| --- | --- |
| [Drivers and Runtime](/ecosystem/huawei/driver-runtime) | Install the NPU driver and firmware on the host, and verify with `npu-smi info` |
| [MindCluster (cluster scheduling component)](/ecosystem/huawei/mindcluster) | Overview of the cluster-side components, the install order, and each component |

## Related

- [Ecosystem docs home](/ecosystem)
- [Drivers and Runtime](/ecosystem/huawei/driver-runtime)
- [MindCluster (cluster scheduling component)](/ecosystem/huawei/mindcluster)
