---
title: 应用实例
updated: '2026-09-12'
description: 应用实例的列表、创建、详情页 PVC 列表与生命周期操作。
tags:
  - rune
  - console
---

# 应用实例

应用实例（`category=app`）用于部署各类通用应用。它与其他类型共享统一实例模型，并在详情页额外提供 **PVC 列表**。

列表路径：`/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/apps`

## 应用列表

列表列（`category=app`）：

| 列 | 说明 |
| --- | --- |
| 名称 | 实例名称，点击进入详情 |
| 应用 | 模板列在该类型下的 i18n key 为 `applications` |
| 规格 | 由 `values.flavor` 解析出的资源摘要 |
| 状态 | `status.phase` |
| 创建者 | 取自标签中的创建者 |
| 创建时间 | 实例创建时间 |

行操作菜单：启动/停止、编辑、删除（删除需二次确认）。

> ⚠️ 注意: 应用列表**不支持状态过滤**，配置的批量操作列表为空，因此也**没有批量启停**。旧版本文档中的相关描述已删除。

## 部署应用

1. 点击列表页右上角的「创建资源」按钮，跳转到 `/rune/products/app`。
2. 选择应用模板与版本，或从应用市场 `/rune/app-market` 的模板详情页点「部署」进入。
3. 填写基本信息（`id` / `name` / `description`）。
4. 填写模板参数：由版本 JSON Schema 动态渲染，图形模式与 JSON 模式可切换。

> 💡 提示: 控制台层没有固定的「模板版本 / 规格 / 存储卷」字段。是否需要持久化存储、选哪种规格，取决于所选模板的 Schema；应用市场列表还会为带 Moha 标记的模板展示 `Moha` 标签。

## 应用详情

详情页与其他类型共享统一骨架，概览标签页的内容为：

1. **基本信息卡片**（`ServiceInfoCard`）
2. **Pod 列表**（`InstancePodList`）
3. **PVC 列表**（`InstancePVCList`）

其余标签页为监控、日志、事件。

### PVC 列表

PVC 列表只在应用详情页出现（`src/pages/rune/apps/detail.tsx`），用于展示与应用关联的持久卷声明。字段以 `InstancePVCList` 实际渲染为准。

> ⚠️ 注意: 旧版本文档给出的 PVC 字段清单（容量、存储类、访问模式等）未经代码逐项确认，文档暂未确认。

## 生命周期操作

| 操作 | 说明 |
| --- | --- |
| 启动 / 停止 | 通过 `values.global.paused` 切换 |
| 扩缩容 | 详情页操作菜单的 `ScaleAction` |
| 编辑 | 修改名称、描述与模板参数 |
| 删除 | 二次确认后删除实例 |

## 权限要求

应用服务属于 PAI 工作台分组，导航要求租户角色为 `ADMIN` 或 `DEVELOPER`。
