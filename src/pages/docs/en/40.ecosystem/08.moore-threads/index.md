---
title: Moore Threads (MTT)
updated: '2026-09-17'
author: Rune Docs Team
description: What to install to bring Moore Threads GPUs into the platform, how far the platform recognises them today, and what is still missing.
tags:
  - ecosystem
  - moore-threads
  - musa
---

# Moore Threads (MTT)

There is no one-click install path for Moore Threads cards on the platform. The cluster side needs MT GPU Operator installed by hand, the host side needs MT Linux Driver and MT Container Toolkit, and **System Apps** only ships the NVIDIA and Ascend packages today.

Recognition stops at the metadata layer: an image can be registered as `Musa(摩尔线程)`, and `musa` is present in the model metadata `hardware_backends` field. Model names, vendor icons and a dedicated accelerator label do not exist yet.

:::info Platform status
The item-by-item comparison is on [Platform support](/ecosystem/moore-threads/platform-support). In one line: **metadata is ready, cluster components are a manual install, and the display layer is missing icons and a dedicated label.**
:::

## Terms to keep straight

| Term | In plain words |
| --- | --- |
| MUSA | The overall name for the Moore Threads software stack, the counterpart of CUDA on the NVIDIA side. Compilers, math libraries and framework ports all live here |
| MTT | The product name prefix. The MTT in MTT S5000 and MTT S80 is this |
| Full-function GPU | How the vendor describes its own products. There is **no split between training cards and inference cards** |
| MT Linux Driver | The host kernel driver. Kernel module `mtgpu`, package `sgpu-dkms` |
| MT Container Toolkit | The container toolkit, package `mt-container-toolkit`. It makes the card visible inside containers |
| MT GPU Operator | The cluster-side component bundle, currently v2.1.0, with full and core install modes |
| sGPU | In-cluster card splitting. Compute is shared by time-slice weight, memory is counted in 512MiB units, resource names are `mthreads.com/sgpu-core` and `mthreads.com/sgpu-memory` |
| MT vGPU | The hardware virtualisation path using mdev / SR-IOV on the host, type name `mtgpu-1101`. It hands out device nodes, not Kubernetes resource names |

sGPU hands out compute in time slices while each holder keeps its own memory, like several processes sharing one CPU core: the time is divided, the memory is not, and it is not physical isolation.

## Installation order

1. **Kernel driver (`sgpu-dkms`)**: on every machine that has a card. `mthreads-gmi` must list the card when you are done.
2. **Container toolkit (`mt-container-toolkit`)**: on the same machines, so containers can reach the device.
3. **Cluster components (MT GPU Operator v2.1.0)**: registers the card as `mthreads.com/gpu`. The components are not open source, so the package has to come from the vendor.
4. **Monitoring (`mt-dcgm` and `mt-dcgm-exporter`)**: only when you need temperature and utilisation.
5. **Build specs and quotas on the platform**: use the resource name the node reports, then submit one job to prove it works.

The first four steps happen on machines and in the cluster. Step five is the only one that touches the platform UI. Reversed, the device plugin will not see the cards.

## Pages in this chapter

| Page | What it covers |
| --- | --- |
| [Products & software stack](/ecosystem/moore-threads/products) | Shipping models, MUSA layers, official entry points |
| [Drivers & container runtime](/ecosystem/moore-threads/driver-runtime) | Host driver and container toolkit, and how to verify |
| [Kubernetes components](/ecosystem/moore-threads/k8s-components) | Component list, resource names, monitoring ports, sGPU splitting |
| [Platform support](/ecosystem/moore-threads/platform-support) | How far the platform goes, what is missing, how to fill the gap |
| [FAQ](/ecosystem/moore-threads/faq) | Card not recognised, no card in containers, component package unavailable |

## Related

- [Ecosystem Docs Home](/ecosystem)
- [NVIDIA (GPU)](/ecosystem/nvidia): same GPU route, so the component layering lines up
- [AMD (Instinct / ROCm)](/ecosystem/amd): also has no one-click install path on the platform
