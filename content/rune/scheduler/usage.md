# Rune 共享算力使用方式和界面

本文从使用方出发描述共享算力能力如何出现在控制台和 API 中。本文使用“资源池、资源权益、运行保障、允许中断、协同启动”等产品语言；它们与底层调度对象的映射见 [设计](design.md)。

## 使用原则

- Chart 在需要资源的任意配置位置使用 `x-resource-enum: flavors`。
- Flavor 选择器先用 ResourcePool 做筛选，再选择具体 Flavor；ResourcePool 不是新增的 values 字段。
- 每个 Flavor 选择器都可以独立筛选不同 ResourcePool。
- 用户提交的仍然只是 Flavor ID，Rune 校验后向原路径注入服务端控制的 Flavor 数据。
- 用户表达业务重要性，不填写数字优先级。
- 用户表达任务能否中断和如何恢复，不配置抢占算法。
- 应用模板决定是否需要全部副本一起启动。
- 状态页优先解释原因和处理建议，底层对象放在技术详情中。

## 角色和入口

| 角色 | 主要入口 | 主要任务 |
| --- | --- | --- |
| 平台管理员 | 集群 / 共享算力治理 | 配置全局共享、保护和中断原则 |
| 租户管理员 | 租户 / 资源池权益 | 查看各资源池权益，配置授权和租户策略 |
| 普通用户 | Instance 创建与详情 | 选择资源池和规格、提交任务、理解等待或中断原因 |
| Chart 作者 | Chart schema 和模板 | 声明平台回填入口和协同启动行为 |

## 平台管理员操作

### 查看共享算力概览

集群详情增加“共享算力”页，首先展示资源承诺和使用情况，而不是调度插件：

| 租户 | 保障资源 | 最大可用 | 当前使用 | 临时借用 | 借出空闲 | 等待需求 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| tenant-a | 64 GPU | 96 GPU | 58 GPU | 0 | 6 GPU | 8 GPU |
| tenant-b | 16 GPU | 64 GPU | 40 GPU | 24 GPU | 0 | 12 GPU |

管理员可以从这里回答：

- 哪些租户正在使用自己的保障资源。
- 哪些租户临时使用了别人的空闲资源。
- 哪些租户有任务在等待。
- 集群不足是总量不足还是资源碎片、型号或拓扑不匹配。

### 配置全局治理策略

第一阶段界面只提供安全、稳定的产品开关：

```text
协同启动支持                         开启
租户间公平共享                       开启
允许使用零散空闲资源                 开启
允许跨租户中断运行中任务             关闭
允许资源拥有方收回临时借出资源       关闭
```

只有管理员主动开启中断或收回能力后，才显示进一步策略：

- 哪类任务允许成为中断候选。
- 在线服务是否始终保护。
- 任务最短运行保护时间。
- 是否允许跨租户执行。
- 执行前是否需要人工确认。

数字优先级、插件顺序和调度器参数放在“高级配置”或“运维诊断”，不作为默认产品界面。

### 查看影响和审计

任何可能中断任务的策略都需要展示：

```text
预计受影响任务：3
涉及租户：tenant-b
预计释放：24 GPU
受影响任务恢复方式：自动重新排队 2，任务结束 1
```

执行后记录：

- 触发时间和操作者。
- 触发原因。
- 资源拥有方和临时使用方。
- 被中断的 Instance/workload。
- 实际释放资源。
- 恢复结果。

## 租户管理员操作

### 查看各资源池权益

首期系统根据租户在各 ResourcePool 中的配额，自动建立对应资源权益：

```text
资源池：H100 高性能算力池
权益：默认权益
保障资源：64 GPU、512 CPU、2 TiB 内存
最大可用：96 GPU、1024 CPU、4 TiB 内存
当前使用：58 GPU、420 CPU、1.7 TiB 内存
等待需求：8 GPU
```

保障资源和最大可用资源来自该 ResourcePool 对应的已有租户配额。租户管理员不在这里重复填写一套资源数量。

