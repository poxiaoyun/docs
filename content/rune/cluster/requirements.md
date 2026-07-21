# 集群需求

本文描述 `rune` 中集群能力的产品需求。集群是平台管理 Kubernetes 资源的基础对象，也是租户、工作空间、应用实例、资源规格、资源池和调度能力的承载环境。

## 背景

`rune` 需要统一管理多个 Kubernetes 集群。平台管理员负责接入集群、维护连接状态、发布给租户使用，并通过集群资源视图、统计、代理和全局配置支撑上层产品能力。

集群能力需要解决的问题不是单纯保存 kubeconfig，而是让后续所有模块都能可靠地获得：

- 可用的 Kubernetes client。
- 集群连接和版本状态。
- 面向用户的集群元数据。
- 可枚举和可代理的 Kubernetes 资源。
- 工作空间和实例运行所需的基础环境。

## 用户问题

### 平台管理员需要安全接入集群

管理员需要把一个 Kubernetes 集群接入 `rune`，并确认 kubeconfig 可用。

需求：

- 创建集群时校验 kubeconfig。
- 支持 dry-run 校验。
- 保存集群类型、名称、描述、连接参数和超卖率。
- 更新集群时保留集群类型。
- 不在普通列表中暴露 kubeconfig 和敏感 params。

### 平台管理员需要知道集群是否在线

集群可能断连、证书失效、网络不可达或 API Server 异常。

需求：

- 控制器定期 heartbeat。
- 状态展示 Connected、Pending、Disconnected。
- conditions 中记录连接失败原因。
- 状态中展示 Kubernetes 版本信息。
- 集群不可用时，上层工作空间和实例操作能得到明确错误。

### 租户只能使用已发布集群

平台可能接入内部测试集群、维护中集群或只给管理员使用的集群。

需求：

- 集群支持 publish/unpublish。
- 租户侧只看到 published 集群元数据。
- 集群元数据隐藏 kubeconfig。
- 租户可以查看 vendor、area、description、version 和 ready 状态。

### 上层模块需要统一 Kubernetes client

工作空间、实例、资源池、Flavor、配额、调度和资源树都需要访问目标集群。

需求：

- 集群接入后生成可复用的 Kubernetes client。
- client 提供 typed client、dynamic client、controller-runtime client。
- client cache 和 instance graph cache 需要后台运行。
- kubeconfig 变化时 client 需要重新创建。
- 集群删除时释放缓存和 client。

### 用户需要集群资源视图

管理员和租户需要查看集群资源、节点、Pod、事件、metadata 和服务代理。

需求：

- 提供 cluster scoped 和 namespace scoped 的资源 API。
- 支持基础资源、Pod 扩展、Node 扩展、事件、children 和 proxy。
- 支持资源 metadata API。
- 支持集群统计，例如节点、namespace、Pod、Deployment、StatefulSet、Job 数量。

### 集群需要全局配置

实例渲染和访问端点依赖集群级配置，例如 DNS、NodePort IP、网关端点和调度器规则。

需求：

- 从系统 namespace 的 global Instance 读取全局配置。
- 调度器规则按资源名映射 schedulerName。
- NodePort、DNS 和网关配置供实例端点和渲染使用。

### 集群需要支撑资源池和规格

资源池、Flavor、租户配额都依赖集群节点资源和标签。

需求：

- ResourcePool 能把节点集合写成节点标签。
- Flavor 能从集群节点发现可配置资源。
- 租户配额能基于集群资源计算可授权资源。
- 超卖率可用于配额资源计算。

## 产品能力需求

### 集群管理

集群管理需要支持：

- 创建。
- 校验。
- 更新。
- 删除。
- 发布。
- 取消发布。
- 查看详情。
- 查看列表。

### 集群状态

状态需要包括：

- ready。
- phase。
- message。
- Kubernetes version。
- agent version。
- conditions。

### 集群元数据

元数据需要包括：

- ID。
- 名称。
- 类型。
- labels。
- annotations。
- vendor。
- area。
- description。
- published。
- ready 状态。
- version。

### 集群资源接口

集群资源接口需要支持：

- Kubernetes 资源列表和详情。
- 事件。
- Pod 和 Node 扩展信息。
- 资源 children。
- Service proxy。
- Kubernetes API proxy。
- metadata API。

### 集群统计

统计至少需要：

- namespace 数量。
- node 数量。
- pod 数量。
- service 数量。
- configmap 和 secret 数量。
- deployment、statefulset、daemonset 数量。
- job 和 cronjob 数量。

## 非目标

第一阶段不要求：

- 不支持非 Kubernetes 集群作为完整运行后端。
- 不把 kubeconfig 暴露给普通租户。
- 不在集群对象内直接管理租户配额、工作空间和应用生命周期。
- 不把 ResourcePool 和 Cluster 合并为同一对象。
- 不在集群接入时自动安装所有插件和调度组件。
- 不承诺集群删除前自动迁移或保留工作负载。

## 验收标准

- 管理员可以创建 Kubernetes 集群。
- 创建时能校验 kubeconfig 并写入版本信息。
- 集群控制器能维护连接状态。
- 列表接口不会返回 kubeconfig。
- published 集群能出现在租户元数据列表中。
- unpublish 后租户不可见。
- 上层模块能通过 CloudInfo 获取可用 Kubernetes client。
- 集群资源 API 能列出资源、事件和 metadata。
- 集群统计能返回基础资源数量。
- 集群全局配置能被实例渲染逻辑读取。
