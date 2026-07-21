# 应用设计

本文描述 `rune` 的应用设计。应用能力由 `Product`、Helm chart、`Instance`、控制器和状态聚合共同组成。

## 对象模型

### Product

`Product` 是可安装应用的元数据：

```yaml
id: vllm
name: vLLM
icon: ""
tenant: system
category: inference
domain: user
published: true
versions:
- version: 1.0.0
  appVersion: 0.8.0
  url: registry.example.com/charts/vllm
  releaseNote: ""
i18n: {}
```

职责：

- 作为应用市场和控制台列表的展示对象。
- 管理可发布版本。
- 从 chart 元数据同步描述、图标、labels、annotations 和 i18n。
- 不保存运行态。

### ProductChart

`ProductChart` 是 Helm chart 的产品化视图：

```yaml
metadata: {}
values: {}
schema: values.schema.json
i18n: {}
readme: README.md
readmes: {}
changelog: CHANGELOG.md
raw: []
```

来源：

- Helm chart metadata。
- `values.yaml`。
- `values.schema.json`。
- `README.md` 和 `README.{locale}.md`。
- `CHANGELOG.md`。
- `i18n/{locale}.yaml`。

### Instance

`Instance` 是安装后的应用实例：

```yaml
cluster: cluster-a
namespace: workspace-a
product:
  id: vllm
  name: vLLM
  url: registry.example.com/charts/vllm
  version: 1.0.0
commonLabels:
  app: demo
values:
  replicaCount: 1
  worker:
    flavor:
      id: h100-1gpu
extensions:
- kind: NodePort
  config:
    service: vllm
    ports: "8000"
status:
  phase: Healthy
  healthy: true
  endpoints: []
  states: []
  resources: []
```

职责：

- 保存用户配置。
- 指向 Product 和 chart 版本。
- 绑定集群和 namespace。
- 驱动 Helm install/upgrade/delete。
- 汇总运行状态和资源引用。

### InstanceTemplate

`InstanceTemplate` 是从已有实例保存出的可复用配置：

```yaml
product: {}
reference: {}
values: {}
extensions: []
```

用途：

- 复用已调好的 values。
- 保留产品引用和扩展配置。
- 作为后续快速创建 Instance 的输入。

## 创建和更新链路

```text
User/API
  -> InstanceData
  -> ConvertWorkspaceInstanceToInstance
  -> BeforeCreate/BeforeUpdate hooks
  -> ValidateValues
  -> store Instance
  -> InstanceController
  -> ResolveHelmValues
  -> PrepareChart
  -> Helm ApplyChart
  -> PostRender
  -> Kubernetes resources
  -> status sync
```

关键规则：

- Instance ID 缺省时自动生成，并限制长度。
- Instance 自动写入 `cluster` 和 `namespace`。
- `permission` 不从普通用户输入透传。
- managed labels 会在更新时保留。
- 创建和更新都会执行 values 校验。

## Values 契约

### 存储格式

`values.Values` 保存为 map：

```go
type Values struct {
    Object map[string]any
}
```

行为：

- JSON/BSON 反序列化时移除空值。
- 序列化时空对象输出 `{}`。
- patch 和 resolve 使用 Helm 风格 map merge。

### ResolveHelmValues

控制器渲染前会解析 values：

```text
instance.values
  + global.labels from commonLabels
  -> resolvedValues
```

`resolvedValues` 会写入 `status.values`，用于判断是否需要重新安装或升级。

### Schema 扩展

当前内置扩展：

```yaml
x-resource-enum:
  resource: flavors
```

处理方式：

- chart schema 声明某字段是 Flavor。
- 用户传入 `id`。
- 服务端读取当前集群 Flavor。
- 校验 Flavor 已启用。
- 用服务端 Flavor 覆盖 `resources`、`nodeSelector`、`tolerations`。

## Chart 契约

应用 chart 应提供：

- `values.yaml`：默认配置。
- `values.schema.json`：控制台表单和服务端校验。
- `README.md`：默认说明。
- `README.{locale}.md`：本地化说明。
- `CHANGELOG.md`：版本变更。
- `i18n/{locale}.yaml`：本地化文案。
- `dashboards/`：实例仪表盘。

