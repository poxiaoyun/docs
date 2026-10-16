# 数字孪生平台对接设计

> 状态：**提案，已确认、未实施**（2026-10-16）。本文是 `rune-digital-twin` 接入 Rune 平台的唯一权威设计；
> 实施步骤见[实施计划](implementation-plan.md)，新采集端见
> [节点硬件与机房环境监控研究](../../../specification/research/node-hardware-monitoring.md)。
> 当前 `rune-digital-twin` 仍是独立前端，下文"现状"一节描述实施前的代码事实。

## 现状

| 方面 | 实施前的代码事实 | 位置 |
| ---- | ---------------- | ---- |
| 数据源 | 浏览器按构建期 `VITE_API_BASE` 请求自定义 `/room`、`/scene`、`/faults`、`/telemetry`、`/nodes`，无鉴权，默认 1 秒轮询 | `src/data/source.ts`、`src/data/api.ts` |
| 机房 | 只有一个 `Room`；台账表 `racks`、`nodes`、`assignments` 无机房维度 | `src/data/types.ts`、`src/admin/schema.ts` |
| 后台配置 | 设置项 `node.apiBase`、`node.apiPath`；手建节点、导入模拟数据、导入演示数据 | `src/admin/AdminPanel.tsx`、`src/admin/store.ts` |
| 登录 | 无用户登录；台账写操作可选 `LEDGER_TOKEN` | `server/index.mjs`、`src/admin/remote.ts` |
| 服务端 | Node 零依赖：托管 `dist/`、整库字节读写 `/api/ledger`、`/healthz`，不理解表结构 | `server/index.mjs`、`server/store.mjs` |
| 平台集成 | 无 Prometheus、cloud、apiserver、IAM、License 代码 | — |

平台侧已具备的能力：

| 能力 | 接口（经网关） | 权限 |
| ---- | -------------- | ---- |
| 集群列表 | `GET /api/cloud/clusters` | `read:clusters` |
| 节点 | `GET /api/cloud/clusters/{cluster}/resources/apis/core/v1/nodes` | `read:kubernetes` |
| GPU 库存树 | `GET /api/cloud/clusters/{cluster}/noderesources` | `read:clusters` |
| Prometheus 透传 | `GET /api/cloud/clusters/{cluster}/prometheus/api/v1/query`、`query_range` | `read:observability` |
| 当前告警 | `GET /api/cloud/clusters/{cluster}/alertrecords` | `read:observability` |
| License 公开状态 | `GET /api/license/global/status`（不含产品授权） | 公开 |

Prometheus 透传按集群路由到该集群 `rune-system` 下的 `kube-prometheus-stack-prometheus:9090`，原样返回 Prometheus JSON，
不限制 PromQL；平台默认抓取与录制规则间隔为 30 秒。

## 所有权与边界

| 问题 | 回答 |
| ---- | ---- |
| 对象属于谁 | 机房 = cloud 集群，平台全局资源，不属于租户或工作空间 |
| 唯一标识 | 机房 = cloud 集群 ID；节点 = (集群 ID, Kubernetes Node 名)；GPU = (node, `device_id`) |
| 权威状态 | 集群与节点在 cloud；指标在各集群 Prometheus；告警在 cloud；身份与角色在 IAM；授权在 apiserver License；机柜编排与资产字段在 twin 台账 |
| 何时算成功 | 读操作返回快照即成功；节点同步成功只表示缓存已刷新，不代表节点健康 |
| 超时恢复 | 对平台的调用都是只读查询，超时后保留上一次快照并标记过期时间，下个周期重试 |
| 删除清理 | 集群或节点在 cloud 消失时，twin 只标记"已失联 / 已下线"，台账保留，由管理员清理 |

硬约束：

- twin 不保存平台事实的副本。集群列表与节点列表只在服务端内存缓存，不写入台账。
- twin 不直连 Prometheus、Kubernetes 或 cloud，数据一律经 apiserver。
- 只消费 `accelerator_*` 与 `rune_node_*` 等平台规范指标，不使用 DCGM 等厂商原始指标。
- 采集不到的指标显示"无数据"，不伪造数值，不用演示数据填充。
- 权限由 twin 服务端执行，前端隐藏不算授权。

