# 配额需求

本文描述 `rune` 的资源配额需求。配额用于限制租户和工作空间可使用的 CPU、内存、GPU、NPU、vGPU、存储和其他扩展资源。

## 背景

多租户共享集群时，必须有明确的资源售卖和使用边界。租户配额控制团队在集群中的资源上限，工作空间配额把租户资源进一步分配给项目或环境。

配额不仅用于 Kubernetes 限制，还会影响 Flavor 可见性、售罄状态、资源池选择和后续调度队列容量。

## 用户问题

### 租户资源需要上限

平台不能让一个租户无限使用集群资源。

需求：

- 租户在集群维度配置 `ClusterResourceQuota`。
- 配额支持 CPU、内存、存储和扩展资源。
- 配额支持硬件型号和资源池约束。
- 租户只能看到配额覆盖的 Flavor。

### 工作空间需要二级分配

租户内部可能有多个工作空间，需要按项目继续分配资源。

需求：

- 工作空间使用 namespace ResourceQuota。
- 工作空间配额不能脱离租户配额语义。
- 工作空间 Flavor 列表受工作空间配额限制。
- 工作空间可以查询可配置资源和 selector。

### 配额需要理解硬件型号

同样的资源名可能对应不同硬件型号，不能只按资源名授权。

需求：

- 配额 config 需要保存 type、model、vendor。
- 配额需要携带 nodeSelector。
- 配额需要支持 ResourcePool。
- 配额匹配 Flavor 时需要考虑资源名、型号和 nodeSelector。

### 配额配置需要来自集群资源

管理员需要知道当前集群还有哪些资源可分配。

需求：

- 从节点 allocatable 聚合可配置资源。
- 可按 ResourcePool 过滤节点。
- 可按租户排除其他租户已分配量。
- CPU 和内存支持超卖率。
- 存储类资源也能出现在可配置资源中。

### 配额需要可回填表单

用户创建或更新配额后，控制台需要能回填原始配置。

需求：

- 原始 config 写入 annotation。
- 读取 Kubernetes quota 时还原 config。
- labels 保存 type、model、vendor、tenant、resourcePool。

## 产品能力需求

### 租户配额

需要支持：

- 创建和更新 ClusterResourceQuota。
- 查询租户 ClusterResourceQuota。
- 查询租户 quota resources。
- 查询租户 quota selector。
- 按 type、model、vendor 过滤。

### 工作空间配额

需要支持：

- 创建 namespace ResourceQuota。
- 更新 namespace ResourceQuota。
- 删除 namespace ResourceQuota。
- 查询工作空间 ResourceQuota。
- 查询工作空间 quota resources。
- 查询工作空间 quota selector。

### 资源发现

需要支持：

- 节点资源聚合。
- HAMi 和 vGPU 资源识别。
- 存储类资源识别。
- ResourcePool 节点过滤。
- 其他租户已分配量扣减。
- overSellingRate。

### 配额状态

需要展示：

- limits。
- requests。
- used limits。
- used requests。
- type。
- model。
- vendor。
- resourcePool。

## 非目标

第一阶段不要求：

- 不在配额模块直接做调度。
- 不自动从业务消费预测生成配额。
- 不允许工作空间绕过租户配额。
- 不把 Flavor 和 Quota 合并成同一对象。
- 不对所有扩展资源做厂商语义解释。

## 验收标准

- 租户启用集群后有基础 CPU 和内存配额。
- 管理员可以查看集群可配置 quota resources。
- 租户可以查询自己的 ClusterResourceQuota。
- 工作空间可以设置 ResourceQuota。
- 配额能按资源池和型号限制可用 Flavor。
- 配额用量能影响 Flavor soldOut。
- CPU 和内存可按集群 overSellingRate 调整可分配量。
