# 数字孪生平台对接实施计划

> 状态：**提案，已确认、未实施**（2026-10-16）。本文只拆分任务；设计、决策、接口契约和查询集合以
> [设计](design.md)为唯一依据，任务卡与设计冲突时以设计为准，并先修正设计再实施。

## 执行约定

适用于执行任何一张任务卡的 agent 或工程师：

- 开工前按根目录 `AGENTS.md` 的流程读目标仓库的 `AGENTS.md`、README、`CONTEXT.md`、`DESIGN.md`，再读 [设计](design.md) 中相关章节。
- 只改任务卡列出的仓库与文件范围；发现需要越界时先停下，说明原因。
- 不 commit、不 push、不打 tag；只暂存本任务文件，禁止 `git add .` / `git add -A`。用户明确要求后再提交，
  提交信息用 Conventional Commits，语言跟随该仓近期记录。
- 跑任务卡写明的验证命令。依赖集群、IAM、etcd 等外部环境而跑不了的检查，如实报告，不伪造结果。
- 完成后更新本文"进度"表对应行，写明完成日期、验证结果和未验证项；若推翻了设计中的"未核实的前提"，同步修改设计。
- 交付说明用中文，结论先行：改了什么、验证了什么、没验证什么。

## 依赖顺序

```text
T1 iam ──┐
T2 license ─┼─► T4 twin 服务端：平台客户端与鉴权 ─► T5 twin 服务端：机房、节点与遥测 ─┐
T3 apiserver ┘                                                                    ├─► T8 部署、验证夹具与文档
                                T6 twin 台账迁移 ─► T7 twin 前端 ──────────────────┘
T9 工作区索引与文档入口（最后）
```

- T1、T2、T3 互不依赖，可并行。它们之间没有 Go 模块依赖（apiserver 不依赖 license 模块），不需要 `go get` 伪版本。
- T4 的代码可以先写，但联调需要 T1、T3 的契约；单元测试使用假 IAM / 假 apiserver。
- T6 不依赖平台，可与 T4 并行。

## 进度

| 任务 | 状态 | 完成日期 | 验证结果 | 未验证 |
| ---- | ---- | -------- | -------- | ------ |
| T1 iam bootstrap | 未开始 | | | |
| T2 license 签发模板 | 未开始 | | | |
| T3 apiserver 路由、授权查询、拦截规则 | 未开始 | | | |
| T4 twin 服务端：平台客户端与鉴权 | 未开始 | | | |
| T5 twin 服务端：机房、节点与遥测 | 未开始 | | | |
| T6 twin 台账迁移 | 未开始 | | | |
| T7 twin 前端 | 未开始 | | | |
| T8 twin 部署、验证夹具与文档 | 未开始 | | | |
| T9 工作区索引与文档入口 | 未开始 | | | |

## T1 iam：预注册应用与角色