## 已确认的决策

| 编号 | 决策 | 结论 |
| ---- | ---- | ---- |
| D1 | 访问平台的身份 | twin 服务端作为后端代理层，用 OAuth Client Credentials 获取应用 token |
| D2 | IAM 登记 | bootstrap 预注册应用 `rune-digital-twin`，只申请 cloud 只读 scope 和 IAM 审查 scope |
| D3 | 机房来源 | 同步全部 cloud 集群作为候选，后台开关启用；集群删除后台账保留 |
| D4 | 节点同步 | 每 5 分钟同步一次，平台字段只读，管理员手动上架，消失的节点标记"已下线" |
| D5 | 指标范围 | 只接已有指标，缺失的部件显示"无数据"；新采集端另出研究提案 |
| D6 | 登录方式 | 挂在 apiserver 网关下，复用平台登录会话；不代调 IAM `/login` |
| D7 | License 授权项 | 新增产品 `DigitalTwin`，只授权产品本身，不带额度 |
| D8 | 授权查询接口 | apiserver 新增公开接口 `GET /api/license/products/{product}/status`，只返回脱敏状态 |
| D9 | 校验失败 | 失败关闭，提示区分"未授权"与"暂时无法确认"，每 5 分钟重新校验 |
| D10 | 大屏访问 | 大屏同样要求登录与 License；角色分 `digital-twin-viewer` 和 `digital-twin-admin` |
| D11 | 查询节奏 | 四档：实时 30 秒、计数 60 秒、清单 5 分钟、趋势按需；只保留全局实时间隔（30–300 秒） |
| D12 | 台账迁移 | 现有数据迁到"未绑定机房"，管理员绑定集群并按节点名对应 |
| D13 | 平台外数据 | 节点只来自 cloud；演示模式只保留在开发构建 |

推导出的命名（实施时以此为准）：

| 名称 | 取值 | 依据 |
| ---- | ---- | ---- |
| IAM 应用 ID（`client_id`） | `rune-digital-twin` | D2 |
| 网关 service 名、IAM 角色 `service`、审计 `service` | `digital-twin` | REST 规范 §3.1：`/api/{service}` 与鉴权、审计的 service 一致 |
| API 前缀 | `/api/digital-twin` → 服务内部 `/v1` | REST 规范 §3.1 |
| 页面路径 | `/twin/` | D6 |
| License 产品名 | `DigitalTwin` | D7 |
| Helm release / Service 名 | `rune-digital-twin` | 现有 Chart |

## 架构

```text
浏览器 ──/twin/ (页面)──────────────┐
       ──/api/digital-twin/... ─────┤  apiserver 网关（License Filter：写操作要求 DigitalTwin）
                                     ▼
                         rune-digital-twin 服务端（Node）
     ┌───────────────┬───────────────┼──────────────────────────────┐
     │ 用户请求鉴权    │ 平台数据（应用 token，resource=urn:cloud:api） │ 授权查询
     ▼               ▼                                               ▼
 IAM（直连 http://iam）  apiserver http://apiserver/api/cloud/...      apiserver /api/license/products/DigitalTwin/status
 authentication-reviews   clusters / nodes / noderesources /
 authorization-reviews    prometheus/api/v1/query(_range) / alertrecords
 oauth2/token
```

- 平台数据与 License 查询走 apiserver 集群内地址；IAM 的 token 与审查直连 `http://iam`，与其他服务一致，
  避免 token 的 issuer 与 cloud 校验的 `http://iam` 不一致（实施时核实）。
- 两个地址写在 Helm values（`platform.apiserverURL`、`platform.iamURL`），后台不提供配置入口。

## 身份与访问

### IAM 预注册

在 `iam/deploy/iam/values.yaml` 的 `bootstrap.plan` 追加（`iam/examples/bootstrap.yaml` 同步）：

