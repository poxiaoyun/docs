---
title: 天数智芯（Iluvatar CoreX）
updated: '2026-09-17'
author: Rune Docs Team
description: 天数智芯加速卡接入平台要装哪些组件、平台侧已经识别到什么程度、还缺哪几件。
tags:
  - ecosystem
  - iluvatar
  - corex
---

# 天数智芯（Iluvatar CoreX）

天数智芯在平台上的处境是「登记了名字，没登记型号」：镜像登记时的加速器选项里有 `CoreX(天数智芯)`，
模型元数据里一个天数型号都没有，规格标签也不带专属图标。集群侧平台没有内置调度组件包，
设备插件、监控、vGPU 都得按官方仓库手工装。

:::info 平台侧现状
逐项对照见 [平台适配现状](/ecosystem/iluvatar/platform-support)。
在界面里找不到某个选项时，先看那一页确认是配置漏了还是平台本来就没有。
:::

## 容易混的几个词

| 名词 | 说明 |
| --- | --- |
| 天垓 | 训练卡产品线，型号前缀是 `BI`，例如天垓 100 的型号是 BI-V100 |
| 智铠 | 推理卡产品线，型号前缀是 `MR`，例如智铠 100 的型号是 MR-V100 |
| CoreX | 软件栈品牌名。官方统称「天数智算软件栈」，英文写作 CoreX SDK，装到 `/usr/local/corex` |
| ix-Container-Toolkit | 容器运行时工具链，命令行是 `ix-ctk`，注册进运行时的名字是 `iluvatar` |
| 设备插件 | `ix-device-plugin`，把卡注册成 `iluvatar.com/gpu` 这个 Kubernetes 资源 |
| vGPU | 一卡多用，官方名叫 iluvatar VGPU，资源名走 `iluvatar.ai/<卡型>.vCore` 这一套 |

## 接入顺序

1. **CoreX SDK**：每台有卡的机器上装，装到 `/usr/local/corex`，装完 `ixsmi` 能列出卡。
2. **ix-Container-Toolkit**：同一批机器上装，让容器里也能看到卡。
3. **ix-device-plugin**：集群里装，节点上出现 `iluvatar.com/gpu`。
4. **监控导出器 ix-exporter**：把卡的利用率与显存指标暴露出来。
5. **ix-GPU-Operator（可选）**：用它把第 3、4 步一起托管，省掉手工装两个组件。

前两步是宿主机的事，后三步是集群的事。顺序倒了设备插件认不到卡。

## 这一章有哪些页面

| 页面 | 讲什么 |
| --- | --- |
| [产品与软件栈](/ecosystem/iluvatar/products) | 天垓与智铠的型号、软件栈分层、资源名口径变更、官方入口 |
| [驱动与容器运行时](/ecosystem/iluvatar/driver-runtime) | 宿主机装 CoreX SDK、装 ix-Container-Toolkit、怎么验证 |
| [Kubernetes 组件](/ecosystem/iluvatar/k8s-components) | 设备插件上报什么资源名、监控端口、vGPU 切分、Volcano 插件 |
| [平台适配现状](/ecosystem/iluvatar/platform-support) | 平台已经认到什么程度、缺哪几件、怎么补 |
| [FAQ](/ecosystem/iluvatar/faq) | 卡不认、容器里看不到卡、资源名对不上一类问题 |

## 相关

- [生态文档首页](/ecosystem)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)：同为 GPU 路线，组件分层可以对照着看
- [AMD（Instinct / ROCm）](/ecosystem/amd)：同样没有平台侧的一键安装入口
