# 资源规格需求

本文描述 `rune` 中资源规格的产品需求。资源规格对应 `Flavor`，它是用户在创建 `Instance` 时选择 CPU、内存、GPU、NPU、vGPU、存储和节点约束的主要入口。

资源规格的目标不是让用户直接填写 Kubernetes `resources`、`nodeSelector`、`tolerations` 或未来的 DRA 字段，而是把这些底层调度和设备细节封装成可选择、可校验、可计费、可展示的产品规格。

## 背景

`rune` 的部署入口是 `Instance + Helm chart`。chart 通过 schema 声明哪些 values 字段需要选择资源规格，`rune` 在创建或更新 Instance 时读取 Flavor，并把规格中的资源和调度约束回填到 values。

当前代码已经支持：

- 从集群节点发现可配置资源。
- 创建集群级 Flavor。
- 将 Flavor 的 `config` 计算成 `resources`、`nodeSelector`、`type`、`model`、`vendor`。
- 通过 `x-resource-enum: flavors` 在 Instance values 校验时注入 Flavor。
- 按租户或工作空间配额过滤可用 Flavor。
- 通过 ResourcePool 把 Flavor 限定到一组节点。
- 根据配额使用情况标记规格是否售罄。

## 用户问题

### 普通用户不知道底层资源名

用户想选择“1 张 H100、16 核 CPU、64Gi 内存”，不应该关心底层是：

- `cpu`
- `memory`
- `nvidia.com/gpu`
- `volcano.sh/vgpu-memory`
- `volcano.sh/vgpu-cores`
- 某个存储类的 quota resource name

需求：

- 控制台以业务名称、型号、厂商、容量展示规格。
- 用户只选择 Flavor，不直接编辑底层 Kubernetes 资源字段。
- Flavor 需要保留底层资源名，供 chart 渲染和配额校验。

### 同一资源名称可能对应不同硬件型号

同样是 `nvidia.com/gpu: 1`，A100、H100、L20 的性能和价格完全不同。

需求：

- Flavor 必须带硬件型号。
- 型号通过节点标签和资源配置推导。
- 规格选择必须能通过 `nodeSelector` 限定到对应型号节点。
- 租户配额也需要按型号过滤可用规格。

### 资源池限制必须进入规格

平台可能把节点拆成多个 ResourcePool，例如生产池、实验池、H100 池、推理池。

需求：

- Flavor 可以绑定 ResourcePool。
- Flavor 绑定 ResourcePool 后，自动生成对应的节点选择条件。
- 租户和工作空间配额也需要携带 ResourcePool 口径。
- 用户只能看到自己配额覆盖的 ResourcePool 内规格。

### 规格需要和配额联动

如果租户没有 H100 配额，就不应该看到或选择 H100 Flavor。如果配额已经用满，规格应该展示为售罄或不可用。

需求：

- Flavor 列表需要根据租户 `ClusterResourceQuota` 过滤。
- 工作空间 Flavor 列表需要根据 namespace `ResourceQuota` 过滤。
- 匹配规则需要同时考虑资源名、型号和节点选择条件。
- 资源用量达到配额时，Flavor 应标记 `soldOut`。

### Chart 需要稳定的 values 契约

不同产品 chart 的 values 结构不同，`rune` 不能假设资源字段固定在某个路径。

需求：

- chart schema 显式声明哪个字段是 Flavor。
- `rune` 在该字段上校验 Flavor ID。
- 校验通过后，`rune` 把 Flavor 的标准资源和节点约束回填到该字段。
- chart 自己决定如何把这些 values 渲染成 Pod、Job、Deployment 或 CRD。

### 多角色 workload 需要多组规格

一个模型服务可能包含 prefill、decode、worker、router 等多个角色，每个角色需要不同资源规格。

需求：

- 一个 Instance 可以在不同 values 路径选择多个 Flavor。
- chart 可以通过角色注解声明角色和对应 Flavor 路径。
- 控制台可以按角色展示和扩缩容。

### vGPU、vNPU 和共享资源需要表达复合规格

虚拟 GPU 不是一个单独资源，通常包含显存、核心比例、卡数等多个资源项。

需求：

- Flavor 的输入必须支持多个资源配置项。
- Flavor 名称和主类型需要能识别 vGPU、GPU、CPU、内存等优先级。
- UI 需要展示组合规格，而不是只展示第一项资源。
- 配额匹配时每个资源项都必须被允许。

### 未来需要支持 DRA/CDI

当前 Flavor 主要注入 `resources` 和 `nodeSelector`。后续 GPU/NPU/RDMA 组合、拓扑和设备分配需要支持 DRA/CDI。

需求：

