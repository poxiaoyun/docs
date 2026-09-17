---
title: 摩尔线程（Moore Threads）
updated: '2026-09-17'
author: Rune Docs Team
description: 摩尔线程全功能 GPU 接入平台要装哪些组件、平台侧已经识别到什么程度、还缺哪几件。
tags:
  - ecosystem
  - moore-threads
  - musa
---

# 摩尔线程（Moore Threads）

摩尔线程的卡在平台上没有一键安装入口。集群侧要自己装 MT GPU Operator，宿主机侧要自己装 MT Linux Driver 与 MT Container Toolkit，平台的「系统应用」里目前只有 NVIDIA 和昇腾两套。

平台对它的识别停在元数据这一层：镜像登记时能选到 `Musa(摩尔线程)`，模型元数据的 `hardware_backends` 里有 `musa`；型号、厂商图标、专属加速卡标签都还没有。

:::info 平台侧现状
逐项对照写在 [平台适配现状](/ecosystem/moore-threads/platform-support) 那一页。一句话概括：**元数据认得，集群组件要自己装，展示层缺图标与专属标签。**
:::

## 容易混的几个词

| 名词 | 说明 |
| --- | --- |
| MUSA | 摩尔线程软件栈的总名，相当于 NVIDIA 那边的 CUDA。编译器、算子库、框架适配都在这一套里 |
| MTT | 产品名前缀。MTT S5000、MTT S80 这类名字里的 MTT 就是它 |
| 全功能 GPU | 官方对自家产品的统称，**不按训练卡与推理卡二分** |
| MT Linux Driver | 宿主机的内核驱动，内核模块叫 `mtgpu`，包名 `sgpu-dkms` |
| MT Container Toolkit | 容器工具链，包名 `mt-container-toolkit`，让容器里也能看到卡 |
| MT GPU Operator | 集群侧的组件包，当前版本 v2.1.0，有 full 与 core 两种安装模式 |
| sGPU | 集群里的卡内切分方式，算力按时间片权重分，显存按 512MiB 为单位分，资源名是 `mthreads.com/sgpu-core` 与 `mthreads.com/sgpu-memory` |
| MT vGPU | 硬件路线的虚拟化，走宿主侧的 mdev / SR-IOV，类型名 `mtgpu-1101`。这条路给出的是设备节点，不是 Kubernetes 资源名 |

sGPU 的算力按时间片轮转、显存各自占住，像单核 CPU 上同时跑几个进程：时间被排开，内存谁都动不了谁的，但它不是物理隔离。

## 接入顺序

1. **内核驱动（`sgpu-dkms`）**：每台有卡的机器都装，装完 `mthreads-gmi` 能列出卡。
2. **容器工具链（`mt-container-toolkit`）**：同一批机器装，容器里才能拿到设备。
3. **集群侧组件（MT GPU Operator v2.1.0）**：把卡注册成 `mthreads.com/gpu`。组件不开源，包要向厂商获取。
4. **监控（`mt-dcgm` 与 `mt-dcgm-exporter`）**：要看卡的温度与利用率时再装。
5. **平台侧建规格与配额**：按节点上报的资源名建，然后拿一个任务验一遍。

前四步都在机器和集群上，第五步才动平台界面。顺序倒了设备插件认不到卡。

## 这一章有哪些页面

| 页面 | 讲什么 |
| --- | --- |
| [产品与软件栈](/ecosystem/moore-threads/products) | 在售型号、MUSA 各层组件、官方入口 |
| [驱动与容器运行时](/ecosystem/moore-threads/driver-runtime) | 宿主机装驱动与容器工具链、怎么验证 |
| [Kubernetes 组件](/ecosystem/moore-threads/k8s-components) | 组件清单、上报什么资源名、监控端口、sGPU 切分 |
| [平台适配现状](/ecosystem/moore-threads/platform-support) | 平台认到什么程度、缺哪几件、怎么补 |
| [FAQ](/ecosystem/moore-threads/faq) | 卡不认、容器里看不到卡、组件包下不到一类问题 |

## 相关

- [生态文档首页](/ecosystem)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)：同为 GPU 路线，组件分层可以对照着看
- [AMD（Instinct / ROCm）](/ecosystem/amd)：同样没有平台侧的一键安装入口
