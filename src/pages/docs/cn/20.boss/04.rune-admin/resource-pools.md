---
title: 资源池
updated: '2026-09-12'
description: '在集群中划分资源池：主从视图、变更预检、节点划分与默认池规则。'
---

## 功能简介

资源池（Resource Pool）把集群节点划分为逻辑分组，用于实现节点级的资源隔离与调度控制。每个节点同一时间只属于一个资源池；未显式划分的节点归属系统保留的默认池 `default`。

管理界面采用**主从布局**：左侧是资源池卡片列表（顶部支持按名称或 ID 搜索），右侧展示当前选中资源池的总览；创建、编辑、调整划分、删除都以**对话框 / 独立表单**的方式完成。

## 进入路径

BOSS 控制台 → 集群管理 → 选择集群 → **资源池**

前端路由：`/rune/clusters/:cluster/resource-pools`

---

## 列表与总览

左侧列表按资源池排序展示**紧凑卡片**，每张卡片展示名称、ID、同步/健康状态概要。列表顶部显示 `资源池数量 / 上限`，并说明上限为 **10**（常量 `MAX_RESOURCE_POOLS = 10`）。

> ⚠️ 注意: 资源池数量达到 10 个后，**创建资源池**按钮会被禁用，并提示已达上限。

右侧总览对应所选资源池，包含：

| 区块 | 内容 |
| --- | --- |
| 头部 | 名称、ID（可复制）、描述、默认池标记、状态标签 |
| 容量快照 | 期望成员数（`membership.expected`，附已解析数 `resolved`）、可分配 CPU、可分配内存、加速卡分组数 |
| 加速卡 | 支持「加速卡视图 / 主机视图」切换（`accelerator` / `host`） |
| 趋势 | 最近一小时的 CPU / 内存利用率迷你趋势图 |
| 操作 | 调整划分、编辑元数据、删除（默认池无删除按钮） |

### 视图切换

- **加速卡视图**（`accelerator`）：按 `physical`（物理卡）/ `virtual`（虚拟卡）分组展示每个加速卡组的 `capacity`、`allocatable`、`nodeCount`。
- **主机视图**（`host`）：按节点维度展示加速卡明细（利用率、显存、功耗、温度等观测项）。

### 状态标签

资源池头部按状态组件展示以下三类状态（默认池不展示同步与监控状态）：

| 状态维度 | 字段 | 取值 |
| --- | --- | --- |
| 同步 | `sync.phase` | `pending` / `syncing` / `synced` / `failed` |
| 健康 | `health.phase` | `healthy` / `attention` / `degraded` / `notApplicable` / `unknown` |
| 监控 | `monitoring.dataStatus` | `complete` / `notApplicable` / `partial` / `unavailable` / `unknown` |

此外，容量与健康数据都带 `dataStatus` 标识数据完整性（`complete` / `partial` / `unavailable` / `notApplicable` / `unknown`）。观测项（`monitoring.cpu` / `monitoring.memory`）还有可用性 `availability`（`observed` / `notInstalled` / `noSeries` / `queryError`）与新鲜度 `freshness`（`delayed` / `fresh` / `stale` / `unknown`）。

---

## 默认资源池

系统保留一个默认池，其 ID 固定为 `default`（`isDefault = true`）：

- 默认池**不可删除**，总览中不显示删除按钮，删除对话框对默认池直接不渲染。
- 创建资源池时，节点选择器只允许选择**当前属于 `default` 池**的节点；已归属其他池的节点会被禁用并提示需先归还默认池。
- 删除某个资源池后，其节点会回到 `default`。

---

## 变更预检机制

创建、删除、迁移节点三类操作都统一走 **“检查变更 → 勾选确认 → 提交”** 的预检流程，避免在快照与后端状态不一致时误操作。

### 操作类型（`ChangeAction`）

| 值 | 场景 |
| --- | --- |
| `CreatePool` | 创建资源池 |
| `DeletePool` | 删除资源池 |
| `MoveNodes` | 节点划分（迁移节点到目标池） |

### 预检请求与响应

预检请求 `ResourcePoolChangeRequest` 的关键字段：

| 字段 | 说明 |
| --- | --- |
| `action` | 上述三种操作之一 |
| `expectedRevision` | 乐观锁版本号，取自当前划分快照的 `snapshot.partitionRevision` |
| `pool` | `CreatePool` 时提交的 `name` / `description` |
| `poolID` | `DeletePool` 的目标池 |
| `targetPoolID` | `MoveNodes` 的目标池 |
| `nodes[]` | 待迁移节点：`name` / `uid` / `expectedSourcePoolID` |
| `acknowledgedRiskCodes` | 用户勾选确认的风险码 |
| `confirm` | 删除时置为 `true` |

