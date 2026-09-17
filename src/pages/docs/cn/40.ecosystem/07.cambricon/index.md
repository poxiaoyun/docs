---
title: 寒武纪（Cambricon MLU）
updated: '2026-09-17'
author: Rune Docs Team
description: 寒武纪 MLU 加速卡接入平台的组件分层、平台已经识别到什么程度、还缺哪几件，以及集群侧上报的资源名。
tags:
  - ecosystem
  - cambricon
  - mlu
---

# 寒武纪（Cambricon MLU）

寒武纪在平台上的处境和 AMD、海光一致：没有一键安装的集群组件。平台的「系统应用」里只内置了 NVIDIA 与昇腾两套硬件调度包，MLU 的集群侧组件要照官方开源仓库手工装。

宿主机这层照常走三步：装 Neuware 驱动，装容器运行时工具链，容器里能看到 `/dev/cambricon_devX` 这类设备节点。集群这层靠官方设备插件把卡注册成 `cambricon.com/mlu`。

:::info 平台侧现状
镜像登记时的加速器类型、模型元数据里的型号、规格标签上的 `MLU` 字样都已经具备，
但**没有一键安装的调度组件**，也没有寒武纪专属图标。逐项对照见
[平台适配现状](/ecosystem/cambricon/platform-support)。
:::

## 容易混的几个词

| 名词 | 说明 |
| --- | --- |
| MLU | 寒武纪的加速卡产品线名，平台规格标签上显示的就是这三个字母 |
| Neuware | 寒武纪整套软件栈的总称。驱动、工具链、算子库、框架适配都归在这一套下面 |
| CNToolkit | 工具链安装包。CNCC 编译器、CNAS、CNGDB、CNPerf、CNDev/CNDrv、CNRT 都在里面 |
| BANG C / BANGPy | 写 MLU 算子用的编程语言，位置相当于 CUDA 里写 kernel 那一层 |
| CNNL / CNCL | 算子库与通信库。多卡训练走 CNCL，单卡算子走 CNNL |
| MagicMind | 推理引擎，把模型编译成离线文件再跑 |
| torch_mlu | PyTorch 的 MLU 适配包，装了它 PyTorch 才认 MLU 设备 |
| vMLU / sMLU / MIM | 一张卡给多个任务用的几种不同口径，粒度和隔离程度都不一样，见 [Kubernetes 组件](/ecosystem/cambricon/k8s-components) |

## 接入顺序

1. **Neuware 驱动**：在每台有卡的机器上装，装完出现 `/dev/cambricon_devX`、`/dev/cambricon_ctl` 这类设备节点。
2. **容器运行时工具链**：同一批机器上装，让容器里也能看到这些设备节点。
3. **集群侧设备插件**：用官方仓库 `Cambricon/cambricon-k8s-device-plugin` 把卡注册成 `cambricon.com/mlu`。注意官方没有预编译镜像，要自己编。
4. **监控组件**：部署 `mlu-exporter`，把卡的利用率与温度接到 Prometheus。
5. **平台侧**：按资源名建规格与配额，再提交一个申请 1 张卡的任务验一遍。

前三步是有依赖的，顺序倒了设备插件认不到卡。第四、五步可以按需补，不影响卡能不能被调度。

## 这一章有哪些页面

| 页面 | 讲什么 |
| --- | --- |
| [产品与软件栈](/ecosystem/cambricon/products) | 在售型号、Neuware 各层组件、官方入口 |
| [驱动与容器运行时](/ecosystem/cambricon/driver-runtime) | 宿主机装驱动、装容器工具链、怎么验证 |
| [Kubernetes 组件](/ecosystem/cambricon/k8s-components) | 设备插件上报什么资源名、监控端口、卡怎么切 |
| [平台适配现状](/ecosystem/cambricon/platform-support) | 平台已经认到什么程度、缺哪几件、怎么补 |
| [FAQ](/ecosystem/cambricon/faq) | 卡不认、容器里看不到卡一类问题 |

## 相关

- [生态文档首页](/ecosystem)
- [AMD（Instinct / ROCm）](/ecosystem/amd)：同样没有平台侧的一键安装入口，分层可以对照着看
- [海光（DCU）](/ecosystem/hygon)：同样是国产加速卡，集群组件同样要手工装
