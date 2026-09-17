---
title: AMD（Instinct / ROCm）
updated: '2026-09-17'
author: Rune Docs Team
description: AMD Instinct 加速卡接入平台要装哪些组件、平台侧已经识别到什么程度、还缺哪几件。
tags:
  - ecosystem
  - amd
  - rocm
  - kubernetes
---

# AMD（Instinct / ROCm）

AMD 的接入路径和 NVIDIA 基本同构：宿主机装内核驱动，容器侧装运行时工具链，集群里由设备插件把卡注册成可调度资源。
差别落在第三层：平台没有内置 AMD 的调度组件包，集群侧要按 AMD 官方的 GPU Operator 手工装。

:::info 平台侧现状
AMD 在平台上是「认了一半」：镜像的加速器类型、模型元数据里的型号、规格页的厂商图标都已经具备，
但**没有一键安装的调度组件**，也没有 AMD 专属的加速卡标签。逐项对照见
[平台适配现状](/ecosystem/amd/platform-support)。
:::

## 容易混的几个词

| 名词 | 说明 |
| --- | --- |
| Instinct | AMD 的数据中心加速卡产品线，型号以 MI 开头（MI300X、MI350X 等） |
| ROCm | AMD 的开放计算软件栈，相当于 NVIDIA 那边的 CUDA。驱动、算子库、编译器、框架适配都在这一套里 |
| HIP | ROCm 的编程模型，语法接近 CUDA。代码迁移工具叫 HIPIFY |
| 计算分区 | 把一张卡按物理方式拆成几份给不同任务用，模式名形如 SPX / DPX / QPX / CPX |
| CDI | 容器设备接口。容器运行时从宿主机读设备规格的标准做法，AMD 用它把 GPU 注入容器 |

## 接入顺序

1. **内核驱动（amdgpu）**：在每台有卡的机器上装，装完 `rocminfo` 能看到卡。
2. **ROCm 用户态**：同一批机器上装，`amd-smi` 能报出版本。
3. **容器运行时工具链**（`amd-container-toolkit`）：让容器里也能看到卡。集群跑 containerd 时走 CDI 路线。
4. **集群侧组件**（AMD GPU Operator 里的设备插件、节点标签、监控导出器）：把卡变成可调度资源。

前两步是宿主机的事，第四步是集群的事。顺序倒了设备插件认不到卡。

## 这一章有哪些页面

| 页面 | 讲什么 |
| --- | --- |
| [产品与软件栈](/ecosystem/amd/products) | 在售型号、ROCm 各层组件、官方入口 |
| [驱动与容器运行时](/ecosystem/amd/driver-runtime) | 宿主机装驱动、装容器工具链、怎么验证 |
| [Kubernetes 组件](/ecosystem/amd/k8s-components) | 设备插件上报什么资源名、监控端口、分区模式 |
| [平台适配现状](/ecosystem/amd/platform-support) | 平台已经认到什么程度、缺哪几件、怎么补 |
| [FAQ](/ecosystem/amd/faq) | 卡不认、容器里看不到卡一类问题 |

## 相关

- [生态文档首页](/ecosystem)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)：同为 GPU 路线，组件分层可以对照着看
- [海光（DCU）](/ecosystem/hygon)：同样没有平台侧的一键安装入口
