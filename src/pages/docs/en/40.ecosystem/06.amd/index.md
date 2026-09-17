---
title: AMD (Instinct / ROCm)
updated: '2026-09-17'
author: Rune Docs Team
description: Which components AMD Instinct cards need to join the platform, how far platform support already goes, and what is still missing.
tags:
  - ecosystem
  - amd
  - rocm
  - kubernetes
---

# AMD (Instinct / ROCm)

AMD follows broadly the same path as NVIDIA: a kernel driver on the host, a runtime toolkit on the container side, and a
device plugin inside the cluster that registers the cards as schedulable resources.
The difference sits in that third layer. The platform ships no AMD scheduling component package, so the cluster side has
to be installed by hand from AMD's own GPU Operator.

:::info Where the platform stands today
AMD is only partly recognised on the platform. The accelerator type on images, the card models in model metadata, and
the vendor icon on specs are all in place,
but there is **no one-click install for the scheduling components** and no AMD-specific accelerator card label. For the
item-by-item comparison see [Platform support](/ecosystem/amd/platform-support).
:::

## Terms that are easy to confuse

| Term | What it means |
| --- | --- |
| Instinct | AMD's data centre accelerator line, with model names starting at MI (MI300X, MI350X and so on) |
| ROCm | AMD's open compute software stack, the counterpart of CUDA on the NVIDIA side. Drivers, math libraries, compilers and framework support all live in it |
| HIP | ROCm's programming model, close to CUDA in syntax. The code migration tool is called HIPIFY |
| Compute partitioning | Splitting one card physically into shares handed to different jobs, with mode names such as SPX / DPX / QPX / CPX |
| CDI | Container Device Interface. The standard way for a container runtime to read device specifications from the host; AMD uses it to inject GPUs into containers |

## Order of work

1. **Kernel driver (amdgpu)**: install it on every machine that has a card. Once it is in, `rocminfo` lists the cards.
2. **ROCm user space**: install it on the same machines. `amd-smi` reports the version.
3. **Container runtime toolkit** (`amd-container-toolkit`): makes the cards visible inside containers. A cluster running containerd takes the CDI route.
4. **Cluster-side components** (device plugin, node labeller and metrics exporter from the AMD GPU Operator): turn the cards into schedulable resources.

The first two steps belong to the host, the fourth to the cluster. Reverse the order and the device plugin never finds
the cards.

## What this chapter contains

| Page | What it covers |
| --- | --- |
| [Products & software stack](/ecosystem/amd/products) | Shipping models, the layers of ROCm, official entry points |
| [Drivers & container runtime](/ecosystem/amd/driver-runtime) | Install the host driver and the container toolkit, and how to verify both |
| [Kubernetes components](/ecosystem/amd/k8s-components) | Which resource names the device plugin reports, monitoring ports, partitioning modes |
| [Platform support](/ecosystem/amd/platform-support) | How far the platform recognises AMD, what is missing, how to fill the gap |
| [FAQ](/ecosystem/amd/faq) | Cards not detected, cards missing inside containers, and similar problems |

## Related

- [Ecosystem docs home](/ecosystem)
- [NVIDIA (GPU)](/ecosystem/nvidia): also a GPU path, and the component layers line up for comparison
- [Hygon (DCU)](/ecosystem/hygon): also has no one-click install entry on the platform
