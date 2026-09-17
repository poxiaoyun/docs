---
title: 华为（昇腾 Ascend）
updated: '2026-09-17'
author: Rune Docs Team
description: 把昇腾 NPU 服务器接入平台要按什么顺序装：驱动与运行时在前，MindCluster 组件在后，附版本口径。
tags:
  - ecosystem
  - huawei
  - ascend
---

# 华为（昇腾 Ascend）

把一台装了昇腾 NPU 的服务器接进平台集群，要做的事分两段：先在宿主机上装驱动和运行时，让机器自己能用卡；
再在集群里装 MindCluster 组件，让 Kubernetes 能调度这张卡。

## 先分清两个词

| 名词 | 通俗解释 |
| --- | --- |
| NPU | 神经网络处理器（Neural Processing Unit）：专为大模型里的张量运算设计的加速卡。它和通用 GPU 都做并行计算，区别在定位——NPU 把矩阵乘法这类张量运算做得更省电，但只擅长这一类活。 |
| CANN | 昇腾的异构计算软件栈（Compute Architecture for Neural Networks）：向上给 PyTorch 等框架提供接口，向下驱动 NPU。相当于显卡的「驱动加运行库」那一层，所以要在驱动验证通过之后才装。 |

:::info 动手前先定三件事
**硬件型号**、**驱动/运行时版本**、**框架版本**。这三者必须配套，后面所有排障和兼容性判断都依赖它们。
查不到依据的版本号不要凭印象填，一律以随版本发布的安装包和官方安装指南为准。
:::

## 版本口径

本分区以 **MindCluster 26.0.0** 为准，这是与平台组件包配套的版本。上游分支更新较快，
**升级前先确认平台的组件包是否已经跟进**，不要只把其中一两个组件单独升上去：
这一组组件之间有版本配套要求，混用会出现「设备插件认不到卡」「调度器加载不上 NPU 插件」这类问题。

| 组件 | 本分区口径 | 说明 |
| --- | --- | --- |
| Ascend Device Plugin / NPU Exporter | 26.0.0 | 镜像标签为 `v26.0.0` |
| 昇腾定制 Volcano | 1.9.0（镜像标签 `v1.9.0-v26.0.0`） | 调度器与控制器必须带昇腾插件，不能换上游同标签镜像 |
| 宿主机驱动与固件 | 以随 NPU 型号发布的安装包为准 | 与 NPU 型号、操作系统内核配套 |
| CANN | 与驱动同一发布批次 | 驱动验证通过后再装 |

驱动与 MindCluster 的版本组合，最终以随发布包提供的组合为准。本分区列出的版本号用来说明口径，
不用来选择发行版。

## 按什么顺序装

1. **驱动与固件**：每台有卡的机器都要装，装完宿主机能识别 NPU。
2. **CANN 等运行时软件包**：驱动验证通过后再装，业务镜像和框架依赖它。
3. **MindCluster 集群调度组件**：在集群里装，按「软件包 → 容器运行时 → 监控导出器 → 设备插件 → 节点状态组件」的顺序。

## 平台侧怎么装

平台内置了一套昇腾调度组件包，在 **集群管理 → 运维管理 → 系统应用**里按集群硬件类型选择安装，
会一次性部署 **Ascend Device Plugin、NPU Exporter 和昇腾定制 Volcano**。
但它**不含宿主机侧的组件**：驱动、固件与 Ascend Docker Runtime 仍然要在每台 NPU 节点上手工装。
两者装了哪些、没装哪些，以及各参数的默认值，见 [MindCluster（集群调度组件）](/ecosystem/huawei/mindcluster)。

## 看哪一页

| 页面 | 解决什么问题 |
| --- | --- |
| [驱动与运行时](/ecosystem/huawei/driver-runtime) | 在宿主机上装 NPU 驱动与固件，并用 `npu-smi info` 验证 |
| [MindCluster（集群调度组件）](/ecosystem/huawei/mindcluster) | 集群侧组件的总览、安装顺序、平台装了哪些与逐组件说明 |

## 相关

- [生态文档首页](/ecosystem)
- [驱动与运行时](/ecosystem/huawei/driver-runtime)
- [MindCluster（集群调度组件）](/ecosystem/huawei/mindcluster)
