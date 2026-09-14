---
title: 华为（昇腾 Ascend）
updated: '2026-09-14'
author: Rune Docs Team
description: 把昇腾 NPU 服务器接入平台要按什么顺序装：驱动与运行时在前，MindCluster 组件在后。
tags:
  - ecosystem
  - huawei
  - ascend
---

# 华为（昇腾 Ascend）

这一章讲怎么把一台装了昇腾 NPU 的服务器接进平台集群。内容分两段：**第一段在宿主机上装驱动和运行时**，
让机器自己能用卡；**第二段在集群里装 MindCluster 组件**，让 Kubernetes 能调度这张卡。

## 先分清两个词

| 名词 | 通俗解释 |
| --- | --- |
| NPU | 神经网络处理器（Neural Processing Unit）：专为大模型里的张量运算设计的加速卡。它和通用 GPU 都做并行计算，区别在定位——NPU 把矩阵乘法这类张量运算做得更省电，但只擅长这一类活。可以理解成一台专门算矩阵的「计算器」。 |
| CANN | 昇腾的异构计算软件栈（Compute Architecture for Neural Networks）：向上给 PyTorch 等框架提供接口，向下驱动 NPU。相当于显卡的「驱动加运行库」那一层，所以要在驱动验证通过之后才装。 |

:::info 动手前先定三件事
**硬件型号**、**驱动/运行时版本**、**框架版本**。这三者必须配套，后面所有排障和兼容性判断都依赖它们。
查不到依据的版本号不要凭印象填，一律以随版本发布的安装包和官方安装指南为准。
:::

## 按什么顺序装

1. **驱动与固件** —— 每台有卡的机器都要装，装完宿主机能识别 NPU。
2. **CANN 等运行时软件包** —— 驱动验证通过后再装，业务镜像和框架依赖它。
3. **MindCluster 集群调度组件** —— 在集群里装，按"软件包 → 容器运行时 → 监控导出器 → 设备插件 → 节点状态组件"的顺序。

## 这一章有哪些页面

| 页面 | 解决什么问题 |
| --- | --- |
| [驱动与运行时](/ecosystem/huawei/driver-runtime) | 在宿主机上装 NPU 驱动与固件，并用 `npu-smi info` 验证 |
| [MindCluster（集群调度组件）](/ecosystem/huawei/mindcluster) | 集群侧组件的总览、安装顺序与逐组件说明 |

## 相关

- [生态文档首页](/ecosystem)
- [驱动与运行时](/ecosystem/huawei/driver-runtime)
- [MindCluster（集群调度组件）](/ecosystem/huawei/mindcluster)
