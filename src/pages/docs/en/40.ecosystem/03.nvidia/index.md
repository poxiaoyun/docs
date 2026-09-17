---
title: NVIDIA (GPU)
updated: '2026-09-17'
author: Rune Docs Team
description: What to install, and in what order, to bring an NVIDIA GPU server into the platform. Host drivers first, GPU Operator and Volcano after.
tags:
  - ecosystem
  - nvidia
  - gpu
  - cuda
---

# NVIDIA (GPU)

Connecting a server with NVIDIA GPUs to a platform cluster has the same two parts as the Ascend and Hygon chapters:
install the driver on each host so the machine can use the card, then install the GPU Operator and Volcano in the
cluster so Kubernetes can schedule that card, and split one card across several jobs.

:::info The platform bundles an NVIDIA scheduling package
The platform ships an NVIDIA scheduling package: **GPU Operator + Volcano + Volcano vGPU**. Install it from
**Cluster Management → Operations → System Apps** by choosing the cluster hardware type, and you do not need to
apply a pile of YAML by hand. This section explains what each component does, how to verify it, and the manual
steps for filling in a missing component or troubleshooting.
:::

## Terms to know first

| Term | In plain words |
| --- | --- |
| GPU | Graphics processing unit. Originally designed for rendering, it excels at massively parallel math, which is why it now runs most large-model matrix operations. |
| Driver | The base software that lets the operating system use the card. If `nvidia-smi` shows the card, the driver is installed. |
| CUDA | NVIDIA's parallel computing platform and programming model (Compute Unified Device Architecture). It provides the interface that PyTorch and other frameworks call, and drives the GPU underneath. The counterpart of Ascend's CANN. |
| Container toolkit | `nvidia-container-toolkit`: makes GPUs visible inside containers. The counterpart of Ascend Docker Runtime. |
| GPU Operator | NVIDIA's official cluster-side component bundle. It installs the device plugin, container toolkit, monitoring exporter, node labels and more as one unit. |
| vGPU | Here it means **Volcano vGPU**: splitting one physical card into shares so several jobs can use it. This is **not** NVIDIA's licensed commercial vGPU product. |

## Which page to read

| Page | What it solves |
| --- | --- |
| [Drivers & Container Runtime](/ecosystem/nvidia/driver-runtime) | Install the NVIDIA driver and container toolkit on the host, verify with `nvidia-smi` |
| [GPU Operator (cluster components)](/ecosystem/nvidia/gpu-operator) | Overview of the cluster components, install order and per-component details |
| [Volcano & vGPU Splitting](/ecosystem/nvidia/volcano-vgpu) | Sharing one card across jobs: how to split, request and limit |
| [FAQ](/ecosystem/nvidia/faq) | When it is installed but not working, look up the symptom |

## Installation order

The order matters. Each step depends on the previous one:

1. **Host driver**: on every machine that has a card. The host can then use the card, but the cluster still does not know about it.
2. **Container toolkit**: makes the card visible inside containers. Installing the GPU Operator from the platform does this for you.
3. **GPU Operator**: installs node labels, the device plugin and the monitoring exporter, registering the card as a schedulable cluster resource.
4. **Volcano**: gang scheduling, queueing and fair sharing for multi-card jobs. It comes with the GPU Operator package.
5. **Volcano vGPU (optional)**: only needed when one card must be shared by several jobs. Enable it together with the scheduling components.

:::warning Do not reverse the order
The device plugin checks for the container toolkit when it starts. Install the toolkit first, then start the
device plugin. Reversed, the plugin usually needs a restart or a reinstall before it sees the cards.
:::

## Two differences from the Ascend chapter

- **The cluster side is one bundle.** Ascend requires installing components one by one (Device Plugin, NPU
  Exporter and NodeD separately); on the NVIDIA side the GPU Operator manages them together and you only set a
  few switches.
- **There is one extra splitting option.** NVIDIA supports Volcano vGPU, which hands out shares of a single
  card to several jobs. The Ascend side uses whole cards plus the device plugin (see
  [Containers & Orchestration](/ecosystem/open-source/container-orchestration)).

## Related

- [Ecosystem Docs Home](/ecosystem)
- [Drivers & Container Runtime](/ecosystem/nvidia/driver-runtime)
- [GPU Operator (cluster components)](/ecosystem/nvidia/gpu-operator)
- [Huawei (Ascend)](/ecosystem/huawei)
- [Hygon (DCU)](/ecosystem/hygon)
- [Alibaba Cloud (PPU)](/ecosystem/aliyun)
