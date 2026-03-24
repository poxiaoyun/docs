---
title: 账号与权限
updated: '2026-03-23'
description: 平台统一身份认证、访问控制与个人账号管理。
tags:
  - account
  - auth
  - iam
---

# 账号与权限系统

晓石智算平台采用统一的身份认证与权限管理体系，Console（用户控制台）和 BOSS（运营平台）共享同一套认证服务。平台基于 RBAC（基于角色的访问控制）模型，通过 **三级作用域**（平台级 → 租户级 → 工作空间级）实现精细化的权限管控。

## 模块概览

### 🔐 认证服务

统一登录、注册、MFA 多因素认证、密码重置等身份认证功能。

| 功能 | 说明 |
|------|------|
| [登录](/docs/account/auth/login) | 用户名/密码登录，支持验证码与 MFA |
| [注册](/docs/account/auth/register) | 新用户自助注册（需管理员开启） |
| [MFA 认证](/docs/account/auth/mfa) | 多因素认证绑定与验证 |
| [密码重置](/docs/account/auth/reset-password) | 通过邮箱或管理员重置密码 |
| [角色与权限](/docs/account/auth/roles) | 平台角色体系与权限说明 |
| [选择租户](/docs/account/auth/select-tenant) | 多租户环境下选择工作租户 |

### 👤 个人中心

用户个人资料、安全设置与访问凭据管理。

| 功能 | 说明 |
|------|------|
| [个人资料](/docs/account/iam/profile) | 头像、昵称、邮箱等基本信息 |
| [安全设置](/docs/account/iam/security) | 密码修改与 MFA 管理 |
| [主题偏好](/docs/account/iam/theme) | 界面语言与主题切换 |
| [API Key](/docs/account/iam/api-key) | API 访问令牌的创建与管理 |
| [租户管理](/docs/account/iam/tenant) | 查看所属租户与切换 |
| [SSH Key](/docs/account/iam/ssh-key) | SSH 公钥管理 |

## 权限模型

平台权限基于 RBAC 模型，采用三级作用域设计：

```
平台级 (Platform)
 └── 租户级 (Tenant) 
      └── 工作空间级 (Workspace)
```

- **平台级**：平台管理员（PlatformAdmin）拥有全局管理权限
- **租户级**：租户管理员（TenantAdmin）管理本租户内的资源与成员
- **工作空间级**：工作空间成员（WorkspaceMember）在授权的工作空间内操作

:::info
详细的权限矩阵与设计文档请参阅 [权限设计](/docs/reference/permissions)。
:::
