---
title: 系统模版市场
updated: '2026-09-12'
description: '从系统模板市场选择模板并部署系统实例或存储集群。'
---

## 功能简介

系统模板市场是集群级别的**基础设施应用市场**，展示系统域（`domain = system`）的产品模板，供管理员选择并一键部署到当前集群。

## 进入路径

由**系统应用**或**存储集群**页面的「新增」进入：

- 系统应用：`/rune/clusters/:cluster/systems` → 新增
- 存储集群：`/rune/clusters/:cluster/storages` → 新增

前端路由（带部署类别）：

- `/rune/clusters/:cluster/system-market/system`
- `/rune/clusters/:cluster/system-market/storage`

---

## 模板浏览

市场复用产品列表组件渲染，数据来自 `listSystemProducts`。卡片展示模板图标、名称、描述与版本信息。

> ⚠️ 注意: 市场页**不显示分类筛选**（`showCategoryFilter = false`）。模板的 `category` 在系统域下为 `system` 或 `storage`，由模板自身的分类字段决定。

---

## 一键部署

1. 在市场中选择目标模板卡片。
2. 选择可部署的版本。
3. 进入部署视图，按模板 Schema 填写配置参数。
4. 提交部署，创建对应的系统实例或存储实例。

部署入口对应前端路由 `/rune/clusters/:cluster/:types?action=create&product=<模板>&version=<版本>`。

部署完成后可回到 [系统实例](./systems) 或存储集群列表查看运行状态。

---

## 与用户应用市场的区别

| 对比项 | 系统模板市场 | 用户应用市场 |
| --- | --- | --- |
| 面向角色 | 系统管理员 | 用户 |
| 模板域 | `domain = system` | `domain = user` |
| 部署范围 | 集群级别 | 工作空间级别 |
| 管理入口 | BOSS → 集群 → 系统应用 / 存储集群 | Console → 应用市场 |

> 💡 提示: 市场中的模板在 [产品模板管理](./templates) 中维护与发布。若缺少所需模板，请先创建并发布对应产品模板。
