---
title: 'Ecological documents'
updated: '2026-09-17'
author: Rune Docs Team
description: 'A delivery and operations view of the hardware ecosystem: what to install for each accelerator vendor, in what order, and how far the platform has adapted to each one.'
tags:
  - ecosystem
  - overview
---

# Ecological documents

This chapter is for delivery engineers and operations engineers: you have one or more servers with accelerator cards
installed and need to bring them into the platform cluster. It tells you which components to install, in what order, and
how to confirm the result.

Regular users can skip it. If all you do is create inference services or run fine-tuning jobs in the console, seeing and
selecting a card is enough — how it got connected is not your problem.

There is one test, and it has three parts: **the card is physically in the machine → the host has the driver and runtime
installed → a cluster component has registered the card as a schedulable resource**. All three must line up before the
card appears in the console. Miss one and it will not.

The vendors differ in neither of the first two layers but in who supplies the third-layer component. That splits them
into four channels, and picking the channel first is faster than guessing vendor by vendor.

## Pick the channel first

| Channel | Vendors | Where the cluster-side components come from | One-step install in System Apps |
| --- | --- | --- | --- |
| Bundled in the platform | [NVIDIA (GPU)](/ecosystem/nvidia), [Huawei (Ascend)](/ecosystem/huawei) | From the platform's System Apps | Yes |
| Install vendor components by hand | [Hygon (DCU)](/ecosystem/hygon), [AMD (Instinct / ROCm)](/ecosystem/amd), [Cambricon (MLU)](/ecosystem/cambricon), [Moore Threads](/ecosystem/moore-threads), [MetaX](/ecosystem/metax), [Biren Technology](/ecosystem/biren), [Iluvatar CoreX](/ecosystem/iluvatar), [Kunlunxin](/ecosystem/kunlunxin) | Vendor repositories, or shipped with the delivery package | No |
| Cloud node pool | [Alibaba Cloud (PPU)](/ecosystem/aliyun) | The cloud provider's console | No (cloud-side components) |
| Open-source foundation | [Open source communities](/ecosystem/open-source) | As needed; most clusters already have it | Mostly already bundled |

The first group is maintained by the platform and follows the platform version. The second group is delivered by the
vendors, so versions, installation methods, and limits follow vendor documentation; the pages in each partition exist to
line those up with the platform's actual state.

These four channels are about where the card components come from. One layer sits outside them: the ability to split
one card among several workloads. That layer comes from middleware such as
[HAMi](/ecosystem/hami) and stacks on top of any of the four. The platform ships exactly one component from it:
the Volcano vGPU device plugin bundled with the NVIDIA scheduling package.

## How far the platform has adapted

Adaptation is layered in the platform: four pieces of code each handle one thing — the accelerator type recorded on an
image, the accelerator models in model metadata, recognition and display in resource flavours, and the cluster-side
scheduling components. The four layers are not necessarily complete, and a layer that is missing should be treated as
missing.

| Vendor | Image accelerator type | Model metadata models | Accelerator label in flavours | Platform scheduling components |
| --- | --- | --- | --- | --- |
| [NVIDIA](/ecosystem/nvidia) | CUDA(Nvidia) | 12 | GPU, dedicated icon | Yes, one-step install |
| [Huawei (Ascend)](/ecosystem/huawei) | CANN(昇腾) | 5 | NPU, dedicated icon | Yes, one-step install |
| [Hygon (DCU)](/ecosystem/hygon) | DKT(海光) | Not registered | DCU, dedicated icon | None |
| [Alibaba Cloud (PPU)](/ecosystem/aliyun) | Not registered | Not registered | PPU, dedicated icon | None, cloud-side |
| [AMD (Instinct)](/ecosystem/amd) | ROCm(AMD) | 8 | Generic GPU, dedicated icon | None |
| [Cambricon (MLU)](/ecosystem/cambricon) | Neuware(寒武纪) | 4 | MLU, no icon | None |
| [Moore Threads](/ecosystem/moore-threads) | Musa(摩尔线程) | Not registered | Generic GPU, no icon | None |
| [MetaX](/ecosystem/metax) | MACA(沐曦) | Not registered | Generic GPU, no icon | None |
| [Biren Technology](/ecosystem/biren) | Not registered | Not registered | Generic GPU, no icon | None |
| [Iluvatar CoreX](/ecosystem/iluvatar) | CoreX(天数智芯) | Not registered | Generic GPU, no icon | None |
| [Kunlunxin](/ecosystem/kunlunxin) | Not registered | Not registered | Resource name matches no keyword; set the type by hand | None |

