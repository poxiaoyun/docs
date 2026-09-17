---
title: 'Device plugin'
updated: '2026-09-17'
author: Rune Docs Team
description: 'The ACK-side PPU device plugin: which resources it reports, how to verify, how to tune scheduling, and how MIG works.'
tags:
  - ecosystem
  - aliyun
  - ppu
  - device-plugin
---

# Device plugin

Before the cluster can schedule PPU, something has to report the cards as Kubernetes resources. On ACK that is two
add-ons:

| Add-on | Role | Needed? |
| --- | --- | --- |
| `ack-ppu-device-plugin` | Discovers and reports PPUs on a node, allocates devices to pods and mounts them into containers | Always, for PPU nodes |
| `ack-rdma-device-plugin` | Reports RDMA NICs as `rdma/hca` | Required for multi-node training and inference |

:::warning These two do not live under the platform's System Applications
The Ascend and NVIDIA cluster components install in one step from **Cluster Management → Operations → System
Applications**. The PPU add-ons are official Alibaba Cloud ACK add-ons and are installed from the **Alibaba Cloud
Container Service console's add-on management**. The platform's job is recognising the resources, creating instances,
and showing metrics — it does not manage ACK add-on installation.
:::

The device plugin does four things: discover devices, report their health and count, allocate on request, and mount the
devices into containers. It follows the community device plugin standard, so `resources.limits` works exactly as it does
for GPUs.

## Reported resources

Whole card:

```yaml
alibabacloud.com/ppu
```

Partitioned instances (MIG):

| Memory tier | Available compute sizes |
| --- | --- |
| `1g12gb` (12GB) | `4u`, `8u` |
| `2g24gb` (24GB) | `1u`, `12u`, `16u` |
| `4g48gb` (48GB) | `1u`, `2u`, `3u`, `4u`, `8u`, `16u`, `24u`, `32u`, `64u` |

The full resource name looks like `alibabacloud.com/ppu-4u.4g48gb`. Read the name literally: the number before `u` is
the number of CUs (compute units), the number before `g` is the number of memory shares, and the trailing value is the
instance's total memory. Compute and memory are **split independently**, which is why combinations such as
`64u.4g48gb` exist — all the compute, one share of memory.

:::info Tiers come from what the node reports
Not every card offers every tier above. The device plugin reports what the card can actually be split into, so the
node's `Allocatable` is the source of truth.
:::

```bash
kubectl describe node <NODE_NAME> | grep -A 20 "Allocatable"
```

## Pages in this group

| Page | What it solves |
| --- | --- |
| [Install and verify](/ecosystem/aliyun/device-plugin/install) | Install the add-ons, tick the option, confirm resources are reported |
| [Scheduling policies](/ecosystem/aliyun/device-plugin/scheduling) | Topology awareness, Binpack, multi-node and gang scheduling |
| [MIG partitioning](/ecosystem/aliyun/device-plugin/mig) | Cutting one card into several shares for different jobs |

## Version

The first public release of `ack-ppu-device-plugin` is **1.4.0**:

| Version | Image | Released | Notes |
| --- | --- | --- | --- |
| 1.4.0 | `registry-cn-wulanchabu.ack.aliyuncs.com/acs/ppu-device-plugin:v1.4.0-8a13b6d4-topology-aliyun` | 2026-08-05 | First full release; complete M890P support |

Upgrading existing clusters is unaffected. The image path carries a region prefix; other regions get their own address
from the console.

## Related

- [Alibaba Cloud (PPU)](/ecosystem/aliyun)
- [Lingjun node pool](/ecosystem/aliyun/lingjun-nodepool)
- [Install and verify](/ecosystem/aliyun/device-plugin/install)
- [Using PPU on the platform](/ecosystem/aliyun/platform-usage)
