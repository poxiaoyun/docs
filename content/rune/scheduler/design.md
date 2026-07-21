# Rune 共享算力产品抽象与后端设计

本文在 [原始需求](requirements.md) 和 [使用方式与界面](usage.md) 已确定的产品结论之上，说明 Rune 如何抽象共享算力能力，以及第一阶段如何映射到 Volcano。

设计顺序是：

```text
用户要完成的任务
  -> 用户可见的产品概念
  -> Rune 中立 API
  -> 调度后端适配
  -> Volcano / Kubernetes 对象
```

不得用底层调度器已有的对象倒推普通用户界面。

## 已确定的产品结论

- 产品入口仍是 `Instance + Chart + Flavor + Quota + ResourcePool`。
- Chart 在任意需要资源的 values 路径声明 `x-resource-enum: flavors`；每个 Flavor 选择器可以先按 ResourcePool 筛选。
- 首期为每个 tenant + ResourcePool 自动建立一份默认资源权益。
- 普通用户首期不需要知道或选择 Queue。
- 后续只有同一资源池存在不同预算、项目权限或服务保障时，才开放多权益选择。
- 用户使用“尽力运行、标准、关键业务”等运行保障等级，不填写数字优先级。
- 用户表达“允许中断、恢复方式、使用临时资源”，不配置 preempt、reclaim、backfill 算法。
- 用户看到“全部副本一起启动”，不需要理解 PodGroup 或 gang。
- Flavor 表达指定 ResourcePool 中的资源和设备规格，不承载资源权益、优先级或调度后端。
- Instance 状态首先提供原因、证据和建议，底层 phase 只放在技术详情中。
- 默认不启用跨租户中断和资源收回。

## 概念映射

| 用户概念 | Rune 产品抽象 | 第一阶段后端映射 |
| --- | --- | --- |
| 资源池 | ResourcePool | 节点集合、label/affinity 边界 |
| 资源权益 | `SchedulingEntitlement` | 配额/admission/后端计量，不强制一对一映射 Queue |
| 保障资源 | `deserved` | 后端可表达时投影，否则由权益状态和治理层维护 |
| 最大可用资源 | `capability` | ClusterResourceQuota 和后端准入 |
| 运行保障 | `ServiceLevel` | PriorityClass、queue/job order |
| 允许中断 | `InterruptibilityPolicy` | preemptable 和保护条件 |
| 使用临时资源 | `OpportunisticPolicy` | backfill/reclaim 相关策略 |
| 全部副本一起启动 | `CoordinatedStartPolicy` | PodGroup/gang |
| 调度状态 | `SchedulingStatus` | Queue、PodGroup、Pod、Event 聚合 |
| 资源规格 | Flavor | resources、node constraints、DRA |
| 缓存优化 | `CachePreference` | PVC 信号、node affinity/scoring |

映射表不代表所有抽象都在第一阶段开放给用户。首期不改变现有 JSON Schema 契约：用户在每个 Flavor 选择器中用 ResourcePool 筛选规格，最终只提交 Flavor ID，Rune 在原路径注入服务端控制的 Flavor 数据。

## 现状和改造基础

Rune 当前已经具备：

- Instance 通过 Helm chart 渲染 Kubernetes workload。
- Flavor 能向 chart values 回填 resources、nodeSelector 和 tolerations。
- ResourcePool 定义节点集合和资源范围。
- `ClusterResourceQuota` 和 namespace `ResourceQuota` 承载租户、工作空间配额。
- `pkg/cloud/scheduler` 已有 Volcano scheduler config 和 HyperNode API。
- instance resource API 已能列出相关 Kubernetes 资源和 Event。

主要缺口：

- 现有 scheduler API 直接暴露 Volcano actions/plugins。
- 当前默认配置包含 preempt/reclaim，与新的安全默认值不一致。
- 没有 tenant + ResourcePool 资源权益模型和后端 Queue 生命周期管理。
- 没有 chart 资源权益字段的校验与回填。
- Instance 没有中立调度状态和可行动的 Pending reason。
- Flavor 尚未支持标准 DRA values 片段。

## 设计原则

### 产品 API 中立

产品 API 使用用户任务对应的稳定概念，不直接暴露：

- Volcano Queue。
- PodGroup。
- Volcano Job。
- actions、plugins、predicateFn、nodeOrderFn。
- 数字 PriorityClass。

这些字段可以存在于 adapter、兼容 API 和技术详情中。

