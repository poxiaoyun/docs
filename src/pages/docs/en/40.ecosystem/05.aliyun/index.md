---
title: 'Alibaba Cloud (PPU)'
updated: '2026-09-17'
author: Rune Docs Team
description: 'Using Zhenwu PPU on Alibaba Cloud: from Lingjun node pools to ACK device plugins, and what it takes to connect it to the platform.'
tags:
  - ecosystem
  - aliyun
  - ppu
  - lingjun
---

# Alibaba Cloud (PPU)

Zhenwu PPU is Alibaba T-Head's in-house AI accelerator, and so far it only shows up on Alibaba Cloud: the compute
comes from **Lingjun node pools**, and scheduling is handled by **ACK**.

Compared with the Ascend, DCU, and NVIDIA chapters, the big difference is that you do not own the cards. Drivers,
firmware, and machine maintenance all sit on Alibaba Cloud's side; what you touch is an ACK cluster and a node pool.
That is why this chapter has no "install the driver" page. What you actually do comes down to three things:
add Lingjun nodes to the cluster, install two ACK add-ons, request resources on the platform.

:::info The platform recognises this card
In the platform's resource model, PPU is keyed by `alibabacloud.com/ppu`, and split instances by
`alibabacloud.com/ppu-*`. Once recognised, a flavor is named `PPU*1` and labelled with the PPU vendor.
See [Using PPU on the platform](/ecosystem/aliyun/platform-usage).
:::

## Terms

| Term | What it means |
| --- | --- |
| PPU | Parallel Processing Unit, the T-Head AI accelerator family sold as "Zhenwu". |
| Lingjun | Alibaba Cloud's intelligent-computing cluster product. PPU cards live in Lingjun machines and join ACK as a node pool. |
| ACK | Alibaba Cloud Container Service. Scheduling, monitoring, and failure handling for PPU nodes happen here. |
| ack-ppu-device-plugin | The standard ACK device plugin for PPU. It reports cards as Kubernetes resources. |
| ack-rdma-device-plugin | Exposes RDMA NICs as `rdma/hca`. Multi-node traffic needs it. |
| MIG | Hardware partitioning for PPU. One card is cut into isolated instances with names like `ppu-4u.4g48gb`. |
| PPU SDK | T-Head's software stack: compiler, operator libraries, `ppu-smi`, and so on. It ships inside workload images; the platform does not install it separately. |

## How this chapter is organised

| Page | What it solves |
| --- | --- |
| [PPU basics](/ecosystem/aliyun/ppu-basics) | Models, key specs, software stack, workloads that fit |
| [Lingjun node pool](/ecosystem/aliyun/lingjun-nodepool) | Cluster prerequisites, node pool, node label checks |
| [Device plugin](/ecosystem/aliyun/device-plugin) | Components, install and verify, scheduling policies, MIG |
| [Using PPU on the platform](/ecosystem/aliyun/platform-usage) | Flavor recognition, instances and quotas, monitoring |
| [FAQ](/ecosystem/aliyun/faq) | Troubleshooting, plus a few things learned the hard way |

## Order of work

1. **Node pool first**: prepare an ACK Pro cluster, create a Lingjun node pool, add the PPU nodes.
2. **Install add-ons**: `ack-rdma-device-plugin` and `ack-ppu-device-plugin`, ticking topology reporting for the latter.
3. **Check the node**: the `aliyun.accelerator/ppu_*` labels must show up.
4. **Tune scheduling**: turn on Binpack and add `alibabacloud.com/ppu` to `binpackResourceWeight`.
5. **Submit a workload**: request `alibabacloud.com/ppu` and tolerate the Lingjun taint.

Do not overthink the order. If step 3 passes, everything before it was fine; if step 3 fails, the rest is wasted effort.

## Where it differs from the other three

- **No host driver step.** Ascend, DCU, and NVIDIA all start with installing a driver on a machine. For PPU nodes the
  driver and firmware are maintained by Alibaba Cloud — you cannot install them, and you do not need to.
- **ACK is the entry point, not bare metal.** The other three chapters connect your own machines to your own cluster;
  PPU connects a cloud node pool to a cloud cluster.
- **The platform plugs in at the resource layer.** It only knows the resource key `alibabacloud.com/ppu`, and does not
  care which data centre the card sits in.

## Related

- [Ecosystem docs home](/ecosystem)
- [PPU basics](/ecosystem/aliyun/ppu-basics)
- [Device plugin](/ecosystem/aliyun/device-plugin)
- [Huawei (Ascend)](/ecosystem/huawei)
- [Hygon (DCU)](/ecosystem/hygon)
- [NVIDIA (GPU)](/ecosystem/nvidia)
