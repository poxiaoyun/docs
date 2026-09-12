---
title: '个人信息'
updated: '2026-09-12'
description: 头像与昵称的查看与修改，用户名只读。
---

## 功能简介

个人信息页用于维护当前账号的头像与昵称。页面只包含这两个可维护项，其余信息不在此页展示。

- 路由：`/iam/account/general`
- 视图：`src/pages/iam/account/general.tsx`

## 进入路径

右上角头像 → 个人设置 → 顶部 Tab「基本信息」

## 页面组成

页面为左右两栏：

| 区域 | 内容 |
|------|------|
| 左栏 | 头像上传与裁剪；下方展示当前 `displayName` |
| 右栏 | 用户名（只读）+ 昵称（可改）+ 保存按钮 |

### 字段

| 字段 | 标识 | 可编辑 | 校验 |
|------|------|--------|------|
| 用户名 | `name` | ❌ | 非空（只读，带锁图标） |
| 昵称 | `displayName` | ✅ | 非空 |

> ⚠️ 注意: 页面**没有**「用户 ID（UUID）」「注册时间」「MFA 状态」等只读信息展示（`general.tsx:164-179` 只渲染 `name` 与 `displayName`）。

## 头像

头像使用「上传并裁剪」组件（`Field.UploadAvatarWithCrop`）：

| 项目 | 值 |
|------|-----|
| 最大文件大小 | `3145728` 字节（3 MB） |
| 裁剪 | 支持，`preserveAspectRatio` |
| 上传接口 | `POST /api/iam/current/avatar`（multipart，字段名 `avatar`） |

上传成功后会自动重新拉取资料、检查会话，并显示成功提示。

## 接口

| 操作 | 接口 |
|------|------|
| 加载资料 | `GET /api/iam/current/profile` |
| 保存资料 | `PUT /api/iam/current/profile` |
| 上传头像 | `POST /api/iam/current/avatar` |

保存时前端提交的是 `{ ...user, ...data }`，即合并后的完整用户对象（`general.tsx:84-88`）。

## 操作步骤

1. 进入「基本信息」Tab
2. 修改昵称 `displayName`
3. 需要时点击头像区域上传并裁剪新头像
4. 点击「保存」提交

## 注意事项

- 用户名不可在此页修改
- 头像超过 3 MB 无法上传
- 保存成功后前端会调用 `checkUserSession()` 刷新会话
