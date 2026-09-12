---
title: 工作空间
updated: '2026-09-12'
description: 工作空间的创建、成员与角色、配额，以及无工作空间/无区域时的拦截逻辑。
tags:
  - rune
  - console
---

# 工作空间管理

工作空间（Workspace）是 Rune 中承载实例的最小隔离单元：它绑定到一个租户和一个集群，并对应一个独立的 Kubernetes Namespace。该空间内的推理、微调、开发环境、应用、存储卷等都在此命名空间下运行。

## 进入路径

| 页面 | 路径 |
| --- | --- |
| 工作空间列表 | `/rune/tenants/:tenant/clusters/:cluster/workspaces` |
| 工作空间概览 / 详情 | `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace` |
| 工作空间配额 | `.../workspaces/:workspace/quotas` |
| 工作空间成员 | `.../workspaces/:workspace/members` |

## 工作空间列表

列表展示当前租户在指定集群下的工作空间。列表以工作空间名称/描述为主，可进入概览、编辑或删除。

> ⚠️ 注意: 旧版本文档给出的状态枚举（Active / Creating / Failed / Terminating）在前端没有约束依据；工作空间的 `phase` 取值由后端返回，前端未做枚举限定，文档暂未确认。

## 创建工作空间

1. 在列表页点击创建按钮。
2. 填写表单。
3. 提交创建。

### 表单字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 工作空间唯一标识，创建后不可修改；创建时前端会自动生成一个默认 ID |
| `name` | ✅ | 显示名称 |
| `cluster` | ✅ | 所属集群；创建态可选，编辑态禁用 |
| `description` | — | 描述 |

`id` 与 `name` 由同一个 `IdField` 组件渲染，`cluster` 由 `ClusterField` 渲染（见 `src/pages/rune/tenant/workspaces/components/form.tsx`）。

> 💡 提示: `id` 会参与 K8s Namespace 命名，建议使用简短有意义的小写标识。

## 成员与角色

### 成员列表

成员列表展示工作空间内的成员及其角色，支持编辑与移除。

### 添加 / 编辑成员

成员表单只包含两个字段：

| 字段 | 控件 | 必填 | 说明 |
| --- | --- | --- | --- |
| `user` | 自动补全（来自租户成员） | ✅ | 从租户成员列表中选择；编辑态禁用 |
| `role` | 自动补全（单选） | ✅ | 工作空间角色，**单选** |

> ⚠️ 注意: 旧版本文档写「分配一个或多个角色」，实际表单的 `role` 是**单选**字符串字段（zod `role: z.string().min(1)`），不能多选。

### 角色来源

角色选项不是前端写死的枚举，而是通过 `listWorkspaceRoles` 动态拉取当前工作空间可用的角色列表（`src/pages/rune/tenant/workspaces/members/components/form.tsx`），以角色 `id` 作为值、`name` 作为标签。

> ⚠️ 注意: 角色清单随租户/工作空间配置变化，文档不列举固定角色枚举。

## 工作空间配额

工作空间配额在工作空间详情下的配额页维护，用于把租户配额进一步分配到工作空间。详见[配额与策略](/rune/console/quota)。

## 上下文与拦截逻辑

工作空间相关的上下文由 `WorkspaceProvider` 提供，页面在渲染前会经过 `WorkspaceGuard`（`src/routes/sections/rune.tsx`）：

| 场景 | 表现 |
| --- | --- |
| 当前上下文没有工作空间（`isEmpty` 且非 loading） | 渲染空态：标题为 `no_workspace`；租户管理员额外看到一个跳转到工作空间列表的「创建空间」按钮，非管理员只看到提示文案 |
| 未选择集群 | 跳转 `/rune/noregion` 无区域提示页 |

切换工作空间后，左侧所有功能模块会重新加载对应空间的资源。

## 权限要求

查看工作空间列表对所有成员开放；工作空间相关的上下文选择是所有实例操作的前提。创建工作空间等管理动作由租户管理员执行（空态中的创建按钮仅对租户管理员展示）。

> ⚠️ 注意: 单个成员管理动作（添加/编辑/移除）的精确角色约束前端未按动作做细粒度判断，文档暂未确认。
