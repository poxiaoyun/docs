# 资源池需求

本文描述 `rune` 的资源池需求。资源池用于把一个集群内的节点按硬件、用途、租户、环境或运维策略划分成多个节点集合。

## 背景

同一个 Kubernetes 集群里可能同时存在 H100 节点、A100 节点、CPU 节点、生产节点、实验节点和专用节点。只按集群维度管理资源会导致规格、配额和调度边界不清晰。

ResourcePool 提供一个产品层节点集合，供 Flavor、Quota、Dashboard 和后续调度策略引用。

## 用户问题

### 管理员需要划分节点集合

平台管理员需要把节点按用途和硬件分组。

需求：

- ResourcePool 可以保存节点列表。
- 节点可以属于某个资源池。
- 资源池需要有名称、描述、标签和注解。
- 删除资源池时需要清理节点上的资源池标签。

### Flavor 需要限制到资源池

同样的 H100 规格可能只允许在某个节点池使用。

需求：

- Flavor 可以绑定 ResourcePool。
- Flavor 绑定后自动生成 ResourcePool nodeSelector。
- Instance 渲染出的 Pod 会通过 Flavor nodeSelector 限定到资源池。

### 配额需要按资源池授权

租户可能只购买了某个资源池里的资源。

需求：

- ClusterResourceQuota 可以绑定 ResourcePool。
- ResourceQuota 可以绑定 ResourcePool。
- quota resources 查询可以按 ResourcePool 过滤节点。
- Flavor 过滤时 ResourcePool 标签参与匹配。

### 资源池需要可观测

管理员需要查看某个资源池内节点的资源使用和健康状态。

需求：

- 资源池提供 dashboard 列表。
- dashboard 查询时只展示资源池节点。
- dashboard 模板变量需要限制在资源池节点范围内。

## 产品能力需求

### 资源池管理

需要支持：

- 创建。
- 列表。
- 获取。
- 更新。
- 删除。
- 节点列表维护。

### 节点标签同步

需要支持：

- 给资源池内节点写入资源池标签。
- 从非资源池节点移除该资源池标签。
- 忽略不存在的节点并记录日志。
- 控制器重启后重新同步。

### 资源池消费

需要支持：

- Flavor 绑定 ResourcePool。
- Quota 绑定 ResourcePool。
- quota resources 按 ResourcePool 过滤。
- Dashboard 按 ResourcePool 过滤。

## 非目标

第一阶段不要求：

- 不实现节点自动分池。
- 不实现一个节点多资源池的复杂归属策略。
- 不在 ResourcePool 中直接表达资源配额。
- 不在 ResourcePool 中直接表达调度队列。
- 不在删除资源池时自动迁移工作负载。

## 验收标准

- 管理员可以创建包含节点列表的 ResourcePool。
- 控制器能给池内节点打资源池标签。
- 控制器能从池外节点移除该资源池标签。
- Flavor 绑定 ResourcePool 后生成对应 nodeSelector。
- Quota 绑定 ResourcePool 后参与资源发现和 Flavor 过滤。
- ResourcePool dashboard 只展示池内节点。