### 产品抽象不等于界面字段

后端需要 Queue，不表示创建 Instance 时必须显示 Queue 选择，也不能从 Flavor schema 路径自动推导 Queue 路径。Queue values 必须由 Chart 使用独立 JSON Schema 扩展显式声明。

同理，系统需要优先级排序，不表示用户需要编辑数字优先级。产品通过有限、授权后的 `ServiceLevel` 表达业务重要性。

### ResourcePool、资源权益和放置约束职责分离

`ClusterResourceQuota` 继续作为资源售卖、硬配额和租户权益口径。

ResourcePool 负责：

- 定义实际节点集合和资源供应边界。
- 为用户提供算力类型、用途、位置或成本层面的一级选择。
- 作为 Flavor 列表和资源权益的过滤维度。

资源权益负责：

- 工作负载归属。
- 公平共享。
- 保障资源和最大资源在调度后端的投影。
- 后续同池多权益授权和运行规则。

节点亲和负责在 ResourcePool 允许的范围内继续缩小候选节点或调整节点排序。required affinity 不得扩大 ResourcePool 范围，preferred affinity 只影响排序。

资源数量必须按 tenant + ResourcePool 从配额聚合，不允许用户再维护一套 Queue capability，也不能把不同资源池中的同名资源简单相加。

### 不推导任意 Chart 的协同启动边界

第一阶段 Rune：

- 不扫描一个 Instance 下的全部 Pod 并合并成 gang。
- 不自动创建 PodGroup。
- 不通过 post-render 猜测 PodGroup 关系。

Chart 或业务 CRD controller 负责生成 PodGroup、Volcano Job 或其他后端等价对象。

### 安全默认

第一阶段默认启用：

```text
enqueue
allocate
backfill
priority
gang
drf / fair share
predicates
proportion
nodeorder
binpack
```

默认关闭：

```text
preempt
reclaim
```

`backfill` 只代表调度器可以利用空闲资源，不表示任意普通任务可以被中断。任务中断能力后续必须由显式产品策略授权。

## 总体架构

```text
+----------------------------------------------------------------+
| Console / Product API                                          |
| Instance | ResourcePool | Flavor | Entitlement | Scheduling Status |
+------------------------------+---------------------------------+
                               |
                               v
+----------------------------------------------------------------+
| Rune Product Layer                                             |
| Policy API | Entitlement Controller | Values Resolver           |
| Service Level Resolver | Scheduling Status Collector            |
+------------------------------+---------------------------------+
                               |
                               v
+----------------------------------------------------------------+
| Scheduling Backend Adapter                                     |
| VolcanoBackend first | future KueueBackend / other backend      |
+------------------------------+---------------------------------+
                               |
                               v
+----------------------------------------------------------------+
| Kubernetes / Backend                                           |
| Queue | PodGroup | Job | Pod | Event | ResourceClaim | HyperNode|
+----------------------------------------------------------------+
```

职责边界：

```text
Rune:
  产品策略、ResourcePool 选择、默认资源权益、校验回填、后端投影、状态聚合。

Chart / 业务 CRD controller:
  workload、协同启动对象、ResourceClaimTemplate。

Backend adapter:
  中立模型与具体后端配置、对象和状态的转换。

Volcano:
  第一阶段 Queue、gang、公平、binpack 和拓扑调度能力。
```

## 产品模型

### SchedulingPolicy

`SchedulingPolicy` 表达集群级产品能力，不暴露 Volcano 插件列表：

```yaml
name: default
backend: volcano
profile: balanced
features:
  coordinatedStart: true
  fairShare: true
  binpack: true
  opportunisticScheduling: true
  interruption: false
  resourceReclaim: false
  dynamicResourceAllocation: false
  cacheAwareScheduling: false
placement:
  defaultSchedulerName: xpai-scheduler
  topologyAware: true
```

其中 `backend` 是管理员和内部适配字段，不进入普通用户创建页。

Volcano adapter 可以翻译为：

```yaml
actions: "enqueue,allocate,backfill"
tiers:
- plugins:
  - name: priority
  - name: gang
- plugins:
  - name: drf
  - name: predicates
  - name: proportion
  - name: nodeorder
  - name: binpack
```

当 `interruption=false` 和 `resourceReclaim=false` 时，不得生成 preempt/reclaim action，也不得打开相关插件能力。

### SchedulingEntitlement