Chart.yaml annotations 可选：

```text
app.kubernetes.io/roles
app.kubernetes.io/states-expression
app.kubernetes.io/summary-expression
app.kubernetes.io/related-endpoints
```

说明：

- `roles` 描述多角色、扩缩容路径和 component label。
- `states-expression` 用 CEL 自定义状态。
- `summary-expression` 用 CEL 生成列表摘要。
- `related-endpoints` 从 values 中读取外部关联地址。

## Helm 渲染和 PostRender

### 基础安装

控制器下载 chart 后调用 Helm apply：

```text
DownloadChart(product.url, product.version)
  -> loader.LoadFiles
  -> helm.ApplyChart(releaseName=instance.ID, namespace=instance.namespace)
```

渲染完成后，manifest 会被解析为资源引用并写入：

```yaml
status:
  resources:
  - apiVersion: apps/v1
    kind: Deployment
    namespace: workspace-a
    name: vllm
```

### 标签注入

PostRender 会注入：

```text
app.kubernetes.io/instance = release name
commonLabels
```

注入范围：

- 资源 metadata labels。
- Pod template labels。
- Pod labels。
- StatefulSet volumeClaimTemplates labels。
- 部分 workload selector 中的 instance label。

这些标签是资源树、日志、监控、追踪和实例归属的基础。

### 命名空间和权限

PostRender 会检查资源命名空间：

- namespaced 资源如果未指定 namespace，则设置为 Instance namespace。
- namespaced 资源如果指定了其他 namespace，则拒绝。
- cluster-scoped 资源默认拒绝。
- 只有 `allowClusterScopeResource` 为 true 时才允许 cluster-scoped 资源。

### 扩展

当前扩展：

```yaml
extensions:
- kind: NodePort
  config:
    service: web
    ports: "80:30080,443"
```

行为：

- 找到目标 Service。
- 复制出一个 `{service}-nodeport` Service。
- 设置为 NodePort。
- 只暴露配置中声明的端口。

### 暂停

停止实例时 patch：

```yaml
values:
  global:
    paused: true
```

PostRender 行为：

- Deployment replicas 置为 0。
- StatefulSet replicas 置为 0。
- Job suspend 置为 true。

恢复实例时将 `global.paused` 设置为 false。

### 调度器注入

PostRender 会读取集群 global schedulers 配置：

```text
scheduler rule:
  name: xpai-scheduler
  resources:
  - nvidia.com/gpu
```

如果 Pod 或 PodTemplate 中任一容器 requests/limits 使用了规则中的资源，则注入：

```yaml
spec:
  schedulerName: xpai-scheduler
```

这使 chart 不需要硬编码调度器名称。

### Dashboard

chart 中的 `dashboards/` 文件会被解析成 ConfigMap：

```text
{instance}-dashboards
```

控制台可以从该 ConfigMap 列出和查询实例级仪表盘。

### StatefulSet 不可变字段

升级时会从现有 StatefulSet 保留不可变字段：

- `serviceName`
- `podManagementPolicy`
- `selector`
- `volumeClaimTemplates`
- `ordinals`

避免用户修改 chart 后 Helm upgrade 因 StatefulSet 不可变字段失败。

## 状态聚合

### 条件

Instance controller 维护：

```text
ClusterConnected
Installed
```

失败时写入 status message 和 Failed phase。

### 资源来源

状态同步从 Instance cache 获取相关资源：

```text
namespace + app.kubernetes.io/instance
  -> resources
  -> endpoints / states / summary
```

直接由 Helm manifest 创建的资源引用存入 `status.resources`。

### 默认端点

默认从以下资源提取端点：

- Ingress。
- Service。

API 返回实例时可以通过 EndpointCompleter 补全实际访问 URL。

### 默认状态

默认支持：

- Job。
- Deployment。
- StatefulSet。
- DaemonSet。
- Pod。

长期服务应用：

