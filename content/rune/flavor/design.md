# 资源规格设计

本文描述 `rune` 的资源规格设计。资源规格的核心对象是 `Flavor`，它把用户可理解的规格选择转换为 Kubernetes 可消费的资源、节点选择和后续设备需求。

## 当前模型

### Flavor

`Flavor` 是集群级对象，主要字段：

```yaml
cluster: cluster-a
resourcePool: h100-pool
config:
- resourceName: nvidia.com/gpu
  type: Accelerator
  name: GPU
  model: NVIDIA-H100
  vendor: Nvidia
  limit: "1"
  request: "1"
  nodeSelector:
    feature.node.cloud.xiaoshiai.cn/accelerator-model.name: NVIDIA-H100
resources:
  limits:
    nvidia.com/gpu: "1"
  requests:
    nvidia.com/gpu: "1"
nodeSelector:
  feature.node.cloud.xiaoshiai.cn/accelerator-model.name: NVIDIA-H100
  cloud.xiaoshiai.cn/resourcepool-h100-pool: "true"
type: Accelerator
model: NVIDIA-H100
vendor: Nvidia
enabled: true
status:
  soldOut: false
```

字段分两类：

- 输入字段：`config`、`resourcePool`、`enabled`、名称和描述。
- 生成字段：`resources`、`nodeSelector`、`type`、`model`、`vendor`、`labels`。

服务端以 `config` 为准生成落地字段，避免用户手工维护多份派生数据。

### FlavorResourceConfig

`config` 中每一项表示一个资源维度：

```yaml
resourceName: volcano.sh/vgpu-memory
type: VGPU
name: vGPU Memory
model: NVIDIA-GeForce-RTX-4090
vendor: Nvidia
ratio: 128Mi
limit: "128"
request: "128"
min: "1"
max: "24576Mi"
default: "12288Mi"
nodeSelector:
  feature.node.cloud.xiaoshiai.cn/accelerator-model.name: NVIDIA-GeForce-RTX-4090
```

设计含义：

- `resourceName` 是最终写入 Kubernetes resources 的资源名。
- `limit` 和 `request` 生成 container resources。
- `type/model/vendor/name` 用于 UI、过滤、命名和配额匹配。
- `ratio/min/max/default/candidates` 用于表单渲染和单位换算。
- `nodeSelector` 用于限制硬件型号或资源池。

## 数据流

### 节点资源发现

资源来源：

- Kubernetes Node `status.allocatable`。
- 节点硬件型号标签。
- Volcano vGPU 节点注解。
- HAMi vNPU 配置。
- 存储类和扩展资源。

处理流程：

```text
NodeList
  -> ListNodeResources
  -> parse vGPU / vNPU / generic resources
  -> detect type, model, vendor, ratio, min, max, default
  -> ListAggregateNodesResources
  -> /flavorresources API
```

聚合策略：

- 按单节点最大可申请量生成资源上限。
- 资源黑名单过滤 `pods`。
- 硬件型号通过 `feature.node.cloud.xiaoshiai.cn/{type}-model.name` 标签识别。

### Flavor 创建

创建或更新 Flavor 时：

```text
request.config
  -> completeFlavorFromConfig
  -> resources.limits / resources.requests
  -> nodeSelector
  -> type / model / vendor
  -> labels = nodeSelector
```

生成规则：

- 非零 `limit` 写入 `resources.limits`。
- 非零 `request` 写入 `resources.requests`。
- 每个 config 的 `nodeSelector` 合并到 Flavor `nodeSelector`。
- 如果绑定 `resourcePool`，追加 ResourcePool 标签。
- 主类型按优先级识别：vGPU、加速卡/GPU、CPU、内存、存储、磁盘。
- 主型号优先从节点选择标签推导。
- 厂商优先从型号推导，其次从资源名推导。

### ResourcePool 绑定

`ResourcePool` 是节点集合。控制器会给池内节点打标签：

```text
cloud.xiaoshiai.cn/resourcepool-{poolID}=true
```

Flavor 绑定资源池时，服务端把同样的标签写入 `nodeSelector`：

```yaml
nodeSelector:
  cloud.xiaoshiai.cn/resourcepool-h100-pool: "true"
```

这样 chart 只需要消费 Flavor 的 `nodeSelector`，Pod 就会被约束到该资源池。

### Instance values 注入

chart schema 通过扩展字段声明 Flavor：

```yaml
properties:
  worker:
    type: object
    properties:
      flavor:
        type: object
        x-resource-enum:
          resource: flavors
```

Instance 创建或更新时：