`SchedulingEntitlement` 是租户在指定 ResourcePool 中的资源权益投影：

```yaml
id: default
displayName: 默认权益
tenant: tenant-a
cluster: cluster-a
resourcePool: h100-pool
default: true
capacity:
  capability:
    cpu: "1024"
    memory: 4Ti
    nvidia.com/gpu: "96"
  deserved:
    cpu: "512"
    memory: 2Ti
    nvidia.com/gpu: "64"
access:
  projects: []
status:
  phase: Ready
```

第一阶段规则：

- 每个 tenant + cluster + ResourcePool 自动生成一份 `default` 权益。
- capability 来自该租户、该 ResourcePool 的 `ClusterResourceQuota.limits` 聚合。
- deserved 来自该租户、该 ResourcePool 的 `ClusterResourceQuota.requests` 聚合。
- 租户管理员只读查看，不手工填写容量。
- 不跨 ResourcePool 聚合容量，即使不同池使用相同扩展资源名。
- 后端路由由 adapter 生成；资源权益不直接承诺对应一个独立 Queue。

后续同池多权益需要先补充配额拆分、项目授权和默认选择规则，不能只创建多个 Queue 就开放界面。

### ResourcePool、Flavor 和 Affinity

每个声明 `x-resource-enum: flavors` 的配置位置都使用相同选择流程：

```text
ResourcePool（默认可直接接受）
  -> 过滤该池中的可用 Flavor
  -> 选择具体 Flavor
  -> 用户 values 只保留 Flavor ID
  -> Rune 读取并注入服务端控制的 Flavor 数据
```

ResourcePool 是选择器的筛选状态，不是新增的 Instance 字段或 values 字段。不同 schema 路径彼此独立，因此 prefill、decode、router 等配置可以选择属于不同 ResourcePool 的 Flavor。

最终候选节点是以下硬约束的交集：

```text
ResourcePool 节点集合
∩ Flavor nodeSelector / required affinity
∩ Chart workload required nodeAffinity
∩ 设备和拓扑硬约束
```

在候选节点内再应用 preferred nodeAffinity、缓存亲和和调度器打分。选择器切换 ResourcePool 后，只清空当前不兼容的 Flavor ID。服务端安全校验以 Flavor ID 查询到的当前 Flavor 为准，不信任前端筛选状态。

### ServiceLevel

运行保障使用稳定枚举：

```yaml
id: standard
displayName: 标准
description: 适合一般训练和推理任务
```

平台维护每个等级到后端优先级和保护条件的映射。普通用户不能提交任意整数，也不能自行创建最高等级。

第一阶段可以只提供固定 `standard`，待权限和审计能力完成后再开放更多等级。

### InterruptibilityPolicy

后续产品模型：

```yaml
enabled: true
recovery: requeue
minimumRunDuration: 30m
checkpointRequired: true
```

该模型只说明 workload 是否可以被中断以及如何恢复。谁可以触发中断、可以跨越哪些租户边界，由管理员策略控制。

### OpportunisticPolicy

后续产品模型：

```yaml
enabled: true
maxRunDuration: 2h
onResourceReturn: requeue
```

该模型对应用户“使用临时空闲资源”的选择。不得把所有 backfill workload 自动视为可安全中断。

### CoordinatedStartPolicy

产品语义：

```yaml
mode: allReady
minAvailable: 8
```

Rune 校验和回填产品数据，Chart 决定如何生成 PodGroup 或等价对象。第一阶段不在 Instance API 中强制统一该字段，由示例 Chart 先建立契约。

### SchedulingStatus

Instance 调度摘要：

```yaml
phase: WaitingForResources
reason: InsufficientMatchingDevices
message: 需要 8 张 H100，目前满足全部条件的可用资源为 4 张
evidence:
  requested:
    nvidia.com/gpu: "8"
  available:
    nvidia.com/gpu: "4"
  constraints:
  - AllReplicasReady
  - SameHighSpeedDomain
suggestions:
- action: Wait
  label: 继续等待
- action: ReduceResource
  label: 降低副本数或单副本规格
technicalDetails:
  backend: volcano
  resourcePool: h100-pool
  entitlementRef: default
  queueName: tenant-a
  workloads: []
```

中立 phase 建议使用：

```text
WaitingForResources
Preparing
Running
Succeeded
Failed
Interrupted
Requeued
Unknown
```

