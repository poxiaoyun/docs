# 可观测性设计

本文描述 `rune` 的可观测性设计。可观测性 API 聚合 monitoring、logging、tracing、alert 和 diagnostics 模块。

## 模块入口

```text
observability.API
  -> Logging
  -> Monitoring
  -> Tracing
  -> Alert
  -> Diagnostics
```

初始化时复用租户工作空间实例 provider：

```text
tenant + cluster + workspace + instance
  -> namespace
  -> Kubernetes client
  -> operation provider
```

这保证实例、工作空间和租户边界一致。

## 指标设计

指标查询基于 Prometheus：

```text
request
  -> metric name
  -> mapper expression
  -> render selectors
  -> Prometheus query or query_range
```

支持参数：

- `time`。
- `start`。
- `end`。
- `step`。
- `filter`。
- `by`。
- `aggregate`。

指标映射包括：

- Node。
- Pod。
- Service。
- Ingress。
- PVC。
- StorageVolume。
- Certificate。
- Accelerator。
- VirtualAccelerator。
- OpenTelemetry。

### 集群指标

集群指标使用 cluster route：

```text
/clusters/{cluster}/metrics/{metrics}
```

表达式包括：

- API Server 请求和延迟。
- etcd 请求和延迟。
- 集群 CPU 和内存。
- 集群磁盘。
- 运行 Pod 数量。

### 实例指标

实例指标使用 instance route：

```text
/tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/metrics/{metrics}
```

自动过滤：

```text
namespace="{namespace}",instance="{instance}"
```

### 资源指标

资源指标从 request metadata 推导 resource、namespace 和 name，再选择对应 mapper。

## Dashboard 设计

Dashboard 来源：

- 内置 dashboard。
- 集群 scope 存储的 MetricsDashboard。
- Instance chart 生成的 dashboard ConfigMap。
- ResourcePool 复用集群 dashboard 后过滤节点。

渲染链路：

```text
dashboard config
  -> render options
  -> panel PromQL
  -> Prometheus query
  -> rendered dashboard result
```

实例 dashboard 参数：

- `instance`。
- `namespace`。
- `job`。
- `service`。
- ingress controller 相关参数。

集群 dashboard 参数：

- `cluster`。
- resource metadata 中的 namespace、resource name。

## 日志设计

日志 provider 抽象：

```go
type LoggingProvider interface {
    QueryLogs(...)
    StreamLogs(...)
    SeriesLogs(...)
    QueryLabels(...)
    QueryLabelValues(...)
}
```

默认 provider：

```text
LokiProviderFactory
```

实例日志自动 selector：

```text
namespace={namespace}
instance={instance}
```

用户 selector 会与自动 selector 合并。

支持能力：

- 普通查询。
- 流式查询。
- series 查询。
- label 查询。
- label values 查询。

## 告警设计

核心对象：

- AlertRule。
- AlertRecord。
- AlertRuleTemplateGroup。
- AlertRuleTemplateResourceGroup。
- AlertRuleTemplate。
- Alert channel。

应用告警规则存储 scope：

```text
cluster + workspace + instance
```

规则状态查询：

```text
local AlertRule
  -> Kubernetes Prometheus rules API
  -> match generated resource name
  -> set local rule status
```

生成 Kubernetes 对象：

- PrometheusRule。
- AlertmanagerConfig。

告警表达式支持模板：

- `@` 替换 label matcher。
- `#` 替换 namespace 条件。
- 单位和阈值进入 annotations。

## 诊断设计

Diagnostics API 独立挂载，并提供 internal group。

设计要点：

- diagnostics options 控制启用和工具配置。
- membership checker 校验租户成员。
- token、status、tools、resources 组成诊断上下文。
- 诊断能力应受权限和配置限制。

## API 摘要

指标和 dashboard：

```text
GET /clusters/{cluster}/metrics/{metrics}
GET /clusters/{cluster}/dashboards
GET /clusters/{cluster}/dashboards/{dashboard}/query
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/metrics/{metrics}
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/dashboards
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/dashboards/{dashboard}/query
```

日志：

```text
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/logs
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/logs/stream
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/logs/series
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/logs/labels
```

告警：

```text
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/alertrules
POST   /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/alertrules
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/alertrules/{rule}
PUT    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/alertrules/{rule}
DELETE /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/alertrules/{rule}
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/templategroups
```

## 与其他模块的关系

### 集群

可观测性通过 CloudInfo 获取 Kubernetes client 和 Prometheus operation。

### 工作空间

工作空间决定 namespace，所有实例可观测查询都必须带 namespace 边界。

### 应用

Instance label 和 chart dashboard 是实例可观测能力的基础。

### 资源池

ResourcePool dashboard 复用 monitoring dashboard 并按节点过滤。

### 调度

后续调度 pending reason、队列状态和资源碎片可进入可观测视图。

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| 后端未安装 | Prometheus 或 Loki 不存在时查询失败 | 返回明确错误，控制台提示扩展未启用 |
| 查询越界 | 用户构造 selector 查询其他 namespace | 实例和工作空间 API 自动追加 namespace/instance selector |
| PromQL 模板不兼容 | 指标名依赖监控扩展版本 | mapper 集中维护，dashboard 渲染失败可诊断 |
| dashboard 缺失 | chart 未提供 dashboard | 使用内置 dashboard 或返回空列表 |
| 告警对象漂移 | 本地 AlertRule 与 PrometheusRule 不一致 | 查询时从 Prometheus rules 回填状态 |
| 日志后端差异 | Loki 和 VictoriaLogs 查询语义不同 | LoggingProvider 抽象隔离 |

## 演进方向

### 数据源

- 支持更多日志 provider。
- 支持 tracing 查询详情。
- 支持 GPU/NPU 厂商指标适配。

### 产品化

- 增加可观测性安装状态检查。
- 增加 dashboard lint。
- 增加告警规则影响预览。

### 调度诊断

- 将调度事件、PodGroup 状态和队列状态接入实例诊断。
- 增加资源池和队列维度利用率。
- 增加 Pending 原因趋势图。
