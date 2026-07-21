# 可观测性需求

本文描述 `rune` 的可观测性需求。可观测性用于帮助用户从集群、工作空间、应用实例和资源对象角度查看运行状态、性能、日志、告警和诊断结果。

## 背景

应用创建后，用户需要知道是否健康、资源是否充足、请求是否异常、日志在哪里、告警是否触发。平台管理员还需要查看集群和节点级资源使用情况。

`rune` 的可观测性能力不是自己采集所有数据，而是作为产品 API 层，对接 Prometheus、Loki 或 VictoriaLogs、Tracing 后端、Alertmanager/PrometheusRule 和诊断工具。

## 用户问题

### 用户需要应用级指标和 dashboard

用户关心某个 Instance 的 CPU、内存、网络、请求延迟、GPU/NPU 使用和健康状态。

需求：

- 按租户、集群、工作空间、实例查询指标。
- 自动注入 namespace 和 instance 过滤条件。
- 支持实例 dashboard 列表、查询和参数列表。
- 支持 chart 中的 dashboard ConfigMap。

### 管理员需要集群和资源级指标

管理员需要查看集群整体、节点、Pod、Service、Ingress、PVC、证书和加速卡指标。

需求：

- 支持集群级 metrics。
- 支持 Kubernetes 资源级 metrics。
- 支持内置 dashboard。
- 支持自定义 dashboard 配置。
- 支持查询时间范围、step、聚合和 by 标签。

### 用户需要日志查询和流式日志

用户需要按实例、Pod、容器和关键字查日志，也需要持续查看实时日志。

需求：

- 支持实例日志查询。
- 支持实例日志 stream。
- 支持日志 series。
- 支持 labels 和 label values 查询。
- 自动追加 namespace 和 instance selector。
- 支持 Loki 和后续其他日志后端。

### 用户需要告警

用户需要对应用或集群资源设置告警，并查看告警状态和历史。

需求：

- 支持应用告警规则 CRUD。
- 支持告警模板组和模板资源。
- 支持从 Prometheus 查询规则状态。
- 支持 AlertRecord。
- 支持通知渠道。

### 运维需要诊断能力

运维需要对实例或资源执行诊断工具，并控制租户权限。

需求：

- 提供诊断 API。
- 支持内部诊断接口。
- 支持诊断 options。
- 支持租户成员校验。

## 产品能力需求

### 指标

需要支持：

- 集群级指标。
- 实例级指标。
- 工作空间或 namespace 级指标。
- 资源对象级指标。
- 加速卡和虚拟加速卡指标。
- OpenTelemetry 请求指标。
- 存储卷指标。

### Dashboard

需要支持：

- 内置 dashboard。
- chart dashboard。
- cluster dashboard。
- instance dashboard。
- resource dashboard。
- dashboard 参数列表。
- dashboard 查询渲染。

### 日志

需要支持：

- 查询。
- 流式输出。
- 时间范围。
- selector。
- limit。
- direction。
- label 查询。
- label value 查询。

### 告警

需要支持：

- AlertRule。
- AlertRecord。
- PrometheusRule 生成。
- AlertmanagerConfig 生成。
- 通知渠道。
- 模板和模板组。

### 诊断

需要支持：

- 诊断工具配置。
- 诊断状态。
- token 和权限校验。
- 资源上下文。

## 非目标

第一阶段不要求：

- 不自研 Prometheus、Loki 或 Tracing 存储。
- 不在可观测性模块直接管理应用生命周期。
- 不保证所有 chart 都有 dashboard。
- 不为所有 CRD 自动生成健康判断。
- 不把日志和指标查询暴露为无限制原始后端代理。

## 验收标准

- 可以查询集群级核心指标。
- 可以查询实例级核心指标。
- 可以列出并渲染实例 dashboard。
- 可以查询实例日志并自动带 namespace/instance selector。
- 可以流式读取实例日志。
- 可以创建和查询应用告警规则。
- 可以查询告警模板。
- 诊断 API 能按配置启用并校验租户成员。
