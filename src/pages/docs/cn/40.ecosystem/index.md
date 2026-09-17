---
title: 生态文档
updated: '2026-09-17'
author: Rune Docs Team
description: 交付与运维视角的硬件生态导航：各家加速卡要装什么、按什么顺序装、平台已经适配到什么程度。
tags:
  - ecosystem
  - overview
---

# 生态文档

这一章写给交付工程师和运维工程师：手上有一台（或一批）插了加速卡的服务器，要把它接进平台集群，
需要知道装哪些组件、按什么顺序装、装完怎么确认。

普通用户不用看这一章。在页面上创建推理服务、跑微调任务的人，只要能选到卡就行，不需要关心卡是怎么接进来的。

判断标准只有一条：**机器上插着卡 → 宿主机装好驱动和运行时 → 集群里有组件把卡注册成可调度资源**。
三层都对齐，平台页面里才选得到这张卡；缺哪一层都不行。

各家的差别不在前两层，而在第三层的组件由谁提供。按这个分成四条通道，先看通道再看厂商，比逐个猜快得多。

## 先认通道

| 通道 | 厂商 | 集群组件从哪来 | 平台侧一键装 |
| --- | --- | --- | --- |
| 平台内置组件包 | [英伟达（NVIDIA GPU）](/ecosystem/nvidia)、[华为（昇腾 Ascend）](/ecosystem/huawei) | 平台的「系统应用」里 | 有 |
| 手工装厂商组件 | [海光（DCU）](/ecosystem/hygon)、[AMD（Instinct / ROCm）](/ecosystem/amd)、[寒武纪（Cambricon MLU）](/ecosystem/cambricon)、[摩尔线程（Moore Threads）](/ecosystem/moore-threads)、[沐曦（MetaX 曦云）](/ecosystem/metax)、[壁仞科技（Biren）](/ecosystem/biren)、[天数智芯（Iluvatar CoreX）](/ecosystem/iluvatar)、[昆仑芯（Kunlunxin）](/ecosystem/kunlunxin) | 厂商官方仓库，或随交付包发放 | 没有 |
| 云上节点池 | [阿里云（PPU）](/ecosystem/aliyun) | 云厂商控制台 | 没有（云侧组件） |
| 开源底座 | [其他开源社区](/ecosystem/open-source) | 按需，多数集群已有 | 多数已内置 |

第一组的组件由平台维护，跟着平台版本走；第二组的组件由厂商提供，版本、装法、限制都以厂商文档为准，
本分区的页面负责把它们和平台的实际情况对上。

这四条分的是「卡的组件从哪来」。还有一层不在这四条里：把一张卡切给多个任务的能力。这一层由
[HAMi（异构算力虚拟化）](/ecosystem/hami) 这类中间件提供，可以和上面任何一条叠加。
平台上目前只有它的一个组件，就是 NVIDIA 调度组件里带的 Volcano vGPU 设备插件。

## 平台已经适配到什么程度

「适配」在平台上是分层的，四处代码各管一件事：镜像登记时的加速器类型、模型元数据里的型号、
资源规格里的识别与展示、集群里的调度组件。这四层不一定是齐的，查到某一层没有就按没有处理。

| 厂商 | 镜像加速器类型 | 模型元数据型号 | 规格里的加速卡标签 | 平台调度组件 |
| --- | --- | --- | --- | --- |
| [英伟达（NVIDIA）](/ecosystem/nvidia) | CUDA(Nvidia) | 12 个 | GPU，有专属图标 | 有，一键装 |
| [华为（昇腾）](/ecosystem/huawei) | CANN(昇腾) | 5 个 | NPU，有专属图标 | 有，一键装 |
| [海光（DCU）](/ecosystem/hygon) | DKT(海光) | 未登记 | DCU，有专属图标 | 没有 |
| [阿里云（PPU）](/ecosystem/aliyun) | 未登记 | 未登记 | PPU，有专属图标 | 没有，在云侧 |
| [AMD（Instinct）](/ecosystem/amd) | ROCm(AMD) | 8 个 | 走通用 GPU，有专属图标 | 没有 |
| [寒武纪（Cambricon）](/ecosystem/cambricon) | Neuware(寒武纪) | 4 个 | MLU，无图标 | 没有 |
| [摩尔线程](/ecosystem/moore-threads) | Musa(摩尔线程) | 未登记 | 走通用 GPU，无图标 | 没有 |
| [沐曦（MetaX）](/ecosystem/metax) | MACA(沐曦) | 未登记 | 走通用 GPU，无图标 | 没有 |
| [壁仞科技](/ecosystem/biren) | 未登记 | 未登记 | 走通用 GPU，无图标 | 没有 |
| [天数智芯](/ecosystem/iluvatar) | CoreX(天数智芯) | 未登记 | 走通用 GPU，无图标 | 没有 |
| [昆仑芯](/ecosystem/kunlunxin) | 未登记 | 未登记 | 资源名不含识别关键词，要手填类型 | 没有 |

