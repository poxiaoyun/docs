---
title: '晓石 AI 产品线术语表'
updated: '2026-07-21'
description: '统一产品、领域、应用交付、算力和模型访问相关术语。'
tags:
  - product
  - architecture
  - glossary
---

# 晓石 AI 产品线术语表

本文统一平台级产品和架构术语。具体 API 字段仍以对应产品和领域设计为准。

## 身份与资源范围

| 术语 | 定义 |
| ---- | ---- |
| User | IAM 中的登录用户或服务身份。 |
| Organization | IAM 中的组织与成员边界；在 Rune 语义中通常映射为 Tenant。 |
| Tenant | 各产品使用的租户范围，不代表一套独立于 IAM 的成员主数据。 |
| Member | User 与 Organization 的成员关系，由 IAM 持有。 |
| Role / Permission | 对动作和资源范围的授权定义，不等于资源用量配额。 |
| Workspace | Rune 管理的项目级运行范围，关联 Tenant、Cluster 和 Kubernetes Namespace。 |
| Namespace | Kubernetes 隔离范围，是 Workspace 的运行投影之一，不是完整的 Workspace 业务对象。 |

## AI 资产与应用

| 术语 | 定义 |
| ---- | ---- |
| AI Asset | Moha 管理的模型、数据集、镜像或 Space，具有版本、内容和访问边界。 |
| Revision | 稳定定位资产内容的版本标识；不能只依赖会移动的展示名称。 |
| Product | Apps 中可发现和管理的应用产品。Rune 旧路径存在同名对象，使用时需说明所属路径。 |
| ProductVersion | Apps 中 Product 的不可变发布版本，关联 artifact、digest、schema 和发布状态。 |
| Artifact | 可由交付系统解析的版本化内容，例如 Helm Chart；通常通过 OCI 或不可变 Secret 分发。 |
| Plugins | 官方应用和系统组件的来源内容仓库，不是运行时插件进程，也不保存 Instance status。 |

## Instance

| 术语 | 定义 |
| ---- | ---- |
| Apps Instance | 面向用户的应用实例 API 和查询视图；新路径不保存可独立变化的中央安装副本。 |
| Installer Instance | 目标集群中的 `apps.xiaoshiai.cn/v1 Instance` CR，是新路径安装 spec/status 的权威来源。 |
| Rune legacy Instance | Rune 旧 ProductChart/Helm Controller 管理的迁移期对象，不与 Installer 管理同一安装。 |

没有限定词时，“Instance”表示用户可见的应用实例；涉及存储、API 或 Controller 时，应明确写出 Apps、Installer 或 Rune legacy。

## 集群与算力

| 术语 | 定义 |
| ---- | ---- |
| Cluster | Rune 纳管的 Kubernetes 集群及其连接、发布和状态。 |
| ResourcePool | 一组节点和资源供应边界，也是 Flavor、Quota 和调度选择的维度。 |
| Flavor | 服务端管理的业务资源规格，可表达 CPU、内存、设备和节点条件。 |
| Quota | Rune 面向租户或 Workspace 表达的资源使用上限。 |
| ClusterResourceQuota | 在 Kubernetes 中跨多个 Namespace 执行和聚合资源配额的扩展。 |
| Entitlement | 租户在共享资源池中的保障、上限或共享权益语义，不等于简单 Quota。 |
| Workload | Kubernetes 中实际运行的 Deployment、StatefulSet、Job、Pod 或其他业务资源。 |

## 模型访问

| 术语 | 定义 |
| ---- | ---- |
| InferenceServiceRegistration | Rune 中显式描述推理服务地址、引擎和范围，并投影为 AIRouter Channel 的对象。 |
| Channel | AIRouter 中描述可路由模型上游、协议、凭据引用和访问范围的对象。 |
| Gateway Token | AIRouter 数据面用于模型调用鉴权和范围判断的凭据。 |
| RPM / TPM | 每分钟请求数或 Token 数限制，属于模型流量治理，不属于 Kubernetes 资源 Quota。 |
| Usage | AIRouter 记录的请求数、Token、延迟、错误和计费证据。 |

## 架构与状态

| 术语 | 定义 |
| ---- | ---- |
| 控制面 | 接收期望状态、执行策略、调谐资源并聚合状态的组件。 |
| 数据面 | 处理高频业务流量的组件，例如 AIRouter 模型请求链路。 |
| 运行面 | 承载工作负载、设备、网络、存储和观测组件的 Kubernetes 环境。 |
| spec | 用户或系统声明的期望状态。 |
| status | Controller 根据外部事实形成的观测状态。 |
| condition | status 中带类型、状态、原因和信息的阶段性判断。 |
| generation | spec 变化版本，用于判断 Controller 是否处理了最新期望。 |
| observedGeneration | Controller 已观察并用于计算当前 status 的 generation。 |
| 权威状态 | 对某项业务事实具有最终解释权的数据来源。 |
| 投影 | 从权威状态计算得到、可以重新生成的跨组件表示。 |
| cache | 为性能或可用性保存的可重建副本；未同步不能被解释为权威空结果。 |
| reconcile | Controller 比较期望状态与外部事实，并以幂等动作使二者收敛。 |
| finalizer | 在业务对象删除前确保外部资源得到清理的声明式机制。 |
