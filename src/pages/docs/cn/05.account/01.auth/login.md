---
title: '登录'
updated: '2026-09-12'
description: 用户名 + 密码登录流程，含验证码、第三方登录与登录后跳转。
---

## 功能简介

Console（用户控制台）和 BOSS（运营平台）共用同一套认证服务与登录页面。前端根据平台类型和登录配置动态渲染登录表单，认证成功后统一调用一次会话检查，再决定跳转目标。

- Console 与 BOSS 的登录路由相同：`/auth/sign-in`
- 登录页采用 `split` 布局（宽屏下左侧为品牌与能力介绍、右侧为表单卡片，`src/routes/sections/auth.tsx:29`），表单固定包含协议勾选，未勾选时登录按钮禁用

## 页面加载

进入登录页后，前端并行发起两个请求：

| 请求 | 用途 |
|------|------|
| `GET /api/iam/login-captcha` | 获取本次登录的验证码配置与其 `key` |
| `GET /api/iam/login-config` | 获取平台登录配置（开放注册、登录方式列表） |

`login-config` 的字段：

| 字段 | 说明 |
|------|------|
| `allowSignup` | 是否允许注册 |
| `methods` | 登录方式列表，用于动态渲染第三方登录按钮 |

> ⚠️ 注意: 登录页**注册入口的显示**由平台设置 `enableBossSignup` 与运行平台决定（`centered-sign-in-view.tsx:687-699`），不是直接读 `login-config.allowSignup`。

> ⚠️ 注意: 验证码是否需要、以及使用哪种验证码，由 `GET /api/iam/login-captcha` 返回的 `provider` 决定，不是由 `login-config` 决定。

## 登录表单

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | 文本输入 | ✅ | 账号（用户名/邮箱） |
| `password` | 密码输入 | ✅ | 可点击眼睛图标切换明文/密文 |
| `agreement` | 复选框 | ✅ | 必须勾选协议后「登录」按钮才可用 |
| `captchaInput` | 文本输入 | 条件 | 仅当验证码 provider 为 `Graphic` 时在表单内显示；`Slider` 时在弹窗内输入 |

> ⚠️ 注意: 登录页**没有**「记住我」复选框。请求体中的 `remeberMe` 为前端硬编码的 `true`（`centered-sign-in-view.tsx:244`），用户不可配置。

## 验证码

后端可返回两种验证码 provider，前端处理方式不同：

| provider | 交互方式 |
|----------|----------|
| `Graphic` | 表单内显示验证码图片 + 输入框；点击图片可刷新，`key` 同步更新 |
| `Slider` | 点击登录后弹出滑块验证弹窗；拖动完成即自动提交 |

提交登录时，验证码信息以如下结构携带：

```json
{
  "captcha": {
    "code": "<用户输入或滑块偏移量>",
    "key": "<来自 login-captcha 的 key>",
    "provider": "Graphic",
    "name": ""
  }
}
```

> 💡 提示: 验证码字段名是 `key`，不是 `captchaId`。`captcha` 对象仅在需要验证码时才会出现在请求体中。

## 请求体

```json
{
  "username": "alice",
  "type": "Password",
  "remeberMe": true,
  "password": { "algorithm": "PlainText", "value": "..." },
  "captcha": { "code": "...", "key": "...", "provider": "Graphic", "name": "" }
}
```

接口：`POST /api/iam/login`

## 第三方登录

当 `login-config.methods` 中存在可识别的第三方方式时，登录按钮下方会渲染对应的登录按钮：

- 判定条件：方法的 `type` 包含 `oauth` / `oauth2` / `oidc` / `saml`，或提供了 `provider`
- 同时必须能从方法对象中取到跳转地址（`url` / `href` / `loginUrl` / `authUrl` / `authorizationUrl` / `redirectUrl`，支持顶层或 `OAuth` / `OAuth2` / `OIDC` / `SAML` 嵌套字段）
- 按钮文案取 `displayName` / `label` / `name` / `provider`；图标取 `icon` 或 `logo`
- 点击按钮为普通的外链跳转（`<a href>`），由第三方完成认证

> ⚠️ 注意: 具体支持哪些第三方 provider、回调地址如何配置，属于后端与平台配置范畴，前端只按 `methods` 渲染，文档暂未确认。

## 登录后跳转

认证流程为：`POST /api/iam/login` 成功 → 调用 `checkUserSession()` → 按平台类型跳转。

| 平台 | 跳转目标 |
|------|----------|
| Console | `/auth/select-tenant?returnTo=<returnTo>` |
| BOSS | `paths.boss.dashboard` |

> ⚠️ 注意: Console 登录后**总是**先进入租户选择页，而不是「单租户直接进首页」。若只属于一个租户，租户选择页会自动进入该租户（详见 [选择/注册租户](./select-tenant)）。登录页没有独立的「MFA 验证页」跳转。

## 错误处理

前端对以下后端返回做了专门处理：

| 场景 | 表现 |
|------|------|
| `reason === 'NeedCaptcha'` | 刷新验证码；`Slider` 直接弹窗，`Graphic` 显示错误提示 |
| `reason === 'InvalidCaptcha'` | 刷新验证码并提示验证码错误；`Slider` 重新弹窗 |
| `reason === 'LoginLocked'` | 若验证码弹窗已打开则刷新验证码，并显示后端错误信息 |
| 错误码 `401` 或消息 `Invalid account or password` | 关闭弹窗并显示「账号或密码错误」 |
| 消息 `Already logged in` | 视为已登录，直接执行会话检查并跳转 |

> ⚠️ 注意: 账号锁定阈值、锁定时长、验证码有效期均由后端策略决定，前端只透传后端错误信息；本页暂未确认具体数值。

## 退出登录

`POST /api/iam/logout`：调用后端登出接口，然后清空本地存储与会话状态，跳回登录页。

## 注意事项

- 协议必须勾选后才能提交登录
- 验证码的 `key` 与 `provider` 来自登录页加载时的 `login-captcha` 响应，刷新验证码后需重新获取
- 登录方式由 `login-config.methods` 动态决定，第三方按钮的有无可由平台配置调整
- 若提示 `Already logged in`，前端会直接进入已登录流程，不会报错
