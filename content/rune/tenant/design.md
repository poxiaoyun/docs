# 租户设计

本文描述 `rune` 的租户设计。租户主要通过 API 路由、对象字段、Kubernetes 标签、集群启用对象和资源配额体现。

## 核心模型

### 路由上下文

租户路径通常是：

```text
/tenants/{tenant}/clusters/{cluster}
/tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}
```

设计含义：

- `tenant` 是访问和资源归属边界。
- `cluster` 是目标资源集群。
- `workspace` 是租户在集群内的 namespace 级隔离单元。

### ClusterTenantEnablement

租户启用集群对象：

```yaml
id: tenant-a
cluster: cluster-a
request:
  reason: "need gpu cluster"
status:
  available: true
  reason: Enabled
```

职责：

- 记录租户是否请求使用某个集群。
- 由控制器初始化基础租户配额。
- 提供可用状态给控制台。

### ClusterResourceQuota

租户级集群配额：

```yaml
tenant: tenant-a
cluster: cluster-a
resourcePool: h100-pool
config:
- resourceName: nvidia.com/gpu
  type: Accelerator
  model: NVIDIA-H100
  limit: "8"
limits:
  nvidia.com/gpu: "8"
```

职责：

- 限制租户在集群内可售卖和可使用资源。
- 作为租户可用 Flavor 的过滤依据。
- 后续可作为调度队列容量来源。

### Workspace

工作空间保存租户归属：

```yaml
id: ws-a
cluster: cluster-a
tenant: tenant-a
namespace: ws-a
```

租户 API 所有工作空间操作都带 tenant 条件过滤。

## 集群启用链路

### 用户主动启用

```text
POST /tenants/{tenant}/clusters/{cluster}/enable
  -> create ClusterTenantEnablement
  -> EnablementController
  -> initResourceQuota
  -> status.available = true
```

查询：

```text
GET /tenants/{tenant}/clusters/{cluster}/available
```

返回：

```yaml
requested: true
available: true
reason: Enabled
```

### 工作空间触发自动启用

`AutoEnablementController` 监听新建工作空间：

```text
Workspace created with tenant + cluster
  -> if ClusterTenantEnablement not exists
  -> create enablement
```

这保证租户第一次创建工作空间后，集群启用对象会被补齐。

### 默认配额初始化

如果租户没有任何 ClusterResourceQuota，控制器初始化：

- CPU: 4。
- Memory: 8Gi。

这是兜底配额，不代表高级资源授权。

## 工作空间归属校验

租户工作空间 API 查询时带条件：

```text
field tenant == {tenant}
```

获取工作空间 namespace 时：

```text
tenant route
  -> get Workspace by id with tenant requirement
  -> namespace = workspace.namespace or workspace.id
```

这样可以防止租户 A 通过 URL 猜测租户 B 的 workspace id。

## 应用归属

租户路径下创建 Instance 时，会执行 `TenantInstanceBeforeCreate`：

```text
tenant from route
  -> instance.commonLabels[app.xiaoshiai.cn/tenant] = tenant
```

Instance controller 后续把 common labels 注入所有渲染资源：

```text
Instance commonLabels
  -> global.labels
  -> PostRender labels
  -> Kubernetes resources
```

作用：

- 资源树按租户过滤。
- 日志、监控、追踪可以按租户聚合。
- Kubernetes namespace 和 workload 都有租户归属线索。

## 租户配额和 Flavor

租户 Flavor 过滤依赖：

```text
ListTenantNodeResource
  -> list ClusterResourceQuota by tenant
  -> build QuotaLimitUsage
  -> apply resourcePool labels
  -> filter enabled flavors
```

匹配规则由 Flavor 文档描述，核心是：

- 资源名匹配。
- 型号匹配或通配。
- Flavor nodeSelector 覆盖 quota nodeSelector。
- ResourcePool 标签参与匹配。

## API 摘要

集群元数据：

```text
GET /tenants/{tenant}/clustermetadatas
GET /tenants/{tenant}/clustermetadatas/{cluster}
GET /tenants/{tenant}/clustermetadatas/{cluster}/metadata/apis/...
```

集群启用：

```text
GET  /tenants/{tenant}/clusters/{cluster}/available
POST /tenants/{tenant}/clusters/{cluster}/enable
```

租户配额：

```text
GET /tenants/{tenant}/clusters/{cluster}/resourcequotas
GET /tenants/{tenant}/clusters/{cluster}/resourcequotas/{resourcequota}
GET /tenants/{tenant}/clusters/{cluster}/quotaresources
GET /tenants/{tenant}/clusters/{cluster}/quota-selector
```

租户工作空间和实例：

```text
GET    /tenants/{tenant}/clusters/{cluster}/workspaces
POST   /tenants/{tenant}/clusters/{cluster}/workspaces
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}
PUT    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}
DELETE /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}

GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances
POST   /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances
```

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| 租户绕过归属访问工作空间 | URL 猜测 workspace id | Get/List 使用 tenant 字段条件 |
| 租户无配额却创建工作空间 | 后续 Flavor 和资源不可控 | 创建工作空间前检查租户 ClusterResourceQuota |
| 资源归属丢失 | workload 没有租户标签 | Instance 创建注入 commonLabels，PostRender 注入资源 |
| enablement 语义过轻 | 当前启用不等于完整审批 | 文档明确 enablement 是可用性和初始化对象 |
| 默认配额误解 | 默认 CPU/Memory 不代表高级资源授权 | 高级资源仍需显式 ClusterResourceQuota |

## 演进方向

- 将租户配额聚合为调度队列容量。
- 增强租户级成本和用量统计。
- 增加租户级默认工作空间策略。
- 将 enablement 接入审批流。
- 将租户标签贯穿更多可观测数据源。
