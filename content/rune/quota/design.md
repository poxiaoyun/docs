# 配额设计

本文描述 `rune` 的配额设计。配额分为租户级 `ClusterResourceQuota` 和工作空间级 `ResourceQuota`。

## 核心模型

### ClusterResourceQuota

```yaml
tenant: tenant-a
cluster: cluster-a
resourcePool: h100-pool
config:
- resourceName: nvidia.com/gpu
  type: Accelerator
  model: NVIDIA-H100
  vendor: Nvidia
  limit: "8"
  request: "8"
  nodeSelector:
    feature.node.cloud.xiaoshiai.cn/accelerator-model.name: NVIDIA-H100
limits:
  nvidia.com/gpu: "8"
requests:
  nvidia.com/gpu: "8"
status:
  usedLimits:
    nvidia.com/gpu: "4"
```

职责：

- 控制租户在集群内的资源上限。
- 为租户 Flavor 过滤提供依据。
- 后续为调度队列容量提供依据。

### ResourceQuota

```yaml
tenant: tenant-a
workspace: ws-a
resourcePool: h100-pool
config: []
limits: {}
requests: {}
status: {}
```

职责：

- 控制工作空间 namespace 内的资源使用。
- 为工作空间 Flavor 过滤提供依据。
- 继承租户和工作空间路由边界。

### ResourceQuotaConfig

配额输入使用资源配置项：

```yaml
resourceName: cpu
type: CPU
name: CPU
model: ""
vendor: ""
limit: "16"
request: "16"
nodeSelector: {}
```

设计原因：

- 与 FlavorResourceConfig 共享 NodeResource 语义。
- 能表达资源名、型号、厂商和节点约束。
- 控制台可直接复用资源选择表单。

## 配额生成链路

```text
ResourceQuotaConfig
  -> limits / requests
  -> ToResourceQuotaHard
  -> scopeSelector from nodeSelector
  -> labels type/model/vendor/tenant/resourcePool
  -> annotation stores config
```

规则：

- `limit` 写入 limits。
- `request` 为空时默认等于 limit。
- requests 转为 `requests.{resource}`。
- limits 转为 `limits.{resource}`。
- storage 特殊映射为 requests storage。
- nodeSelector 转为 quota scopeSelector。
- config JSON 存入 annotation 供表单回填。

## 资源发现链路

集群可配置资源：

```text
NodeList
  -> optional ResourcePool node filter
  -> ListAggregateNodesResources with AddQuantity
  -> apply overSellingRate for CPU/Memory
  -> subtract other tenants usage
  -> append storage class resources
  -> round resources
```

ResourcePool 过滤：

- 读取 ResourcePool 节点列表。
- 删除不在池内的节点。

超卖：

- 仅 CPU 和 Memory 支持。
- 结果为 `capacity * (1 + overSellingRate)`。

扣减其他租户：

- 按 tenant、resourceName、model 统计已有 ClusterResourceQuota。
- 查询某租户可配置资源时扣除其他租户已分配量。

## Flavor 过滤链路

租户：

```text
ClusterResourceQuota
  -> QuotaLimitUsage
  -> filter enabled Flavor
```

工作空间：

```text
namespace ResourceQuota
  -> QuotaLimitUsage
  -> filter enabled Flavor
```

匹配规则：

- resourceName 必须匹配。
- quota model 为空表示通配。
- quota model 非空时必须匹配 Flavor model。
- Flavor nodeSelector 必须覆盖 quota nodeSelector。
- ResourcePool 标签参与 nodeSelector 匹配。

售罄规则：

- 如果所有匹配 quota 都 `limit <= used`，Flavor 标记 soldOut。
- 如果任一 Flavor config 没有匹配 quota，Flavor 不返回。
- 如果匹配 quota 的 limit 全为零，Flavor 不返回。

## API 摘要

集群配额资源：

```text
GET /clusters/{cluster}/quotaresources
GET /clusters/{cluster}/quota-selector
```

租户配额：

```text
GET /tenants/{tenant}/clusters/{cluster}/resourcequotas
GET /tenants/{tenant}/clusters/{cluster}/resourcequotas/{resourcequota}
GET /tenants/{tenant}/clusters/{cluster}/quotaresources
GET /tenants/{tenant}/clusters/{cluster}/quota-selector
```

工作空间配额：

```text
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/resourcequotas
POST   /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/resourcequotas
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/resourcequotas/{resourcequota}
PUT    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/resourcequotas/{resourcequota}
DELETE /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/resourcequotas/{resourcequota}
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/quotaresources
GET    /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/quota-selector
```

## 与其他模块的关系

### 租户

租户启用集群时初始化基础 CPU 和内存 ClusterResourceQuota。

### 工作空间

创建工作空间前要求租户已有 ClusterResourceQuota。

### 资源规格

Flavor 可见性和 soldOut 状态由配额决定。

### 资源池

配额可以绑定 ResourcePool，并将 ResourcePool 标签纳入 nodeSelector。

### 调度

后续 SchedulingQueue capacity 可以从租户 ClusterResourceQuota 聚合得到。

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| 配额和实际集群资源不一致 | 节点变化或其他租户已占用 | quota resources 实时从集群和已有配额计算 |
| 型号匹配错误 | resourceName 相同但 model 不同 | 匹配规则包含 model 和 nodeSelector |
| 工作空间越权 | workspace 配额大于租户授权 | 当前通过租户路径和可选资源约束，后续需加强校验 |
| 复杂设备计量困难 | DRA claim 不一定能直接转为 resourceName | 后续通过 queueAccounting 和 device requirement 补齐 |
| 超卖误用 | GPU/NPU 不应超卖 | 只允许 CPU 和 Memory 应用 overSellingRate |

## 演进方向

### 配额校验

- 校验工作空间配额不超过租户剩余额度。
- 校验 ResourcePool 和型号组合存在。
- 增加配额变更影响评估。

### 调度联动

- 将租户配额聚合为队列 capacity。
- 将 requests 聚合为队列 deserved。
- 增加配额和队列状态一致性检查。

### 设备扩展

- 支持 DRA/CDI 复杂设备计量。
- 支持拓扑域配额。
- 支持资源池内碎片化展示。
