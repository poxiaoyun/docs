---
title: '审计日志'
updated: '2026-09-12'
description: '魔哈 Hub 平台级操作审计日志的筛选、列表字段与导出。'
---

## 功能简介

审计日志记录平台侧对 Moha 资源（模型 / 数据集 / 镜像 / Space / 组织等）的操作，供管理员追溯操作人、动作、目标与结果。

## 进入路径

BOSS 控制台 → 安全审计 → **审计日志**

前端路由：`/moha/audit`

---

## 筛选条件

页面顶部的筛选卡片包含：

| 筛选项 | 字段 | 默认值 |
| --- | --- | --- |
| 开始日期 | `startTime` | 近 **1 个月**（当月往前一个月，取当日 00:00） |
| 结束日期 | `endTime` | 今天 23:59:59 |
| 组织 | `organization` | 全部 |
| 操作 | `action` | 全部 |
| 资源类型 | `resourceType` | 全部 |

- 调整开始 / 结束日期时会自动纠正范围（开始不晚于结束）。
- 点击 **查询** 应用筛选，点击 **重置** 恢复默认值。
- 修改任一筛选条件会把分页重置到第 1 页。

### 操作枚举（`action`）

| 值 | 说明 |
| --- | --- |
| `create` | 创建 |
| `update` | 更新 |
| `delete` | 删除 |
| `push` | 推送 |
| `pull` | 拉取 |
| `online` | 上线 |
| `restart` | 重启 |

> 💡 提示: 当记录没有显式 `action` 时，前端会根据请求方法兜底推断：`POST → create`、`PUT/PATCH → update`、`DELETE → delete`；`resourceType = commit` 时推断为 `push`。

### 资源类型

资源类型为可选项集合（`AUDIT_RESOURCE_OPTIONS`），包含 `models`、`datasets`、`images`、`spaces`、`organizations`、`favorite`、`discussion`、`comments`、`commit`、`freezes`、`scans`、`announcements`、`banners`、`mirrors`、`members`、`users`、`pods`、`logs`、`encryption`、`rating`、`readme`、`refs`、`contents`、`raw`、`downloads`、`cover`、`summary`、`resolve`、`mirror-requests` 等。

---

## 列表字段

| 列 | 字段路径 | 说明 |
| --- | --- | --- |
| 时间 | `startTime` | `YYYY-MM-DD HH:mm:ss.SSS` |
| 用户 | `subject` | 操作主体，为空显示 `-` |
| 组织 | `organization` | 组织标识 |
| 操作 | `action` | 彩色标签（按动作着色） |
| 资源类型 / 名称 | `resourceType` / `resourceName` | 上行类型，下行资源名（无则回退请求路径） |
| 方法 | `request.method` | POST / PUT / PATCH / DELETE 等，彩色标签 |
| 状态码 | `response.statusCode` | 2xx 绿、4xx 黄、5xx 红 |
| 耗时 | `endTime - startTime` | 毫秒 |
| 操作 | — | 查看详情（打开详情弹窗） |

- 默认每页 **20** 条，按时间倒序（`time-`）。
- 列表禁用搜索与工具栏，使用分页器翻页。

---

## 导出

右上角 **下载** 按钮会把当前筛选条件下的全部记录导出为 JSON 文件：

- 导出时按 **500 条 / 页**逐页拉取，直到取完为止。
- 文件名形如 `moha-audit-YYYYMMDD-HHmmss.json`。
- 无数据、成功、失败均有提示。

---

## 权限要求

需要 **系统管理员** 角色。