```text
values.worker.flavor.id
  -> get Flavor from current cluster
  -> check enabled
  -> override values.worker.flavor.resources
  -> override values.worker.flavor.nodeSelector
  -> override values.worker.flavor.tolerations
```

关键点：

- 用户必须传 `id`。
- `resources/nodeSelector/tolerations` 以服务端 Flavor 为准。
- 用户在 values 中伪造这些字段会被覆盖。
- chart 决定如何把回填值渲染到 Pod template。

### 多角色支持

chart 可以用 `app.kubernetes.io/roles` 注解声明角色：

```json
[
  {
    "name": "prefill",
    "title": "Prefill",
    "replicaPath": "prefill.replicaCount",
    "flavorPath": "prefill.flavor",
    "componentLabel": "prefill"
  }
]
```

设计含义：

- 不同角色可以拥有不同 Flavor。
- 控制台可以按角色展示副本和规格。
- `rune` 不要求所有 chart 使用固定 values 路径。

## 配额联动

### 租户和工作空间配额

配额输入同样使用资源配置项：

```yaml
config:
- resourceName: nvidia.com/gpu
  type: Accelerator
  model: NVIDIA-H100
  limit: "8"
  request: "8"
  nodeSelector:
    feature.node.cloud.xiaoshiai.cn/accelerator-model.name: NVIDIA-H100
resourcePool: h100-pool
```

服务端生成：

- Kubernetes quota hard。
- 类型、型号、厂商、租户、资源池标签。
- scopeSelector。
- 用于表单回填的 config annotation。

### 可用 Flavor 过滤

租户或工作空间查询可用 Flavor 时：

```text
quota list
  -> ListTenantNodeResource / ListWorkspaceNodeResource
  -> filter enabled flavors
  -> match each flavor config against quotas
  -> remove forbidden flavors
  -> mark soldOut if quota exhausted
```

匹配规则：

- `resourceName` 必须精确匹配。
- quota `model` 为空时匹配所有型号。
- quota `model` 非空时必须与 Flavor config 型号一致。
- Flavor config 的 `nodeSelector` 必须是 quota `nodeSelector` 的超集。
- ResourcePool 标签会参与 nodeSelector 匹配。

售罄规则：

- 如果某个资源项匹配到的所有 quota 都 `limit <= used`，该 Flavor 标记为 `soldOut`。
- 如果任一资源项没有匹配 quota，Flavor 不返回。
- 如果匹配 quota 的 limit 全部为 0，Flavor 不返回。

## API 形态

### 管理员接口

集群维度：

```text
GET    /clusters/{cluster}/flavors
POST   /clusters/{cluster}/flavors
GET    /clusters/{cluster}/flavors/{flavor}
PUT    /clusters/{cluster}/flavors/{flavor}
DELETE /clusters/{cluster}/flavors/{flavor}
GET    /clusters/{cluster}/flavorresources
GET    /clusters/{cluster}/flavor-selector
```

用途：

- 管理 Flavor。
- 查询集群可配置资源。
- 查询控制台筛选器。

### 租户和工作空间接口

租户和工作空间维度：

```text
GET /tenants/{tenant}/clusters/{cluster}/flavors
GET /tenants/{tenant}/clusters/{cluster}/resources
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/flavors
GET /tenants/{tenant}/clusters/{cluster}/workspaces/{workspace}/resources
```

用途：

- 展示当前用户可选择的 Flavor。
- 按配额过滤不可用规格。
- 展示售罄状态。

## 命名和展示

Flavor 名称由配置生成，规则倾向于展示最重要资源：

```text
H100*1 . 16CPU . 64Gi . h100-pool
VGPU*1 . 8CPU . 32Gi
```

生成顺序：

- 主加速卡。
- CPU。
- 内存。
- 其他资源。
- ResourcePool 名称。

这样控制台可以直接展示简短规格名，同时详情里展示完整资源清单。

## 兼容与扩展

### 当前扩展资源模式

当前主要落地字段：

```yaml
resources:
  requests: {}
  limits: {}
nodeSelector: {}
tolerations: []
```

chart 应将这些字段放入 Pod template。

### 后续 DRA/CDI 扩展

后续 Flavor 需要在现有扩展资源字段之外增加标准 DRA 回填字段。产品层可以保留中立 `device` 元数据，但 Helm chart 正常落地 DRA 时应优先消费 Kubernetes 标准字段。

普通业务用户提交 Instance 时仍只选择 Flavor：

```yaml
worker:
  flavor:
    id: h100-8gpu-rdma
```