reason、evidence 和 suggestions 必须允许为空，不能在证据不足时伪造确定原因。

## API 设计

### 集群策略

建议新增：

```text
GET /clusters/{cluster}/scheduling/policy
PUT /clusters/{cluster}/scheduling/policy
```

现有 `/clusters/{cluster}/schedulers/default/config`：

- 保留一个兼容周期。
- 标记 deprecated。
- 控制台迁移到中立 API。
- 后续只作为 internal/debug 接口保留或删除。

### 租户资源权益

第一阶段：

```text
GET /tenants/{tenant}/clusters/{cluster}/resource-pools/{pool}/scheduling/entitlements
GET /tenants/{tenant}/clusters/{cluster}/resource-pools/{pool}/scheduling/entitlements/default
```

首期不提供普通租户管理员修改 capability/deserved 的接口。配额变化由 Controller 自动同步。

如果实现层仍需要保存 QueuePolicy，建议作为内部投影对象，不直接成为首期用户主 API。

### Instance 调度状态

可以在 Instance 响应中增加 `schedulingStatus`，或提供：

```text
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/instances/{instance}/scheduling-status
```

接口返回中立状态，并把后端对象放入可选 `technicalDetails`。

### 现有 Flavor Values 契约

资源选择完全由 Chart JSON Schema 中的 `x-resource-enum: flavors` 位置决定，Rune 不引入固定 role、固定 values 路径或 Instance 级 ResourcePool 字段：

```yaml
properties:
  prefill:
    type: object
    properties:
      flavor:
        type: object
        x-resource-enum:
          resource: flavors
  decode:
    type: object
    properties:
      flavor:
        type: object
        x-resource-enum:
          resource: flavors
```

用户提交：

```yaml
prefill:
  flavor:
    id: h100-4gpu
decode:
  flavor:
    id: l20-1gpu
```

Rune 对每个扩展位置按 Flavor ID 查询当前对象，校验后将服务端控制的 Flavor 数据覆盖或合并回原路径。当前实现明确覆盖 resources、nodeSelector 和 tolerations；新增 DRA 等字段时继续扩展同一 validator。Helm Chart 根据注入数据自行渲染 workload。Rune 不根据字段名推断 prefill、decode、worker 等业务角色。

## Chart Schema 契约

### Flavor

继续使用现有契约，不增加 `resourcePool` schema 字段、`resourcepools` 枚举或 `filterBy` 扩展：

```yaml
worker:
  flavor:
    type: object
    x-resource-enum:
      resource: flavors
```

控制台在这个 Flavor 选择器内部增加 ResourcePool 筛选。服务端仍只接收 Flavor ID，并使用当前 Flavor 覆盖或拒绝用户伪造的 resources、nodeSelector、tolerations 和后续设备字段。ResourcePool 筛选不作为可信的提交数据。

### Queue Values 扩展（待实现）

Queue 与 Flavor 是独立契约。技术扩展名暂时使用待实现的 `x-scheduling-queue`，Chart 自己决定声明路径：

```yaml
scheduling:
  type: object
  properties:
    entitlement:
      type: object
      x-scheduling-queue:
        scope: tenant
        default: true
```

扩展实现后，用户可以不传，Rune 在 Chart 声明的位置回填租户默认 Queue：

```yaml
scheduling:
  entitlement:
    backendQueue: tenant-a
    backend: volcano
```

字段含义：

- `backendQueue` 是 adapter 解析出的后端 Queue。
- `backend` 仅用于 Chart 适配，不是普通用户概念。

如果未来更换后端，Chart 需要通过 `backend` 分支或由业务 Controller 统一适配。Rune 不从 Flavor 路径推导 Queue 路径，也不额外注入固定的 `global.scheduling`。

## Backend Adapter

建议在 `pkg/cloud/scheduler` 引入边界：

```go
type SchedulingBackend interface {
    Name() string
    ApplyClusterPolicy(ctx context.Context, cluster string, policy SchedulingPolicy) error
    ApplyEntitlement(ctx context.Context, cluster string, entitlement SchedulingEntitlement) error
    DeleteEntitlement(ctx context.Context, cluster, backendName string) error
    GetEntitlementStatus(ctx context.Context, cluster, backendName string) (EntitlementStatus, error)
    ListWorkloadStatuses(ctx context.Context, cluster, namespace, instance string) ([]WorkloadStatus, error)
}
```

`VolcanoBackend` 负责：

