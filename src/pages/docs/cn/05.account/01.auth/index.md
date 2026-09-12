---
title: 认证与登录
updated: '2026-09-12'
description: 平台登录、注册、密码重置与多因素认证指南。
tags:
  - account
  - auth
---

## 概述

本章节介绍平台的认证体系：账号注册、登录方式、密码重置、MFA 绑定与租户选择。Console（用户控制台）与 BOSS（运营平台）共用同一套认证服务。

## 章节导航

- [用户登录](/account/auth/login) — 登录表单、验证码、第三方登录与登录后跳转
- [用户注册](/account/auth/register) — 自助注册表单与校验规则
- [密码重置](/account/auth/reset-password) — 忘记密码与设置新密码（v1 为前端占位）
- [多因素认证](/account/auth/mfa) — MFA 绑定与恢复码
- [角色与权限](/account/auth/roles) — 角色串与前端权限判定
- [选择/注册租户](/account/auth/select-tenant) — 租户选择与新租户注册

## 关键结论

- 登录成功后 Console 一律先进入租户选择页，单租户会自动进入
- 登录页没有「记住我」，验证码字段名是 `key`
- 注册表单不含确认密码/邀请码/短信验证码
- 密码重置两个页面在 v1 未接入后端
