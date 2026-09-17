---
title: Biren Technology
updated: '2026-09-17'
author: Rune Docs Team
description: How Biren Biren products connect to the platform, what the driver and device plugin situation is, and how far the platform recognises Biren models.
tags:
  - ecosystem
  - biren
  - supa
---

# Biren Technology

Biren Technology builds data centre GPUs. Its accelerator line is called Biren, and its software platform is BIRENSUPA™. Among the accelerator vendors the platform already covers, Biren is the one the platform recognises least: there is no Biren entry among image accelerator types, no Biren model registered in model metadata, no vendor icon on flavours, and no scheduling component in System Apps. Whether a node can use the cards depends entirely on which device plugin was installed by hand on the cluster side, and the platform only treats those cards as a generic accelerator keyed by resource name.

:::info Where the platform stands
Biren runs a manual path on the platform: the platform knows the resource name, not the vendor and not the model. The per-layer status and the way to fill each gap are in
[Platform support](/ecosystem/biren/platform-support).
:::

## Terms worth sorting out

| Term | What it means |
| --- | --- |
| Biren Technology | The company that builds the accelerators and the BIRENSUPA stack |
| Biren (product line) | The accelerator product name, in models such as 106M and 166L |
| BR106 / BR166 | Chip models in chiplet terms. BR166 is built from two BR106 chiplets |
| BIRENSUPA™ | Official software platform name. The official split is driver and HAL, programming platform, framework layer, solution layer |
| SVI | Secure Virtual Instance, the official in-card secure instance. A BR106 supports up to 4 |
| HAMi | Open source middleware and the practical route for split scheduling of Biren cards; Biren is supported only from v2.10.0 |

## Order of work

1. **Driver**: install on every machine that has a card, until `brsmi` lists them. The device plugin requires driver ≥ 1.2.2.
2. **Container runtime toolkit**: install on the same machines so containers can see the cards. The CDI route requires kubelet ≥ 1.28 and containerd ≥ 1.7.
3. **Device plugin**: install `k8s-device-plugin` in the cluster; nodes then report `birentech.com/gpu`.
4. **In-card splitting**: configure SVI on the card first, then nodes report `birentech.com/1-2-gpu` or `birentech.com/1-4-gpu`.
5. **Scheduling extras**: to schedule split jobs by share, switch to the third-party HAMi `biren-device-plugin`, and change the node label from `birentech.com=gpu` to `biren=on`.
6. **Platform side**: back on the platform, define flavours and quotas against the resource names, then run one minimal job to prove it.

The first three steps are host and cluster work; only step six touches the platform UI. Reverse the order and the device plugin will not see the cards.

## Pages in this section

| Page | What it covers |
| --- | --- |
| [Products and software stack](/ecosystem/biren/products) | Biren model generations, training and inference split, company and roadmap status |
| [Drivers and container runtime](/ecosystem/biren/driver-runtime) | Prerequisites, driver install steps, verification and upgrade notes |
| [Kubernetes components](/ecosystem/biren/k8s-components) | Device plugin and archive status, reported resource names, SVI splitting, relation to Volcano |
| [Platform support](/ecosystem/biren/platform-support) | Layer-by-layer check of what the platform recognises and what is missing |
| [FAQ](/ecosystem/biren/faq) | Cards not seen, cards missing in containers, split resources not schedulable |

## Related

- [Ecosystem docs home](/ecosystem)
- [NVIDIA (GPU)](/ecosystem/nvidia): the same GPU route, useful to compare device plugin and resource name layering against
- [AMD (Instinct / ROCm)](/ecosystem/amd): also has no one-click install entry on the platform side
