---
title: MetaX (Xiyun)
updated: '2026-09-17'
author: Rune Docs Team
description: What it takes to bring MetaX accelerators into the platform, how far the platform already recognises them, and what is still missing.
tags:
  - ecosystem
  - metax
  - maca
---

# MetaX (Xiyun)

Connecting a MetaX machine works much like the AMD path: install the kernel driver on the host, install MetaX's own
container runtime next to it, and let `gpu-device` register the cards as schedulable resources in the cluster.
The difference sits in the cluster layer. Both MetaX Helm charts live in MetaX's own OCI registry, pulling them needs
commercial authorisation, and the platform has no built-in installer for them.

:::info Where the platform stands
The platform has the accelerator type registered for MetaX, shown as `MACA(沐曦)`. Model metadata, flavor labels,
vendor icons and bundled scheduling components have nothing for MetaX yet. See
[Platform support status](/ecosystem/metax/platform-support) for the item-by-item comparison.
:::

## Terms to know first

| Term | What it means |
| --- | --- |
| Xiyun C series | The general-compute line for both training and inference, with models such as C500, C588 and C600 |
| N series | The inference line, with models such as N100, N260 and N300 |
| MXMACA | MetaX's user-space software stack. Compiler, runtime and operator libraries all live here; it occupies the same position as CUDA on NVIDIA |
| MACA | The accelerator option name used when registering an image on the platform, written as `MACA(沐曦)` in the UI |
| KMD / UMD | Kernel-mode and user-mode drivers. The kernel module is `metax.ko`, shipped with `k8s-driver-image` |
| gpu-device | The device plugin component that reports `metax-tech.com/gpu` |
| sGPU | MetaX's software partitioning scheme, up to 16 instances per card, requested through `metax-tech.com/sgpu` |
| VF | A virtual function produced by SR-IOV; it reuses the `metax-tech.com/gpu` resource name |

## Installation order

1. **Kernel driver, KMD / UMD**: on every machine that has a card. Once `metax.ko` is loaded the host can use the card.
2. **MXMACA user space**: on the same machines, after which `mx-smi` reports a version.
3. **Container runtime**: install `metax-container-runtime` (`metax-docker` for Docker nodes) so containers can reach the devices.
4. **Cluster components**: install `metax-operator` or `metax-gpu-extensions` so the card is registered as `metax-tech.com/gpu`.

The first two steps belong to the host, the fourth to the cluster. Reverse the order and `gpu-device` will not see the cards.

## Which page to read

| Page | What it covers |
| --- | --- |
| [Products & software stack](/ecosystem/metax/products) | Shipping models, the layers of MXMACA, official entry points |
| [Drivers & container runtime](/ecosystem/metax/driver-runtime) | Installing the driver and container runtime on the host, and how to verify |
| [Kubernetes components](/ecosystem/metax/k8s-components) | Choosing between the two charts, reported resource names, monitoring ports, partitioning, and the Volcano relationship |
| [Platform support status](/ecosystem/metax/platform-support) | How far the platform recognises MetaX, what is missing, how to work around it |
| [FAQ](/ecosystem/metax/faq) | Cards not detected, containers not seeing devices, and similar |

## Related

- [Ecosystem docs home](/ecosystem)
- [AMD (Instinct / ROCm)](/ecosystem/amd): the closest component layout, useful to read side by side
- [NVIDIA (GPU)](/ecosystem/nvidia): comparable resource-name and device-plugin conventions
- [Hygon (DCU)](/ecosystem/hygon): also has no one-click installer on the platform side
