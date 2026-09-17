---
title: MindCluster（集群调度组件）
updated: '2026-09-17'
author: Rune Docs Team
description: 昇腾集群侧组件总览：平台装了哪些、没装哪些、各参数默认值，以及正确的安装顺序。
tags:
  - ecosystem
  - huawei
  - ascend
  - mindcluster
  - kubernetes
---

# MindCluster（集群调度组件）

MindCluster 是华为昇腾的集群调度组件集合，跑在 Kubernetes 上，作用是把宿主机上的 NPU 变成集群能调度、
能监控、能故障恢复的资源。宿主机装好驱动之后，集群依然不知道有卡；装上这一组组件，集群才看得见、用得上。

:::info 平台侧已有成套组件
平台内置了一套昇腾调度组件包，会把 **Ascend Device Plugin、NPU Exporter 和昇腾定制的 Volcano** 一起部署。
如果你是通过平台安装的，组件命名空间与镜像版本以该安装包为准；本目录讲的单个组件安装，用于需要单独补齐某个组件、
或排查问题时的场景。本页涉及的具体版本为 **MindCluster 26.0.0**。
:::

## 开始之前

- NPU 节点已装好与硬件匹配的驱动，并能通过 `npu-smi info` 看到卡。
- 节点上存在 `/usr/local/Ascend/driver` 目录。
- 集群已经装好容器运行时（Docker 或 containerd），并能正常调度 Pod。
- 需要给 NPU 节点打上标签（设备插件等组件靠它选择节点）：

  ```bash
  kubectl label node <npu-node> accelerator=huawei-Ascend910
  ```

- 部署昇腾定制 Volcano 时，调度器与控制器默认运行在管理节点，管理节点需要打上标签：

  ```bash
  kubectl label node <management-node> masterselector=dls-master-node
  ```

## 平台装了哪些、没装哪些

| 组件 | 平台组件包 | 说明 |
| --- | --- | --- |
| [Ascend Device Plugin](/ecosystem/huawei/mindcluster/ascend-device-plugin) | **装** | 把 NPU 注册成集群资源 |
| [NPU Exporter](/ecosystem/huawei/mindcluster/npu-exporter) | **装** | 指标采集，默认建 ServiceMonitor |
| Volcano（昇腾定制） | **装** | 调度器、控制器与 Admission 一并部署 |
| [Ascend Docker Runtime](/ecosystem/huawei/mindcluster/ascend-docker-runtime) | 不装 | 属于宿主机侧，要在每台 NPU 节点上手工装 |
| NodeD | 不装 | 节点与卡的故障上报；需要时按本目录单独部署 |
| ClusterD（含 ClusterInfoManager） | 不装 | 见下 |

### 「没装 ClusterD」意味着什么

ClusterD 是 MindCluster 里负责**集群信息管理**的组件。断点续训的故障重调度、动态 vNPU 这类能力依赖它，
而平台的组件包没有部署它，并且把调度器的 `useClusterInfoManager` 参数设成了 `false`。

影响很直接：**依赖集群信息管理器的能力默认不可用**。作为交换，平台打开了两个自维护开关：

| 参数 | 默认值 | 作用 |
| --- | --- | --- |
| `useClusterInfoManager` | `false` | 不接集群信息管理器，调度器自己管 |
| `selfMaintainAvailableCard` | `true` | 卡出现故障时由调度器自行剔除，不等外部上报 |
| `forceEnqueue` | `true` | 资源暂时不够时先把任务留在队列里等，而不是直接失败 |

确实需要 ClusterD 提供的能力时，要单独部署它并接进 Volcano，并且**保证所有 MindCluster 组件版本配套**。

## 组件总表

| 组件 | 作用 | 前置条件 | 验证方法 |
| --- | --- | --- | --- |
| [获取软件包](/ecosystem/huawei/mindcluster/packages) | 拿到各组件的二进制、镜像与 YAML | 无 | 签名校验通过、解压目录完整 |
| [Ascend Docker Runtime](/ecosystem/huawei/mindcluster/ascend-docker-runtime) | 让容器里也能看到 NPU | 宿主机已装驱动；容器引擎已装 | 安装脚本 `--check` 通过；重启引擎后设备插件能正常识别 |
| [NPU Exporter](/ecosystem/huawei/mindcluster/npu-exporter) | 采集 NPU 指标，供监控系统抓取 | 宿主机已装驱动；镜像已就绪 | `npu-exporter` 的 Pod 为 `Running`；`8082` 端口的 `/metrics` 有数据 |
| [Ascend Device Plugin](/ecosystem/huawei/mindcluster/ascend-device-plugin) | 把 NPU 注册成 K8s 可调度资源 | Ascend Docker Runtime 已装并重启 | 节点可分配资源里出现 `huawei.com/Ascend910` |
| [NodeD](/ecosystem/huawei/mindcluster/noded) | 上报节点与卡的故障状态 | 驱动已装；与设备插件版本配套 | `noded` 的 Pod 为 `Running`；故障能被上报 |
| Volcano（昇腾定制） | 多卡任务排队与调度 | Device Plugin 已装 | `volcano-system` 下的调度器与控制器 Pod 为 `Running` |

## 为什么必须按这个顺序

组件之间有真实的先后依赖，不能随意调换：

1. **获取软件包**：后面每一步都要用到里面的安装包或 YAML。
2. **Ascend Docker Runtime**：必须先装好并重启容器引擎。设备插件启动时会检查它是否存在，
   顺序反了插件需要重启甚至重装才能识别到卡。
3. **NPU Exporter**：只做监控采集，依赖宿主机驱动，但不参与资源注册，可以先装也可以后装。
4. **Ascend Device Plugin**：把卡注册进集群。这一步做完，集群才开始看得见卡。
5. **NodeD、Volcano**：依赖前置的注册结果。Volcano 的昇腾插件需要 Device Plugin 已经上报设备。

:::warning 驱动升级时的停机顺序
升级宿主机驱动前，先停业务，再按相反顺序停组件：先停 NodeD 与设备插件，再停 Exporter，最后才动驱动。
Exporter 和 Device Plugin 都会周期性调用驱动接口，带着它们升驱动容易踩坑。
:::

## 平台默认参数

通过平台安装时，这几个值已经设好，排障时对照它来看现在的行为是不是预期的：

| 位置 | 参数 | 默认值 | 作用 |
| --- | --- | --- | --- |
| 设备插件 | 节点标签选择器 | `accelerator=huawei-Ascend910` | 决定哪些节点上跑设备插件 |
| 设备插件 | `volcanoType` | `true` | 以 Volcano 模式上报，多卡任务成组调度需要 |
| 设备插件 | `presetVirtualDevice` | `true` | 静态虚拟化：按预切分的 vNPU 规格上报 |
| 设备插件 | `listWatchPeriod` | `5` | 设备信息刷新周期（秒） |
| NPU Exporter | 指标端口 | `8082` | `/metrics` 的端口 |
| NPU Exporter | 采集间隔 | `5` | 指标刷新周期（秒） |
| NPU Exporter | ServiceMonitor | 开启（`10s`） | 由 Prometheus Operator 自动抓取 |
| Volcano | 版本 | `1.9.0` | 昇腾配套标签 `v1.9.0-v26.0.0` |
| Volcano | 调度器落点 | `masterselector=dls-master-node` | 调度器与管理节点跑在打了该标签的机器上 |

## 相关

- [华为（昇腾 Ascend）](/ecosystem/huawei)
- [驱动与运行时](/ecosystem/huawei/driver-runtime)
- [获取软件包](/ecosystem/huawei/mindcluster/packages)
