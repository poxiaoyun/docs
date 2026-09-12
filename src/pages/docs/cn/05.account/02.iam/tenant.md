---
title: '租户管理'
updated: '2026-09-12'
description: 租户概览与成员管理（Tab 结构、字段、权限）。
---

## 功能简介

租户管理页提供当前租户的概览与成员管理。页面由顶部 Tab 组织，路由前缀为 `/iam/tenants/{tenant}`。

## 进入路径

> ⚠️ 注意: 代码中**没有**「个人中心 → 租户管理」入口。`AccountLayout` 的 Tab 只有个人资料/密码/邮箱/手机号/API Key/SSH Key/MFA/主题，不包含租户（`account/layouts/layout.tsx:20-61`）。

实际入口：右上角头像菜单中的**租户项**（显示当前租户名称），点击后进入 `/iam/tenants/{tenant}`，再重定向到概览页（`/iam/tenants/{tenant}/overview?tab=overview&provider=rune`）。

## Tab 结构

| Tab | 标识 | 所需角色 |
|-----|------|----------|
| 概览 | `overview` | ADMIN / DEVELOPER |
| 成员 | `members` | 仅 ADMIN |
| 配额 | `quotas` | ADMIN / DEVELOPER |
| 规格 | `flavors` | ADMIN / DEVELOPER |
| 工作空间 | `workspaces` | ADMIN / DEVELOPER |

角色判定见 `src/pages/iam/tenant/layouts/layout.tsx:58-103`。

> ⚠️ 注意: Tab 还会按 URL 上的 `provider` 过滤：当没有 `provider` 或 `provider` 为 `moha` / `chatapp` 时，只展示 `overview` 与 `members` 两个 Tab。

## 概览页

路由：`/iam/tenants/{tenant}/overview`

概览页由多个区块组成：租户信息、成员统计、成员列表、配额、工作空间列表、事件日志。

### 1. 租户信息卡片

可编辑字段（仅租户 ADMIN 可编辑，`tenant-info.tsx:194-238`）：

| 字段 | 标识 | 可编辑 | 校验 |
|------|------|--------|------|
| 租户名称 | `name` | ✅ | 非空 |
| 邮箱 | `email` | ✅ | 非空 + 邮箱格式 |
| 手机号 | `phone` | ✅ | 非空 |
| 创建时间 | `creationTimestamp` | ❌ | — |

卡片顶部为租户头像上传（支持裁剪），非 ADMIN 时禁用。

> ⚠️ 注意: 信息卡中**没有**「租户 ID」「启用状态」「默认语言」字段。

### 2. 成员统计

按角色统计成员分布，角色为 `ADMIN` / `DEVELOPER` / `MEMBER`。

### 3. 成员列表

以表格展示成员，字段见下方「成员管理」。

### 4. 配额与工作空间

分别展示租户的配额信息与工作空间列表。

### 5. 事件日志

数据来源为审计记录，按租户查询（`tenant-events.tsx:33-39`，`pageSize: 20`）。每条事件展示的字段：

| 字段 | 说明 |
|------|------|
| `method` + `endpoint` | 请求方法与端点，作为事件标题 |
| `username`（缺失时回退 `userId`） | 操作者 |
| `result` | 操作结果 |
| `createdAt` | 以相对时间（`fToNow`）展示 |

> ⚠️ 注意: 事件字段是 `method` + `endpoint` / `username` / `result`，**没有**「操作类型」「目标资源」等字段。

## 成员管理

路由：`/iam/tenants/{tenant}/members`（仅 ADMIN 可见）

### 成员列表列

| 列 | 说明 |
|----|------|
| `name` | 成员用户名（附头像，取 `member.user`） |
| `userInfo.email` | 成员邮箱 |
| `role` | 角色（经 `role:{role}` 翻译展示） |
| `creationTimestamp` | 加入时间 |

支持多选删除；工具栏提供「添加成员」按钮，行内提供编辑入口。

### 添加/编辑成员

成员表单字段（`members/components/form.tsx:92-95`）：

| 字段 | 标识 | 说明 |
|------|------|------|
| 用户 | `user` | 通过可搜索的下拉从用户列表中选择；编辑时禁用 |
| 角色 | `role` | 下拉选择，选项来自 `GET /api/iam/tenants/{tenant}/roles` |

> ⚠️ 注意: 角色选项来自租户角色接口返回的 `{ id, name }` 列表，不是写死的三角色枚举；本文档未确认后端返回的全部角色项。

### 成员接口

| 操作 | 接口 |
|------|------|
| 列表 | `GET /api/iam/tenants/{tenant}/members` |
| 详情 | `GET /api/iam/tenants/{tenant}/members/{member}` |
| 删除 | `DELETE /api/iam/tenants/{tenant}/members/{member}` |
| 更新 | `PUT /api/iam/tenants/{tenant}/members/{user}` |
| 角色选项 | `GET /api/iam/tenants/{tenant}/roles` |

## 注意事项

- 成员 Tab 仅 ADMIN 可见；概览 Tab 需要 ADMIN 或 DEVELOPER
- 租户信息的编辑权限同样限定为租户 ADMIN
- 租户管理入口在头像菜单，不在个人中心 Tab
