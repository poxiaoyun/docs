---
title: 壁仞科技（Biren）
updated: '2026-09-17'
author: Rune Docs Team
description: 壁仞科技壁砺加速卡接入平台的路径：驱动、设备插件现况，以及平台侧对壁砺型号的识别程度。
tags:
  - ecosystem
  - biren
  - supa
---

# 壁仞科技（Biren）

壁仞科技做数据中心 GPU，产品线叫壁砺，软件平台叫 BIRENSUPA™。在平台已经收录的几家加速器厂商里，壁仞是平台侧识别度最低的一家：镜像登记的加速器类型里没有壁仞，模型元数据没登记任何壁砺型号，规格标签上没有厂商图标，系统应用里也没有对应的调度组件。节点上能不能用卡，取决于集群侧手工装了什么设备插件，平台只按资源名把节点上的卡当成一种通用加速卡。

:::info 平台侧现状
壁仞在平台上走纯手工路径：平台认资源名，不认厂商也不认型号。每一层的实际状态和补齐办法见
[平台适配现状](/ecosystem/biren/platform-support)。
:::

## 容易混的几个词

| 名词 | 说明 |
| --- | --- |
| 壁仞 / Biren | 公司名，产品线叫壁砺 |
| 壁砺 | 加速卡产品名，型号形如 106M、166L |
| BR106 / BR166 | 芯粒口径的芯片型号，BR166 由两颗 BR106 芯粒组成 |
| BIRENSUPA™ | 官方软件平台名，官方分层为驱动与 HAL、编程平台、框架层、解决方案层 |
| SVI | Secure Virtual Instance，官方的卡内安全虚拟实例，BR106 最多支持 4 个 |
| HAMi | 开源中间件，壁仞卡做卡内切分调度时的实际可用路径；v2.10.0 起才支持壁仞 |

## 接入顺序

1. **驱动**：在每台有卡的机器上装，装完 `brsmi` 能列出卡。设备插件要求驱动 ≥ 1.2.2。
2. **容器运行时工具链**：同一批机器上装，让容器里也能看到卡。走 CDI 方式要求 kubelet ≥ 1.28 且 containerd ≥ 1.7。
3. **设备插件**：集群里装 `k8s-device-plugin`，节点上报 `birentech.com/gpu`。
4. **卡内切分**：要先在卡上配好 SVI，节点上才会出现 `birentech.com/1-2-gpu` 或 `birentech.com/1-4-gpu`。
5. **调度增强**：要按份额排卡内切分任务，改用第三方 HAMi 的 `biren-device-plugin`，节点标签也从 `birentech.com=gpu` 换成 `biren=on`。
6. **平台侧收口**：回到平台按资源名建规格与配额，再交一个最小任务验一遍。

前三步是宿主机与集群的事，第六步才动平台界面。顺序倒了设备插件认不到卡。

## 这一章有哪些页面

| 页面 | 讲什么 |
| --- | --- |
| [产品与软件栈](/ecosystem/biren/products) | 壁砺型号代际、训练卡与推理卡划分、公司经营与路线现状 |
| [驱动与容器运行时](/ecosystem/biren/driver-runtime) | 前置条件、驱动安装步骤、验证与升级注意 |
| [Kubernetes 组件](/ecosystem/biren/k8s-components) | 设备插件与归档状态、上报的资源名、SVI 切分、和 Volcano 的关系 |
| [平台适配现状](/ecosystem/biren/platform-support) | 逐层核对平台已经认到什么程度、缺哪几件 |
| [FAQ](/ecosystem/biren/faq) | 卡不认、容器里看不到卡、切分卡申请不到一类问题 |

## 相关

- [生态文档首页](/ecosystem)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)：同为 GPU 路线，设备插件与资源名的分层可以对照着看
- [AMD（Instinct / ROCm）](/ecosystem/amd)：同样没有平台侧的一键安装入口
