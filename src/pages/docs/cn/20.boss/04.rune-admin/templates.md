---
title: 应用模版
updated: '2026-09-12'
description: '产品模板的列表字段、创建/编辑表单、域与分类映射，以及模板版本管理。'
---

## 功能简介

产品模板（Product / Template）定义应用部署配置，底层以 Helm Chart 承载。模板按**域（Domain）**区分用途：`user` 域面向用户应用市场，`system` 域面向集群的系统模板市场。

## 进入路径

BOSS 控制台 → 应用模版

前端路由：`/rune/products`

---

## 模板列表

### 列字段

| 列 | 字段路径 | 说明 |
| --- | --- | --- |
| 名称 | `name` | 头像 + 名称（附带 ID）+ 描述；点击进入介绍页 |
| 应用版本 | `versions[0]` | 展示最新版本的 `appVersion`，下方显示 `包版本: chart 版本` |
| 域 | `domain` | `user` / `system` |
| 分类 | `category` | 分类标识 |
| 已发布 | `published` | 状态图标 |
| 推荐指数 | `annotations["app.xiaoshiai.cn/recommendation-score"]` | 数值评分 |
| 推荐截图 | `annotations["app.xiaoshiai.cn/recommendation-screenshot"]` | 是否已配置推荐截图 |
| 创建时间 | `creationTimestamp` | — |

> ⚠️ 注意: 「应用版本」「推荐指数」「推荐截图」是列表独有列，创建表单中并不存在对应输入项。

### 筛选与排序

- **域**：`user` / `system` 切换。
- **分类**：选项随所选域变化（见下表）。
- **关键词搜索**。
- **时间排序**（`creationTimestamp-`）与 **推荐排序**（`recommendation-`）。
- **显示未发布**开关。

### 域与分类映射

分类选项由域决定（`DOMAIN_CATEGORIES`）：

| 域 | 可选分类 |
| --- | --- |
| `user` | `inference`、`tune`、`im`、`experiment`、`evaluation`、`app` |
| `system` | `system`、`storage` |

切换域时，若当前分类不属于新域，会自动清空。

### 操作

| 操作 | 说明 |
| --- | --- |
| 推荐 | 打开推荐对话框，配置推荐指数与推荐截图 |
| 发布 / 取消发布 | 切换 `published`，带确认弹窗 |
| 编辑 | 进入编辑页 |
| 删除 | 带确认弹窗删除 |

---

## 创建 / 编辑模板

前端路由：

- 创建：`/rune/products?action=create`
- 编辑：`/rune/products/:product?action=edit`

### 表单字段

| 字段 | 字段名 | 必填 | 说明 |
| --- | --- | --- | --- |
| ID | `id` | ✅ | Chart 唯一标识；编辑时禁用；创建模式下会**由 ID 自动同步填充名称**（名称未被手动修改时） |
| 名称 | `name` | ✅ | 展示名称 |
| 域 | `domain` | ✅ | 默认 `user` |
| 分类 | `category` | ✅ | 未选域时禁用；选项由域决定 |
| 描述 | `description` | — | 文本域 |

### 图标（Avatar）

- **仅在编辑模式**显示上传入口。
- 上传后调用模板头像接口，支持裁剪。

> ⚠️ 注意: 前端**没有 README 编辑器**，创建 / 编辑表单中不包含 README 字段。模板的介绍内容由详情页的「介绍」标签呈现。

---

## 模板详情与版本

详情页包含**介绍**与**版本**两个标签（前端 `/rune/products/:product/introduction`、`/rune/products/:product/version`）。

### 版本列表

| 列 | 字段 | 说明 |
| --- | --- | --- |
| Chart | `chart` | Chart 名称 |
| 包版本 | `chartVersion` / `version` | Chart 版本号 |
| 已发布 | `published` | 状态图标 |

版本支持上传 Chart、发布 / 取消发布与删除。

> 💡 提示: 上传的 Chart 包需为 `.tgz` 压缩包格式。

---

## 权限要求

需要 **系统管理员** 角色。可创建、编辑、发布 / 取消发布、推荐与删除产品模板。
