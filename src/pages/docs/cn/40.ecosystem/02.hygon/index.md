---
title: 海光（DCU）
updated: '2026-09-12'
author: Rune Docs Team
description: 把海光 DCU 服务器接入平台要装哪些组件、按什么顺序装、每一步怎么确认装好了。
tags:
  - ecosystem
  - hygon
  - dcu
---

# 海光（DCU）

这一章讲怎么把一台插了**海光 DCU** 的服务器接进平台集群，分两段：先在**每台有卡的机器上装驱动和运行时**，
让机器自己能用卡；再在**集群里装一组 Kubernetes 组件**，让平台能调度和监控这张卡。
按下面的顺序做完，你在平台页面上就能选中这块卡来跑任务。

:::tip 先记住三句话

- **DCU** 就是海光出的 AI 加速卡，作用类似显卡，专门加速大模型训练和推理。
- 驱动是给**机器**用的，装完机器认识卡；Kubernetes 组件是给**集群**用的，装完集群认识卡。
- 两者都装齐，卡才算真正接进平台。

:::

## 按什么顺序装

顺序不建议调换，后一步依赖前一步的结果：

1. **驱动与运行时** —— 每台有卡的机器都要装，装完宿主机自己能用卡。
2. **DCU-Label-Node** —— 给集群里的节点贴上「这台机器有什么卡」的标签。
3. **DCU-Exporter** —— 把卡的温度、功耗、显存等状态报给监控系统，可先装也可后装。
4. **DCU-Device-Plugin** —— 把卡注册成集群可调度的资源。做到这一步，集群才「看得见」卡。
5. **vDCU-Scheduler（按需）** —— 只有需要把一张卡动态切给多个任务时才装，配合设备插件的动态切分模式使用。

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

## 名词先看懂

下面几个词后面反复出现，先用一句话记牢：

| 名词 | 通俗解释 |
| --- | --- |
| DCU | 海光的 AI 加速卡，相当于机器里的「显卡」，用来加速训练和推理 |
| 切分（虚拟化） | 把一张卡分成几份，让多个任务同时用，不必一人独占整张卡 |
| vDCU | 切出来的一份「虚拟卡」，有自己的算力和显存额度 |
| MIG | 一种硬件级切分方式，切出来的实例之间隔离更强 |
| Device Plugin | 设备插件，让 Kubernetes 能「看见」并分配加速卡的组件 |
| Exporter | 探针，定期把卡的温度、功耗、显存等状态报给监控系统 |
| Label Node | 给节点贴标签，告诉调度器这台机器插了什么卡 |

## 相关

- [生态文档首页](/ecosystem)
- [华为（昇腾 Ascend）](/ecosystem/huawei)
- [DCU 驱动安装](/ecosystem/hygon/driver-runtime)
