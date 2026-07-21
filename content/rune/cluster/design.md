# 集群设计

本文描述 `rune` 的集群设计。集群对象负责保存接入信息和发布状态，`CloudInfoHolder` 负责维护运行时 Kubernetes client，控制器负责连接心跳和状态同步。

## 核心模型

### Cluster

```yaml
id: cluster-a
name: Cluster A
type: Kubernetes
published: true
kube:
  config: "<kubeconfig>"
  namespace: rune-system
  service: rune-agent-api
  port: 80
params: {}
overSellingRate: 0
status:
  ready: true
  phase: Connected
  version:
    vendor: kubernetes
    gitVersion: v1.30.0
  conditions: []
```

字段含义：

- `type` 当前主要支持 Kubernetes。
- `published` 控制租户是否可见。
- `kube.config` 保存 kubeconfig。
- `kube.namespace/service/port` 用于 rune agent 代理。
- `overSellingRate` 用于后续配额资源计算。
- `status` 由控制器维护。

### ClusterMetadata

面向用户展示的集群元数据：

```yaml
id: cluster-a
name: Cluster A
type: Kubernetes
vendor: ""
area: ""
description: ""
published: true
state: Ready
status:
  ready: true
  phase: Connected
  version: {}
```

设计目标：

- 隐藏 kubeconfig。
- 给租户和控制台展示区域、厂商、描述和状态。
- 只返回 published 集群。

### CloudInfoHolder

运行时缓存：

```text
Cluster store object
  -> CloudInfoHolder.Sync
  -> rest.Config
  -> KubernetesClients
  -> typed client / dynamic client / controller-runtime client / graph cache
```

`CloudInfoHolder` 是上层模块访问集群的统一入口。

## 接入和校验

创建集群：

```text
POST /clusters
  -> validateCluster
  -> RESTConfigFromKubeConfig
  -> Discovery ServerVersion
  -> write status.version
  -> store Cluster
```

更新集群：

```text
PUT /clusters/{cluster}
  -> load existing
  -> preserve type
  -> validate kubeconfig
  -> update store
```

校验规则：

- cluster id 必填。
- name 必填。
- kubeconfig 必须能解析。
- 非 skip validate 时必须能访问 Kubernetes discovery。
- dry-run 只校验不保存。

## 连接状态

Cluster controller 监听 Cluster 对象：

```text
Cluster changed
  -> CloudInfoHolder.Sync
  -> Kubernetes discovery heartbeat
  -> update Connected condition
  -> complete phase
```

状态计算：

- 没有 Connected condition 时为 Pending。
- Connected condition 为 false 时为 Disconnected。
- Connected condition 为 true 时为 Connected。

心跳间隔：

```text
1 minute
```

失败时：

- `ready=false`。
- `phase=Disconnected`。
- `message` 记录脱敏后的错误。

## KubernetesClients

`KubernetesClients` 封装：

- `rest.Config`。
- typed clientset。
- dynamic client。
- controller-runtime client。
- controller-runtime cache。
- Instance graph cache。
- API Server proxy transport。
- agent proxy config。

启动流程：

```text
NewKubernetesClients
  -> controller-runtime cluster
  -> instance graph cache
  -> Run in background
  -> wait cache sync
  -> ready
```

`Get` 时会检查 client 是否 ready。如果 client 还在启动、已停止或启动失败，上层会收到明确错误。

配置变更：

```text
hash(cluster.type, kube, params)
  unchanged -> reuse client
  changed -> close old client and create new one
```

删除集群时从 holder 中移除 runtime info。

## 发布和租户可见性

管理员接口：

```text
POST /clusters/{cluster}:publish
POST /clusters/{cluster}:unpublish
```

租户元数据接口只查询：

```text
published = true
```

效果：

- unpublished 集群仍可由管理员维护。
- 租户看不到未发布集群。
- 工作空间、实例和租户 enablement 应以租户路径和 published 元数据控制入口。

## 资源 API

集群资源 API 前缀：

```text
/clusters/{cluster}/resources/apis
/clusters/{cluster}/metadata/apis
```

能力：

- 基础资源 list/get。
- namespace scoped 和 cluster scoped 资源。
- resource children。
- Pod 扩展。
- Node 扩展。
- Events。
- Service proxy。
- 通用 proxy。
- metadata API。

