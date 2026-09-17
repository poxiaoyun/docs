---
title: 海光（DCU）
updated: '2026-09-17'
author: Rune Docs Team
description: 把海光 DCU 服务器接入平台要装哪些组件、按什么顺序装、每一步怎么确认装好了；含驱动之上的软件栈分层。
tags:
  - ecosystem
  - hygon
  - dcu
---

# 海光（DCU）

把一台插了海光 DCU 的服务器接进平台集群，分两段：先在每台有卡的机器上装驱动和运行时，让机器自己能用卡；
再在集群里装一组 Kubernetes 组件，让平台能调度和监控这张卡。按下面的顺序做完，在平台页面上就能选中这块卡来跑任务。

## 名词先看懂

| 名词 | 通俗解释 |
| --- | --- |
| DCU | 海光的 AI 加速卡（深度计算单元，Deep Computing Unit）。靠大量计算单元同时做矩阵运算，面向 AI 训练与推理。 |
| 驱动 | 让操作系统认识并驱动 DCU 的那一层软件，装在宿主机上。 |
| DTK | 海光的异构计算平台（DCU Toolkit），兼容 ROCm 生态，业务框架依赖它。 |
| 切分（虚拟化） | 把一张卡分成几份，让多个任务同时用，不必一人独占整张卡。 |
| vDCU | 切出来的一份「虚拟卡」，有自己的算力和显存额度。 |
| MIG | 一种硬件级切分方式，切出来的实例之间隔离更强。 |
| Device Plugin | 设备插件，让 Kubernetes 能看见并分配加速卡的组件。 |
| Exporter | 探针，定期把卡的温度、功耗、显存等状态报给监控系统。 |
| Label Node | 给节点贴标签，告诉调度器这台机器插了什么卡。 |

驱动是给机器用的，装完机器认识卡；Kubernetes 组件是给集群用的，装完集群认识卡。两者都装齐，卡才算真正接进平台。

## 按什么顺序装

顺序不建议调换，后一步依赖前一步的结果：

1. **驱动与运行时**：每台有卡的机器都要装，装完宿主机自己能用卡。
2. **DCU-Label-Node**：给集群里的节点贴上「这台机器有什么卡」的标签。
3. **DCU-Exporter**：把卡的温度、功耗、显存等状态报给监控系统，可先装也可后装。
4. **DCU-Device-Plugin**：把卡注册成集群可调度的资源。做到这一步，集群才看得见卡。
5. **vDCU-Scheduler（按需）**：只有需要把一张卡动态切给多个任务时才装，配合设备插件的动态切分模式使用。

## 平台侧怎么装

海光这一套集群组件**平台没有内置一键安装的应用**，需要按本章的步骤在集群里手工部署 YAML。
这一点和另外两家不同：**NVIDIA 与昇腾都有成套的平台应用，可以在 集群管理 → 运维管理 → 系统应用
里一键装**，海光目前只能手工装。

所以海光的落地节奏是先把宿主机驱动做齐，再按本目录顺序部署四个集群组件。
这些组件的镜像来自海光官方仓库（`image.sourcefind.cn:5000/...`），部署前先确认集群能拉到。

:::info 一个集群只保留一套调度组件
海光的调度组件（DCU-Device-Plugin 等）不要与 NVIDIA 的 GPU Operator、昇腾的 Ascend Device Plugin
装在同一批节点上。同一批节点只服务一家硬件。
:::

## 驱动之上还有三层软件栈

海光的软件栈分三层，名字很像、容易混。接入平台只需要驱动那一步；DTK 及更上层是业务环境的事，
装在业务镜像或开发环境里，不在宿主机接卡这一步：

| 层 | 全称 | 干什么 | 平台接入要不要装 |
| --- | --- | --- | --- |
| 驱动 | 加速卡驱动（`rock-*.run`） | 让操作系统认识并驱动 DCU | **要**，每台有卡的机器都装 |
| DTK | 异构计算平台（DCU Toolkit） | 兼容 ROCm，提供编译器、算子库、运行时；业务框架依赖它 | 不要，装在业务环境里 |
| DAS | 人工智能基础软件系统 | 算子与框架组件（PyTorch / vLLM 等），跟 DTK 版本强绑定 | 不要，用官方镜像即可 |
| DAP | 人工智能应用平台 | 知识库、智能体编排这类上层应用能力 | 不要 |

:::warning 框架组件的版本必须跟 DTK 对上
用到的 PyTorch / vLLM 组件包（whl）版本必须与已装 DTK 版本严格对应，否则会出现
「`hy-smi` 能看卡，但一跑框架就报错」。不要凭印象指定版本号，以官方镜像与组件仓库提供的组合为准。
驱动与 DTK 的对应关系见 [DCU 驱动安装](/ecosystem/hygon/driver-runtime)。
:::

## 这一章有哪些页面

| 页面 | 覆盖什么 | 解决什么问题 |
| --- | --- | --- |
| [DCU 驱动安装](/ecosystem/hygon/driver-runtime) | 宿主机驱动与运行时 | 让机器认识卡，用 `lsmod` 确认驱动已加载 |
| [Kubernetes 组件](/ecosystem/hygon/k8s-components) | 集群侧组件总览 | 这组组件分别干什么、按什么顺序装 |
| [概述](/ecosystem/hygon/k8s-overview) | 组件介绍、镜像清单、系统要求 | 装之前先对一遍硬件、软件、系统版本 |
| [DCU-Label-Node](/ecosystem/hygon/k8s-label-node) | 节点标签 | 告诉调度器每台机器插了什么卡 |
| [DCU-Exporter](/ecosystem/hygon/k8s-exporter) | 监控探针 | 把卡的运行状态报给监控系统 |
| [DCU-Device-Plugin（标准模式）](/ecosystem/hygon/k8s-device-plugin-standard) | 设备插件 | 把物理卡和预切分 vDCU 注册成可调度资源 |
| [DCU-Device-Plugin（MIG 模式）](/ecosystem/hygon/k8s-device-plugin-mig) | 硬件级切分 | 用 MIG 把一张卡切成多个隔离实例 |
| [vDCU 动态切分模式](/ecosystem/hygon/k8s-vdcu-dynamic-splitting) | 动态切分 | 提交任务时按需切卡，用完自动回收 |
| [FAQ](/ecosystem/hygon/k8s-faq) | 排障 | 装完不能用时，按现象查原因和命令 |

## 相关

- [生态文档首页](/ecosystem)
- [华为（昇腾 Ascend）](/ecosystem/huawei)
- [英伟达（NVIDIA GPU）](/ecosystem/nvidia)
- [阿里云（PPU）](/ecosystem/aliyun)
- [DCU 驱动安装](/ecosystem/hygon/driver-runtime)