服务端校验 Flavor 后回填标准 DRA values：

```yaml
resources:
  requests:
    cpu: "128"
    memory: 1024Gi
  limits:
    cpu: "128"
    memory: 1024Gi
  claims:
  - name: accelerator
resourceClaims:
- name: accelerator
  resourceClaimTemplateName: h100-8gpu-rdma
resourceClaimSpec:
  devices:
    requests:
    - name: accelerator
      exactly:
        deviceClassName: gpu.xiaoshiai.cn/h100
        allocationMode: ExactCount
        count: 8
device:
  allocationMode: auto
  className: gpu.xiaoshiai.cn/h100
  count: 8
  topology:
    nodeLocal:
    - same-numa
    - same-pcie-root
queueAccounting:
  resources:
    nvidia.com/gpu: "8"
```

建议结构变化：

```go
type FlavorResources struct {
    Limits   corev1.ResourceList
    Requests corev1.ResourceList
    Claims   []corev1.ResourceClaim
}

type Flavor struct {
    Resources         FlavorResources
    ResourceClaims    []corev1.PodResourceClaim
    ResourceClaimSpec *resourcev1.ResourceClaimSpec
    Device            *DeviceRequirement
    QueueAccounting   *QueueAccounting
}
```

字段职责：

- `resources.claims` 对应 `container.resources.claims`。
- `resourceClaims` 对应 `pod.spec.resourceClaims`。
- `resourceClaimSpec` 对应 `ResourceClaimTemplate.spec.spec`。
- `device` 只作为 UI、校验、兼容和后端适配的中立元数据。
- `queueAccounting` 用于说明复杂设备如何计入队列资源，例如 8 个 DRA 设备按 `nvidia.com/gpu: "8"` 进入队列容量统计。

扩展原则：

- 保持普通用户只选择 Flavor。
- `ResourceClaimSpec` 由平台从 Flavor/设备规格生成或由管理员维护，不由普通业务用户提交。
- 保持旧 Flavor 继续通过扩展资源工作。
- DRA/CDI 相关 values 由 Flavor 回填，具体对象仍由 chart 或业务 controller 生成。
- Flavor 不直接提供 `ResourceClaimTemplate` 对象列表；对象的 metadata、labels、owner、命名和生命周期不属于 Flavor。
- 复杂设备拓扑不塞进现有 `nodeSelector`，避免语义失真。
- Flavor 不包含 queue、schedulerName、priorityClassName、PodGroup 或调度后端类型，这些由 scheduler policy、queue schema 和 chart/controller 负责。

## 风险和约束

| 风险 | 说明 | 处理 |
| --- | --- | --- |
| 用户伪造资源 | values 中手写更大 resources | 服务端用 Flavor 覆盖派生字段 |
| 型号识别不准 | 节点缺少标准模型标签 | 规范节点标签，缺失时降级为资源名/vendor 推导 |
| ResourcePool 变更影响调度 | 节点池标签变化后旧 Pod 不自动迁移 | Flavor 只负责新渲染资源，迁移由上层策略处理 |
| 配额和 Flavor 不一致 | 管理员创建了不被配额覆盖的 Flavor | 租户侧通过配额过滤，不返回不可用 Flavor |
| vGPU 资源复合 | 显存、核心、卡数必须一起判断 | Flavor config 支持多资源项，匹配时逐项校验 |
| DRA shape 演进 | Kubernetes DRA API 和 driver 差异大 | Flavor 回填标准 DRA values 片段，chart/controller 负责对象模板 |
| Flavor 和 scheduler 边界混淆 | 把 queue、PodGroup 或 backend 塞入 Flavor | Flavor 只保留资源和设备字段，调度字段走 scheduler policy 和 `x-scheduling-queue` |

## 落地阶段

### 稳定现有 Flavor

- 明确 `config -> resources/nodeSelector/type/model/vendor` 为服务端生成链路。
- 控制台使用租户和工作空间 Flavor API。
- 保持 `x-resource-enum: flavors` 注入契约。
- 补齐 Flavor、配额、ResourcePool 的文档和示例。

### 多角色和状态展示

- 基于 chart roles 注解展示角色 Flavor。
- Instance 详情展示每个角色的规格、资源和售罄状态。
- 资源树展示 Flavor 与实际 Pod resources 的对应关系。

### 设备需求扩展

- 增加 Flavor 标准 DRA 回填字段和中立设备元数据。
- 支持 `resources.claims`、`resourceClaims`、`resourceClaimSpec` values 回填。
- 支持队列计量字段。
- 与调度队列和拓扑策略联动。
