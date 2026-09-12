---
title: MindCluster（集群调度组件）
updated: '2026-09-12'
author: Rune Docs Team
description: 昇腾集群侧组件总览：每个组件是干什么的、什么时候必须装、装完怎么确认，以及正确的安装顺序。
tags:
  - ecosystem
  - huawei
  - ascend
  - mindcluster
  - kubernetes
---

# MindCluster（集群调度组件）

MindCluster 是华为昇腾的**集群调度组件集合**，跑在 Kubernetes 上。它的作用是把宿主机上的 NPU
「翻译」成集群能调度、能监控、能故障恢复的资源。前面宿主机装好驱动之后，集群依然不知道有卡；
装上这一组组件，集群才真正看得见、用得上。

把集群想成一栋办公楼：驱动让机器「有电」，MindCluster 则是给每张卡装上门牌号、电表和报修按钮。

:::info 平台侧已有成套组件
平台内置了一套昇腾调度组件包，会把 **Ascend Device Plugin、NPU Exporter 和昇腾定制的 Volcano** 一起部署。
如果你是通过平台安装的，组件命名空间与镜像版本以该安装包为准；本目录讲的单个组件安装，用于需要单独补齐某个组件、
或排查问题时的场景。本页涉及的具体版本为 **MindCluster 26.0.0**。
:::

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

1. **获取软件包** —— 后面每一步都要用到里面的安装包或 YAML。
2. **Ascend Docker Runtime** —— 必须先装好并重启容器引擎。设备插件启动时会检查它是否存在，
   顺序反了插件需要重启甚至重装才能识别到卡。
3. **NPU Exporter** —— 只做监控采集，依赖宿主机驱动，但不参与资源注册，可以先装也可以后装。
4. **Ascend Device Plugin** —— 把卡注册进集群。这一步做完，集群才开始"看得见"卡。
5. **NodeD、Volcano** —— 依赖前置的注册结果。Volcano 的昇腾插件需要 Device Plugin 已经上报设备。

:::warning 驱动升级时的停机顺序
升级宿主机驱动前，先停业务，**再按相反顺序停组件**：先停 NodeD 与设备插件，再停 Exporter，最后才动驱动。
Exporter 和 Device Plugin 都会周期性调用驱动接口，带着它们升驱动容易踩坑。
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

## 相关

- [华为（昇腾 Ascend）](/ecosystem/huawei)
- [驱动与运行时](/ecosystem/huawei/driver-runtime)
- [获取软件包](/ecosystem/huawei/mindcluster/packages)