资源 API 通过 `CloudInfoGetter` 获取 Kubernetes client，并使用请求中的 group、version、resource、namespace 等元数据访问目标集群。

## 内部代理

Kubernetes API proxy：

```text
ANY /clusters/{cluster}/kubernetes/{path}*
```

实现：

- 获取集群 API Server 地址。
- 使用集群 rest transport。
- 反向代理到目标 path。

Agent proxy：

```text
GetAgentConfig(path)
  -> /api/v1/namespaces/{agentNamespace}/services/{agentService}/proxy/{path}
```

用途：

- exec websocket。
- 任意集群内地址代理。
- websocket service proxy。

## 全局配置

全局配置从系统 namespace 的 `global` Instance 读取：

```yaml
dns: []
nodePortIPs: []
endpoints: []
schedulers:
- name: xpai-scheduler
  resources:
  - nvidia.com/gpu
```

使用方：

- Instance PostRender 根据 `schedulers` 注入 schedulerName。
- 端点补全和网关能力可以使用 endpoints、DNS、NodePort IP。

全局配置缺失时返回空配置，不阻塞普通实例渲染。

## 集群统计

统计接口：

```text
GET /clusters/{cluster}/statistics
```

Kubernetes 集群统计：

- Namespace。
- Node。
- Pod。
- ConfigMap。
- Secret。
- Service。
- Deployment。
- StatefulSet。
- DaemonSet。
- Job。
- CronJob。

实现方式：

- 并发 list `PartialObjectMetadataList`。
- 统计 items 数量。

## 与其他模块的关系

### 工作空间

Workspace controller 通过集群 client 创建 namespace 和 LimitRange。

### 应用实例

Instance controller 通过集群 client 安装 Helm chart，并通过 Instance graph cache 聚合资源。

### 资源规格

Flavor 从集群节点 `status.allocatable` 和节点标签发现可配置资源。

### 资源池

ResourcePool controller 通过集群 client 给节点打资源池标签。

### 租户配额

ClusterResourceQuota 使用集群资源和 overSellingRate 计算可分配资源。

### 调度

集群 global config 中的 scheduler rules 会影响 Instance Pod 的 schedulerName 注入。

## API 摘要

管理员集群：

```text
GET    /clusters
POST   /clusters
GET    /clusters/{cluster}
PUT    /clusters/{cluster}
DELETE /clusters/{cluster}
POST   /clusters/{cluster}:publish
POST   /clusters/{cluster}:unpublish
GET    /clusters/{cluster}:exec
```

集群元数据：

```text
GET /clustermetadatas
GET /clustermetadatas/{cluster}
PUT /clustermetadatas/{cluster}
```

集群资源：

```text
GET /clusters/{cluster}/resources/apis/...
GET /clusters/{cluster}/metadata/apis/...
GET /clusters/{cluster}/statistics
```

内部代理：

```text
ANY /clusters/{cluster}/kubernetes/{path}*
```

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| kubeconfig 泄露 | 集群列表不应返回敏感连接信息 | `ListClusters` 会清空 kube 和 params |
| client 未 ready | cache 启动需要时间 | `CloudInfoHolder.Get` 检查 ready 状态 |
| 集群断连 | 上层资源操作失败 | controller heartbeat 写入 Disconnected 和 message |
| 未发布集群被租户使用 | 测试或维护集群不应暴露 | 租户元数据只列 published 集群 |
| 删除集群影响大 | 工作空间和实例仍可能存在 | 删除仅移除集群对象和 runtime info，需后续增加保护 |
| 全局配置缺失 | 调度器和端点增强不可用 | 返回空 GlobalConfig，保持基础渲染可用 |
| 代理能力过强 | API proxy 可能绕过产品边界 | 内部接口和权限层需要严格限制 |

## 演进方向

### 接入策略

- 增加集群接入前置检查报告。
- 增加 agent 安装状态和版本回传。
- 支持集群证书过期提醒。

### 可用性和安全

- 删除集群前检查工作空间和实例。
- 对内部 Kubernetes proxy 增加更细粒度权限。
- 对 kubeconfig 存储增加加密和轮换策略。

### 资源和调度

- 将集群资源池、调度器、DRA/CDI 能力汇总为集群能力矩阵。
- 在集群元数据中展示 GPU/NPU/RDMA 等资源摘要。
- 将 global config 产品化为显式 ClusterPolicy。
