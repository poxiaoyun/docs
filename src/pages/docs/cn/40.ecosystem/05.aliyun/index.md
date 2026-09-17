---
title: 阿里云（PPU）
updated: '2026-09-17'
author: Rune Docs Team
description: 在阿里云上使用真武 PPU：从灵骏节点池到 ACK 设备插件，接入平台要做的每一步。
tags:
  - ecosystem
  - aliyun
  - ppu
  - lingjun
---

# 阿里云（PPU）

真武 PPU 是阿里平头哥自研的 AI 加速卡，目前只出现在阿里云上：算力来自**灵骏节点池**，调度交给 **ACK**。

接入方式和昇腾、海光、英伟达三章不太一样，差别在于卡不归你管。驱动、固件、机器维护都在阿里云一侧，
你能操作的只有 ACK 集群和节点池。所以这一章没有「装驱动」那一页，需要自己做的其实只有三件事：
把灵骏节点加进集群、装两个 ACK 组件、在平台里申请资源。

:::info 平台认这张卡
平台的规格体系里，PPU 的资源键是 `alibabacloud.com/ppu`，切分实例是 `alibabacloud.com/ppu-*`。
识别到之后，规格名会显示成 `PPU*1`，厂商标为 PPU。细节见[在平台上使用](/ecosystem/aliyun/platform-usage)。
:::

## 先分清几个词

| 名词 | 说明 |
| --- | --- |
| PPU | Parallel Processing Unit，平头哥自研的 AI 加速芯片系列，产品名「真武」。 |
| 灵骏 | 阿里云的智算集群产品。PPU 卡装在灵骏机器上，以节点池的形式挂进 ACK 集群。 |
| ACK | 阿里云容器服务。PPU 节点的调度、监控、故障处理都在这里做。 |
| ack-ppu-device-plugin | ACK 提供的标准 PPU 设备插件，把节点上的卡上报成 Kubernetes 资源。 |
| ack-rdma-device-plugin | 把节点的 RDMA 网卡上报成 `rdma/hca`，跨机通信要用它。 |
| MIG | PPU 的硬件切分。一张卡切成若干互相隔离的实例，资源名形如 `ppu-4u.4g48gb`。 |
| PPU SDK | 平头哥的软件栈，含编译器、算子库、`ppu-smi` 等。业务镜像里自带，平台不单独安装。 |

## 这一章怎么分

| 页面 | 解决什么问题 |
| --- | --- |
| [PPU 基础](/ecosystem/aliyun/ppu-basics) | 型号、关键参数、软件栈、适合什么业务 |
| [灵骏节点池](/ecosystem/aliyun/lingjun-nodepool) | 集群准备、建节点池、核对节点标签 |
| [设备插件](/ecosystem/aliyun/device-plugin) | 组件总览、安装验证、调度策略、MIG 切分 |
| [在平台上使用](/ecosystem/aliyun/platform-usage) | 规格识别、实例与配额、看监控 |
| [FAQ](/ecosystem/aliyun/faq) | 排障方法，以及几条踩过的经验 |

## 按什么顺序做

1. **建池加节点**：准备 ACK Pro 集群，建灵骏节点池，把 PPU 节点加进去。
2. **装组件**：`ack-rdma-device-plugin` 与 `ack-ppu-device-plugin`，装后者时勾上拓扑上报。
3. **确认节点**：节点上要出现 `aliyun.accelerator/ppu_*` 这几个标签。
4. **调调度**：打开 Binpack，把 `alibabacloud.com/ppu` 加进 `binpackResourceWeight`。
5. **提交任务**：申请 `alibabacloud.com/ppu`，并且容忍灵骏节点的污点。

顺序不用纠结，第 3 步跑通就说明前面都对；第 3 步不过，后面全是白费力气。

## 和前三家不一样的地方

- **没有宿主机驱动这一步。** 昇腾、海光、英伟达都得先在某台机器上装驱动，PPU 节点的驱动和固件由阿里云维护，
  你既装不到也不需要装。
- **接入入口是 ACK，不是裸机。** 前三家是「自己的机器接自己的集群」，PPU 是「云上的节点池接云上的集群」。
- **平台的介入点在资源层。** 平台只认 `alibabacloud.com/ppu` 这个资源键，不关心卡在哪个机房。

## 相关

- [生态文档首页](/ecosystem)
- [PPU 基础](/ecosystem/aliyun/ppu-basics)
- [设备插件](/ecosystem/aliyun/device-plugin)
- [华为（昇腾 Ascend）](/ecosystem/huawei)
- [海光（DCU）](/ecosystem/hygon)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)