- Flavor 保持产品中立，不直接绑定某个设备插件或调度器。
- 现有扩展资源模式保持兼容。
- DRA 主契约使用 Kubernetes 标准字段，而不是让 chart 只依赖产品自定义 `device` 字段。
- 后续可以增加 `container.resources.claims`、`pod.spec.resourceClaims` 和 `ResourceClaimSpec` 片段回填。
- `device` 可以作为 UI、校验、兼容和后端适配的中立元数据，但不是 Helm values 落地 DRA 的唯一数据源。
- Flavor 不直接提供 `ResourceClaimTemplate` 对象列表；模板对象的 metadata、labels、owner、命名和生命周期由 chart 或业务 CRD controller 管理。
- 普通业务用户不提交 `ResourceClaimSpec`；用户只选择 Flavor，`ResourceClaimSpec` 由平台从 Flavor/设备规格生成并回填。
- 普通用户仍然只选择 Flavor。

### Flavor 不承载调度队列

调度队列、优先级、PodGroup、schedulerName 和后端类型属于 scheduler 能力，不属于资源规格本身。

需求：

- Flavor 只描述资源、设备、节点约束、资源池约束和队列计量口径。
- queue 由 chart schema 的 `x-scheduling-queue` 字段声明和回填。
- PodGroup、Volcano Job、ResourceClaimTemplate 等底层对象由 chart 或业务 CRD controller 生成。
- Flavor 不直接包含 `queue`、`schedulerName`、`priorityClassName`、`podGroup` 或 `backend: volcano`。

## 产品能力需求

### Flavor 管理

平台管理员需要：

- 创建、更新、删除 Flavor。
- 从集群节点资源生成可选资源项。
- 绑定 ResourcePool。
- 设置启用或禁用状态。
- 查看 Flavor 的类型、型号、厂商、资源清单和节点选择条件。

### Flavor 发现

系统需要：

- 从节点 `status.allocatable` 发现 CPU、内存、扩展资源和存储资源。
- 从节点标签识别硬件型号。
- 识别常见 GPU/NPU/DCU/PPU/vGPU 资源。
- 过滤不应该作为规格暴露的资源，例如 `pods`。
- 按单节点最大可申请量生成资源配置上限。

### Flavor 选择

普通用户需要：

- 在创建 Instance 时选择可用 Flavor。
- 只能选择启用状态的 Flavor。
- 只能选择租户或工作空间配额覆盖的 Flavor。
- 可以按类型、厂商、型号过滤。
- 看到售罄状态，但不能误以为规格不存在。

### Flavor 注入

Instance values 校验需要：

- 校验 Flavor ID 必填。
- 校验 Flavor 存在于当前集群。
- 校验 Flavor 已启用。
- 用服务端当前 Flavor 覆盖用户传入的 `resources`、`nodeSelector`、`tolerations`。
- 如果 Flavor 包含 DRA 字段，用服务端当前 Flavor 回填 `resources.claims`、`resourceClaims` 和 `resourceClaimSpec`；用户在请求 values 中伪造这些字段时必须被覆盖或拒绝。
- 防止用户在 values 中伪造更高资源或绕过节点约束。

### 配额匹配

Flavor 与配额匹配需要：

- 资源名必须匹配。
- 配额指定型号时，Flavor 型号必须匹配。
- 配额未指定型号时，可以匹配所有型号。
- Flavor 的节点选择条件必须覆盖配额的节点选择条件。
- 绑定 ResourcePool 的 Flavor 需要把 ResourcePool 标签纳入匹配。

### 状态展示

Flavor 状态至少需要：

- 是否启用。
- 是否售罄。
- 主资源类型。
- 主型号。
- 厂商。
- 资源池。
- 资源请求和限制。
- 节点选择条件。

## 非目标

第一阶段不要求：

- 不让用户直接编辑 Pod `resources` 作为主路径。
- 不让用户直接编辑 `nodeSelector` 绕过 Flavor。
- 不由 `rune` 自动修改 chart 模板。
- 不在 Flavor 中直接管理 ResourceClaimTemplate 生命周期。
- 不在 Flavor 中表达 queue、schedulerName、priorityClassName、PodGroup 或调度后端。
- 不承诺所有设备拓扑需求都已在现有实现中落地。
- 不把 Flavor 和调度队列合并成同一个概念。

## 验收标准

基础能力：

- 管理员可以创建基于 CPU、内存、GPU、vGPU 或存储的 Flavor。
- Flavor 自动生成 `resources` 和 `nodeSelector`。
- Flavor 绑定 ResourcePool 后，节点选择条件包含 ResourcePool 标签。
- Instance values 中声明 `x-resource-enum: flavors` 的字段可以被校验和回填。
- 禁用的 Flavor 不能被选择。
- 租户和工作空间只看到配额覆盖的 Flavor。
- 配额用尽时 Flavor 标记 `soldOut`。

兼容能力：

- 旧 chart 不声明 Flavor schema 时行为不变。
- 旧 Flavor 不包含未来设备字段时仍按扩展资源模式工作。
- 同一 Instance 可以为多个角色选择不同 Flavor。
- Flavor 可以继续回填现有资源字段，并能回填标准 DRA values 片段。