同一资源池首期只有一份默认权益，因此普通用户选择资源池后，系统可以自动匹配权益。

### 后续同池多权益

只有同一个资源池出现以下业务需求时才开放多权益账户：

- 生产和实验使用不同保障。
- 不同项目使用不同预算。
- 权益账户有不同成本或服务等级。
- 需要限制特定用户或项目访问。

同池多权益界面示例：

| 权益账户 | 用途 | 保障资源 | 最大可用 | 当前使用 | 可访问项目 |
| --- | --- | ---: | ---: | ---: | --- |
| 生产资源 | 在线服务 | 48 GPU | 64 GPU | 42 GPU | inference-prod |
| 实验资源 | 训练实验 | 16 GPU | 48 GPU | 30 GPU | research-a、research-b |

租户管理员可以配置默认权益和访问范围，但底层 Queue 名称不需要成为主要字段。

### 配置租户运行规则

在平台允许的范围内，租户管理员可以配置：

- 用户可选择哪些运行保障等级。
- 哪些应用允许声明为关键业务。
- 是否允许实验任务使用临时空闲资源。
- 可中断任务默认恢复方式。
- 哪些项目或应用始终受到保护。

租户管理员不能通过这些规则突破平台分配的最大资源。

## 普通用户创建 Instance

### 默认创建流程

创建页仍然由 JSON Schema 驱动。某个 `x-resource-enum: flavors` 字段在界面中表现为带资源池筛选的 Flavor 选择器：

```text
应用参数
  副本数量             8

Worker Flavor
  资源池筛选           H100 高性能算力池（默认）
  具体规格             H100 × 8 高速互联

运行保障
  保障等级             标准
```

如果应用没有开放运行保障选择，界面只展示管理员或 Chart 给出的默认值。

系统自动完成：

- 为每个 Flavor 选择器读取用户可访问的资源池并应用默认筛选。
- 按当前资源池筛选可选 Flavor。
- 校验 Flavor 是否可用。
- 校验租户和工作空间配额是否覆盖该 Flavor。
- 回填资源数量、节点范围和设备要求。
- 将服务端控制的 Flavor 数据写回声明 `x-resource-enum: flavors` 的原 values 路径。

普通用户不需要填写：

- schedulerName。
- Queue 名称。
- 原生 nodeSelector 或 nodeAffinity YAML。
- 数字优先级。
- PodGroup。
- ResourceClaimSpec。
- 调度器后端或插件参数。

### 资源池选择

资源池是 Flavor 选择器中的一级筛选，并提供默认值：

```text
资源池
● H100 高性能算力池（默认）  适合大模型训练，高速互联
○ L20 推理算力池           适合在线推理和批量推理
○ CPU 通用算力池           适合数据处理和普通服务
```

交互规则：

- 默认选中集群、租户或应用推荐的资源池。
- 用户不理解资源池差异时可以直接保留默认值。
- 只展示用户有权访问的资源池。
- Flavor 选项只来自当前资源池。
- 切换资源池后，如果原 Flavor 不属于新资源池，清空 Flavor 并要求重新选择。
- 资源池没有可用 Flavor 时说明原因，不展示跨池 Flavor。
- 切换当前选择器的资源池只使当前 Flavor 失效，不影响其他 Flavor 选择器。

资源池卡片可以展示主要硬件、用途、位置、价格标签和当前可用性，但不能承诺提交后立即运行。

具有多个 Flavor 配置位置的应用示例：

```text
Prefill Flavor
  资源池筛选           H100 高性能算力池
  具体规格             H100 × 4

Decode Flavor
  资源池筛选           L20 推理算力池
  具体规格             L20 × 1

Router Flavor
  资源池筛选           CPU 通用算力池（默认）
  具体规格             CPU 8C 16Gi
```

三个 schema 配置位置的选择相互独立。是否需要它们协同启动以及如何使用注入数据，完全由 Helm Chart 或业务 Controller 决定。

### 资源权益校验

