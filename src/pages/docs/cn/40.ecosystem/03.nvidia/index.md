---
title: 英伟达（NVIDIA GPU）
updated: '2026-09-17'
author: Rune Docs Team
description: 把 NVIDIA GPU 服务器接入平台要按什么顺序装：宿主机驱动在前，GPU Operator 与 Volcano 在后。
tags:
  - ecosystem
  - nvidia
  - gpu
  - cuda
---

# 英伟达（NVIDIA GPU）

把装了 NVIDIA GPU 的服务器接进平台集群，内容和昇腾、海光两章一样分两段：先在宿主机上装驱动，让机器自己能用卡；
再在集群里装 GPU Operator 与 Volcano，让 Kubernetes 能调度这张卡，也能把一张卡切成多份给多个任务共用。

:::info 平台内置了 NVIDIA 调度组件包
平台内置一套 NVIDIA 调度组件：**GPU Operator + Volcano + Volcano vGPU**。在
**集群管理 → 运维管理 → 系统应用**里按集群硬件类型选择安装即可，不需要手工 apply 一堆 YAML。
本分区讲的是这套组件各自在做什么、装完怎么验证，以及需要单独补齐某个组件、或排查问题时的操作步骤。
:::

## 先分清几个词

| 名词 | 通俗解释 |
| --- | --- |
| GPU | 图形处理器：原本为图形渲染设计，因为擅长大量并行计算，现在主要用来算大模型的矩阵运算。 |
| 驱动 | 让操作系统能使用这张卡的基础软件。`nvidia-smi` 能看到卡，就说明驱动装好了。 |
| CUDA | NVIDIA 的并行计算平台与编程模型（Compute Unified Device Architecture）：向上给 PyTorch 等框架提供接口，向下驱动 GPU。相当于昇腾那边的 CANN。 |
| 容器工具链 | `nvidia-container-toolkit`：让容器里也能看到并使用 GPU。相当于昇腾那边的 Ascend Docker Runtime。 |
| GPU Operator | NVIDIA 官方的集群侧组件包，把设备插件、容器工具链、监控导出器、节点标签等一批组件自动装齐。 |
| vGPU | 这里指 **Volcano vGPU**：把一张物理卡按份数切开，让多个任务共享一张卡（**不是** NVIDIA 商用的 vGPU 授权方案）。 |

## 分页

| 页面 | 解决什么问题 |
| --- | --- |
| [驱动与容器运行时](/ecosystem/nvidia/driver-runtime) | 在宿主机上装 NVIDIA 驱动与容器工具链，并用 `nvidia-smi` 验证 |
| [GPU Operator（集群侧组件）](/ecosystem/nvidia/gpu-operator) | 集群侧组件的总览、安装顺序与逐组件说明 |
| [Volcano 与 vGPU 切分](/ecosystem/nvidia/volcano-vgpu) | 让多个任务共用一张卡：怎么切、怎么申请、怎么限制 |
| [FAQ](/ecosystem/nvidia/faq) | 装完不能用时，按现象查原因和命令 |

## 按什么顺序装

顺序不建议调换，后一步依赖前一步的结果：

1. **宿主机驱动**：每台有卡的机器都要装。装完宿主机自己能用卡，但集群还不知道。
2. **容器工具链**：让容器里也能看到卡。用平台装 GPU Operator 时这一步会自动完成。
3. **GPU Operator**：装齐节点标签、设备插件、监控导出器，把卡注册成集群可调度的资源。
4. **Volcano**：让多卡任务成组调度、排队和公平共享；GPU Operator 的这套组件里已经带上。
5. **Volcano vGPU（按需）**：只有需要把一张卡分给多个任务时才装，随调度组件一起开启。

:::warning 顺序不能倒
设备插件启动时会检查容器工具链是否已经装好。先装工具链、再起设备插件；
顺序反了，插件往往要重启或重装才能识别到卡。
:::

## 和昇腾那章的差别

- **集群侧组件是一整包**。昇腾那边要按组件一个个装（Device Plugin、NPU Exporter、NodeD 分开部署），
  NVIDIA 这边由 GPU Operator 统一管理，安装时只需要给几个开关。
- **多了一个切分方案**。NVIDIA 侧支持 Volcano vGPU，把一张卡按份额切给多个任务。
  昇腾侧走的是整卡与设备插件方案，见[容器与编排](/ecosystem/open-source/container-orchestration)。

## 相关

- [生态文档首页](/ecosystem)
- [驱动与容器运行时](/ecosystem/nvidia/driver-runtime)
- [GPU Operator（集群侧组件）](/ecosystem/nvidia/gpu-operator)
- [华为（昇腾 Ascend）](/ecosystem/huawei)
- [海光（DCU）](/ecosystem/hygon)