```yaml
roles:
  - id: digital-twin-viewer
    name: Digital Twin Viewer
    authorities:
      - service: digital-twin
        actions: [get, list]
        resources: ["**"]
  - id: digital-twin-admin
    name: Digital Twin Admin
    authorities:
      - service: digital-twin
        actions: ["*"]
        resources: ["**"]
applications:
  - id: rune-digital-twin
    name: Rune Digital Twin
    description: Rune digital twin service identity
    clientSecret: password   # 生产用 ${RUNE_DIGITAL_TWIN_CLIENT_SECRET}
    grants:
      - resourceServer: iam
        allowedScopes: [create:authentication-reviews, create:authorization-reviews]
        defaultScopes: [create:authentication-reviews, create:authorization-reviews]
      - resourceServer: cloud
        allowedScopes: [read:clusters, read:kubernetes, read:observability]
        defaultScopes: [read:clusters, read:kubernetes, read:observability]
```

- bootstrap 只建不改：新集群自动生效，已部署集群需通过 IAM `/v1/applications`、系统角色接口补注册，
  重跑 Job 不会补齐。
- 平台系统管理员角色（`service: "*"`）自动拥有 twin 全部权限。
- 生产环境用共享 Secret：bootstrap Job 的 `extraEnvVarsSecret` 与 twin Chart 的 `clientSecretRef` 指向同一 Secret。

### 应用 token

- `POST http://iam/oauth2/token`，`client_secret_basic`，`grant_type=client_credentials`。
- 每次请求只能选一个 resource，所以 twin 持有两个 token：
  `resource=urn:cloud:api`（cloud 只读）和 `resource=urn:iam:api`（审查）。
- token 默认 10 分钟过期。缓存到 `exp − 60s`；收到 401 时强制刷新并重试一次。
- token 不写日志、不进错误响应、不下发给浏览器。

### 网关注册

apiserver `DefaultServicesConfig` 新增服务 `digital-twin`，地址 `http://rune-digital-twin`：

| 外部路径 | 上游路径 | 说明 |
| -------- | -------- | ---- |
| `/twin`、`/twin/` | `/` | 静态页面；Vite `base` 改为 `/twin/` |
| `/api/digital-twin`、`/api/digital-twin/` | `/v1/` | twin REST |

网关对该服务不开启 authn/authz（与 cloud 相同，由上游自行鉴权），会保留 `Cookie` 与 `Authorization`。

### 请求鉴权流程

twin 服务端对每个 `/v1` 请求依次执行（`/healthz` 除外）：

1. **认证**：取 `user_session` Cookie（或 `Authorization: Bearer`），用 IAM token 调
   `POST http://iam/v1/authentication-reviews`。失败返回 401 + `Status`，前端跳转平台登录页，登录后回到 `/twin/`。
   结果按凭据哈希缓存 60 秒。
2. **授权**：调 `POST http://iam/v1/authorization-reviews`，`service=digital-twin`，
   动作见下文 API 表（读为 `get`/`list`，写为 `update`/`create` 等）。拒绝返回 403。结果按 (subject, action) 缓存 60 秒。
3. **License**：调 `GET http://apiserver/api/license/products/DigitalTwin/status`，结果全局缓存 5 分钟（D9 的重新校验周期）。
   未通过返回 403（未授权）或 503（暂时无法确认），`reason` 透传 License code。

审查请求与响应的线格式见 `common/rest/api` 的 `AuthenticationReview` / `AuthorizationReview`，以及 IAM `pkg/integration`。

## License

### 签发侧（`license` 仓库）

`internal/signing/signer.go` 的 `DefaultConfig().Products` 追加 `{Name: "DigitalTwin"}`，不带 features。
Web 表单为自由文本，无需改动。

### 执行侧（`apiserver`）

**新增公开接口**

```http
GET /api/license/products/{product}/status
```

```json
{
  "product": "DigitalTwin",
  "entitled": true,
  "phase": "Active",
  "code": "LicenseValid",
  "message": ""
}
```

