---
title: 推理服务
updated: '2026-09-12'
description: 推理服务的列表字段、创建流程、状态枚举、网关注册与实例详情。
tags:
  - rune
  - console
---

# 推理服务

推理服务（`category=inference`）用于把模型以在线服务的形式部署出来。部署方式与其它类型一致：选择模板、填写基本信息、按模板的 JSON Schema 填参数。部署后可将实例注册到网关对外提供服务。

## 进入路径

Rune 工作台 → 左侧导航 → **推理服务**

列表路径：`/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/inferences`

## 推理服务列表

列表列（`src/pages/rune/instances/list.tsx`）：

| 列 | 说明 |
| --- | --- |
| 名称 | 实例名称，点击进入详情 |
| 模板 | 来源产品模板名称与版本 |
| 规格 | 由 `values.flavor` 解析出的 CPU/内存/加速卡摘要 |
| 模型 | 取自 `status.summary.model` |
| 副本数 | 取自 `status.summary.replicas` |
| 状态 | `status.phase`，以徽标展示 |
| 创建者 | 取自标签中的创建者 |
| 创建时间 | 实例创建时间 |

行操作菜单：

- 启动 / 停止：按 `values.global.paused` 切换暂停与恢复
- 发布服务 / 网关配置：注册或编辑网关注册（见下文）
- 注销：删除网关注册记录（仅已注册时显示）
- 保存为模板：把当前实例另存为实例模板
- 编辑 / 删除：删除需二次确认

> ⚠️ 注意: 当前列表**不支持状态过滤**，也**没有批量启停**（工具栏未配置批量操作；`filterFields` 为空）。旧版本文档中的「状态过滤」「批量启停」已删除。

列表支持按名称搜索与手动刷新。

## 创建推理服务

1. 点击列表页右上角的「创建资源」按钮。按钮文案由 i18n key `create_resource` 渲染（「创建资源」），点击后跳转到产品列表 `/rune/products/inference`，而不是直接打开部署页。
2. 在产品列表/详情页选择模板与版本，或从应用市场 `/rune/app-market` 中某模板详情页点「部署」进入。
3. 填写基本信息。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 实例 ID，编辑态不可修改 |
| `name` | ✅ | 显示名称 |
| `description` | — | 描述 |

4. 填写模板参数：由版本 JSON Schema 动态渲染，图形模式与 JSON 模式可切换。

> 💡 提示: 部署流程不是「选规格 → 挂载存储 → 填参数」的固定步骤。是否存在规格、存储卷、副本数等字段，取决于所选模板的 Schema 定义。

## 实例状态

`status.phase` 取值来自 `InstanceStatusPhaseEnum`（`src/types/instance.ts`），共 12 个：

| 状态 | 说明 |
| --- | --- |
| `Reconciling` | 正在调和 |
| `Installed` | 已安装 |
| `Pending` | 等待中 |
| `Running` | 运行中 |
| `Healthy` | 健康 |
| `Unhealthy` | 不健康 |
| `Degraded` | 降级 |
| `Paused` | 已暂停 |
| `Succeeded` | 已完成 |
| `PartialFailed` | 部分失败 |
| `Failed` | 失败 |
| `Terminating` | 正在删除 |

## 生命周期操作

| 操作 | 说明 |
| --- | --- |
| 编辑 | 进入编辑页，可修改名称、描述与模板参数 |
| 启动 / 停止 | 通过 `values.global.paused` 切换，非状态机迁移 |
| 扩缩容 | 详情页操作菜单的 `ScaleAction`，按模板声明的副本数字段调整 |
| 删除 | 删除实例及关联资源，需二次确认 |

> ⚠️ 注意: 不存在 `Healthy → Installed` 之类的「停止状态迁移」；暂停/恢复只是修改 `paused` 参数并触发调和。

## 网关注册

推理实例的专属能力。入口在列表行操作菜单和详情页操作菜单，表单字段与访问级别见[推理托管](/rune/guide/inference)。要点：

- 实例状态需为 `Healthy` 或 `Installed`，否则菜单项置灰。
- 表单实际渲染 `endpoint`（必填 URL，可从实例端点自动补全）、`accessLevel`、`engine`、`adapters`。
- `models`、`key` 在后端契约中存在，但当前表单**没有输入控件**。
- 网关状态前端**没有枚举**，仅有 `paused` 布尔值。

> ⚠️ 注意: 网关状态枚举在后端契约中，前端未做约束，文档暂未确认。

## 实例详情

详情页与其他类型共享统一骨架，包含以下标签页：

| 标签 | 内容 |
| --- | --- |
| 概览 | 基本信息卡片与 Pod 列表 |
| 监控 | 实例监控面板 |
| 日志 | 实例日志 |
| 事件 | K8s 事件流 |

操作菜单额外提供：保存为模板、网关配置、解密模型。

### 模型解密

推理实例支持对加密模型执行解密（`DecryptModelAction`），弹窗中需要填写解密密码。Pod 列表中也可对单个 Pod 执行解密。

## 权限要求

推理服务属于 PAI 工作台分组，导航要求租户角色为 `ADMIN` 或 `DEVELOPER`。

> ⚠️ 注意: 具体到「编辑 / 启停 / 删除 / 网关注册」等单个动作的角色约束，前端未按动作做细粒度判断，文档暂未确认。