用户选定 Flavor 后，服务端可以根据 Flavor 中已有的 `ResourcePool` 和资源需求校验租户权益。ResourcePool 筛选值本身不提交，也不用于安全判断。

只有未来同一资源池存在多份不同预算或项目权益时，才需要单独设计“使用额度”扩展；不能擅自塞进现有 Flavor schema 契约：

```text
使用额度
○ 生产保障额度
○ 实验共享额度
```

### 放置条件和 Node Affinity

普通用户不编辑原生 nodeAffinity YAML。界面把它转换为资源池内部的业务条件：

```text
放置条件
- H100 节点
- 同一高速互联域
- GPU 与 RDMA 同 NUMA

放置偏好
● 自动
○ 优先使用已有缓存的节点
○ 优先使用指定可用区
```

交互和校验规则：

- ResourcePool 先确定允许使用的节点集合。
- Flavor 和 required nodeAffinity 只能在该集合内进一步缩小范围。
- preferred nodeAffinity 只调整候选节点排序。
- required 条件与 ResourcePool 没有交集时，在提交前提示冲突。
- Chart 自带的 nodeAffinity 必须进入确认页和状态解释，不能成为不可见约束。
- 专家模式可以只读展示 label 条件；首期不允许普通用户任意填写 label key/value。

### 运行保障

界面使用业务等级：

```text
运行保障
○ 尽力运行    适合实验，资源紧张时等待时间可能较长
● 标准        适合一般训练和推理任务
○ 关键业务    仅授权应用可用，优先获得资源
```

运行保障用于表达等待顺序和保护等级。它不直接承诺一定立即运行，也不表示可以中断任何其他任务。

管理员可以对关键业务要求额外权限、审批或应用类型限制，避免所有用户都选择最高等级。

### 允许中断

对批处理、实验或可恢复训练任务，创建页可以提供：

```text
允许在资源紧张时中断此任务       [x]

中断后
● 自动重新排队
○ 结束任务
○ 由应用自行恢复
```

选项旁必须说明：

- 允许中断可能缩短首次等待时间。
- 中断可能导致未保存的运行进度丢失。
- 是否真正中断仍由平台策略决定。

在线服务和不支持恢复的应用可以由 Chart 禁用该选项。

### 使用临时空闲资源

当平台启用相关能力后，可中断任务可以选择：

```text
允许使用临时空闲资源             [x]
最长连续运行时间                 2 小时
资源被收回后                     自动重新排队
```

界面不使用“回填”术语。用户只需要理解这类资源可能随时被拥有方收回。

### 协同启动

训练或 HPC Chart 可以展示：

```text
启动方式
● 全部 8 个副本资源就绪后一起启动
○ 副本可以逐个启动
```

推荐由 Chart 根据应用类型提供正确默认值：

- 分布式训练、MPI、HPC 默认全部就绪后启动。
- Web 服务和普通 Deployment 默认逐个启动。

如果应用只支持一种方式，可以不让用户选择，只在确认页展示结果。

### 缓存优化

推理应用可以展示简化选项：

```text
缓存优化
● 自动优先使用已缓存节点
○ 必须使用已缓存节点（高级）
○ 不使用缓存位置优化
```

默认使用软偏好。只有专家用户明确选择“必须使用”时，缓存才成为硬限制，并需要提示可能导致长时间等待。

缓存位置不放入 Flavor，也不要求用户选择具体节点。

### 创建确认

提交前展示用户真正关心的结果：

```text
Prefill：H100 高性能算力池 / H100 × 4
Decode：L20 推理算力池 / L20 × 1
Router：CPU 通用算力池 / CPU 8C 16Gi
资源权益：根据各 Flavor 所属 ResourcePool 校验
运行保障：标准
启动方式：按应用定义协同启动
允许中断：否
缓存优化：自动
```

底层 scheduler、Queue、PodGroup 和 DRA 对象不出现在普通确认页。

## Instance 详情和状态解释

### 状态模型

用户主状态使用中立语言：