`phase` 取值沿用 `pkg/license` 的 `Active`、`Warning`、`Pending`、`Invalid`、`Error`。调用方判定规则：
`entitled == true` 且 phase 为 `Active` 或 `Warning` 时通过；phase 为 `Invalid`，或 `entitled == false` 时视为未授权；
phase 为 `Pending` 或 `Error` 时视为暂时无法确认。

- 挂在 `StatusGroup`（不鉴权），显式豁免理由：只返回产品是否授权和脱敏状态，不含签发明细、额度、用量和 Record，
  敏感度与 `/global/status` 相同。
- `phase` / `code` / `message` 复用 `ValidationStatus` 与 `Public()` 脱敏输出；`entitled` 由
  `Manager.Check(CheckOptions{Product: product})` 判定。
- 不认识的产品名返回 `entitled: false`、`code: LicenseProductNotEntitled`，不返回 404，避免泄露产品清单差异。
- `product` 只接受 `[A-Za-z][A-Za-z0-9]{0,63}`，否则 400。
- License 未就绪时返回 200 + `phase: Pending`，由调用方按"暂时无法确认"处理；接口本身不因 License 状态失败。

**网关拦截规则**

`cloudLicenseFilterOptions` 的 `Requirements` 追加：

```go
{
    Product: "DigitalTwin",
    Matcher: license.RequestMatcherFunc(func(r *http.Request) bool {
        return proxyServiceFromContext(r.Context()) == "digital-twin"
    }),
},
```

现有 `Allow` 放行所有 `GET,HEAD`，所以该规则只拦截写操作；读请求由 twin 服务端的 License 校验覆盖。

### 失败处理

按上一节的 phase 规则分类，再按 code 选择提示文案：

| 类别 | License code | twin 响应 | 提示文案 |
| ---- | ------------ | --------- | -------- |
| 未授权 | `LicenseNotInstalled` | 403 | 平台尚未安装 License，请联系平台管理员 |
| 未授权 | `LicenseExpired` | 403 | 平台 License 已过期，请联系平台管理员续期 |
| 未授权 | `LicenseProductNotEntitled` | 403 | 当前 License 未开通数字孪生，请联系平台管理员 |
| 未授权 | `LicenseInvalid`、`LicenseFingerprintMismatch` 等其他 Invalid | 403 | 平台 License 无效，请联系平台管理员 |
| 暂时无法确认 | `LicenseNotReady`、`LicenseUsageCheckFailed`、`LicenseReadFailed`、apiserver 不可达或超时 | 503 | 授权状态暂时无法确认，请稍后重试 |

- 前端整页展示拒绝原因，大屏与后台一致；会话期间每 5 分钟重新校验，失效后清空数据并展示拒绝页。
- 文案进入前端 i18n，code 为判断依据，不解析 message。

## 多机房模型

### 机房

- 机房列表 = `GET /api/cloud/clusters` 的结果，服务端每 5 分钟刷新，内存缓存。
- 展示信息：集群 ID、显示名、`status.phase`、`cloud.xiaoshiai.cn/area`。
- 机房设置（启用、显示名覆盖、排序、全局实时间隔）是 twin 自有数据，由服务端保存在 `DATA_DIR/rooms.json`，
  沿用台账的原子写、备份与 `rev` 乐观锁。服务端只轮询**已启用**机房。
- 集群从 cloud 消失：机房标记 `lost`，设置与台账保留，后台提供清理入口。
- 保留机房 ID `unbound`，承载迁移前的单机房台账（D12），不对应任何集群，不轮询。

### 节点

- 已启用机房每 5 分钟拉取 `.../resources/apis/core/v1/nodes` 与 `.../noderesources`，后台可手动触发。
- 节点池 = 服务端内存中的节点列表，不写入台账。平台字段只读：名称、InternalIP、CPU、内存、GPU 型号与数量、Ready 状态。
- 节点被分配到机柜但不在最新列表中 → 派生状态 `offline`，保留上架位置。
- 新节点不自动上架。

### 台账结构变化（SQLite，浏览器侧迁移）

