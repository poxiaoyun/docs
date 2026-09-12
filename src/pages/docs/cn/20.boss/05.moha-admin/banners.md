---
title: Banner
updated: '2026-09-12'
description: '平台 Banner 的列表字段、图片上传裁剪与创建/编辑表单说明。'
---

## 功能简介

Banner 管理用于维护平台首页的横幅位内容。管理员可创建、编辑、删除 Banner，并设置跳转链接与生效时间。

## 进入路径

BOSS 控制台 → 系统设置 → **Banner 管理**

前端路由：`/moha/banners`

---

## 列表

| 列 | 字段路径 | 说明 |
| --- | --- | --- |
| 图片 | `image` | 缩略图（64×40，等比裁切） |
| 标题 | `title` | — |
| 内容 | `content` | 单行截断 |
| 链接 | `link` | 可点击的外链，超过宽度截断 |
| 生效日期 | `startAt` | — |
| 失效日期 | `endAt` | — |

### 状态表现

- `endAt` 早于当前时间的 Banner 视为**已过期**，整行灰化展示。
- 支持按标题搜索；操作：编辑、删除（带确认弹窗，支持批量）。

---

## 创建 / 编辑 Banner

前端路由：

- 创建：`/moha/banners?action=create`
- 编辑：`/moha/banners/:id?action=edit`

### 表单字段

| 字段 | 字段名 | 必填 | 说明 |
| --- | --- | --- | --- |
| 标题 | `title` | — | 文本 |
| 内容 | `content` | — | 多行文本 |
| 链接 | `link` | — | URL，需为合法地址 |
| 生效日期 | `startAt` | ✅ | 日期时间选择器 |
| 失效日期 | `endAt` | ✅ | 日期时间选择器 |
| 图片 | `image` | ✅ | 上传图片（Base64） |

### 图片要求

- 支持 JPEG / PNG / APNG / WebP / GIF / AVIF / SVG。
- 上传时可**裁剪**，输出为按固定宽高比裁切的 Base64。
- 大小上限约 3MB。

校验规则：

- `startAt`、`endAt` 必填，且 `endAt` 必须晚于 `startAt`。
- `link` 若填写必须是合法 URL。
- 提交时固定携带 `isActive = true`。

---

## 权限要求

需要 **系统管理员** 角色。
