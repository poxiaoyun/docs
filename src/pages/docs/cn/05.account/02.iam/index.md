---
title: 个人中心
updated: '2026-09-12'
description: 用户中心的 Tab 结构与各页说明。
tags:
  - account
  - iam
---

## 概述

个人中心（用户中心）集中管理当前账号的资料、凭据与界面偏好。页面由顶部一排 Tab 组织，路由前缀为 `/iam/account`。

## 进入路径

头像菜单 → 个人设置 → `/iam/account/general`

## Tab 一览

| Tab | 路由 | 说明 |
|-----|------|------|
| [基本信息](/account/iam/profile) | `/iam/account/general` | 头像、昵称；用户名为只读 |
| [密码](/account/iam/security) | `/iam/account/change-password` | 通过旧密码修改新密码 |
| 邮箱 | `/iam/account/change-email` | 新邮箱 + 邮箱验证码 |
| 手机号码 | `/iam/account/change-mobile` | 新手机号 + 验证码 |
| [API Key](/account/iam/api-key) | `/iam/account/api-key` | AccessKey / SecretKey |
| [SSH 密钥](/account/iam/ssh-key) | `/iam/account/ssh-key` | SSH 公钥管理 |
| [多因素认证](/account/auth/mfa) | `/iam/account/mfa` | 多因素认证绑定 |
| [主题](/account/iam/theme) | `/iam/account/theme` | 外观偏好，自动保存 |

> ⚠️ 注意: 代码中**没有**名为「安全设置」的独立 Tab。安全相关功能分散在「密码 / 邮箱 / 手机号码 / 多因素认证」四个 Tab 中；[安全设置](/account/iam/security) 文档是这几项的集合说明。

## 相关说明

- 租户管理不在个人中心的 Tab 中，入口在头像菜单的租户项（详见 [租户管理](/account/iam/tenant)）
- 各 Tab 切换时会保留 URL 上的 `provider` 参数