| 表 | 变化 |
| -- | ---- |
| `racks` | 新增 `room_id`（非空，迁移时填 `unbound`）；`ord` 在机房内唯一 |
| `assignments` | 主键改为 `(room_id, node_name)`；新增 `room_id`；`node_id` 改为 `node_name` |
| `nodes` | 语义改为"资产覆盖"：主键 `(room_id, node_name)`，只保留整机型号、厂商、序列号、BMC IP、部件模板等资产字段；删除 `poll_interval_s` 与全部平台字段 |
| `settings` | 删除 `node.apiBase`、`node.apiPath`、`telemetry.defaultIntervalSec`（实时间隔改由服务端 `rooms.json` 保存） |

服务端继续只按字节保存台账，不理解表结构。迁移写在 `src/admin/schema.ts` 的 `MIGRATIONS`。

### 绑定未绑定机房

管理员在后台把 `unbound` 绑定到某个已启用机房时（浏览器内执行）：

1. 把 `room_id = unbound` 的机柜、分配和资产覆盖改为目标机房 ID。
2. 旧节点按名称（旧 `HostNode` 的主机名）对应到目标集群的 Node 名。
3. 对不上的节点列出来，由管理员选择删除或手动对应。
4. 写库前触发一次整库备份（服务端已有的覆盖前备份）。

## 场景组装

- `Room` = 一个机房；`Rack` 来自台账；`Server.id` = Node 名（机房内唯一）。
- GPU 部件来自 `accelerator_info{device_mode="physical"}`：`Part.id` = `device_id`，型号、厂商、序列号取标签，
  槽位按 `pci_bus_id` 排序，缺失时按 `device_id` 排序。
- CPU 与内存来自 Node 容量。网卡、硬盘、风扇、PSU 的数量和型号来自台账"部件模板"，默认沿用现有 4U 8 卡模板；
  这些部件没有平台指标时显示"无数据"。
- 整机型号、厂商、序列号、BMC IP 来自台账资产覆盖；未填写时显示"未登记"。

## 监控查询集合

全部查询由服务端按机房调用
`GET http://apiserver/api/cloud/clusters/{cluster}/prometheus/api/v1/query`（或 `query_range`）执行，
不带节点过滤的查询覆盖整个集群。结果合并为机房快照，浏览器只读快照。

### 实时档：每个实时周期（默认 30 秒，30–300 秒可调）

| 用途 | PromQL | 结果维度 |
| ---- | ------ | -------- |
| GPU 利用率 | `accelerator_core_utilization_percentage{device_mode="physical"}` | node, device_id, vendor |
| GPU 温度 | `accelerator_temperature_celsius{device_mode="physical"}` | node, device_id |
| GPU 功耗 | `accelerator_power_usage_watts{device_mode="physical"}` | node, device_id |
| GPU 显存已用 | `accelerator_memory_used_bytes{device_mode="physical"}` | node, device_id |
| GPU 健康 | `accelerator_health_state{device_mode="physical"} == 1` | node, device_id, state |
| 节点就绪 | `rune_node_status` | node |
| CPU 使用率 | `rune_node_cpu_used_percentage` | node |
| 内存使用率 | `rune_node_memory_used_percentage` | node |
| 负载 | `rune_node_load_avg_1m` | node |
| 网络接收 / 发送 | `rune_node_network_receive_bytes_per_second`、`rune_node_network_transmit_bytes_per_second` | node |
| 网络错误率 | `rune_node_network_receive_errors_percentunit`、`rune_node_network_transmit_errors_percentunit` | node |
| 磁盘 IOPS | `rune_node_disk_reads_per_second`、`rune_node_disk_writes_per_second` | node |
| 磁盘吞吐 | `rune_node_disk_read_bytes_per_second`、`rune_node_disk_write_bytes_per_second` | node |
| 磁盘使用率 | `max by (node) (rune_node_disk_used_percentage)` | node |

### 计数档：每 60 秒

| 用途 | PromQL | 结果维度 |
| ---- | ------ | -------- |
| GPU 硬件错误（替代 ECC 计数） | `sum by (node, device_id) (increase(accelerator_errors_total{device_mode="physical"}[1h]))` | node, device_id |

