---
title: '晓石 AI 平台架构'
updated: '2026-07-21'
description: '说明晓石 AI 产品线的系统上下文、产品边界、状态所有权和平台部署分层。'
tags:
  - architecture
  - platform
  - c4
---

# 晓石 AI 平台架构

本文从整个平台视角说明产品、公共能力、集群组件和外部基础设施如何协作。它保持在 C4 System Landscape 和 System Context 层级，不展开 Rune、Apps 等产品的内部包或进程；产品价值和用户方案见[产品线全景](product-line.md)，Rune 内部结构见[Rune 控制面架构](rune/architecture.md)。

## 范围与状态

| 项目 | 说明 |
| ---- | ---- |
| 系统范围 | Console、BOSS、IAM、Moha、Apps、Rune、AIRouter、KMS 及必要的集群运行组件 |
| 运行环境 | 中心管理集群、被管 Kubernetes 集群、资产与观测基础设施、外部模型上游 |
| 当前边界 | IAM、Moha、Rune、AIRouter 及集群组件具有正式实现基线 |
| 正在落地 | Apps 当前工作树已有 Product、ProductVersion 和 Installer Instance API，但尚无正式提交基线 |
| 迁移边界 | Rune 旧 Product/Instance Controller 与 Apps/Installer 新路径并存，但不能管理同一实例 |

本文描述已实现边界及明确标记的迁移状态，不把未实现路线当作当前能力。

## 平台系统上下文

```mermaid
flowchart TB
    subgraph Actors[用户与外部客户端]
        Developer[模型与应用开发者]
        TenantAdmin[租户管理员]
        PlatformAdmin[平台管理员]
        APIClient[API / SDK / CLI]
    end

    subgraph Experience[产品入口]
        Console[Console]
        Boss[BOSS]
        OpenAPI[统一 API 入口]
    end

    subgraph Products[核心产品]
        Moha[Moha<br/>AI 资产]
        Apps[Apps<br/>应用目录与交付]
        Rune[Rune<br/>集群与算力治理]
        AIRouter[AIRouter<br/>模型访问治理]
    end

    subgraph Shared[公共能力与内容]
        IAM[IAM<br/>身份、组织与授权]
        KMS[KMS<br/>数据密钥]
        Plugins[Plugins<br/>应用与系统内容]
    end

    subgraph Managed[被管 Kubernetes 集群]
        Installer[Installer]
        CRQ[ClusterResourceQuota]
        KubeSSH[kube-ssh]
        Kubernetes[Kubernetes API]
        Workloads[AI 与开发工作负载]
    end

    subgraph External[外部基础设施]
        Assets[Git / LFS / OCI / Object Storage]
        Upstream[公有云与外部模型上游]
        Observe[Metrics / Logs / Alerts / Traces]
    end

    Developer --> Console
    TenantAdmin --> Console
    PlatformAdmin --> Boss
    APIClient --> OpenAPI

    Console --> Moha
    Console --> Apps
    Console --> Rune
    Console --> AIRouter
    Boss --> IAM
    Boss --> Apps
    Boss --> Rune
    Boss --> AIRouter
    OpenAPI --> Products

    IAM -.-> Products
    Moha --> Apps
    Plugins --> Apps
    Apps --> Rune
    Apps --> Installer
    Rune --> CRQ
    Rune --> Kubernetes
    Rune -.-> AIRouter
    Rune -.-> KMS

    Moha --> Assets
    Installer --> Kubernetes
    CRQ --> Kubernetes
    KubeSSH --> Kubernetes
    Kubernetes --> Workloads
    AIRouter --> Workloads
    AIRouter --> Upstream
    Products -.-> Observe
```

箭头表示主要调用、内容流或状态投影方向。虚线表示共享治理、注册或观测关系；详细协议和时序由产品设计与[关键业务场景](key-scenarios.md)维护。

## 产品和组件边界

| 产品或组件 | 核心职责 | 权威状态 | 不负责 |
| ---------- | -------- | -------- | ------ |
| Console / BOSS | 组织用户与管理员操作流程 | 不持有后端业务权威状态 | 复制产品数据库或绕过服务端授权 |
| IAM | 登录、组织、成员、角色、授权与审计 | 用户、组织、成员和授权关系 | 集群资源配额和工作负载状态 |
| Moha | 模型、数据集、镜像和 Space 的版本化管理与分发 | 仓库元数据、版本历史、LFS/OCI 内容 | 应用安装和集群容量 |
| Apps | Product、ProductVersion、实例 API 和安装状态呈现 | 产品目录与面向用户的实例视图 | 直接执行 Helm 或持有 kubeconfig |
| Rune | Cluster、Workspace、ResourcePool、Flavor、Quota、调度与运行诊断 | Cloud 治理对象和集群连接配置 | 产品目录、用户主数据和模型调用 usage |
| AIRouter | 模型协议、Channel、Token、路由、审核、限流、usage 和 billing | 渠道、策略、Token、用量与账务 | 创建训练或推理工作负载 |
| [KMS](kms/README.md) | 生成和解密数据密钥 | 当前不持久化通用业务密钥对象 | Secret 管理和业务密钥生命周期 |
| Plugins | 保存官方应用和系统组件内容 | Chart、镜像构建与来源配置 | Instance 运行状态 |
| Installer | 解析制品并声明式安装应用 | Installer Instance spec/status | 产品目录、身份和算力决策 |
| ClusterResourceQuota | 执行跨 Namespace 资源配额 | CRQ spec/status | 租户权益和产品配额策略 |
| kube-ssh | 将 SSH 映射为受控 Pod exec/portforward | Access 与会话审计 | Workspace、成员和应用生命周期 |
| Kubernetes | 承载工作负载和集群资源 | Kubernetes 资源与运行事实 | 产品目录和平台身份主数据 |