- SchedulingPolicy 到 Volcano scheduler config 的翻译。
- SchedulingEntitlement 到配额、Queue、admission 或状态投影的后端组合翻译。
- 读取 Queue、PodGroup、Volcano Job、Pod 和 Event。
- 将底层状态映射为中立状态。
- 复用现有 HyperNode 能力。

它不负责：

- 生成用户 workload。
- 自动推导 PodGroup。
- 管理 DRA driver。
- 直接进行 CDI 注入。

### Queue 与 ResourcePool 不强绑定

一个 SchedulingEntitlement 不必对应一个 Volcano Queue，一个 ResourcePool 也不必对应一个 Queue。原因是：

- 同一 Instance 的多个 Flavor 配置可以来自不同 ResourcePool。
- 一个协同启动组可能消费多个 Flavor 配置。
- Volcano PodGroup 只有一个 queue 字段，不能用这个限制倒推产品模型。
- 不同 ResourcePool 中的 CPU、memory 等同名资源不能简单合并成一份池级 capability。

第一阶段优先考虑租户级 Queue 承载调度顺序和公平性。Helm Chart 使用注入的 resources、nodeSelector、tolerations 等 Flavor 数据渲染 workload；服务端可以从 Flavor 对象自身取得 ResourcePool，用于池级配额、准入和状态统计。若需要把池级 deserved 精确下沉到调度器，需要验证 Volcano 的层级 Queue、扩展资源计量或自定义插件能力后再确定。

Backend adapter 的验收目标是保持以下产品语义，而不是固定对象数量：

- 每个 workload 按 Helm 消费注入 Flavor 后生成的资源和节点约束调度。
- 资源消耗能够按注入 Flavor 所属 ResourcePool 计入池级权益。
- 使用不同 ResourcePool Flavor 的 workload 仍可由 Chart 组织为同一业务协同启动组。
- 用户不需要选择或理解后端 Queue。

## Entitlement Controller

触发源：

- tenant enablement 创建或删除。
- 租户 `ClusterResourceQuota` 创建、更新或删除。
- 集群调度策略或后端实例变化。

处理流程：

```text
tenant/quota changed
  -> list tenant ClusterResourceQuota
  -> group quotas by ResourcePool
  -> aggregate schedulable resources inside each pool
  -> build default SchedulingEntitlement for each pool
  -> backend.ApplyEntitlement
  -> write projection status and warnings
```

聚合规则：

- 先按 ResourcePool 分组，不允许跨池合并。
- 在每个 ResourcePool 内按资源名累加 limits 为 capability。
- 在每个 ResourcePool 内按资源名累加 requests 为 deserved。
- 过滤 storage、对象数等不能进入调度器 Queue 容量的配额项。
- 对无法映射的资源写入 warning，不静默忽略。
- Quantity 运算保持 Kubernetes 精度和格式语义。

删除权益投影前需要检查仍在对应 ResourcePool 中运行或等待的 workload。首期建议先标记不可用，停止新准入，再处理存量 workload。

## Instance Values Resolver

扩展现有 Values Validator/Resolver：

- 保留 `x-resource-enum: flavors`。
- 新增 `x-scheduling-queue`。
- 对每个 `x-resource-enum: flavors` 位置按 ID 获取当前 Flavor。
- 校验 Flavor 启用状态和租户配额覆盖。
- 使用当前 Flavor 覆盖 resources、nodeSelector、tolerations 等平台字段。
- 对每个 `x-scheduling-queue` 位置独立校验和回填 Queue。
- 不根据 Flavor schema 路径推导 Queue、PodGroup 或 workload 结构。
- 不改变未声明扩展的旧 Chart。
- 不通过 post-render 修改 workload 结构。

实现前必须保证 OpenAPI 校验错误会返回给调用方，不能忽略无效结果。

## 状态聚合

第一阶段数据来源：

- 注入 Flavor 所属 ResourcePool、资源权益及 adapter 解析出的 Volcano Queue。
- 带 Instance label 的 PodGroup、Volcano Job 和 Pod。
- Kubernetes Event。
- 后续增加 ResourceClaim、PVC cache annotation。

归属规则：

- Chart 和业务 Controller 给调度对象添加 `app.kubernetes.io/instance`。
- ownerReference 用于补充资源树关系。
- 没有 label 且无法通过 owner 链归属的对象，不强行聚合到 Instance。

第一阶段原因推导：

