---
title: 账号与权限
updated: '2026-09-12'
description: 平台统一身份认证、访问控制与个人账号管理。
tags:
  - account
  - auth
  - iam
---

# 账号与权限系统

平台采用统一的身份认证与权限管理体系，Console（用户控制台）与 BOSS（运营平台）共享同一套认证服务。访问控制基于角色（RBAC），前端根据角色派生出权限字符串用于控制界面。

## 模块概览

### 🔐 认证服务

统一登录、注册、密码重置、MFA 与租户选择等身份认证功能。

| 功能 | 说明 |
|------|------|
| [登录](/account/auth/login) | 用户名 + 密码登录，支持验证码与第三方登录 |
| [注册](/account/auth/register) | 新用户自助注册（受平台开关控制） |
| [密码重置](/account/auth/reset-password) | 忘记密码与设置新密码（v1 为前端占位） |
| [多因素认证](/account/auth/mfa) | MFA 绑定与恢复码 |
| [角色与权限](/account/auth/roles) | 角色串与前端权限判定 |
| [选择租户](/account/auth/select-tenant) | 登录后的租户选择与新租户注册 |

### 👤 个人中心

用户个人资料、安全操作与访问凭据管理，入口为头像菜单 → 个人设置。

| 功能 | 说明 |
|------|------|
| [个人资料](/account/iam/profile) | 头像与昵称 |
| [安全设置](/account/iam/security) | 密码 / 邮箱 / 手机号 / MFA 集合说明 |
| [主题偏好](/account/iam/theme) | 外观偏好，自动保存 |
| [API Key](/account/iam/api-key) | AccessKey / SecretKey |
| [SSH Key](/account/iam/ssh-key) | SSH 公钥管理 |
| [租户管理](/account/iam/tenant) | 租户概览与成员管理 |

## 权限模型

角色以字符串表示，代码中出现的枚举为 `admin` / `developer` / `member`，并可通过 `tenant`、`workspace` 作用域区分层级（`src/types/tenant.ts:18-22`、`src/types/member.ts`）。

- 前端在登录后通过 `GET /api/iam/current/roles` 拉取角色
- 权限字符串由前端根据角色在本地派生（`src/auth/authz/context.tsx`），后端权限契约本文档未确认
- 详细说明见 [角色与权限](/account/auth/roles)

> 💡 提示: 平台权限的完整设计文档请参阅 [权限设计](/reference/permissions)。