| 状态 | 用户含义 |
| --- | --- |
| 等待资源 | 已提交，但资源或条件尚未满足 |
| 准备启动 | 所需条件正在满足，workload 正在创建或调度 |
| 运行中 | 应用已经开始运行 |
| 已完成 | 应用成功结束 |
| 失败 | 应用或基础设施发生失败 |
| 已中断 | 因资源治理或临时资源收回而停止 |
| 重新排队 | 被中断后等待再次运行 |
| 未知 | 暂时无法确定状态 |

技术详情中可以同时显示后端 phase，但不能替代用户主状态。

### 等待资源

详情页需要同时展示“原因、证据、建议”：

```text
状态：等待资源

主要原因
需要 8 张 H100，目前满足全部条件的可用资源为 4 张。

限制条件
- 需要 8 张卡同时可用
- 设备必须位于同一高速互联域
- 当前资源池权益还有 6 张 GPU 可用

处理建议
- 继续等待
- 将副本数或单副本规格降低到 4 张 GPU
- 选择其他资源池或规格
- 联系租户管理员增加资源
```

系统无法确定唯一原因时，应明确写成“可能原因”，不能制造确定性结论。

### 等待协同启动

```text
状态：等待全部副本资源
所需副本：16
可满足副本：12
已启动副本：0

说明：该应用要求全部副本资源就绪后一起启动。
```

普通视图不需要显示 PodGroup；技术详情可以展示 PodGroup conditions。

### 使用临时资源

运行中需要明显标识：

```text
运行中 · 使用临时资源

此任务使用了当前空闲但不属于本资源池权益保障范围的资源，资源被收回时可能中断。
中断后：自动重新排队
```

### 被中断或资源被收回

```text
状态：已中断，正在重新排队

原因
任务使用的是临时空闲资源，资源拥有方正在使用其保障资源。

本次运行时长：1 小时 26 分钟
释放资源：8 × H100
恢复方式：自动重新排队
```

“被抢占”“被回收”等后端术语可以作为技术原因，但主文案应解释业务原因。

### 缓存状态

推理 Instance 可以展示：

- 已命中缓存节点，预计减少模型加载时间。
- 缓存节点资源不足，已使用其他满足条件的节点。
- 必须命中缓存，但缓存节点当前不满足资源要求。
- 缓存信息无效，已忽略该优化条件。

### 技术详情

为管理员和排障人员提供可展开区域：

- 实际 ResourcePool、资源权益和底层 Queue。
- workload、PodGroup 或后端 Job。
- Pod conditions 和 Kubernetes Events。
- ResourceClaim 状态。
- 设备和节点拓扑条件。
- 缓存亲和来源。
- 调度后端原始 phase 和 reason。

技术详情不作为普通用户理解状态的唯一入口。

## Chart 作者接入

### Flavor 入口

Chart 继续只在需要资源的 values 路径声明现有 `x-resource-enum: flavors`：

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

用户提交：

```yaml
worker:
  flavor:
    id: h100-8gpu-rdma
```

ResourcePool 只用于选择器过滤，不进入用户提交 values。Rune 根据 Flavor ID 读取当前 Flavor，并在原路径回填服务端控制的数据。当前实现覆盖 resources、nodeSelector 和 tolerations；后续设备字段也应扩展同一注入机制。用户伪造平台管理字段时，服务端应覆盖或拒绝请求。

回填后的同一路径示意：

```yaml
worker:
  flavor:
    id: h100-8gpu-rdma
    resources:
      requests:
        cpu: "128"
        memory: 1024Gi
      limits:
        cpu: "128"
        memory: 1024Gi
        nvidia.com/gpu: "8"
    nodeSelector:
      feature.node.cloud.xiaoshiai.cn/gpu-model.name: NVIDIA-H100
    tolerations: []
```

Helm Chart 是否把这些数据用于一个或多个 workload、是否创建 PodGroup，以及如何组织不同配置位置，均由 Chart 模板决定。

### Queue Values 入口（待实现）

