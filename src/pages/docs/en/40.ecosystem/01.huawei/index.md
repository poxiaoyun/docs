---
title: 'Huawei (Ascend)'
updated: '2026-09-17'
author: Rune Docs Team
description: 'The order for connecting an Ascend NPU server to the platform: driver and runtime first, MindCluster components after, plus the version baselines.'
tags:
  - ecosystem
  - huawei
  - ascend
---

# Huawei (Ascend)

Connecting a server with Ascend NPUs to the platform cluster has two parts: install the driver and runtime on the host,
so the machine itself can use the cards; then install MindCluster components in the cluster, so Kubernetes can schedule
those cards.

## Two words to tell apart first

| Term | Plain explanation |
| --- | --- |
| NPU | Neural Processing Unit: an accelerator card designed for the tensor math inside large models. It and a general-purpose GPU both do parallel computing; the difference is focus — an NPU does matrix multiplication very efficiently but is good at little else. |
| CANN | Ascend's heterogeneous computing software stack (Compute Architecture for Neural Networks): it exposes interfaces upward to frameworks such as PyTorch and drives the NPU downward. It is the equivalent of a graphics card's driver plus runtime layer, so install it only after the driver is verified. |

:::info Decide three things before you start
**Hardware model**, **driver/runtime version**, and **framework version**. These three must match as a set, and every later
troubleshooting or compatibility decision depends on them. Do not guess a version from memory — always use the combination
shipped with the release package and the official installation guide.
:::

## Version baselines

This chapter is written against **MindCluster 26.0.0**, the version matched to the platform's component package.
The upstream branches move faster, so **check whether the platform package has caught up before upgrading**, and do not
upgrade one or two components on their own: these components must match as a set, and mixing versions shows up as "the
device plugin cannot see the cards" or "the scheduler fails to load the NPU plugin".

| Component | Baseline here | Notes |
| --- | --- | --- |
| Ascend Device Plugin / NPU Exporter | 26.0.0 | Image tag `v26.0.0` |
| Ascend-customized Volcano | 1.9.0 (image tag `v1.9.0-v26.0.0`) | The scheduler and controller must carry the Ascend plugin; upstream images with the same tag will not work |
| Host driver and firmware | Whatever ships with your NPU model | Must match the NPU model and the OS kernel |
| CANN | Same release batch as the driver | Install it only after the driver is verified |

The final authority for a driver and MindCluster combination is the combination shipped in the release package. The
versions above state the baseline, and they are not a release picker.

## What order to install in

1. **Driver and firmware**: on every machine that has cards. Afterwards the host can recognise the NPUs.
2. **CANN and other runtime packages**: after the driver is verified. Service images and frameworks depend on them.
3. **MindCluster cluster scheduling components**: in the cluster, in the order "packages → container runtime → monitoring exporter → device plugin → node status component".

## How the platform installs it

The platform bundles an Ascend scheduling package. Install it from **Cluster Management → Operations → System
Apps** by choosing the cluster hardware type, and it deploys **Ascend Device Plugin, NPU Exporter and the
Ascend-customized Volcano** in one go. It does **not** include the host-side components: the driver, firmware
and Ascend Docker Runtime still have to be installed by hand on every NPU node.

For what is and is not included, and the default value of each parameter, see
[MindCluster (cluster scheduling components)](/ecosystem/huawei/mindcluster).

## Which page to read

| Page | What it solves |
| --- | --- |
| [Drivers and Runtime](/ecosystem/huawei/driver-runtime) | Install the NPU driver and firmware on the host, and verify with `npu-smi info` |
| [MindCluster (cluster scheduling component)](/ecosystem/huawei/mindcluster) | Overview of the cluster-side components, the install order, what the platform deploys, and each component |

## Related

- [Ecosystem docs home](/ecosystem)
- [Drivers and Runtime](/ecosystem/huawei/driver-runtime)
- [MindCluster (cluster scheduling component)](/ecosystem/huawei/mindcluster)