预检响应 `ResourcePoolChangeCheck` 的字段：

| 字段 | 说明 |
| --- | --- |
| `ready` | 是否可提交；`false` 表示存在阻断项 |
| `noChanges` | 变更无实际效果 |
| `normalizedRequest` | 规范化后的请求（回填后的目标池 ID 等） |
| `nodes[]` | 每个节点的 `sourcePoolID` / `targetPoolID` / `changed` |
| `blockers[]` | 阻断原因列表 |
| `requiredAcknowledgementCodes[]` | 必须逐条勾选确认的风险码 |
| `references.flavors` / `references.quotas` | 依赖该池的规格与配额引用 |

> 💡 提示: 提交按钮只有在 `ready = true` 且 `noChanges = false`，并且所有 `requiredAcknowledgementCodes` 均已勾选时才可点击。

---

## 创建资源池

前端路由：`/rune/clusters/:cluster/resource-pools?action=create`

### 操作步骤

1. 在资源池页面点击 **创建资源池**。
2. 填写名称与描述（表单字段见下）。
3. 在「初始节点」选择器中选择要纳入的节点（可选；只能选默认池节点）。
4. 点击 **检查并创建**，弹出确认对话框展示预检结果。
5. 勾选所有风险确认项后点击 **创建资源池**。

### 表单字段

| 字段 | 字段名 | 必填 | 约束 |
| --- | --- | --- | --- |
| 名称 | `name` | ✅ | 去空格后 1–128 字符 |
| 描述 | `description` | — | 去空格后 ≤ 500 字符 |

> ⚠️ 注意: 已达到 10 个资源池时，创建页只显示“已达上限”的提示，不渲染表单。

### 初始节点选择

- 仅列出 **`selectable = true` 且 `poolID === 'default'`** 的节点。
- 支持按节点名称搜索、全选当前页；分页大小可选 **20 / 50 / 100**。
- 非默认池节点即使出现在列表中也会被禁用，提示需先归还默认池。

### 确认对话框

对话框展示：

- 预检结论（需确认 / 通过 / 阻断 / 变更无效果 / 提交结果不确定）。
- 初始节点清单（序号、节点名、加速卡）。
- 需要逐条勾选的 `requiredAcknowledgementCodes`。
- 阻断原因 `blockers`（本地化展示）。

提交成功后跳回资源池列表并触发刷新。

---

## 编辑资源池

点击总览右上角 **编辑元数据** 进入编辑页，仅修改 `name` 与 `description`：

- `name` 1–128 字符，`description` ≤ 500 字符。
- 编辑页 helper 文本会显示当前池 ID。

> 💡 提示: 节点的增删不在编辑页完成，而在 **调整划分** 对话框中通过 `MoveNodes` 迁移。

---

## 调整节点划分

点击总览右上角 **调整划分** 打开对话框：

1. 左侧勾选要迁移的节点（支持搜索、全选当前页，分页 20 / 50 / 100）。
2. 右侧选择**唯一**目标资源池。
3. 点击 **检查变更** 执行 `MoveNodes` 预检，面板展示“待更新 / 待跳过”节点数与阻断原因。
4. 勾选所有风险确认项后点击 **提交划分变更**。

> ⚠️ 注意: 勾选节点、切换目标池、翻页或改搜索都会使上一次预检结果失效，需要重新检查。

---

## 删除资源池

1. 在总览点击 **归还节点并删除**（默认池无此入口）。
2. 打开对话框后系统自动以 `DeletePool` + `confirm: true` 发起预检。
3. 若存在规格 / 配额引用，删除被阻断，对话框列出每条引用（名称、类型、租户 / 工作空间）并提供「去管理」跳转。
4. 无阻断时，输入**资源池 ID** 完成二次确认，勾选风险项后点击删除。

删除成功后节点回到 `default`，列表刷新并默认选中 `default` 池。

---

## 刷新与初始化

- 正常状态下每 **30 秒**自动刷新一次总览。
- 若集群返回 `initialization.phase = initializing`，改为每 **2 秒**轮询；`phase = failed` 时暂停轮询并展示初始化失败状态。
- 初始化未完成时，创建入口被禁用。

---

## 权限要求

| 操作 | 所需角色 |
| --- | --- |
| 查看资源池 | 系统管理员 |
| 创建 / 编辑 / 调整划分 / 删除 | 系统管理员 |
