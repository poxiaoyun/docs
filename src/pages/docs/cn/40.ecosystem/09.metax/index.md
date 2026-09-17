---
title: 沐曦（MetaX 曦云）
updated: '2026-09-17'
author: Rune Docs Team
description: 沐曦加速卡接入平台要装哪些组件、平台侧已经识别到什么程度、还缺哪几件。
tags:
  - ecosystem
  - metax
  - maca
---

# 沐曦（MetaX 曦云）

沐曦的接入路径和 AMD 接近：宿主机装内核驱动，容器侧装沐曦自己的容器运行时，集群里由 `gpu-device` 把卡注册成可调度资源。
差别落在集群侧这一层：沐曦的两套 Helm chart 放在自家 OCI 仓库里，拉之前要拿到商务授权，平台也没有内置这套组件的安装入口。

:::info 平台侧现状
平台登记了沐曦的加速器类型，选项写的是 `MACA(沐曦)`；模型元数据、规格标签、厂商图标、集群调度组件
四处都还没有沐曦。逐项对照见 [平台适配现状](/ecosystem/metax/platform-support)。
:::

## 容易混的几个词

| 名词 | 说明 |
| --- | --- |
| 曦云 C 系列 | 训推一体的通用计算产品线，型号形如 C500、C588、C600 |
| 曦思 N 系列 | 推理产品线，型号形如 N100、N260、N300 |
| MXMACA | 沐曦的用户态软件栈，编译、运行时、算子库都在这套里，位置上对应 NVIDIA 的 CUDA |
| MACA | 平台上镜像登记时的加速器选项名，界面上写的是 `MACA(沐曦)` |
| KMD / UMD | 内核态与用户态驱动，内核模块是 `metax.ko`，随 `k8s-driver-image` 发布 |
| gpu-device | 集群侧的设备插件组件名，上报 `metax-tech.com/gpu` |
| sGPU | 沐曦的软件切分方案，一张卡最多切 16 个实例，走 `metax-tech.com/sgpu` |
| VF | SR-IOV 硬件虚拟化出来的虚拟功能，复用 `metax-tech.com/gpu` 这个资源名 |

## 接入顺序

1. **内核驱动 KMD / UMD**：每台有卡的机器上装，`metax.ko` 加载后宿主机能看到卡。
2. **MXMACA 用户态**：同一批机器上装，`mx-smi` 能报出版本。
3. **容器运行时**：装 `metax-container-runtime`（对应 Docker 场景是 `metax-docker`），让容器也能拿到设备。
4. **集群组件**：用 `metax-operator` 或 `metax-gpu-extensions` 把卡注册成 `metax-tech.com/gpu`。

前两步是宿主机的事，第四步是集群的事。顺序倒了 `gpu-device` 认不到卡。

## 这一章有哪些页面

| 页面 | 讲什么 |
| --- | --- |
| [产品与软件栈](/ecosystem/metax/products) | 在售型号、MXMACA 各层组件、官方入口 |
| [驱动与容器运行时](/ecosystem/metax/driver-runtime) | 宿主机装驱动、装容器运行时、怎么验证 |
| [Kubernetes 组件](/ecosystem/metax/k8s-components) | 两套 chart 的取舍、上报的资源名、监控端口、切分方式、与 Volcano 的关系 |
| [平台适配现状](/ecosystem/metax/platform-support) | 平台已经认到什么程度、缺哪几件、怎么补 |
| [FAQ](/ecosystem/metax/faq) | 卡不认、容器里看不到卡一类问题 |

## 相关

- [生态文档首页](/ecosystem)
- [AMD（Instinct / ROCm）](/ecosystem/amd)：组件分层最接近，两边可以对照着看
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)：资源名与设备插件的命名习惯可以互相参照
- [海光（DCU）](/ecosystem/hygon)：同样没有平台侧的一键安装入口