如果后续引入 Queue values，应像 Flavor 一样由 Chart 在 JSON Schema 中显式声明独立的扩展路径。以下 `x-scheduling-queue` 仍是待实现设计，不属于现有 `x-resource-enum: flavors` 行为：

```yaml
properties:
  scheduling:
    type: object
    properties:
      entitlement:
        type: object
        x-scheduling-queue:
          scope: tenant
          default: true
```

该扩展实现后，Rune 在 Chart 声明的位置校验和回填 Queue。它与 Flavor 注入相互独立，不能根据 Flavor 路径擅自推导 Queue 路径：

```yaml
scheduling:
  entitlement:
    backendQueue: tenant-a
    backend: volcano
```

Chart 决定如何把 `backendQueue` 写入 workload 或业务 CRD。多个 Flavor 字段可以来自不同 ResourcePool，与 Queue 字段如何组织没有必然关系。Rune 不扫描渲染结果并自动生成 PodGroup。

### 协同启动

需要协同启动的 Chart 自己生成 PodGroup 或后端等价对象，并确保：

- 使用 Chart 显式声明并由平台回填的 Queue 数据。
- `minMember` 与应用实际协同启动需求一致。
- 对象带有 `app.kubernetes.io/instance` 标签。
- 用户选择逐个启动时不生成错误的协同约束。
- 多个 Flavor 配置来自不同 ResourcePool 时仍按 Chart 定义的业务边界协同启动。

### 可中断和运行保障

Chart 只有在应用支持对应语义时才展示这些字段。应用不支持恢复时，不应提供“自动重新排队”承诺。

平台需要校验用户选择是否在租户授权范围内，并将产品等级转换为后端字段；Chart 不应要求用户填写数字优先级。

### 兼容规则

- 不声明 `x-scheduling-queue` 的 Chart 不强制注入资源权益投影。
- 不声明协同启动的 Chart 不自动创建 PodGroup。
- 现有 Flavor 继续回填 resources、nodeSelector 和 tolerations。
- DRA 字段只有在集群和 Chart 都支持时才回填和消费。

## API 使用原则

API 与控制台保持相同产品语义：

- ResourcePool 只作为 Flavor 选择器筛选，不作为额外 API 字段提交。
- 运行保障使用稳定枚举，不接受任意数字优先级。
- 是否允许中断、恢复方式和临时资源使用分别表达。
- 返回中立状态、原因、证据和建议。
- 后端对象放在可选 technicalDetails 中。

普通用户创建 Instance 的最小 values 仍然可以是：

```yaml
worker:
  replicaCount: 8
  flavor:
    id: h100-8gpu-rdma
```

多个 Flavor 配置位置可以提交不同 Flavor ID：

```yaml
prefill:
  flavor:
    id: h100-4gpu
decode:
  flavor:
    id: l20-1gpu
```

启用高级能力后才增加：

```yaml
scheduling:
  serviceLevel: standard
  interruptible:
    enabled: true
    recovery: requeue
  opportunistic:
    enabled: true
    maxRunDuration: 2h
worker:
  replicaCount: 8
  flavor:
    id: h100-8gpu-rdma
```

这些字段是产品 API 示例，最终字段名需要在设计阶段统一，不应直接复用 Volcano 字段名。

## 排障顺序

当 Instance 长时间等待时，界面和支持人员按以下顺序检查：

1. Flavor 是否存在、启用并被当前租户覆盖。
2. 当前 ResourcePool 对应的租户权益是否足够。
3. 集群是否有足够的对应设备总量。
4. ResourcePool 和节点范围是否匹配。
5. 数量、型号和拓扑条件能否同时满足。
6. 应用是否要求全部副本一起启动。
7. Chart 是否正确消费平台回填字段。
8. DRA 模式下 ResourceClaim 是否完成分配。
9. 缓存硬约束或原生 nodeAffinity 是否限制了候选节点。
10. Pod、workload 和调度后端 Event 是否提供更具体原因。

排障结果最终应转换为用户可以采取的行动，而不是原样复制底层事件。
