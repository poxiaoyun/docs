---
title: Iluvatar CoreX
updated: '2026-09-17'
author: Rune Docs Team
description: What to install to bring an Iluvatar CoreX accelerator server into the platform, how far the platform already recognises it, and what is still missing.
tags:
  - ecosystem
  - iluvatar
  - corex
---

# Iluvatar CoreX

Iluvatar CoreX sits in an odd spot on the platform: the name is registered, the models are not.
The image accelerator option already lists `CoreX(天数智芯)`, but no Iluvatar model is registered in the model
metadata and spec labels carry no vendor icon. On the cluster side the platform bundles no scheduling package,
so the device plugin, the exporter and vGPU support all have to be installed from the vendor's own repositories.

:::info Where the platform stands
See [Platform Support](/ecosystem/iluvatar/platform-support) for the layer-by-layer status.
When an option is missing from the UI, check that page first to tell a configuration gap from a product boundary.
:::

## Terms to know first

| Term | In plain words |
| --- | --- |
| TianGai | The training card line. Model names start with `BI`, so TianGai 100 is BI-V100. |
| ZhiKai | The inference card line. Model names start with `MR`, so ZhiKai 100 is MR-V100. |
| CoreX | The software stack brand. The vendor calls the whole thing the CoreX SDK, installed under `/usr/local/corex`. |
| ix-Container-Toolkit | The container runtime toolkit. Its command line is `ix-ctk`, and it registers a runtime named `iluvatar`. |
| Device plugin | `ix-device-plugin`, which registers the cards as the Kubernetes resource `iluvatar.com/gpu`. |
| vGPU | Sharing one card across jobs. The vendor calls it iluvatar VGPU and its resources live under `iluvatar.ai/<model>.vCore`. |

## Installation order

1. **CoreX SDK**: on every machine that has a card. It installs under `/usr/local/corex`, and `ixsmi` must list the cards afterwards.
2. **ix-Container-Toolkit**: on the same machines, so containers can see the cards too.
3. **ix-device-plugin**: in the cluster. The node then reports `iluvatar.com/gpu`.
4. **ix-exporter**: publishes utilisation and memory metrics for the cards.
5. **ix-GPU-Operator (optional)**: manages steps 3 and 4 together, so you do not install two components by hand.

The first two steps are host work, the last three are cluster work. Reverse the order and the device plugin will
not see the cards.

## Which page to read

| Page | What it solves |
| --- | --- |
| [Products & Software Stack](/ecosystem/iluvatar/products) | TianGai and ZhiKai models, the stack layers, the resource-name change, official entry points |
| [Drivers & Container Runtime](/ecosystem/iluvatar/driver-runtime) | Installing the CoreX SDK and ix-Container-Toolkit on the host, and how to verify |
| [Kubernetes Components](/ecosystem/iluvatar/k8s-components) | The resource names the device plugin reports, monitoring ports, vGPU splitting, the Volcano plugin |
| [Platform Support](/ecosystem/iluvatar/platform-support) | How far the platform already recognises it, what is missing, how to fill the gap |
| [FAQ](/ecosystem/iluvatar/faq) | Cards not detected, cards missing inside containers, resource names that do not match |

## Related

- [Ecosystem Docs Home](/ecosystem)
- [NVIDIA (GPU)](/ecosystem/nvidia): the same GPU route, useful for comparing how the layers are split
- [AMD (Instinct / ROCm)](/ecosystem/amd): also has no one-click install for cluster components