`accelerator_errors_total` 的类别枚举只在同一厂商内可比；这里只在单卡内求和，不跨卡或跨厂商比较。

### 清单档：每 5 分钟，与节点同步同周期

| 用途 | PromQL | 结果维度 |
| ---- | ------ | -------- |
| GPU 清单与静态信息 | `accelerator_info{device_mode="physical"}` | node, device_id, device_type, vendor, model, serial_number, pci_bus_id |
| GPU 显存总量 | `accelerator_memory_total_bytes{device_mode="physical"}` | node, device_id |
| CPU 核数 | `rune_node_cpu_total_cores` | node |
| 内存总量 | `rune_node_memory_total_bytes` | node |

GPU 清单只从 `accelerator_info` 读取（Monitoring 规范的消费约束）。

### 趋势档：打开详情时按需，结果缓存 60 秒

`query_range`，默认最近 1 小时、步长 60 秒；可切换最近 24 小时、步长 5 分钟。节点名必须在当前节点列表中，
且仅允许 DNS-1123 字符，再拼入 PromQL 的 `node="<name>"`。

| 用途 | PromQL 模板 |
| ---- | ----------- |
| GPU 利用率 | `accelerator_core_utilization_percentage{device_mode="physical",node="<node>"}` |
| GPU 温度 | `accelerator_temperature_celsius{device_mode="physical",node="<node>"}` |
| CPU 使用率 | `rune_node_cpu_used_percentage{node="<node>"}` |
| 内存使用率 | `rune_node_memory_used_percentage{node="<node>"}` |
| 网络收发 | `rune_node_network_receive_bytes_per_second{node="<node>"}`、`rune_node_network_transmit_bytes_per_second{node="<node>"}` |

### 机房汇总：由实时快照计算，不另发查询

| 指标 | 计算 |
| ---- | ---- |
| GPU 总功耗 | 实时档 GPU 功耗求和 |
| GPU 平均利用率 | 按 `vendor` 分组求平均，结果保留 `vendor`（利用率只在同厂商内可比） |
| 异常 GPU 数 | 健康状态不为 `healthy` 的卡数 |
| 未就绪节点数 | `rune_node_status != 1` 的节点数 |

### 告警

`GET http://apiserver/api/cloud/clusters/{cluster}/alertrecords`，每 30 秒，按机房缓存。

### 指示灯映射

| 部件 | 绿 | 黄（闪） | 红（闪） | 无数据（灰） |
| ---- | -- | -------- | -------- | ------------ |
| GPU | 健康且利用率 > 3 | 温度 ≥ 72℃，或 1 小时错误增量 > 4，或 `degraded` | 温度 ≥ 78℃，或错误增量 > 12，或 `fault` | 无 `accelerator_info` 或实时值缺失 |
| 整机状态灯 | 节点就绪 | 有黄色部件 | 节点未就绪或有红色部件 | 节点不在快照中 |
| 网卡、硬盘 | — | — | — | 平台只有节点汇总，没有逐设备数据，单设备灯一律无数据；汇总值在详情面板展示 |
| 风扇、PSU | — | — | — | 平台无采集来源 |

逐设备网卡与硬盘数据由新采集端 P0（只加录制规则）补齐后再点亮，见研究提案。

### 指标清单表

服务端以一张静态清单表维护上面的全部查询，每行包含：键名、PromQL、档位、结果维度、对应的 twin 字段、状态
（`available` / `pending-collector`）。新采集端上线后只需把对应行改为 `available`，前端不改。

## twin REST API

服务内部前缀 `/v1`，经网关为 `/api/digital-twin`。JSON 字段 lowerCamelCase，时间 RFC 3339，错误使用 Kubernetes 风格 `Status`，
列表顶层为 `items`。实施时必须按 `specification/REST.md` 复核每个 endpoint。

