---
title: 昆仑芯（Kunlunxin）
updated: '2026-09-17'
author: Rune Docs Team
description: 昆仑芯加速卡接入平台要装哪些组件，以及平台侧一件预置都没有的情况下，规格要怎么建起来。
tags:
  - ecosystem
  - kunlunxin
  - xpu
---

# 昆仑芯（Kunlunxin）

昆仑芯（Kunlunxin）是百度旗下的 AI 芯片公司，百度持股 59.45%。公司 2021 年 4 月独立融资，
2025 年 7 月完成 D 轮，投后估值约 210 亿元；2025 年 12 月改制为股份有限公司，注册资本从 2128 万元增至 4 亿元；
2026 年 1 月 1 日以保密形式向港交所递交主板上市申请，百度已公告确认，分拆后仍是百度附属公司。
2025 年 11 月的百度世界大会上发布了 M100（计划 2026 上市）与 M300（计划 2027）。

在平台上的处境和别的生态分区不一样：**平台侧一件预置都没有**。镜像登记的加速器选项里没有昆仑芯，
模型元数据里没有登记任何昆仑芯型号，规格标签上没有厂商图标，系统应用里也没有集群调度组件。
能走通的只有资源规格这一条路，而且新建规格时有一个独有的坑要绕。

:::info 平台侧现状
昆仑芯在平台上没有任何预置项，连资源名的自动识别都过不了。逐项对照和那个坑的绕法见
[平台适配现状](/ecosystem/kunlunxin/platform-support)。
:::

## 容易混的几个词

| 名词 | 说明 |
| --- | --- |
| XPU | 昆仑芯对自家 AI 加速卡的统一叫法，不指别家的卡 |
| 昆仑芯 | 公司名（Kunlunxin），百度旗下，2025 年 12 月改制为股份有限公司 |
| P800 | 第三代型号，96GB 显存、PCIe 5.0、TDP 400W |
| XRE | 软件栈统称，含内核驱动 kmd、用户态运行时与 `xpu-smi` |
| `xpu-device-plugin` | Kubernetes 设备插件，把卡注册成可调度资源 |
| vXPU | 官方对一卡多用的叫法，基于 SR-IOV。平台与云厂商侧的切分参数目前都还没生效 |

## 接入顺序

1. **内核驱动（XRE 里的 kmd）**：每台有卡的机器装，`xpu-smi` 能看到卡。
2. **容器运行时**：让容器里也能看到卡，集群节点一般跑 containerd。
3. **集群侧组件（`xpu-device-plugin` 与 `xpu-exporter`）**：把卡变成可调度资源，暴露监控指标。
4. **平台侧建规格**：按 `kunlunxin.com/xpu` 建资源规格，并把规格的「类型」字段填成 GPU。

前两步是宿主机的事，第三步是集群的事，第四步才回到平台。顺序倒了设备插件认不到卡。

## 这一章有哪些页面

| 页面 | 讲什么 |
| --- | --- |
| [产品与软件栈](/ecosystem/kunlunxin/products) | 三代型号、软件栈各层、官方入口、资料可得性 |
| [驱动与容器运行时](/ecosystem/kunlunxin/driver-runtime) | 宿主机前置条件、驱动分层、`xpu-smi` 验证 |
| [Kubernetes 组件](/ecosystem/kunlunxin/k8s-components) | 上报的资源名、旧口径、监控端口、vXPU 现状 |
| [平台适配现状](/ecosystem/kunlunxin/platform-support) | 逐层对照、独有的坑、手工接入顺序 |
| [FAQ](/ecosystem/kunlunxin/faq) | 卡不认、容器里看不到卡、规格识别不出来 |

## 相关

- [生态文档首页](/ecosystem)
- [海光（DCU）](/ecosystem/hygon)：同样没有平台侧的一键安装入口
- [AMD（Instinct / ROCm）](/ecosystem/amd)：同样要手工装设备插件