```text
Running/Healthy -> Healthy
Degraded/Updating/Scaling -> Degraded
Pending -> Unhealthy
Failed/Error/CrashLoopBackOff -> Failed
```

纯 Job 应用：

```text
Running -> Running
Pending -> Pending
Succeeded -> Succeeded
Failed -> Failed
mixed success/failure -> PartialFailed
```

### 角色状态

如果 chart 声明 `app.kubernetes.io/roles`：

```json
[
  {
    "name": "worker",
    "replicaPath": "worker.replicaCount",
    "flavorPath": "worker.flavor",
    "componentLabel": "worker",
    "scalable": true
  }
]
```

状态聚合会把资源的 `app.kubernetes.io/component` 映射到角色。

### 自定义表达式

支持 CEL 数据：

```text
instance
resources
values
```

用途：

- 自定义 states。
- 自定义 summary。
- 解析 related endpoints。

## 生命周期操作

### 创建

```text
POST /instances
```

行为：

- 补 ID。
- 写 creator label。
- 校验 values。
- 保存 Instance。
- 控制器异步安装。

### 更新

```text
PUT /instances/{instance}
```

行为：

- 保留 managed labels。
- 校验 values。
- 保存 spec。
- 控制器对比 product、resolved values、extensions。
- 如果变化则 Helm upgrade。

### 删除

```text
DELETE /instances/{instance}
```

行为：

- phase 置为 Terminating。
- 调用 Helm remove。
- 删除 release 资源。

### 停止和恢复

```text
PUT /instances/{instance}:stop
PUT /instances/{instance}:resume
```

行为：

- patch `global.paused`。
- 由 PostRender 在下一轮渲染中修改工作负载。

### 扩缩容

```text
PUT /instances/{instance}:scale
```

单角色：

- 自动寻找 `replicaCount` 或 `replicas`。

多角色：

- 根据 `roles` 查找 `replicaPath`。
- 只允许 `scalable=true` 的角色。

### 保存模板

```text
POST /instances/{instance}:template
```

保存：

- product reference。
- values。
- extensions。
- reference。

## API 摘要

工作空间实例：

```text
GET    /instances
POST   /instances
GET    /instances/{instance}
PUT    /instances/{instance}
DELETE /instances/{instance}
PUT    /instances/{instance}:stop
PUT    /instances/{instance}:resume
PUT    /instances/{instance}:scale
POST   /instances/{instance}:template
GET    /instances/{instance}/resources
```

产品和 chart：

```text
GET    /products
GET    /products/{product}
POST   /products/{product}/charts
GET    /products/{product}/charts/{version}
```

具体路径会由租户、集群和工作空间路由前缀包裹。

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| Chart 越权创建资源 | chart 创建其他 namespace 或 cluster-scoped 资源 | PostRender 强校验 namespace，默认拒绝 cluster-scoped |
| 用户伪造规格资源 | values 中手写 resources | Flavor schema 扩展用服务端 Flavor 覆盖 |
| 状态不准确 | 自定义 CRD 默认状态无法识别 | chart 通过 states-expression 补充 |
| 端点不完整 | 某些服务端点不来自 Service/Ingress | 使用 related-endpoints 或后续 endpoints-expression |
| StatefulSet 升级失败 | 不可变字段变化 | 保留集群中已有不可变字段 |
| 多角色路径不统一 | chart values 结构不固定 | roles 注解声明 replicaPath/flavorPath/componentLabel |
| Helm chart 过度耦合平台 | chart 写死调度器或平台字段 | 通过 schema、post-render 和 annotations 建立契约 |

## 演进方向

### 稳定应用生命周期

- 明确 Product、Chart、Instance 边界。
- 完善 chart 契约文档。
- 保持创建、更新、删除、停止、恢复、扩缩容稳定。

### 强化状态和资源树

- 提升自定义 CRD 状态表达能力。
- 增强端点表达式。
- 在资源树中展示调度、Flavor、事件和健康原因。

### 应用与调度/规格联动

- Instance 状态聚合调度队列和 PodGroup 信息。
- 多角色 Flavor 展示和变更审计。
- DRA/CDI 设备资源进入应用资源视图。
