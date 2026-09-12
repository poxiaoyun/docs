---
title: '选择/注册租户'
updated: '2026-09-12'
description: 登录后的租户选择（Autocomplete）与新租户注册表单。
---

## 功能简介

平台采用多租户架构，Console 登录成功后统一进入租户选择页，从当前账号可访问的租户中选择一个进入。若账号下只有一个租户，页面会自动进入该租户，无需手动选择。

- 路由：`/auth/select-tenant`
- 视图：`src/auth/view/centered/centered-tenant-view.tsx`

## 租户列表数据源

| 项目 | 值 |
|------|-----|
| 接口 | `GET /api/iam/current/tenants` |
| 返回 | `Tenant[]` |
| 选项字段 | `{ id, name, enabled }` |

选项会按 `enabled` 排序，被禁用的租户排在最后。

## 页面说明

页面主体是一个下拉选择框，而非卡片列表：

| 元素 | 说明 |
|------|------|
| 标题 | 取当前用户 `displayName` / `name` / `email` 显示个性化问候；取不到时用通用文案 |
| 下拉框 | `Field.Autocomplete`，字段名 `tenant`，标签为「租户」 |
| 禁用项 | `enabled === false` 的选项不可选，并在右侧显示错误色标签「已禁用」 |
| 进入按钮 | 点击后以所选租户进入 |

> ⚠️ 注意: 页面**没有**租户卡片列表，也**没有**租户 ID、角色、成员数量、状态列、搜索框或排序功能。

## 单租户自动进入

当租户数量恰好为 1 时，页面会自动选择并进入该租户（`centered-tenant-view.tsx:138-142`），用户无需操作。

## 进入租户

选择并提交后，前端执行（`centered-tenant-view.tsx:120-136`）：

1. `setDefaultTenant(tenantId)`
2. 清除默认区域与默认工作空间上下文
3. 跳转：
   - 若 URL 带 `returnTo`，跳回该地址；若同时带 `oldTenantId`，会用新租户 ID 替换 `returnTo` 中的旧 ID（用于切换租户后保持原页面）
   - 否则跳转 `paths.rune.dashboard`

## 注册新租户

点击页面下方的「创建租户」按钮进入注册表单：

- 路由：`/auth/regist-tenant`
- 视图：`centered-regist-tenant-view.tsx`

表单字段（全部必填）：

| 字段 | 类型 | 前端校验 |
|------|------|----------|
| `name` | 文本输入 | 非空 |
| `email` | 文本输入 | 邮箱格式 |
| `phone` | 文本输入 | 非空 + 数字 6–16 位 |

提交：

| 项目 | 值 |
|------|-----|
| 接口 | `POST /api/iam/tenant-register` |
| 请求体 | `{ name, email, phone }` |

提交成功后（`centered-regist-tenant-view.tsx:71-79`）：重新检查会话 → 将新租户 ID 写入 `localStorage`（键 `tenant`）→ 跳转 `paths.rune.dashboard`。

> ⚠️ 注意: 注册租户表单**没有**「租户 ID」字段，也**没有**「描述」字段；`email` 与 `phone` 为普通文本输入，不走验证码。

## 注意事项

- 租户选择是 Autocomplete 下拉，不是卡片网格
- 单租户会自动跳过选择
- 被禁用的租户不可进入
- 注册租户的审批模式、配额分配等由后端决定，本文档未确认
