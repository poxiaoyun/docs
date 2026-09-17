---
title: 生态文档
updated: '2026-09-17'
author: Rune Docs Team
description: 交付与运维视角的硬件生态导航：昇腾、海光、英伟达、阿里云 PPU、开源组件各要装什么、按什么顺序装、怎么确认装好了。
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

阿里云 PPU 是个例外，它的中间一层由云厂商负责，见下文。

## 五类生态分别要装什么

| 生态 | 覆盖的硬件 / 组件 | 你要装什么 | 安装顺序 |
| --- | --- | --- | --- |
| [华为（昇腾 Ascend）](/ecosystem/huawei) | Atlas 训练/推理服务器上的 Ascend NPU | 驱动与固件、容器运行时、NPU Exporter、Ascend Device Plugin、NodeD（可选配昇腾定制 Volcano） | 严格按从左到右顺序，见下 |
| [海光（DCU）](/ecosystem/hygon) | 海光 DCU 加速卡 | 驱动与运行时、DCU-Label-Node、DCU-Exporter、DCU-Device-Plugin | 严格按从左到右顺序 |
| [英伟达（NVIDIA GPU）](/ecosystem/nvidia) | NVIDIA 数据中心 GPU | 宿主机驱动、GPU Operator（含容器工具链、设备插件、DCGM Exporter）、Volcano（可选 vGPU 切分） | 驱动 → GPU Operator → Volcano |
| [阿里云（PPU）](/ecosystem/aliyun) | 阿里云灵骏节点上的真武 PPU | 灵骏节点池、ACK 侧的 ppu / rdma 设备插件（驱动与固件由云厂商负责） | 节点池 → 设备插件 → 调度策略 |
| [其他开源社区](/ecosystem/open-source) | Kubernetes、容器、推理框架、可观测、制品安全 | 按需安装，多数是集群已有的底座 | 按需 |

前四类里，前三类是自己机器上装，第四类是云上节点池接进来，操作对象完全不同，别互相套用法。

## 平台里的调度组件

平台内置两套成套的硬件调度组件：**NVIDIA**（GPU Operator + Volcano + Volcano vGPU）与
**昇腾**（Ascend Device Plugin + NPU Exporter + 昇腾定制 Volcano），都能在
**集群管理 → 运维管理 → 系统应用**里一键安装。

海光侧的平台组件目前还没有，需要按[海光（DCU）](/ecosystem/hygon)里的步骤手工装。
阿里云 PPU 的 ACK 组件在阿里云控制台安装，不在平台的系统应用里，平台侧只负责识别资源和调度。

同一个集群只保留一套调度组件，不要混装。

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

- 第一次接入昇腾机器：看[华为（昇腾 Ascend）](/ecosystem/huawei)，按里面的顺序走。
- 第一次接入海光机器：看[海光（DCU）](/ecosystem/hygon)。
- 第一次接入 NVIDIA 机器：看[英伟达（NVIDIA GPU）](/ecosystem/nvidia)，集群侧组件在平台上一键装。
- 第一次在阿里云上用 PPU：看[阿里云（PPU）](/ecosystem/aliyun)，先建节点池再接集群。
- 只想补某个组件，或者在排查问题：直接跳到对应组件页。

## 相关

- [华为（昇腾 Ascend）](/ecosystem/huawei)
- [海光（DCU）](/ecosystem/hygon)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)
- [阿里云（PPU）](/ecosystem/aliyun)
- [其他开源社区](/ecosystem/open-source)
