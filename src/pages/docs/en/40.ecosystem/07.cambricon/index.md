---
title: Cambricon (MLU)
updated: '2026-09-17'
author: Rune Docs Team
description: What to install to bring Cambricon MLU cards into the platform, how far the platform already recognises them, and what is still missing.
tags:
  - ecosystem
  - cambricon
  - mlu
---

# Cambricon (MLU)

Cambricon sits where AMD and Hygon sit: there is no one-step cluster package. The platform's **System Apps** bundles
only NVIDIA and Ascend scheduling components, so the MLU cluster side is installed by hand from the official
open-source repositories.

The host side is the usual three steps: install the Neuware driver, install the container runtime toolkit, and confirm
container processes can see device nodes such as `/dev/cambricon_devX`. The cluster side then registers the card as
`cambricon.com/mlu` through the official device plugin.

:::info Where the platform stands
The accelerator type for image registration, the card models in model metadata, and the `MLU` label on flavors are
already in place. What is **not** there is a one-step installation package, and Cambricon has no dedicated icon.
The item-by-item comparison is in [Platform support status](/ecosystem/cambricon/platform-support).
:::

## Terms to keep apart

| Term | In plain words |
| --- | --- |
| MLU | Cambricon's accelerator card line, and the label the platform shows on a flavor |
| Neuware | The name for the whole software stack. Driver, toolchain, operator libraries and framework adapters all sit under it |
| CNToolkit | The toolchain package. CNCC compiler, CNAS, CNGDB, CNPerf, CNDev/CNDrv and CNRT are all inside |
| BANG C / BANGPy | The languages used to write MLU kernels, the layer where CUDA has its kernel code |
| CNNL / CNCL | Operator library and communication library. Multi-card training goes through CNCL |
| MagicMind | The inference engine; it compiles a model into an offline file before it runs |
| torch_mlu | The MLU adapter for PyTorch. PyTorch only sees MLU devices once this package is present |
| vMLU / sMLU / MIM | Several different ways of giving one card to more than one job, with different granularity and isolation. See [Kubernetes components](/ecosystem/cambricon/k8s-components) |

## Installation order

1. **Neuware driver**: on every machine with a card. Afterwards `/dev/cambricon_devX`, `/dev/cambricon_ctl` and similar nodes exist.
2. **Container runtime toolkit**: on the same machines, so containers can see those device nodes too.
3. **Device plugin**: from `Cambricon/cambricon-k8s-device-plugin`, registering the card as `cambricon.com/mlu`. There is no prebuilt official image, so you build it yourself.
4. **Monitoring**: deploy `mlu-exporter` to get card utilisation and temperature into Prometheus.
5. **Platform side**: create a flavor and quota against the resource name, then submit a job asking for one card to confirm.

The first three steps depend on each other in that order; reverse them and the device plugin will not find the cards.
The last two can be added later without affecting schedulability.

## Which page to read

| Page | What it covers |
| --- | --- |
| [Products & software stack](/ecosystem/cambricon/products) | Shipping models, the layers of Neuware, official entry points |
| [Drivers & container runtime](/ecosystem/cambricon/driver-runtime) | Installing the driver and container toolkit on the host, and how to verify |
| [Kubernetes components](/ecosystem/cambricon/k8s-components) | Resource names the device plugin reports, monitoring ports, how one card is split |
| [Platform support status](/ecosystem/cambricon/platform-support) | How far the platform recognises the card, what is missing, how to fill the gap |
| [FAQ](/ecosystem/cambricon/faq) | Cards not recognised, cards invisible inside containers |

## Related

- [Ecosystem Docs Home](/ecosystem)
- [AMD (Instinct / ROCm)](/ecosystem/amd): also has no platform-side one-step install, so the layering compares well
- [Hygon (DCU)](/ecosystem/hygon): another domestic accelerator whose cluster components are installed by hand