| 方法与路径 | 动作（IAM `action`） | 说明 |
| ---------- | -------------------- | ---- |
| `GET /v1/session` | `get` | 当前用户、角色（viewer / admin）、License 状态 |
| `GET /v1/rooms` | `list` | 机房列表；viewer 只看到已启用机房，admin 看到全部候选 |
| `PATCH /v1/rooms/{room}` | `update` | 启用、显示名、排序（admin） |
| `GET /v1/rooms/{room}/nodes` | `list` | 节点池（平台字段 + 派生状态） |
| `POST /v1/rooms/{room}/nodes:sync` | `update` | 立即同步节点（admin） |
| `GET /v1/rooms/{room}/telemetry` | `get` | 最新快照：每个指标的值、`observedTimestamp`、可用状态 |
| `GET /v1/rooms/{room}/nodes/{node}/trends` | `get` | 趋势；query：`metric`、`range`（`1h` / `24h`），不支持的 query 返回 400 |
| `GET /v1/rooms/{room}/alerts` | `list` | 当前告警 |
| `GET /v1/settings`、`PUT /v1/settings` | `get` / `update` | 全局实时间隔（30–300 秒） |
| `GET /v1/ledger`、`PUT /v1/ledger`、`DELETE /v1/ledger` | `get` / `update` / `delete` | 整库字节，沿用 `If-Match` / `rev` 乐观锁 |
| `GET /v1/ledger/backups`、`POST /v1/ledger:restore` | `list` / `update` | 备份列表与回滚 |
| `GET /healthz` | 豁免：技术端点 | 探活，不鉴权 |

- `LEDGER_TOKEN` 与 `VITE_LEDGER_TOKEN` 删除，写操作只认会话与 admin 角色。
- 原 `/api/status`、`/api/ledger*` 路由删除，由上表替代。

## 前端变化

- 新增 `platform` 数据源，替换 `api.ts`；`DataSource.id` 改为 `'platform' | 'mock' | 'none'`。
- 顶部增加机房切换；URL 保存当前机房（`?room=<clusterId>`）。
- 遥测类型的平台指标字段允许 `null`，`telemetry.ts` 增加 `nodata` 判定，3D 侧渲染灰色 LED。
- 未登录跳转平台登录页；403 / 503 展示 License 或权限拒绝页；viewer 不显示管理后台入口（服务端仍校验）。
- 删除：接口地址配置、手建节点、导入模拟数据、清除模拟数据、单台采集间隔、生产构建中的导入演示数据。
- `mockdata` 演示模式只在开发构建可用；生产构建（`make build`、镜像）中 `mock/` 不得进入产物。

## 部署配置

Helm values 新增（默认值只写在 `values.yaml`）：

```yaml
platform:
  apiserverURL: http://apiserver
  iamURL: http://iam
  clientID: rune-digital-twin
  clientSecret: ""
  clientSecretRef:
    name: ""
    key: clientSecret
```

删除 `ledgerToken.*`；`replicas: 1`、`Recreate`、PVC 约束保持不变（台账与 `rooms.json` 仍是单写者文件）。

## 未核实的前提

| 前提 | 核实方式 | 不成立时的处理 |
| ---- | -------- | -------------- |
| 直连 `http://iam/oauth2/token` 签发的 token，其 issuer 与 cloud 校验的 `http://iam` 一致 | 在测试集群换 token 后调 `/api/cloud/clusters` | 调整 twin 的 IAM 地址或 cloud 的 issuer 配置，记录到本节 |
| 平台登录页支持登录后回跳 `/twin/` | 阅读 Console 登录路由实现 | 退化为登录后停留 Console，twin 提示"请登录后刷新" |
| IAM 授权审查对 `service=digital-twin` 的系统角色生效 | IAM 单元测试或测试集群验证 | 修正角色 authorities 写法 |
| `user_session` Cookie 的 path 覆盖 `/twin` 与 `/api/digital-twin` | 测试集群抓包 | 调整 Cookie path 由 IAM 侧处理，另行提案 |

## 非目标

- 不引入新的采集端（见研究提案）。
- 不做按租户隔离的数据视图：twin 面向平台运维，数据范围是已启用机房的全部节点。
- 不做 License 额度型功能项。
- 不改 IAM 协议（不新增授权码流程）。
