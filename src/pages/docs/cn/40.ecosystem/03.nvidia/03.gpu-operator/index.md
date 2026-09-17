---
title: GPU Operator（集群侧组件）
updated: '2026-09-17'
author: Rune Docs Team
description: NVIDIA 集群侧组件总览：每个组件是干什么的、什么时候必须装、装完怎么确认，以及平台默认开了哪些开关。
tags:
  - ecosystem
  - nvidia
  - gpu-operator
  - kubernetes
---

# GPU Operator（集群侧组件）

GPU Operator 是 NVIDIA 官方的集群侧组件包，跑在 Kubernetes 上。它的作用是把宿主机上的 GPU 变成集群
能调度、能监控、能切分的资源。宿主机装好驱动之后集群依然不知道有卡；装上这一组组件，集群才看得见、用得上。

:::info 平台上是一整包装的
在 **集群管理 → 运维管理 → 系统应用**里选择 NVIDIA 调度组件，平台会一次性部署本节列出的这些组件，
不需要逐个 apply YAML。本目录讲的是每个组件在做什么、装完怎么看、出问题从哪查。
:::

## 开始之前

- GPU 节点已装好驱动，`nvidia-smi` 能看到卡。
- 集群已经装好容器运行时（Docker 或 containerd），并能正常调度 Pod。
- 集群已安装平台的 `apps.xiaoshiai.cn` 应用控制器（随平台初始化完成）。
- 需要监控数据时，集群里已装 Prometheus Operator（否则要关掉 ServiceMonitor 选项）。

## 组件总表

| 组件 | 作用 | 前置条件 | 装完怎么验证 |
| --- | --- | --- | --- |
| [NFD（节点特征发现）](/ecosystem/nvidia/gpu-operator/node-labels) | 探测节点上有哪些硬件特征，生成节点标签 | 无 | 节点上出现 `feature.node.kubernetes.io/*` 标签 |
| [GFD（GPU 特征发现）](/ecosystem/nvidia/gpu-operator/node-labels) | 把 GPU 的型号、显存、驱动版本写成节点标签 | NFD 已就绪、驱动已装 | 节点上出现 `nvidia.com/gpu.product` 等标签 |
| [容器工具链](/ecosystem/nvidia/driver-runtime) | 让容器里能看到 GPU | 驱动已装 | 设备插件能起来并发现卡 |
| [设备插件（k8s-device-plugin）](/ecosystem/nvidia/gpu-operator/device-plugin) | 把 GPU 注册成集群可调度资源 | 容器工具链已就绪 | 节点可分配资源里出现 `nvidia.com/gpu` |
| [DCGM Exporter](/ecosystem/nvidia/gpu-operator/dcgm-exporter) | 采集 GPU 指标供监控抓取 | 驱动已装、DCGM 镜像就绪 | `9400` 端口的 `/metrics` 有数据 |
| [MIG Manager](/ecosystem/nvidia/gpu-operator/mig-manager) | 按节点标签自动划分 MIG 实例 | 硬件支持 MIG；已声明切分策略 | 节点上出现 `nvidia.com/mig-*` 资源（仅声明过的节点） |
| Validator / Node Status Exporter | 安装后自检各个组件是否就位 | 无 | 校验 Pod 全部完成且无失败 |

## 为什么必须按这个顺序

组件之间有真实的先后依赖：

1. **NFD / GFD**：先把节点和卡的信息写成标签。设备插件与 MIG Manager 都靠标签决定自己管哪些节点。
2. **容器工具链**：让容器能拿到卡设备。设备插件启动时会检查它是否就位。
3. **设备插件**：把卡注册进集群。这一步做完，集群才开始看得见卡。
4. **DCGM Exporter**：只做监控采集，不参与资源注册，可以先装也可以后装。
5. **MIG Manager**：依赖前面的注册结果，只对声明了切分策略的节点生效。

## 平台默认开了哪些开关

下表是平台安装时的默认值，排障时对照它来看现在的行为是不是预期的：

| 配置项 | 平台默认值 | 含义 |
| --- | --- | --- |
| GPU Operator 版本 | `v23.6.0` | 组件包版本，命名空间 `gpu-operator` |
| 容器运行时 | `containerd` | 节点上用的是哪种运行时；集群用 Docker 时要改这一项 |
| 由 GPU Operator 安装驱动 | **关闭** | 默认复用节点上已经装好的驱动，避免动到宿主机内核模块 |
| 驱动版本（打开上面那项才生效） | `595` | 使用预编译驱动包，避免节点上现编内核模块 |
| DCGM Exporter | 开启 | 默认同时创建 ServiceMonitor，抓取间隔 `30s` |
| GPU Operator 自带的 vGPU 管理组件 | **关闭** | 见下方说明 |

### 被关掉的两个组件，以及为什么

GPU Operator 自带一套 vGPU 管理组件（`vgpu-manager` / `vgpu-device-manager`），
平台默认把这两个**关掉**，改用 [Volcano vGPU](/ecosystem/nvidia/volcano-vgpu)。

原因是这两套方案都会往 `libvgpu.so` 这个路径注入自己的共享库、并各自向 kubelet 注册设备，
同时开着会互相覆盖，表现为「卡能调度、但任务里看到的显存额度不对」。两套只能留一套。

:::warning 不要手工把这两个组件打开
如果你在平台之外直接改 GPU Operator 的 values 把 vGPU 组件打开，会和 Volcano vGPU 打架。
需要卡切分能力时，走[Volcano 与 vGPU 切分](/ecosystem/nvidia/volcano-vgpu)这条路径开启。
:::

## 相关

- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)
- [驱动与容器运行时](/ecosystem/nvidia/driver-runtime)
- [设备插件](/ecosystem/nvidia/gpu-operator/device-plugin)
- [Volcano 与 vGPU 切分](/ecosystem/nvidia/volcano-vgpu)