Each vendor's layer-by-layer breakdown, what is missing, and how to work around it lives on the "Platform Support"
page of its own partition.

## Scheduling stacks inside the platform

The platform bundles two complete hardware scheduling packages — **NVIDIA** (GPU Operator + Volcano + Volcano vGPU) and
**Ascend** (Ascend Device Plugin + NPU Exporter + Ascend-customized Volcano) — both installable in one step from
**Cluster Management → Operations → System Apps**.

No other vendor has a platform-side package today. For Hygon, AMD, Cambricon, Moore Threads, MetaX, Biren, Iluvatar
CoreX, and Kunlunxin, install the cluster-side components by hand following the matching partition. The Alibaba Cloud
PPU add-ons are installed from the Alibaba Cloud console rather than System Apps, and the platform only handles resource
recognition and scheduling.

One cluster keeps a single scheduling stack. Do not install both.

In-card splitting is a separate matter and not part of these packages: the NVIDIA package bundles a device plugin from
the HAMi family (`volcano-vgpu-device-plugin`) that can hand one card to several workloads. For the other eight
vendors the platform offers no in-card splitting, and a full HAMi has to be installed by hand. The trade-off between
the two is under [HAMi](/ecosystem/hami).

## Common installation order

Whatever the vendor, the landing order follows the same rule: **let the host see the card first, then let the cluster see
the card**.

1. **Driver and firmware**, on every machine that has a card. Afterwards the host can use the card, but the cluster still
   does not know about it.
2. **Container runtime extension**, also on every machine that has a card. This lets containers see the card too.
3. **Monitoring exporter**, cluster-wide. It exposes temperature, utilisation, memory, and other metrics for the platform
   to scrape.
4. **Device plugin**, cluster-wide. It registers the card as a schedulable Kubernetes resource; only now does the cluster
   actually see it.
5. **Scheduler and node status components**, cluster-wide and optional. Job queuing, fault rescheduling, and resumable
   training depend on them.

:::warning Do not reverse the order
The device plugin checks at startup whether the container runtime extension is installed and restarted. Install the runtime
first, the plugin second. Reverse it and the plugin usually needs a reinstall or restart before it can recognise the card.
:::

## Where to start

- Connecting an Ascend machine for the first time: start with [Huawei (Ascend)](/ecosystem/huawei) and follow the order inside.
- Connecting a Hygon machine for the first time: see [Hygon (DCU)](/ecosystem/hygon).
- Connecting an NVIDIA machine for the first time: see [NVIDIA (GPU)](/ecosystem/nvidia); the cluster-side components install in one step from the platform.
- Connecting an AMD machine for the first time: see [AMD (Instinct / ROCm)](/ecosystem/amd); the container toolkit goes through the CDI route.
- Connecting a Cambricon machine for the first time: see [Cambricon (MLU)](/ecosystem/cambricon); you build the device plugin image yourself.
- Other domestic accelerators: find the matching partition under Related below.
- Running PPU on Alibaba Cloud for the first time: see [Alibaba Cloud (PPU)](/ecosystem/aliyun), node pool first.
- Sharing one card among several workloads: see [HAMi](/ecosystem/hami), starting with how the built-in route differs from a full HAMi.
- Filling in one component or troubleshooting: jump straight to the page you need.

## Related

- [Huawei (Ascend)](/ecosystem/huawei)
- [Hygon (DCU)](/ecosystem/hygon)
- [NVIDIA (GPU)](/ecosystem/nvidia)
- [Alibaba Cloud (PPU)](/ecosystem/aliyun)
- [AMD (Instinct / ROCm)](/ecosystem/amd)
- [Cambricon (MLU)](/ecosystem/cambricon)
- [Moore Threads](/ecosystem/moore-threads)
- [MetaX](/ecosystem/metax)
- [Biren Technology](/ecosystem/biren)
- [Iluvatar CoreX](/ecosystem/iluvatar)
- [Kunlunxin](/ecosystem/kunlunxin)
- [HAMi](/ecosystem/hami)
- [Open source communities](/ecosystem/open-source)
