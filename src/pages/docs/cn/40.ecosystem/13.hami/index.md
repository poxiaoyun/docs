---
title: HAMi（异构算力虚拟化）
updated: '2026-09-17'
author: Rune Docs Team
description: HAMi 是什么、平台里已经有它的哪一部分、缺的部分怎么补，以及使用它切卡与使用平台内置切卡的区别。
tags:
  - ecosystem
  - hami
  - vgpu
  - kubernetes
---

# HAMi（异构算力虚拟化）

HAMi 全称 Heterogeneous AI Computing Virtualization Middleware，是跑在 Kubernetes 上的异构算力虚拟化中间件，
前身叫 `k8s-vGPU-scheduler`。它要解决的问题很直接：Kubernetes 原生的加速卡分配是一卡一 Pod，卡空着半张也分不出去；
HAMi 让多个任务共用同一张卡，显存和算力都能按份额申请。

项目 2024 年 8 月 21 日进入 CNCF Sandbox，2026 年 7 月 2 日晋升为 CNCF Incubating 项目，
CNCF 技术监督委员会全票通过。当前最新版本 `v2.10.0`，2026 年 8 月 21 日发布。

## 先分清平台里有什么

这一段是看懂 HAMi 与平台关系的关键：**平台里带了 HAMi 家族的一个组件，但没装完整的 HAMi**。

| 能力 | 平台里有没有 | 说明 |
| --- | --- | --- |
| NVIDIA 卡按份额共享 | 有 | 内置的 NVIDIA 调度组件（`scheduler-nvidia`）里带了 HAMi 的 `volcano-vgpu-device-plugin` `v1.11.1`，随组件一起下发 |
| 完整的 HAMi | 没有 | `hami-scheduler`（准入 Webhook 与调度扩展）、`hami-device-plugin`、容器内的 HAMi-Core、WebUI 都不在平台组件目录里 |
| 非 NVIDIA 卡的卡内切分 | 没有 | 平台内置的硬件调度组件只有昇腾与英伟达两套 |

两者的资源名和能力边界不一样，建规格前要看清楚走的是哪条。

| 项 | 平台内置的 Volcano vGPU | 完整的 HAMi |
| --- | --- | --- |
| 申请时写什么 | `volcano.sh/vgpu-number`、`volcano.sh/vgpu-memory`、`volcano.sh/vgpu-memory-percentage`、`volcano.sh/vgpu-cores` | `nvidia.com/gpu`、`nvidia.com/gpumem`、`nvidia.com/gpucores`、`nvidia.com/gpumem-percentage` |
| 谁来调度 | Volcano 的 `deviceshare` 插件 | HAMi 自己的调度扩展，与 `kube-scheduler` 并行 |
| 覆盖硬件 | 只覆盖 NVIDIA | 覆盖十余种加速器，见[支持的设备与资源名](/ecosystem/hami/device-matrix) |
| 切分粒度 | 按份额切，显存按折算因子计入 | NVIDIA 上显存 1 MiB 一档、算力 1% 一档 |

在 NVIDIA 卡上，这两条路只能走一条。HAMi 的设备插件和 NVIDIA GPU Operator 的设备插件都会向 kubelet 上报
`nvidia.com/gpu`，同一节点同时跑会撞车，而平台默认装的是 GPU Operator。详细对照见
[平台侧现状与接入路径](/ecosystem/hami/platform-support)。

:::warning 不要在同一个集群里混装
集群已经用平台的 NVIDIA 调度组件开了 vGPU，再装一套完整的 HAMi，两套设备插件会重复上报同一份资源。
要换路线，先把原先那套停掉再装。
:::

## 容易混的几个词

| 名词 | 说明 |
| --- | --- |
| HAMi | 项目名，也是整套装法的统称 |
| HAMi-Core | 容器内的资源控制库，NVIDIA 上是 `libvgpu.so`，负责显存与算力的实际限制 |
| `hami-scheduler` | HAMi 的调度组件，同时承担准入 Webhook 与调度扩展两个角色 |
| `hami-device-plugin` | 节点侧设备插件，把物理卡注册成可分配的设备并上报给 kubelet |
| vGPU | HAMi 对「一张卡分给多个任务」的叫法，逻辑划分，不增加物理资源 |
| SMLU | 寒武纪侧的动态切分模式名，HAMi 借用同一套资源名 |
| sGPU | 沐曦侧的分片叫法 |
| vXPU | 昆仑芯侧的分片叫法，HAMi 用 `kunlunxin.com/vxpu` 上报 |
| SVI | 壁仞的安全虚拟实例，HAMi 支持整卡与 SVI 两种形态 |

## 接入顺序

1. **宿主机**：装厂商驱动与容器工具链，容器里能看到卡。
2. **节点标签**：给要交给 HAMi 管的节点打标签，NVIDIA 默认认 `gpu=on`。
3. **厂商设备插件**：把卡注册成可调度资源，部分厂商这一步用 HAMi 侧提供的插件。
4. **HAMi 本体**：用 Helm 装 `hami-scheduler` 与对应厂商的设备插件，按厂商开关打开。
5. **平台侧建规格**：按 HAMi 上报的资源名建规格，并核对平台已内置的组件有没有占着同名资源。

前三步是宿主机与集群的事，第四步装的是 HAMi 自己，第五步才回到平台。顺序倒了设备插件认不到卡。

## 这一章有哪些页面

| 页面 | 讲什么 |
| --- | --- |
| [架构与调度链路](/ecosystem/hami/architecture) | 四个组件各干什么、调度怎么走、隔离怎么实现 |
| [安装与参数](/ecosystem/hami/install) | 前置条件、Helm 安装、设备参数、节点级配置、验证 |
| [支持的设备与资源名](/ecosystem/hami/device-matrix) | 官方支持矩阵、各厂商资源名与粒度、版本引入时间线 |
| [平台侧现状与接入路径](/ecosystem/hami/platform-support) | 平台里已有什么、缺什么、手工接入顺序、冲突点 |
| [申请与运维](/ecosystem/hami/usage) | 各厂商申请写法、注解、优先级、监控指标 |
| [FAQ](/ecosystem/hami/faq) | 切不出来、限制不生效、和厂商插件打架 |

## 相关

- [生态文档首页](/ecosystem)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)：平台内置的 Volcano vGPU 走在这里
- [容器与编排](/ecosystem/open-source/container-orchestration)：Volcano 与 Volcano vGPU 在开源组件总表里的位置
- [HAMi 上游项目](https://project-hami.io)：版本号、支持矩阵与部署说明的原始出处
