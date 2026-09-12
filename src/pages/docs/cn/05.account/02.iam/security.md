---
title: '安全设置'
updated: '2026-09-12'
description: 修改密码 / 邮箱 / 手机号与 MFA 的集合说明。
---

## 功能简介

「安全设置」是文档层面的集合概念，代码中**没有**独立的「安全设置」Tab。相关功能分散在用户中心的四个 Tab 中，本页统一说明其字段、校验与接口。

| 功能 | Tab | 路由 | 视图 |
|------|-----|------|------|
| 修改密码 | 密码 | `/iam/account/change-password` | `change-password.tsx` |
| 修改邮箱 | 邮箱 | `/iam/account/change-email` | `change-email.tsx` |
| 修改手机号 | 手机号码 | `/iam/account/change-mobile` | `change-mobile.tsx` |
| MFA | 多因素认证 | `/iam/account/mfa` | `mfa.tsx` |

## 修改密码

| 字段 | 标识 | 前端校验 |
|------|------|----------|
| 旧密码 | `oldPassword` | 非空 |
| 新密码 | `newPassword` | ≥ 8 位、仅可打印 ASCII |
| 确认新密码 | `confirmNewPassword` | ≥ 8 位、仅可打印 ASCII，且与新密码一致 |

附加校验：`oldPassword` 不能与 `newPassword` 相同。

| 项目 | 值 |
|------|-----|
| 接口 | `POST /api/iam/current/reset-password` |
| 请求体 | `{ "password": "<旧密码>", "newPassword": "<新密码>" }` |

> ⚠️ 注意: 代码中**没有**密码强度指示器（弱/中/强），只有上述规则校验。密码规则与注册页一致，来自 `schemaHelper.password`。

## 修改邮箱

| 字段 | 标识 | 前端校验 |
|------|------|----------|
| 新邮箱 | `newEmail` | 非空 + 邮箱格式 |
| 验证码 | `code` | 非空（邮箱验证码） |

| 项目 | 值 |
|------|-----|
| 接口 | `POST /api/iam/current/reset-email` |
| 请求体 | `{ "newEmail": "...", "code": "..." }` |

## 修改手机号

| 字段 | 标识 | 前端校验 |
|------|------|----------|
| 新手机号 | `newPhone` | 非空 + 数字 6–16 位 |
| 验证码 | `code` | 非空（短信验证码） |

| 项目 | 值 |
|------|-----|
| 接口 | `POST /api/iam/current/reset-phone` |
| 请求体 | `{ "newPhone": "...", "code": "..." }` |

## 验证码机制

邮箱与手机号修改使用同一个验证码组件（`RHFVerifyCode`）：

- 发送接口：`POST /api/iam/send-code`，请求体 `{ action, target, type }`
  - `action` 默认为 `reset`；修改邮箱/手机号时 `target` 为当前输入的新邮箱/新手机号，`type` 分别为 `email` / `phone`
- 点击发送后按钮进入 **60 秒倒计时**
- 若后端返回消息 `Need captcha`，前端会：
  1. 调用 `GET /api/iam/captcha` 获取图形验证码
  2. 弹出确认框让用户输入图形验证码
  3. 携带 `captcha: { code, key, provider, name }` 重新发送验证码

> ⚠️ 注意: 图形验证码不是固定前置步骤，仅在后端返回 `Need captcha` 时触发。验证码有效期由后端决定，本文档未确认。

## MFA

MFA 的绑定与恢复码说明见 [多因素认证](/account/auth/mfa)。要点：进入页面即自动调用 `POST /api/iam/init-mfa`，无独立「启用 MFA」按钮；Stepper 为两步；恢复码只展示第一个。

## 注意事项

- 安全相关操作都集中在用户中心的 Tab 中，没有独立「安全设置」页面
- 修改密码前需先通过旧密码校验
- 邮箱 / 手机号修改需通过验证码确认新值
