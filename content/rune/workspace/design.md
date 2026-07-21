# 工作空间设计

本文描述 `rune` 的工作空间设计。工作空间是 cluster-scoped 的产品对象，运行时映射到 Kubernetes namespace。

## 核心模型

### Workspace

```yaml
id: ws-a
name: Demo
cluster: cluster-a
namespace: ws-a
tenant: tenant-a
labels: {}
annotations: {}
status:
  phase: Ready
  message: ""
```

字段含义：

- `id` 是产品对象 ID，也是默认 namespace 名称。
- `cluster` 表示目标集群。
- `tenant` 表示所属租户。
- `namespace` 预留映射字段；当前主要使用 `id`。
- `status.phase` 表示控制器同步结果。

### Namespace 映射

当前映射规则：

```text
workspace namespace = workspace.namespace or workspace.id
```

在租户路径中，先检查 workspace 属于当前 tenant，再转换成 namespace。

## 创建链路

租户路径创建：

```text
POST /tenants/{tenant}/clusters/{cluster}/workspaces
  -> validate id
  -> check tenant ClusterResourceQuota exists
  -> create Workspace{tenant, cluster, namespace=id}
  -> WorkspaceController
  -> create/update Namespace
  -> create/update LimitRange
  -> status Ready
```

保留前缀：

```text
kube-
system
default
rune-
```

这些前缀不能作为租户工作空间 ID 开头。

## 控制器行为

### Namespace

控制器创建或更新：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ws-a
  labels:
    app.xiaoshiai.cn/tenant: tenant-a
    app.xiaoshiai.cn/workspace: ws-a
```

同时复制 Workspace 的 labels 和 annotations。

### LimitRange

控制器创建默认 LimitRange：

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limit-range
  namespace: ws-a
spec:
  limits:
  - type: Container
    defaultRequest:
      cpu: 100m
      memory: 128Mi
    default:
      cpu: 500m
      memory: 512Mi
```

目的：

- 避免 Pod 完全没有资源请求。
- 给普通工作负载提供基础默认值。

### 删除

删除 Workspace 时：

```text
Workspace finalizer
  -> delete Kubernetes Namespace
```

注意：删除 namespace 会触发 Kubernetes 清理 namespace 内资源。

## API 形态

管理/集群路径：

```text
GET    /clusters/{cluster}/workspaces
POST   /clusters/{cluster}/workspaces
GET    /clusters/{cluster}/workspaces/{workspace}
PUT    /clusters/{cluster}/workspaces/{workspace}
DELETE /clusters/{cluster}/workspaces/{workspace}
```

租户路径：

```text
GET    /tenants/{tenant}/clusters/{cluster}/workspaces
POST   /tenants/{tenant}/clusters/{cluster}/workspaces
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}
PUT    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}
DELETE /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}
```

资源 API：

```text
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/resources/apis/...
```

Instance API 位于：

```text
/tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances
```

## 配额链路

工作空间配额使用 namespace ResourceQuota：

```text
POST /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/resourcequotas
```

处理流程：

```text
ResourceQuota config
  -> applyResourceQuota
  -> hard requests/limits
  -> scopeSelector from nodeSelector
  -> labels type/model/vendor/tenant/resourcePool
  -> annotation stores config
```

工作空间可用资源：

```text
ListWorkspaceNodeResource
  -> list namespace ResourceQuota
  -> convert config to QuotaLimitUsage
  -> apply resourcePool labels
  -> aggregate
```

用途：

- 工作空间 Flavor 过滤。
- 工作空间配额表单。
- 后续成本和调度展示。

## 应用实例边界

租户 Instance provider 做两件事：

```text
tenant + cluster + workspace
  -> get Workspace with tenant requirement
  -> namespace = workspace.namespace or workspace.id
  -> Instance API uses that namespace
```

Instance PostRender 再保证：

- namespaced 资源 namespace 为空时设置为工作空间 namespace。
- namespaced 资源指定其他 namespace 时拒绝。
- cluster-scoped 资源默认拒绝。

因此工作空间是应用资源的实际运行边界。

## 资源视图

工作空间资源 API 使用：

```text
workspace -> namespace -> Kubernetes resource API
```

支持：

- 基础资源列表。
- Pod 扩展信息。
- 事件。
- 子资源/层级。
- Service proxy。

工作空间资源视图是 Instance 资源树的上层范围。

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| namespace 名称冲突 | 工作空间 ID 直接映射 namespace | 自动生成 `ws-`，租户路径限制保留前缀 |
| 租户越权访问 | 猜测其他租户 workspace id | 租户路径查询带 tenant requirement |
| 删除影响大 | 删除 Workspace 会删除 namespace | 控制台需提示 namespace 内资源会被清理 |
| namespace 映射不一致 | `namespace` 字段存在但部分路径直接用 id | 当前文档明确主路径使用 id，后续统一映射函数 |
| 默认 LimitRange 不适合所有应用 | 默认 CPU/Memory 可能影响特殊 workload | 后续支持工作空间策略配置 |
| 无配额工作空间 | Flavor 和资源使用不可控 | 租户路径创建前检查租户配额存在 |

## 演进方向

- 统一所有路径的 workspace namespace 映射逻辑。
- 支持工作空间级默认策略，包括 LimitRange、NetworkPolicy、PodSecurity。
- 增加删除保护和资源残留检查。
- 增强工作空间级成本、用量和告警。
- 与调度队列建立项目级映射。
