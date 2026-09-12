---
title: 'Space 管理'
updated: '2026-09-12'
description: 'BOSS 端 Space 的列表字段、运行状态来源与可见性/推荐管理。'
---

## 功能简介

BOSS 端 Space 管理提供**平台级别**的 Space 全局管理。Space 是基于代码仓库构建的交互式 Web 应用，管理员可在此查看与管理所有组织创建的 Space。

## 进入路径

BOSS 控制台 → 资产管理 → **Space**

前端路由：`/moha/spaces`

---

## 列表

Space 与模型库、数据集、镜像仓库共用数据管理列表组件，`type = spaces`。

### 列字段

| 列 | 字段路径 | 说明 |
| --- | --- | --- |
| 别名 / 名称 | `name` / `alias` | 名称列展示 `alias || name`，含描述悬浮提示与镜像来源标签 |
| 组织 | `organization` | 组织头像 + 名称 |
| 可见性 | `visibility` | 公开 / 私有 / 租户内标签 |
| 仓库容量 | `repositoryStorageSize` | 仓库统计就绪时展示，否则 `-` |
| 运行状态 | `spaceMetadata.status.phase` | 运行阶段状态 |
| 下载量 | `annotations.downloads` | — |
| 领域 | `metadata.domain` | 可折叠标签组 |
| 场景 | `metadata.scene` | 可折叠标签组 |
| 推荐指数 | `annotations.recommendation-score` | 推荐状态 |
| 更新时间 | `modified` | — |

> ⚠️ 注意: 列表**没有「许可证」列**。

### 运行状态的取值

Space 的运行状态以 `spaceMetadata.status.phase` 为准（前端还会优先取实时状态接口返回的 phase），并通过状态组件以 `space_phase` 为翻译前缀渲染。

> ⚠️ 注意: 前端未固化 Space 的 phase 枚举（不是固定的一组状态），实际取值由后端返回，文档暂不列举。

### 筛选

名称搜索、组织筛选、可见性筛选，以及基于元数据 Facet 的高级筛选。

---

## 管理操作

操作列包含：

| 操作 | 说明 |
| --- | --- |
| 可见性 | 打开可见性对话框，切换公开 / 私有 |
| 推荐 | 打开推荐对话框，配置推荐指数与推荐截图 |
| 编辑 | 进入编辑页 |
| 删除 | 带确认弹窗，支持批量 |

> ⚠️ 注意: BOSS 端 Space 列表**只有上述操作**，没有「重启」「停止」「查看日志」等运行时运维入口。

---

## 权限要求

需要 **系统管理员** 角色。普通用户和租户管理员应通过 Console → Moha → Space 管理自己的 Space。

相关页面：[模型库管理](./models)、[数据集管理](./datasets)、[镜像仓库管理](./images)。
