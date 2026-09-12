---
title: '集群管理'
updated: '2026-09-12'
description: '接入 Kubernetes 集群：列表字段、创建/编辑表单、连接测试、终端与集群详情子页导航。'
---

## 功能简介

Rune 平台的计算能力来自通过 BOSS 接入的 Kubernetes 集群。管理员在此完成集群的**添加接入、发布上线、详情监控和终端操作**等生命周期管理。

## 进入路径

BOSS 控制台 → 集群管理

前端路由：`/rune/clusters`

---

## 集群列表

### 列字段

| 列 | 字段路径 | 展示 | 说明 |
| --- | --- | --- | --- |
| 名称 | `name` | 链接 + 描述 | 点击进入集群概览；下方显示描述 |
| 版本 | `status.version.gitVersion` | 文本 | Kubernetes 版本号，取不到时显示 `-` |
| 线上状态 | `published` | 图标 | 已上线 / 已下线；仅已上线集群对租户可见 |
| 连接状态 | `status` | 状态组件 | 通过 `ObjectStatus` 渲染（命名空间 `cluster`） |
| 创建时间 | `creationTimestamp` | 时间 | 集群接入时间 |

### 可执行操作

| 操作 | 说明 |
| --- | --- |
| 终端 | 打开集群 kubectl 终端 |
| 上线 / 下线 | 切换 `published`，带确认弹窗 |
| 编辑 | 进入编辑页 |
| 删除 | 带确认弹窗删除集群 |

> ⚠️ 注意: **列表操作中没有「测试连接」**。连接测试只出现在创建 / 编辑表单内。

---

## 添加 / 编辑集群

### 表单字段

| 字段 | 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 名称 | `name` | IdField（名称 + 自动生成 ID） | ✅ | 显示名称；ID 可手动改，创建后不可修改 |
| 描述 | `description` | 文本域（4 行） | — | 用途、位置等补充说明 |
| 集群类型 | `type` | 固定值 | — | 固定为 `Kubernetes` |
| KubeConfig | `kube.config` | 文本域（8 行，等宽） | ✅ | kubeconfig YAML 内容 |

> 💡 提示: 编辑模式下集群 ID 不可修改。

### 测试连接（表单内）

- 仅当 `name` 与 `kube.config` 都已填写时，**测试连接**按钮才可用。
- 测试成功时表单顶部展示成功提示，并显示探得的集群版本 `gitVersion`。
- 测试失败时展示错误详情。

KubeConfig 是连接集群的核心配置，示例：

```yaml
apiVersion: v1
kind: Config
clusters:
  - cluster:
      server: https://your-k8s-api-server:6443
      certificate-authority-data: <base64-ca>
    name: my-cluster
contexts:
  - context:
      cluster: my-cluster
      user: admin
    name: my-context
current-context: my-context
users:
  - name: admin
    user:
      client-certificate-data: <base64-cert>
      client-key-data: <base64-key>
```

> ⚠️ 注意: KubeConfig 含敏感凭证，建议使用专用 ServiceAccount 并授予最小必要权限。

---

## 发布 / 下线

`published` 决定集群是否对租户可见：

| 操作 | 效果 |
| --- | --- |
| 上线 | 集群对租户可见，可用于资源分配与部署 |
| 下线 | 对租户隐藏；已部署实例不受影响，但不再允许新部署 |

---

## kubectl 终端

列表操作列的 **终端** 会打开内置 Web 终端，已自动配置目标集群上下文，可直接执行 `kubectl` 命令。

```bash
kubectl get nodes
kubectl get pods -A
kubectl top nodes
```

> ⚠️ 注意: 终端具备集群管理员权限，请谨慎操作，避免在生产集群执行破坏性命令。

---

## 集群详情与子页导航

点击集群名称进入详情页（前端路由 `/rune/clusters/:cluster/:domain`）。侧边栏实际包含 **11 个子页**：

| 分组 | 子页 | 前端路由 |
| --- | --- | --- |
| 集群信息 | 集群信息（概览） | `/rune/clusters/:cluster/overview` |
| 集群信息 | 节点状态 | `/rune/clusters/:cluster/nodes` |
| 集群信息 | 加速卡信息 | `/rune/clusters/:cluster/gpu-dashboard` |
| 资源管理 | 资源池 | `/rune/clusters/:cluster/resource-pools` |
| 资源管理 | 资源规格 | `/rune/clusters/:cluster/flavors` |
| 资源管理 | 租户配额 | `/rune/clusters/:cluster/tenant-quotas` |
| 运维管理 | 工作负载 | `/rune/clusters/:cluster/resources` |
| 运维管理 | 存储集群 | `/rune/clusters/:cluster/storages` |
| 运维管理 | 系统应用 | `/rune/clusters/:cluster/systems` |
| 运维管理 | 调度器管理 | `/rune/clusters/:cluster/schedulers` |
| 运维管理 | 日志管理 | `/rune/clusters/:cluster/logs` |

### 概览

概览页过滤名称中包含 `basic` 的仪表盘进行渲染，即**基础类看板**，不包含独立的加速卡看板（加速卡看板在「加速卡信息」子页）。

### 节点状态 / 加速卡信息

这两个页面都是**按名称聚合的监控看板**，不是节点清单：

- 节点状态：聚合名称中包含 `node` 的看板。
- 加速卡信息：聚合名称或标题（小写后）包含 `gpu` 或 `npu` 的看板；若 NPU 看板原本排在 NVIDIA GPU 看板之后，会被前移到其前面。

> ⚠️ 注意: 这两页**没有节点表格**，不展示节点角色、IP、CPU/内存明细、标签或污点等字段。节点级对象信息请到「工作负载」子页的 Nodes 标签或 kubectl 终端查看。

### 工作负载（Kubernetes 资源浏览）

内置 14 类资源标签：Pods、Nodes、Deployments、StatefulSets、DaemonSets、Jobs、CronJobs、Services、Ingresses、IngressClasses、StorageClasses、ConfigMaps、Secrets、PersistentVolumeClaims。详见 [Kubernetes 资源浏览](./resources)。

### 存储集群 / 系统应用

两者都以实例列表渲染（`category = storage` / `system`），列字段一致：`name`、`product.version`、`status.phase`、`creationTimestamp`。详见 [存储与运行时服务](./storage-runtime) 与 [系统实例管理](./systems)。

系统应用 / 存储集群页的 **新增** 会跳转到系统模板市场（`/rune/clusters/:cluster/system-market`）选择模板后部署。

### 日志管理

基于 Loki 的集群日志查询（`LogViewer`），支持查询语句、标签联想、标签值查询与 WebSocket 实时日志流，并可在「全部 / 节点」范围间切换。

### 调度器管理

提供 Volcano 调度配置的拖拽式编排：加载 `actions` / `plugins` / `tiers`，本地编辑后保存下发。

### 不在侧边栏中的路由

以下路由存在但**不在详情子页导航中**：

| 路由 | 现状 |
| --- | --- |
| `/rune/clusters/:cluster/metrics` | 预留页，前端为 ComingSoon 占位 |
| `/rune/clusters/:cluster/events` | 预留页，前端为 ComingSoon 占位 |
| `/rune/clusters/:cluster/dynamic-dashboard` | 集群仪表盘编辑器（从概览看板进入配置） |
| `/rune/clusters/:cluster/system-market` | 由系统应用 / 存储集群的「新增」进入 |

---

## 权限要求

需要 **系统管理员** 角色。可查看列表、添加 / 编辑 / 删除集群、上线 / 下线、使用终端并访问全部详情子页。
