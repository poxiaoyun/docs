# Rune

Rune 是晓石 AI 产品线的集群、算力与工作负载运行控制面，把 Kubernetes 集群、异构设备、租户空间、资源策略和观测后端封装为稳定的平台能力。

## 产品定位

Rune 解决“工作负载部署到哪个集群和 Workspace、可以使用多少资源、如何调度、如何观察和诊断”。它为 Apps 提供集群和算力上下文，并连接 IAM、Moha、AIRouter 与 Kubernetes；不持有用户主数据、AI 资产内容、Apps 产品目录或模型调用 usage。

## 核心功能

| 功能组 | 用户能力 | 详细文档 |
| ------ | -------- | -------- |
| 多集群 | 接入、发布和诊断 Kubernetes 集群 | [集群](cluster/README.md) |
| 租户空间 | 将 IAM 组织映射为 Tenant Enablement、Workspace 和 Namespace | [租户](tenant/README.md)、[工作空间](workspace/README.md) |
| 算力治理 | 管理 ResourcePool、Flavor 和 Quota | [资源池](resourcepool/README.md)、[规格](flavor/README.md)、[配额](quota/README.md) |
| 应用运行支撑 | 为 Apps 提供 Workspace、资源上下文、运行查询和受限代理 | [Apps](../apps/README.md)、[平台运行组件](../platform-components.md) |
| 调度 | 表达资源权益、运行保障、共享策略并对接调度后端 | [调度](scheduler/README.md) |
| 运行运维 | 聚合资源、事件、指标、日志、告警、终端和服务代理 | [可观测性](observability/README.md) |
| 模型服务注册 | 将显式推理服务注册同步为 AIRouter Channel | [AIRouter](../airouter/README.md) |

## 架构入口

- [Rune 控制面架构](architecture.md)：API Server、Cloud API、Cloud Controller、Agent、存储、多集群连接、部署与关键运行链路。
- [平台领域架构](../domain-architecture.md)：Rune 与 IAM、Moha、Apps、AIRouter、Installer 和 Kubernetes 的对象与状态边界。
- [平台架构](../platform-architecture.md)：Rune 在整个产品线中的系统上下文和部署分层。
- [关键业务场景](../key-scenarios.md)：Workspace、应用交付、共享算力、服务注册和运行诊断的端到端协作。
- [架构驱动](../architecture-drivers.md)：共享算力问题、目标、约束和当前未闭环能力。

## 领域文档

Rune 领域文档全部位于本目录，每个稳定领域使用 `README.md → requirements.md → design.md` 的下钻结构。

| 分组 | 领域 | 核心对象或能力 |
| ---- | ---- | -------------- |
| 接入与隔离 | [集群](cluster/README.md) | Cluster、连接、发布和资源访问 |
| 接入与隔离 | [租户](tenant/README.md) | ClusterTenantEnablement、组织映射和租户配额 |
| 接入与隔离 | [工作空间](workspace/README.md) | Workspace、Namespace、LimitRange 和资源范围 |
| 算力治理 | [资源池](resourcepool/README.md) | ResourcePool、节点集合和供应边界 |
| 算力治理 | [资源规格](flavor/README.md) | Flavor、设备规格和 values 注入 |
| 算力治理 | [配额](quota/README.md) | Quota、ResourceQuota 与 ClusterResourceQuota 投影 |
| 运行策略 | [调度](scheduler/README.md) | 资源权益、运行保障、协同启动和状态解释 |
| 运行运维 | [可观测性](observability/README.md) | Metric、Log、Alert、Dashboard 和诊断 |

## 状态边界

| 状态 | 权威来源 | Rune 的职责 |
| ---- | -------- | ----------- |
| 用户、组织、成员和角色 | IAM | 查询身份和组织上下文，不复制用户主数据 |
| 模型、数据集、镜像和 revision | Moha | 为工作负载保留稳定引用，不保存资产内容 |
| Product、ProductVersion 和新实例视图 | Apps | 提供目标 Cluster、Workspace 和资源上下文 |
| 新应用安装 spec/status | Installer Instance CR | 通过受限集群访问查询和聚合运行证据 |
| Cluster、Workspace、ResourcePool、Flavor、Quota | Rune Cloud Store | 保存期望状态并由 Controller 调谐 |
| Pod、Deployment、Job 和 Event | Kubernetes | 查询、代理和聚合，不替代集群运行事实 |
| Channel、Token、策略和 usage | AIRouter | 只维护显式服务注册期望和同步状态 |

## Apps 与旧应用路径

新应用交付边界是 Apps → Installer → Kubernetes。Rune 负责 Cluster、Workspace、算力和运行访问，不直接成为新应用目录或安装状态的权威来源。

Rune 基线仍保留迁移期的[旧 Product/Chart](product/README.md)和[旧 Instance](app/README.md)设计，用于解释现有环境和兼容代码。新旧路径不得管理同一逻辑安装；新功能默认进入 Apps 与 Installer，除非明确处理旧环境兼容。