- **仓库**：`iam`
- **设计依据**：[设计 › IAM 预注册](design.md#iam-预注册)
- **文件**：`deploy/iam/values.yaml`（`bootstrap.plan`）、`examples/bootstrap.yaml`、`pkg/bootstrap/README.md`（如列有默认应用清单）
- **步骤**：
  1. 在 `roles` 追加 `digital-twin-viewer`、`digital-twin-admin`，`service: digital-twin`。
  2. 在 `applications` 追加 `rune-digital-twin`：iam 授权 `create:authentication-reviews`、`create:authorization-reviews`；
     cloud 授权 `read:clusters`、`read:kubernetes`、`read:observability`；两组都写 `defaultScopes`。
  3. `examples/bootstrap.yaml` 同步，`clientSecret` 用 `${RUNE_DIGITAL_TWIN_CLIENT_SECRET}`。
  4. 如 `pkg/bootstrap` 有渲染或解析默认清单的测试，补上新条目断言。
- **验收**：`helm template` 渲染出的 BootstrapPlan 含新角色与新应用；现有条目不变。
- **验证**：`make check`（含 helm lint）。
- **注意**：bootstrap 只建不改，已部署集群的补注册步骤写进 T8 的上线说明，不在本任务实现。

## T2 license：签发模板新增 DigitalTwin

- **仓库**：`license`
- **设计依据**：[设计 › 签发侧](design.md#签发侧license-仓库)
- **文件**：`internal/signing/signer.go`、`internal/signing/signer_test.go`、README（如列有默认产品）
- **步骤**：
  1. `DefaultConfig().Products` 追加 `{Name: "DigitalTwin"}`，不带 features。
  2. 补测试：默认模板包含 `DigitalTwin`；签发后 `Decode` 能读回该产品。
- **验收**：管理台"签发 License"对话框默认带出 `DigitalTwin`。
- **验证**：`make test`（go test、client 测试、web lint/build、helm lint）。

## T3 apiserver：路由、授权查询接口、拦截规则

- **仓库**：`apiserver`
- **设计依据**：[设计 › 网关注册](design.md#网关注册)、[设计 › 执行侧](design.md#执行侧apiserver)
- **文件**：`pkg/apiserver/config.go`、`pkg/apiserver/license.go`、`pkg/apiserver/license_test.go`、`pkg/apiserver/server_test.go`、
  `pkg/license/api.go`、`pkg/license/api_test.go`、`pkg/license/manager.go`（如需新增查询方法）、`pkg/license/README.md`、
  `pkg/license/DESIGN.md`、`pkg/apiserver/DESIGN.md`、`README.md`
- **步骤**：
  1. `DefaultServicesConfig` 新增服务 `digital-twin`，地址 `http://rune-digital-twin`，路由 `/twin`、`/twin/` → `/`，
     `/api/digital-twin`、`/api/digital-twin/` → `/v1/`，不开启网关 security。
  2. `StatusGroup` 新增 `GET /products/{product}/status`，`Operation("getPublicLicenseProductStatus")`，
     声明显式豁免及理由；响应结构按设计；`product` 格式校验失败返回 400。
  3. `cloudLicenseFilterOptions` 追加 `DigitalTwin` 规则，按 `proxyServiceFromContext == "digital-twin"` 匹配。
  4. 测试：
     - 授权查询：已授权、未授权产品、未知产品、License 未安装、未就绪、非法产品名；响应不含 `max`、`used`、签发明细。
     - 拦截：`digital-twin` 服务的 PUT 在未授权时返回 403，GET 放行；其他服务不受影响。
     - 路由：`/twin/`、`/api/digital-twin/rooms` 改写到正确上游路径。
  5. 同步 README 路由表、`pkg/license` 的 README / DESIGN（新接口与豁免理由）、`pkg/apiserver/DESIGN.md`（如列有服务清单）。
- **验收**：OpenAPI 输出包含新接口与豁免说明；现有 License 接口行为不变。
- **验证**：`make check`、`go test -race ./pkg/license/...`；检查 OpenAPI 输出。
- **注意**：这是公开 REST 契约新增，实施前完整阅读 `specification/REST.md`；不修改现有接口。

## T4 twin 服务端：平台客户端与鉴权

- **仓库**：`rune-digital-twin`
- **设计依据**：[设计 › 应用 token](design.md#应用-token)、[设计 › 请求鉴权流程](design.md#请求鉴权流程)、[设计 › License](design.md#license)
- **文件**：新增 `server/platform/`（建议拆分为 `token.mjs`、`iam.mjs`、`apiserver.mjs`、`license.mjs`、`auth.mjs`），
  修改 `server/index.mjs`；新增 `scripts/check-platform.mjs` 并接入 `make check`
- **步骤**：
  1. 配置：从环境变量读取 `PLATFORM_APISERVER_URL`、`PLATFORM_IAM_URL`、`PLATFORM_CLIENT_ID`、`PLATFORM_CLIENT_SECRET`；
     缺失时启动失败并给出明确日志（`mockdata` 开发模式除外）。
  2. token 源：两个 resource（`urn:cloud:api`、`urn:iam:api`），缓存到 `exp − 60s`；401 时刷新并重试一次；并发请求合并为一次换取。
  3. IAM 审查客户端：认证审查与授权审查，结果分别缓存 60 秒；缓存键使用凭据哈希，不保存原文。
  4. License 客户端：按设计的 phase 规则分类，全局缓存 5 分钟；apiserver 不可达、超时（建议 5 秒）归为"暂时无法确认"。
  5. 鉴权中间件：`/v1/*` 依次执行认证 → 授权 → License；输出 Kubernetes 风格 `Status`（401 / 403 / 503，`reason` 为 License code
     或 `Unauthorized` / `Forbidden`）。`/healthz` 豁免。
  6. 删除 `LEDGER_TOKEN` 相关逻辑，台账接口改由中间件保护（写操作要求 admin 动作）。
  7. 日志不得出现 token、Cookie、clientSecret、请求体原文。
- **验收**：用假 IAM、假 apiserver 覆盖：未登录 401；无角色 403；viewer 读通过、写 403；License 各 code 的分类与文案键；
  token 过期刷新；IAM 超时；apiserver 超时。
- **验证**：`make check`（新增脚本纳入）。
- **注意**：服务端保持零运行期依赖，只用 Node 内置模块与全局 `fetch`；新增依赖需单独提交并说明理由。

## T5 twin 服务端：机房、节点与遥测

- **仓库**：`rune-digital-twin`
- **前置**：T4
- **设计依据**：[设计 › 多机房模型](design.md#多机房模型)、[设计 › 监控查询集合](design.md#监控查询集合)、[设计 › twin REST API](design.md#twin-rest-api)
- **文件**：新增 `server/rooms/`（`settings.mjs`、`clusters.mjs`、`nodes.mjs`、`metrics-catalog.mjs`、`telemetry.mjs`、`trends.mjs`、`alerts.mjs`），
  修改 `server/index.mjs`、`server/store.mjs`（复用原子写到 `rooms.json`）
- **步骤**：
  1. `rooms.json`：机房设置与全局实时间隔（30–300 秒，默认 30），原子写、备份、`rev` 乐观锁，复用 `store.mjs` 的实现。
  2. 集群同步：每 5 分钟拉取集群列表，内存缓存；消失的集群标记 `lost`；`unbound` 为保留 ID。
  3. 节点同步：已启用机房每 5 分钟拉取 Node 与 `noderesources`，投影为节点池字段；`POST .../nodes:sync` 立即触发；
     同一机房同步不重入。
  4. 指标清单表：按设计逐行录入键名、PromQL、档位、维度、twin 字段、状态；查询模板只接受白名单节点名。
  5. 调度：一个机房一个调度循环，按档位执行查询；只轮询已启用机房；单条查询失败只影响该指标，快照保留上一次值并记录
     `observedTimestamp`。
  6. 快照：按设计组装 `telemetry` 响应，含机房汇总（GPU 平均利用率按 `vendor` 分组）。
  7. 趋势：`query_range`，`range` 只允许 `1h`、`24h`，结果缓存 60 秒；不支持的 query 返回 400。
  8. 告警：每 30 秒拉取 `alertrecords`，按机房缓存。
  9. REST：实现设计中的全部 endpoint；JSON lowerCamelCase、列表 `items`、未知 body 字段 422。
- **验收**：用假 apiserver 覆盖：多集群隔离（A 集群数据不出现在 B 机房）；集群消失；节点消失（`offline`）；Prometheus 单条失败；
  趋势节点名注入被拒绝；未启用机房不发查询。
- **验证**：`make check`、`make check-api`。

## T6 twin 台账迁移

- **仓库**：`rune-digital-twin`
- **设计依据**：[设计 › 台账结构变化](design.md#台账结构变化sqlite浏览器侧迁移)、[设计 › 绑定未绑定机房](design.md#绑定未绑定机房)
- **文件**：`src/admin/schema.ts`（`MIGRATIONS`）、`src/admin/repo.ts`、`src/data/ledger.ts`、`src/data/types.ts`、
  `scripts/gen-seed-sql.mjs`、`sql/seed.sql`、`src/mock/fleet.json`（演示数据补 `room_id`）
- **步骤**：
  1. 新增迁移：`racks.room_id`、`assignments` 改为 `(room_id, node_name)`、`nodes` 改为资产覆盖表；旧数据写入 `unbound`；
     删除 `node.apiBase`、`node.apiPath`、`telemetry.defaultIntervalSec` 设置项与 `poll_interval_s` 列。
  2. `repo.ts`：所有查询按机房过滤；新增"绑定未绑定机房"的仓储函数（按名称对应、返回未匹配清单、事务内完成）。
  3. `ledger.ts`：`buildRoomFromLedger` 按机房组装；节点平台字段来自服务端节点池，资产字段来自覆盖表；
     不在节点池中的已上架节点标记 `offline`。`packRack()` 与"U 位不落库"规则不变。
  4. 种子数据与 `seed-check` 同步。
- **验收**：用旧结构样本库升级后，机柜与上架关系完整保留在 `unbound`；绑定后按名称对应正确，未匹配项列出；
  重复执行迁移安全。
- **验证**：`make check`（含 `seed-check`）。

## T7 twin 前端

- **仓库**：`rune-digital-twin`
- **前置**：T5 的接口形状、T6
- **设计依据**：[设计 › 前端变化](design.md#前端变化)、[设计 › 指示灯映射](design.md#指示灯映射)
- **文件**：`src/data/source.ts`、新增 `src/data/platform.ts`（替换 `src/data/api.ts`）、`src/data/types.ts`、`src/data/telemetry.ts`、
  `src/data/poll.ts`、`src/state/store.ts`、`src/admin/*`、`src/ui/*`、`src/three/ServerUnit.tsx`、`src/App.tsx`、`vite.config.ts`、`src/styles.css`
- **步骤**：
  1. 数据源：`platform` 实现 `DataSource` / `LiveFeed`，读 `/api/digital-twin/v1/...`；`id` 枚举改为 `'platform' | 'mock' | 'none'`；
     生产构建不得静态或动态引入 `mock/`。
  2. 机房切换：顶部选择器，URL `?room=` 为唯一来源。
  3. 遥测：平台指标字段允许 `null`；`telemetry.ts` 增加 `nodata` 判定；`ServerUnit` 渲染灰色 LED；详情面板展示节点汇总值与
     "缺少某类采集"说明。
  4. 采集间隔：`poll.ts` 改为单一全局间隔（读 `/v1/settings`），删除单台覆盖。
  5. 登录与拒绝：401 跳转平台登录（回跳 `/twin/`）；403 / 503 整页展示拒绝原因；viewer 不显示后台入口。
  6. 管理后台：机房启用、显示名、排序；节点池只读展示与手动同步；上架与资产字段编辑；绑定未绑定机房向导；
     删除接口地址配置、手建节点、导入/清除模拟数据、生产环境的导入演示数据。
  7. `vite.config.ts`：`base: '/twin/'`；开发代理 `/api/digital-twin` 指向本地服务端。
  8. 文案集中管理，中文为主；新增颜色先加 CSS 变量。
- **验收**：空机房、加载中、加载失败、无数据四种状态不崩；多机房切换数据隔离；viewer 与 admin 界面差异正确；
  构建产物 chunk 清单不含 `mock/`。
- **验证**：`make verify-all`；按仓库 AGENTS §10 做浏览器截图验证（机房切换、灰色 LED、拒绝页、后台）。

## T8 twin 部署、验证夹具与文档

- **仓库**：`rune-digital-twin`
- **前置**：T4–T7
- **文件**：`deploy/helm/rune-digital-twin/*`、`deploy/docker-compose.yml`、`Dockerfile`、`verification/`、`scripts/check-deploy.mjs`、
  `README.md`、`AGENTS.md`、`Makefile`
- **步骤**：
  1. Helm：新增 `platform.*` values 与 Secret 引用（默认值只写在 `values.yaml`，模板不用 `| default`）；删除 `ledgerToken.*`；
     保持单副本、`Recreate`、PVC；Chart 升版本。
  2. compose：开发用环境变量；删除 `VITE_LEDGER_TOKEN` 构建参数。
  3. `verification/`：把假后端改为假 apiserver + 假 IAM，覆盖 `/api/cloud/clusters`、nodes、noderesources、prometheus `query` /
     `query_range`、alertrecords、`/api/license/products/{product}/status`、`oauth2/token`、两类审查；至少两个集群夹具。
  4. 文档：README 与 AGENTS 更新数据接入、目录结构、环境变量、两个 store 的职责、已知坑位；写明已部署集群的 IAM 补注册步骤。
- **验收**：`helm template` 渲染出 Secret 引用与环境变量；本地 `make dev` + 假后端可完整走通登录、切换机房、无数据、拒绝页。
- **验证**：`make check-deploy`、`make helm-lint`、`make verify-all`。

## T9 工作区索引与文档入口

- **仓库**：工作区根目录、`docs`
- **前置**：T1–T8 全部完成
- **文件**：`INDEX.md`、`docs/content/README.md`、本目录全部文档
- **步骤**：
  1. `INDEX.md`：统一入口路由表加 `/twin`、`/api/digital-twin`；twin 卡片改为当前实现；端口与运行时依赖更新。
  2. `docs/content/README.md` 与本目录文档状态由"提案"改为"已实现"或"正在落地"，删除已过时的"现状"描述。
- **验证**：`cd docs && yarn lint && yarn build`。