- PodGroup conditions：是否等待最小成员就绪。
- Pod conditions/Event：资源不足、节点亲和、污点、设备等基础原因。
- Queue 状态：权益容量和当前分配摘要。
- 多个证据冲突时保留多个候选原因，并标记为可能原因。

第一阶段不做：

- scheduler attempt trace。
- 每个插件过滤的节点列表。
- 插件打分明细。
- victim 选择解释。
- DRA 内部候选设备解释。

## Flavor、DRA 和拓扑

Flavor 继续作为资源规格入口：

- CPU、内存和扩展资源。
- nodeSelector 和 tolerations。
- ResourcePool 约束。
- 后续中立设备需求和 queue accounting。

Flavor 不包含：

- entitlement/queue。
- schedulerName。
- serviceLevel/priorityClassName。
- PodGroup。
- backend: volcano。

DRA 后续回填标准 Kubernetes 所需片段：

- `container.resources.claims`。
- `pod.spec.resourceClaims`。
- `ResourceClaimSpec` 数据。

ResourceClaimTemplate 的 metadata、owner、命名和生命周期仍由 Chart 或业务 Controller 管理。Rune 不负责安装所有 DRA driver、CDI runtime 和节点侧组件。

拓扑要求优先封装在 Flavor 或应用模板中。普通用户先选择 ResourcePool，再选择业务规格；状态解释可以展示哪些 ResourcePool、Flavor 和拓扑条件导致不可调度。

## 缓存感知调度

缓存是放置偏好，不是资源规格或资源权益：

- 不写入 Flavor。
- 不绕过 quota、ResourcePool、资源权益和设备约束。
- 默认是软偏好。
- 只有用户明确选择 hard 模式时才成为硬约束。

第一阶段之后可以读取 PVC annotation：

```yaml
scheduling.xiaoshiai.cn/cache-affinity-nodes: node-a,node-b
scheduling.xiaoshiai.cn/cache-affinity-mode: preferred
scheduling.xiaoshiai.cn/cache-affinity-weight: "80"
scheduling.xiaoshiai.cn/cache-key: model/llama-70b
```

也应尊重 Chart 已经生成的原生 Pod nodeAffinity。若暂时没有缓存调度插件，可以先做状态识别和诊断，不应把软偏好擅自转换为硬 nodeSelector。

## 安全和权限

- 普通用户操作 Instance、授权后的 ResourcePool、Flavor 和运行选项。
- 首期资源权益自动匹配，普通用户不直接操作底层 Queue。
- 租户管理员查看本租户在各 ResourcePool 中的权益和状态。
- 平台管理员配置集群 SchedulingPolicy 和后续中断规则。
- 底层 Volcano Queue 由 Rune service account 管理并添加 managed label。
- RBAC 阻止普通用户修改托管 Queue。
- 后续可通过 admission webhook 加强保护。
- 所有任务中断和资源收回必须产生审计记录。

## 兼容与迁移

### 旧 Scheduler API

- 新增中立 SchedulingPolicy API。
- 控制台迁移到新 API。
- 旧 Volcano 风格 API 保留一个兼容周期并标记 deprecated。
- 读取旧配置时转换为中立能力；无法无损转换的字段放入技术详情或 warning。

### 旧 Flavor

没有设备扩展字段时继续按当前扩展资源模式处理，保持 resources、nodeSelector 和 tolerations 注入行为。

### 旧 Chart

没有 `x-scheduling-queue` 时：

- 不强制注入资源权益投影。
- 不自动创建 PodGroup。
- 不修改原有部署行为。

需要协同启动或后端 Queue 的 Chart 显式升级 schema 和模板。

## 落地阶段

### 阶段一：资源池选择和默认权益闭环

- 修复 values 校验错误返回。
- 新增 SchedulingPolicy 中立模型和 Volcano adapter。
- 默认策略移除 preempt/reclaim。
- 现有 Flavor 选择器支持 ResourcePool 默认筛选和切换，不新增 values 字段。
- 从各 ResourcePool 的租户配额聚合默认 SchedulingEntitlement。
- 创建和维护底层租户 Queue。
- 提供资源权益只读 API 和基础状态。

### 阶段二：Chart 契约与协同启动

- 新增 `x-scheduling-queue` 校验和默认回填。
- 提供示例 Chart。
- Chart 显式创建 PodGroup 或 Volcano Job。
- 验证旧 Chart 行为不变。

