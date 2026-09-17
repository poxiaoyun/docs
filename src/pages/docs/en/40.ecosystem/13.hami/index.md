---
title: HAMi
updated: '2026-09-17'
author: Rune Docs Team
description: What HAMi is, which part of it the platform already ships, how to fill the gap, and how its card sharing differs from the built-in one.
tags:
  - ecosystem
  - hami
  - vgpu
  - kubernetes
---

# HAMi

HAMi stands for Heterogeneous AI Computing Virtualization Middleware. It is a Kubernetes middleware for
virtualizing heterogeneous accelerators, formerly known as `k8s-vGPU-scheduler`. The problem it solves is
straightforward: Kubernetes allocates a whole accelerator card to a single pod, so a half-idle card cannot be
handed to anyone else. HAMi lets several workloads share one card, requesting device memory and compute in slices.

The project entered the CNCF Sandbox on 21 August 2024 and was promoted to a CNCF Incubating project on
2 July 2026 by a unanimous vote of the CNCF Technical Oversight Committee. The latest release is `v2.10.0`,
published on 21 August 2026.

## What the platform already ships

This part matters for reading the rest of the section: **the platform ships one component from the HAMi family,
not a full HAMi installation**.

| Capability | On the platform | Notes |
| --- | --- | --- |
| NVIDIA card sharing by slot | Yes | The built-in NVIDIA scheduling package (`scheduler-nvidia`) bundles HAMi's `volcano-vgpu-device-plugin` `v1.11.1` |
| A full HAMi | No | `hami-scheduler` (admission webhook and scheduler extender), `hami-device-plugin`, the in-container HAMi-Core and the WebUI are all absent from the platform package set |
| Card slicing for non-NVIDIA vendors | No | The platform ships scheduling packages for Ascend and NVIDIA only |

The two talk in different resource keys and have different capability boundaries, so check which route you are
on before defining a flavor.

| | Built-in Volcano vGPU | Full HAMi |
| --- | --- | --- |
| What a workload requests | `volcano.sh/vgpu-number`, `volcano.sh/vgpu-memory`, `volcano.sh/vgpu-memory-percentage`, `volcano.sh/vgpu-cores` | `nvidia.com/gpu`, `nvidia.com/gpumem`, `nvidia.com/gpucores`, `nvidia.com/gpumem-percentage` |
| Who schedules | Volcano's `deviceshare` plugin | HAMi's own scheduler extender, running beside `kube-scheduler` |
| Hardware covered | NVIDIA only | More than a dozen accelerator families, see [Supported devices & resource keys](/ecosystem/hami/device-matrix) |
| Slicing granularity | By slot, device memory converted through a factor | On NVIDIA, 1 MiB of memory and 1% of compute per unit |

On an NVIDIA card only one of the two routes can be used. HAMi's device plugin and the NVIDIA GPU Operator's
device plugin both register `nvidia.com/gpu` with the kubelet, so running both on the same node collides, and
the platform installs the GPU Operator by default. The full comparison is under
[Platform support](/ecosystem/hami/platform-support).

:::warning Do not mix the two in one cluster
If the cluster already uses the platform's NVIDIA scheduling package with GPU virtualization enabled, adding a
full HAMi makes two device plugins register the same resource. Stop the first one before installing the second.
:::

## Terms to keep apart

| Term | In plain words |
| --- | --- |
| HAMi | The project name, and the name for the whole installation |
| HAMi-Core | The in-container resource control library; `libvgpu.so` on NVIDIA, where the actual limits are enforced |
| `hami-scheduler` | HAMi's scheduling component, acting as both admission webhook and scheduler extender |
| `hami-device-plugin` | The node-side device plugin that registers physical cards as allocatable devices |
| vGPU | HAMi's name for sharing one card among several workloads. A logical split, not extra hardware |
| SMLU | Cambricon's name for dynamic slicing; HAMi reuses the same resource keys |
| sGPU | MetaX's name for a card slice |
| vXPU | Kunlunxin's name for a card slice, reported by HAMi as `kunlunxin.com/vxpu` |
| SVI | Biren's Secure Virtual Instance; HAMi supports both whole cards and SVI partitions |

## Installation order

1. **Host**: install the vendor driver and container toolchain until the card is visible inside containers.
2. **Node labels**: label the nodes HAMi should manage. NVIDIA's device plugin looks for `gpu=on` by default.
3. **Vendor device plugin**: register the cards as schedulable resources. For some vendors this plugin comes from HAMi.
4. **HAMi itself**: install `hami-scheduler` and the vendor's device plugin with Helm, enabling that vendor.
5. **Platform flavor**: define the flavor against the resource key HAMi reports, and check that no built-in
   component already holds the same key.

The first three steps are host and cluster work, the fourth installs HAMi, and only the fifth returns to the
platform. Reverse the order and the device plugin will not see the card.

## Pages in this section

| Page | What it covers |
| --- | --- |
| [Architecture & scheduling](/ecosystem/hami/architecture) | What the four components do, how a pod reaches a device, how limits are enforced |
| [Installation & parameters](/ecosystem/hami/install) | Prerequisites, the Helm install, device parameters, per-node settings, verification |
| [Supported devices & resource keys](/ecosystem/hami/device-matrix) | The official support matrix, resource keys per vendor, when each vendor arrived |
| [Platform support](/ecosystem/hami/platform-support) | What ships today, what is missing, the manual sequence, the collision points |
| [Requesting & operating](/ecosystem/hami/usage) | Request syntax per vendor, annotations, priority, metrics |
| [FAQ](/ecosystem/hami/faq) | Slicing that does not happen, limits that do not apply, plugins that fight each other |

## Related

- [Ecosystem Docs Home](/ecosystem)
- [NVIDIA GPU](/ecosystem/nvidia): where the platform's built-in Volcano vGPU lives
- [Containers & orchestration](/ecosystem/open-source/container-orchestration): where Volcano and Volcano vGPU sit in the open-source component table
- [HAMi upstream project](https://project-hami.io): the source for version numbers, the support matrix and deployment notes
