# 资源池设计

本文描述 `rune` 的资源池设计。资源池是 cluster-scoped 对象，核心能力是维护节点集合并通过节点标签暴露给 Flavor、Quota 和 Dashboard。

## 核心模型

### ResourcePool

```yaml
id: h100-pool
name: H100 Pool
cluster: cluster-a
nodes:
- name: node-a
- name: node-b
```

字段含义：

- `id` 是资源池稳定标识。
- `name` 是展示名称。
- `nodes` 是池内节点列表。
- `cluster` 表示所属集群。

### ResourcePoolNode

```yaml
name: node-a
```

当前只保存节点名，不保存节点容量快照。容量由集群实时查询。

## 节点标签

资源池标签 key：

```text
cloud.xiaoshiai.cn/resourcepool-{poolID}
```

标签 value：

```text
true
```

用途：

- Flavor nodeSelector。
- Quota nodeSelector。
- Namespace 和资源过滤。
- 后续调度策略。

## 控制器链路

```text
ResourcePool changed
  -> list cluster nodes
  -> mark nodes in pool
  -> remove pool label from other nodes
```

处理规则：

- 如果 ResourcePool 没有 cluster，跳过同步。
- 如果节点不存在，记录日志并继续。
- 删除 ResourcePool 时，将对象 nodes 清空后执行同步。
- 控制器使用 finalizer 保证删除前清理标签。

## Flavor 绑定

Flavor 绑定 ResourcePool 时：

```text
flavor.resourcePool
  -> resourcepool label key/value
  -> flavor.nodeSelector
```

示例：

```yaml
nodeSelector:
  cloud.xiaoshiai.cn/resourcepool-h100-pool: "true"
```

chart 消费 Flavor 的 nodeSelector 后，Pod 会被约束到该资源池节点。

## Quota 绑定

租户和工作空间配额绑定 ResourcePool 时：

```text
quota.resourcePool
  -> nodeSelector includes resourcepool label
  -> scopeSelector
  -> labels for backfill
```

quota resources 查询时：

```text
resourcepool id
  -> load ResourcePool
  -> filter NodeList
  -> aggregate node resources
```

这样管理员配置配额时只看到资源池内资源。

## Dashboard 过滤

资源池 dashboard 复用集群 dashboard：

```text
cluster dashboard
  -> clone config
  -> build node regex from pool.nodes
  -> filter panels
  -> filter templating variables
  -> inject nodename matcher
```

保留的变量：

- `origin_prometheus`
- `job`
- `name`
- `instance`
- `interval`
- `device`
- `maxmount`
- `show_name`

如果资源池没有节点，则直接返回原 dashboard。

## API 摘要

资源池：

```text
GET    /clusters/{cluster}/resourcepools
POST   /clusters/{cluster}/resourcepools
GET    /clusters/{cluster}/resourcepools/{resourcepool}
PUT    /clusters/{cluster}/resourcepools/{resourcepool}
DELETE /clusters/{cluster}/resourcepools/{resourcepool}
```

资源池 dashboard：

```text
GET /clusters/{cluster}/resourcepools/{resourcepool}/dashboards
GET /clusters/{cluster}/resourcepools/{resourcepool}/dashboards/{dashboard}/query
GET /clusters/{cluster}/resourcepools/{resourcepool}/dashboards/{dashboard}/params
```

## 与其他模块的关系

### 集群

ResourcePool 依赖集群 client 读取和更新 Node。

### 资源规格

Flavor 通过 ResourcePool 标签限制节点范围。

### 配额

ClusterResourceQuota 和 ResourceQuota 通过 ResourcePool 标签限制资源授权范围。

### 可观测性

ResourcePool dashboard 复用集群 dashboard 并按节点过滤。

### 调度

ResourcePool 是后续队列、拓扑和调度策略的重要边界，但当前不直接生成调度对象。

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| 节点标签漂移 | 节点被手工改标签 | 控制器 watch ResourcePool 后可重新同步 |
| 节点不存在 | ResourcePool 保存了无效节点名 | 记录日志并跳过 |
| 多池归属不清 | 当前标签允许多个 pool key 同时存在 | 产品层应限制或明确节点归属策略 |
| 删除影响 workload | 删除资源池会清理标签，新 Pod 可能调度失败 | 删除前应在控制台提示影响 |
| dashboard 过滤不完整 | 面板 PromQL 不一定有 nodename matcher | 只对可识别模板变量和表达式做过滤 |

## 演进方向

### 节点归属

- 增加节点唯一归属校验。
- 增加按标签选择节点自动生成资源池。
- 增加节点池容量摘要。

### 策略联动

- 将 ResourcePool 作为队列和租户策略边界。
- 增加资源池级调度模板。
- 增加资源池维护模式。

### 可观测性

- 增加资源池资源总览。
- 增加资源池成本和利用率。
- 增加节点池健康检查。
