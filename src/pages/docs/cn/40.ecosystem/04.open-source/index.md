---
title: 其他开源社区
updated: '2026-09-12'
author: Rune Docs Team
description: 平台底下装了哪些开源组件、各自解决什么问题、在界面哪里安装和查看。
tags:
  - ecosystem
  - open-source
---

# 其他开源社区

这一章帮你弄清楚**平台底下装了哪些开源组件**：每个组件是干什么的、解决什么交付或运维问题、在界面的哪个位置安装和查看。
读完你能对着下面这张总表，判断某个能力（比如日志、扩缩容、对象存储）是由哪个组件提供的，以及该去哪个页面处理。

:::tip 先记住一件事
平台不是从零写出来的，它站在一批成熟开源组件上。**组件是「装配件」，界面才是「操作面板」**：
大多数组件先在**平台管理端**装好，然后在**智算平台端**被用户使用。
:::

## 开源组件总表

按界面上能做的四类事情分组。「在哪能装/能看到」里给的都是界面位置，详细操作看对应的分类页。

| 组件名 | 它解决什么问题 | 分类 | 在哪能装/能看到 |
| --- | --- | --- | --- |
| Kubernetes | 把多台服务器组成一个集群，统一调度容器 | 容器与编排 | 集群管理 → 集群信息（随平台部署的底座） |
| Volcano | 给批量任务和 AI 训练排队、成组调度、公平共享资源 | 容器与编排 | 运维管理 → 调度器管理 |
| Volcano vGPU | 把一张 GPU 切成多份，让多个任务共享 | 容器与编排 | 跟随调度组件安装，集群信息 → 加速卡信息（源自 [HAMi](/ecosystem/hami) 家族，只覆盖 NVIDIA） |
| GPU Operator / 昇腾调度组件 | 让 NVIDIA / 昇腾集群认识卡并交给 Volcano 调度 | 容器与编排 | 运维管理 → 系统应用（硬件侧见[英伟达](/ecosystem/nvidia)、[华为](/ecosystem/huawei)两章；海光与阿里云 PPU 的组件不在系统应用里，见[海光（DCU）](/ecosystem/hygon)、[阿里云（PPU）](/ecosystem/aliyun)） |
| Multus-CNI | 给容器加第二张网卡，并分配固定 IP | 容器与编排 | 运维管理 → 系统应用 |
| ingress-nginx | 把外部 HTTP 流量按域名转发到集群里的服务 | 容器与编排 | 运维管理 → 系统应用 |
| Higress | 统一入口网关，可替代 nginx-ingress | 容器与编排 | 运维管理 → 系统应用 |
| kube-ssh / sshpiper | 提供统一的 SSH 接入入口和转发 | 容器与编排 | 运维管理 → 系统应用 |
| 全局配置（global） | 集中管理镜像仓库、默认存储类、调度器和服务端点 | 容器与编排 | 运维管理 → 系统应用（通常随集群预装） |
| vLLM（含加密版 ENX） | 高吞吐大模型推理引擎，加密版支持加密模型推理 | 框架与推理 | 工作台 → 推理服务 → 创建 |
| SGLang（含 PD 分离） | 高性能推理，PD 版把推理拆成三段分别扩缩 | 框架与推理 | 工作台 → 推理服务 → 创建 |
| Xinference | 一个服务同时跑 LLM、向量、语音、图像等多种模型 | 框架与推理 | 工作台 → 推理服务 → 创建 |
| llama.cpp | 在 CPU 或少量显存上跑量化开源模型 | 框架与推理 | 工作台 → 推理服务 → 创建 |
| vLLM Ascend | 面向华为昇腾 NPU 的 vLLM 推理引擎 | 框架与推理 | 工作台 → 推理服务 → 创建 |
| LLaMA-Factory | 大模型微调训练框架 | 框架与推理 | 智算平台 → 训练与微调 → 创建 |
| mock-openai-api | 模拟 OpenAI 接口，用于离线联调和演示 | 框架与推理 | 工作台 → 推理服务 → 创建 |
| kube-prometheus-stack | 采集指标、存指标、发告警，自带 Grafana 看板 | 可观测与运维 | 运维管理 → 系统应用 |
| metrics-server | 提供节点和 Pod 的基础资源用量指标 | 可观测与运维 | 运维管理 → 系统应用（监控） |
| Loki + Logging Operator | 采集、聚合、查询容器日志 | 可观测与运维 | 运维管理 → 系统应用；日志管理里查看 |
| VictoriaMetrics / VictoriaLogs | 指标和日志的存储与查询（兼容 Prometheus） | 可观测与运维 | 运维管理 → 系统应用 |
| OpenTelemetry Collector + Jaeger | 采集和存储链路追踪数据 | 可观测与运维 | 运维管理 → 系统应用 |
| Holmes | 用大模型帮你自动诊断资源问题 | 可观测与运维 | 系统应用；平台 → AI助手设置 |
| KEDA | 按外部事件或指标自动扩缩容 | 可观测与运维 | 运维管理 → 系统应用 |
| VPA | 自动给出并调整 Pod 的 CPU、内存请求 | 可观测与运维 | 运维管理 → 系统应用 |
| Descheduler | 把负载从热点节点迁走，整理资源碎片 | 可观测与运维 | 运维管理 → 系统应用 |
| Prometheus Adapter | 把 Prometheus 指标变成 Kubernetes 能用的自定义指标 | 可观测与运维 | 随监控与调度组件安装 |
| RustFS / MinIO | S3 兼容的对象存储，放模型、数据集等大文件 | 制品与安全 | 运维管理 → 存储集群；平台内置制品存储 |
| Longhorn | 分布式块存储，给实例提供持久卷 | 制品与安全 | 运维管理 → 存储集群 |
| Local Path Provisioner | 用节点本地磁盘提供持久卷 | 制品与安全 | 运维管理 → 存储集群 |
| NFS / CephFS / JuiceFS | 接入已有的共享存储作为存储类 | 制品与安全 | 运维管理 → 存储集群 |
| cert-manager | 自动签发和续期 HTTPS 证书 | 制品与安全 | 运维管理 → 系统应用 |

## 四个分类分别讲什么

| 分类 | 解决的问题 | 你要关注它的时候 |
| --- | --- | --- |
| [容器与编排](/ecosystem/open-source/container-orchestration) | 任务怎么被调度、网络怎么通、流量怎么进来 | 任务排队、要固定 IP、配域名、接 GPU |
| [框架与推理生态](/ecosystem/open-source/framework-inference) | 模型用什么引擎跑起来、怎么微调 | 创建推理服务、跑训练任务、换推理引擎 |
| [可观测与运维](/ecosystem/open-source/observability-ops) | 看清集群状态、查日志、自动扩缩容 | 排查故障、看监控、配弹性伸缩 |
| [制品与安全](/ecosystem/open-source/artifacts-security) | 模型和数据放哪、传输怎么加密 | 建存储、配 HTTPS、规划容量 |

## 开始之前

- 能**安装系统组件**的操作，需要**平台管理员**权限，并进入**某个具体集群**（集群管理 → 选择集群）。
- 只是想**使用**这些组件（创建推理服务、查日志、建存储卷），普通成员在**智算平台**里就能做，不需要自己安装。

## 相关

- [容器与编排](/ecosystem/open-source/container-orchestration)
- [框架与推理生态](/ecosystem/open-source/framework-inference)
- [可观测与运维](/ecosystem/open-source/observability-ops)
- [制品与安全](/ecosystem/open-source/artifacts-security)
- [常见问题](/ecosystem/open-source/faq)