### 阶段三：基础状态解释

- 聚合 Queue、PodGroup、Volcano Job、Pod 和 Event。
- 输出中立 phase、reason、evidence 和 suggestions。
- 控制台展示用户主状态和技术详情。

### 阶段四：设备和高级治理

- Flavor DRA/CDI 数据模型与回填。
- 拓扑感知状态解释。
- 同池多权益和项目授权。
- ServiceLevel 权限与策略。
- InterruptibilityPolicy 和 OpportunisticPolicy。
- 显式开启 preempt/reclaim。
- 缓存感知调度和完整 explain。

## 测试计划

### 单元测试

- SchedulingPolicy 到 Volcano config 的翻译。
- 默认策略不包含 preempt/reclaim。
- 配额聚合 capability/deserved，且过滤非调度资源。
- Flavor 选择器切换 ResourcePool 只重新过滤当前选择器，不影响其他 schema 路径。
- entitlement 与 Queue 映射不假设一池一 Queue。
- `x-scheduling-queue` 自动选择、权限校验和回填。
- 无效 values 能正确返回错误。
- 旧 Flavor 和旧 Chart 兼容。
- 后端 phase 和 Event 到中立状态的映射。

### 控制器测试

- tenant enablement 后按有配额的 ResourcePool 生成默认权益，并生成所需的租户 Queue/后端投影。
- 指定 ResourcePool 的配额更新后只更新对应 capability/deserved。
- 不可映射资源产生 warning。
- Queue 仍被引用时不被直接删除。
- 后端不可用时资源权益状态可解释。

### 集成测试

- 用户在每个 Flavor 选择器中保留默认或切换 ResourcePool 后选择 Flavor。
- 用户提交 values 中仍然只有 Flavor ID。
- 多个 `x-resource-enum: flavors` 位置可以选择不同 ResourcePool 中的 Flavor。
- 示例 Chart 能消费自动回填的默认资源权益。
- 多副本示例等待全部资源就绪后启动。
- 资源不足时 Instance 返回基础原因和建议。
- Queue 和 workload 使用量能根据注入 Flavor 归集到对应 ResourcePool 的资源权益状态。
- 旧 Chart 不声明扩展时渲染结果不变。

## 风险和缓解

| 风险 | 说明 | 缓解 |
| --- | --- | --- |
| 从 Queue 倒推界面 | 普通用户被迫理解后端概念或现有 Chart 契约被破坏 | Queue 使用独立 schema 扩展，不能从 Flavor 路径自动推导 |
| 产品 API 绑定 Volcano | 更换后端困难 | 对外使用中立模型，Volcano 字段留在 adapter 和技术详情 |
| 配额和 Queue 容量不一致 | 两套资源口径互相冲突 | capacity 只从 ClusterResourceQuota 聚合 |
| 聚合了错误资源 | storage 等资源不适合作为 Queue 容量 | 使用资源白名单/映射器并产生 warning |
| 自动推导协同边界错误 | 通用 Chart 结构复杂 | Chart/业务 Controller 显式生成 PodGroup |
| 中断误伤在线服务 | 应用恢复能力未知 | 默认关闭 preempt/reclaim，后续显式授权和审计 |
| 状态无法归属 Instance | 底层对象缺少 label | 要求 Chart 添加 instance label，ownerReference 仅作补充 |
| 状态解释过度推断 | Event 无法证明唯一根因 | 分离 reason/evidence，证据不足时标记可能原因 |
| DRA shape 不稳定 | Kubernetes 和 driver 版本差异 | 产品层保留中立需求，底层模板由 Chart/driver 适配 |

## 第一阶段完成定义

第一阶段完成不以“暴露了多少 Volcano 能力”为标准，而以以下用户闭环为标准：

```text
管理员按 ResourcePool 给租户配置现有配额
  -> Rune 为 tenant + ResourcePool 自动生成默认权益
  -> 每个 Flavor 选择器用 ResourcePool 筛选规格
  -> 用户 values 只提交 Flavor ID
  -> Rune 在各 schema 路径注入服务端控制的 Flavor 数据
  -> Helm Chart 根据注入数据渲染 workload 和节点范围
  -> Chart 在独立 schema 路径消费 Queue 数据并显式声明协同启动
  -> 等待时用户看到资源缺口、限制条件和处理建议
```

该闭环完成后，再引入同池多权益、运行保障、中断、临时资源、DRA 和缓存感知能力。