每家的逐层核对、缺哪几件、怎么补，都写在各自分区的「平台适配现状」页里。

## 平台里的调度组件

平台内置两套成套的硬件调度组件：**NVIDIA**（GPU Operator + Volcano + Volcano vGPU）与
**昇腾**（Ascend Device Plugin + NPU Exporter + 昇腾定制 Volcano），都能在
**集群管理 → 运维管理 → 系统应用**里一键安装。

其余厂商的平台组件目前都没有。海光、AMD、寒武纪、摩尔线程、沐曦、壁仞、天数智芯、昆仑芯这八家的集群侧组件，
按各自分区的步骤手工装；阿里云 PPU 的 ACK 组件在阿里云控制台安装，不在平台的系统应用里，
平台侧只负责识别资源和调度。

同一个集群只保留一套调度组件，不要混装。

卡内切分是另一件事，不在这个组件包里：NVIDIA 那套调度组件里带了一个 HAMi 家族的设备插件
（`volcano-vgpu-device-plugin`），能把一张卡按份额分给多个任务；其余八家的卡内切分平台都不提供，
要走完整的 HAMi 得手工装。两者的取舍见 [HAMi（异构算力虚拟化）](/ecosystem/hami)。

## 通用安装顺序

不管哪家硬件，落地顺序都遵守同一条规律：**先让宿主机认卡，再让集群认卡**。

1. **装驱动与固件**。在每台有卡的机器上做。装完宿主机自己能用卡，但集群还不知道。
2. **装容器运行时增强**。同样在每台有卡的机器上做，让容器里也能看到卡。
3. **装监控导出器**。集群级，把温度、利用率、显存这些指标暴露出来，供平台监控采集。
4. **装设备插件**。集群级，把卡注册成 Kubernetes 可调度资源。做完这一步集群才看得见卡。
5. **装调度器与节点状态组件**。集群级，可选。多卡任务排队、故障重调度、断点续训这类能力靠它。

:::warning 顺序不能倒
设备插件启动时会检查容器运行时增强是否装好并重启过。先装运行时、再装设备插件；
顺序反了，插件往往要重装或重启才能识别到卡。
:::

## 从哪一页开始

- 第一次接入昇腾机器：[华为（昇腾 Ascend）](/ecosystem/huawei)，按里面的顺序走。
- 第一次接入海光机器：[海光（DCU）](/ecosystem/hygon)。
- 第一次接入 NVIDIA 机器：[英伟达（NVIDIA GPU）](/ecosystem/nvidia)，集群侧组件在平台上一键装。
- 第一次接入 AMD 机器：[AMD（Instinct / ROCm）](/ecosystem/amd)，容器工具链要走 CDI 路线。
- 第一次接入寒武纪机器：[寒武纪（Cambricon MLU）](/ecosystem/cambricon)，设备插件要自己编镜像。
- 其它国产加速卡：从下面相关里找对应分区。
- 第一次在阿里云上用 PPU：[阿里云（PPU）](/ecosystem/aliyun)，先建节点池再接集群。
- 要让一张卡分给多个任务：[HAMi（异构算力虚拟化）](/ecosystem/hami)，先看清平台内置那条与完整 HAMi 的差别。
- 只想补某个组件，或者在排查问题：直接跳到对应组件页。

## 相关

- [华为（昇腾 Ascend）](/ecosystem/huawei)
- [海光（DCU）](/ecosystem/hygon)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)
- [阿里云（PPU）](/ecosystem/aliyun)
- [AMD（Instinct / ROCm）](/ecosystem/amd)
- [寒武纪（Cambricon MLU）](/ecosystem/cambricon)
- [摩尔线程（Moore Threads）](/ecosystem/moore-threads)
- [沐曦（MetaX 曦云）](/ecosystem/metax)
- [壁仞科技（Biren）](/ecosystem/biren)
- [天数智芯（Iluvatar CoreX）](/ecosystem/iluvatar)
- [昆仑芯（Kunlunxin）](/ecosystem/kunlunxin)
- [HAMi（异构算力虚拟化）](/ecosystem/hami)
- [其他开源社区](/ecosystem/open-source)