## 应用交付与算力协作

```mermaid
sequenceDiagram
    actor User as 开发者
    participant IAM as IAM
    participant Apps as Apps
    participant Rune as Rune
    participant Installer as Installer
    participant Kube as Kubernetes

    User->>Apps: 选择 ProductVersion 和 Workspace 创建 Instance
    Apps->>IAM: 认证、授权并确认租户范围
    Apps->>Rune: 解析 Cluster、Workspace 与受限访问范围
    Apps->>Installer: 创建 Installer Instance 与不可变 artifact
    Installer->>Kube: Helm / Kustomize / Template 安装
    Kube-->>Installer: 工作负载、事件和运行状态
    Installer-->>Apps: Instance status 投影
    Apps-->>User: 返回安装阶段、端点和资源视图
```

新路径中 Apps 持有产品目录与用户 API，Rune 持有集群和算力上下文，Installer 持有安装期望与状态，Kubernetes 持有运行事实。Rune 基线仍保留旧 ProductChart/Instance Helm Controller；迁移期间必须按实例来源选择唯一 Controller。

Installer、ClusterResourceQuota、kube-ssh 和 Plugins 的详细职责见[应用交付与集群运行组件](platform-components.md)。

## 平台部署分层

```mermaid
flowchart TB
    subgraph Access[访问层]
        Ingress[Ingress / API Gateway]
        Console[Console / BOSS]
    end

    subgraph Management[中心管理与产品服务]
        IAM[IAM]
        Moha[Moha]
        Apps[Apps]
        Rune[Rune API / Cloud Controller]
        AIRouter[AIRouter Control / Data]
        KMS[KMS]
    end

    subgraph Cluster[被管集群]
        KubeAPI[Kubernetes API]
        Agent[Rune Agent]
        Installer[Installer Controller]
        CRQ[ClusterResourceQuota Controller]
        KubeSSH[kube-ssh]
        Workloads[业务工作负载]
    end

    subgraph Data[数据与外部依赖]
        Stores[产品数据库与对象存储]
        Registry[Git / LFS / OCI Registry]
        Observability[观测后端]
        ModelUpstream[外部模型上游]
    end

    Console --> Ingress --> Management
    Apps --> Rune
    Rune --> KubeAPI
    KubeAPI --> Agent
    KubeAPI --> Installer
    KubeAPI --> CRQ
    KubeAPI --> KubeSSH
    Installer --> Workloads
    Management --> Stores
    Moha --> Registry
    AIRouter --> ModelUpstream
    Cluster --> Observability
```

中心产品服务和被管集群具有独立故障边界。集群暂时离线不应影响其他集群；AIRouter 数据面不经过 Rune Controller；运行中的 Kubernetes 工作负载也不应因 Apps 暂时不可用而停止。

## 状态所有权规则

- 产品之间只通过稳定 API、协议或声明式对象协作，不直接读取彼此数据库。
- API 同步响应表示请求已校验并受理；外部安装、调度和注册结果通过 status 表达。
- 缓存和跨产品投影必须可删除重建，不能反向成为业务权威来源。
- 用户、组织与权限以 IAM 为准；AI 资产和版本以 Moha 为准。
- Apps 产品和版本以 Apps 为准；新安装状态以 Installer Instance CR 为准。
- 集群治理期望以 Rune 为准；Pod、Deployment、Job、Event 等运行事实以 Kubernetes 为准。
- 模型渠道、策略、Token 和 usage 以 AIRouter 为准。
- 业务密文和加密数据密钥由 KMS 调用方持有；KMS 只在请求期间处理明文数据密钥。

完整对象级划分见[领域架构](domain-architecture.md)，失败和恢复要求见[质量属性](quality-attributes.md)。

## 下钻入口

| 关注点 | 文档 |
| ------ | ---- |
| 产品价值、用户角色和典型方案 | [产品线全景](product-line.md) |
| 业务目标、约束与成功判据 | [架构驱动](architecture-drivers.md) |
| 跨产品运行时协作 | [关键业务场景](key-scenarios.md) |
| Rune 进程、存储、部署与多集群连接 | [Rune 控制面架构](rune/architecture.md) |
| Apps 产品与 Installer 边界 | [Apps 设计](apps/design.md) |
| Installer、CRQ、kube-ssh、Plugins | [平台运行组件](platform-components.md) |
| IAM、Moha、AIRouter 内部设计 | [IAM](iam/design.md)、[Moha](moha/design.md)、[AIRouter](airouter/design.md) |
| 数据密钥能力 | [KMS](kms/design.md) |
| 决策依据 | [架构决策记录](architecture-decisions/README.md) |
