---
title: MindCluster（集群调度组件）
updated: '2025-12-14'
author: Rune Docs Team
description: 基于 MindCluster 7.2.RC1 的集群调度组件安装准备与关键组件部署要点。
tags:
  - ecosystem
  - huawei
  - ascend
  - mindcluster
  - kubernetes
---

## 概述

MindCluster 集群调度组件围绕 Kubernetes 运行，常见会涉及：

- 容器运行时适配（Docker / containerd）
- 资源监测（NPU Exporter）
- 设备注册与调度（Ascend Device Plugin，可选结合 Volcano）
- 节点状态/故障上报（NodeD）

本目录按“交付视角”整理了安装前准备与关键组件部署步骤，便于落地。

:::tip
同一套组件在不同运行时（Docker/containerd）以及不同硬件形态（训练/推理/开发套件）下，YAML 与参数可能不同。建议先明确：运行时类型、K8s 版本、节点类型，再按需选择 YAML。
:::
