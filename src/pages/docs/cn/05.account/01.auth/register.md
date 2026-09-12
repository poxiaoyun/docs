---
title: '注册'
updated: '2026-09-12'
description: 自助注册表单字段、校验规则与注册接口说明。
---

## 功能简介

注册页用于创建平台账号。前端通过全局平台设置与运行平台共同决定该入口是否可用。

> ⚠️ 注意: 只有当平台设置 `enableBossSignup` 为真，或当前运行在 Console 平台时，注册页才会渲染；否则会跳转到 404（`centered-sign-up-view.tsx:82-84`）。

## 进入路径

- 登录页 → 「没有账户？现在就注册」链接（仅在允许注册时显示）
- 直接访问：`/auth/sign-up`

## 注册表单

| 字段 | 类型 | 必填 | 前端校验 | 说明 |
|------|------|------|----------|------|
| `username` | 文本输入 | ✅ | 非空 | 账号名 |
| `password` | 密码输入 | ✅ | ≥ 8 位、仅可打印 ASCII 字符 | 可点击眼睛图标查看明文 |
| `email` | 邮箱输入 | ✅ | 邮箱格式 | 用于接收邮箱验证码 |
| `phone` | 电话输入 | ✅ | 非空 + 号码有效 | 需包含国际区号 |
| `code` | 验证码输入 | ✅ | 非空 | 邮箱验证码 |
| `agreement` | 复选框 | ✅ | 必须勾选 | 未勾选时「注册」按钮禁用 |

> ⚠️ 注意: 表单**没有**「确认密码」、**没有**「邀请码」、**没有**密码强度指示条、**没有**短信验证码。前端只实现了邮箱验证码。

### 密码规则

注册密码校验来自 `schemaHelper.password`（`components/hook-form/schema-helper.ts:57-67`）：

- 长度不少于 8 位
- 只允许可打印 ASCII 字符：正则 `/^[\x21-\x7E]{8,}$/`

> ⚠️ 注意: 前端**没有**「必须包含大小写字母和数字」的复杂度校验。若后端有额外规则，请以后端返回为准，本文档未确认。

### 用户名规则

前端仅校验 `username` 非空（`schemaHelper.required`）。

> ⚠️ 注意: 用户名长度、字符集、唯一性等规则由后端定义，前端未做约束，本文档暂未确认。

### 手机号规则

`phone` 为**必填**，且通过 `react-phone-number-input` 的 `parsePhoneNumber(phone)?.isValid()` 校验号码有效性（`centered-sign-up-view.tsx:92-96`）。校验通过后，前端会从号码中解析出 `countryCode` 一并提交。

### 邮箱验证码

验证码组件参数为：`action="signup"`、`codeType="email"`、`target=<当前邮箱>`（`centered-sign-up-view.tsx:171-178`）。

- 点击发送后调用 `POST /api/iam/send-code`
- 倒计时、有效期等策略由验证码组件与后端控制，本文档未确认具体数值

## 提交请求

注册请求体结构（`centered-sign-up-view.tsx:41-68`）：

```json
{
  "username": "alice",
  "displayName": "alice",
  "agreement": true,
  "email": { "value": "alice@example.com", "code": "123456" },
  "phone": { "value": "+8613800000000" },
  "countryCode": "CN",
  "password": { "algorithm": "PlainText", "value": "..." }
}
```

接口：`POST /api/iam/register`

提交成功后 `router.replace(paths.auth.signIn)`，跳转到登录页。失败时页面顶部展示后端返回的错误信息。

## 操作步骤

1. 在登录页点击「没有账户？现在就注册」
2. 填写 `username`、`password`、`email`、`phone`
3. 点击邮箱验证码的发送按钮，在邮箱中查收验证码并填入 `code`
4. 勾选协议
5. 点击「注册」
6. 注册成功后跳转登录页，使用新账号登录

## 注意事项

- 手机号为必填，且必须是解析后的有效号码
- 是否显示注册入口由 `enableBossSignup` 与运行平台共同决定
- 注册后默认不属于任何租户，需要创建或加入租户（详见 [选择/注册租户](./select-tenant)）
