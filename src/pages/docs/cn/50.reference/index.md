---
title: '参考文档'
updated: '2026-09-12'
description: 接口怎么调、权限怎么判断、本地怎么跑起来、出错怎么办，都在这四篇里。
tags:
  - reference
---

# 参考文档

这里放的是操作性资料，不需要从头读，按需要查。四篇分别解决一类问题：

| 页面 | 解决什么问题 | 谁需要 |
| --- | --- | --- |
| [API 概览](/reference/api-overview) | 平台有哪几组接口、分别给谁用、怎么认证、从哪拿文档 | 要用程序调用模型的开发者 |
| [权限说明](/reference/permissions) | 三种角色分别能做什么、按钮为什么不见了、怎么申请权限 | 所有用户，尤其是管理员 |
| [构建与环境](/reference/build-and-env) | 本地要把控制台跑起来需要装什么、有哪些环境变量、改了会怎样 | 部署和维护控制台的人 |
| [常见问题](/reference/faq) | 按主题分组的「现象 → 原因 → 怎么办」 | 遇到问题时的第一站 |

## 建议阅读顺序

1. 只是想知道「按钮为什么没有」→ 直接看[权限说明](/reference/permissions)。
2. 要用程序调用模型 → 先看 [API 概览](/reference/api-overview)，再看 [API 密钥](/rune/chatapp/token)。
3. 要把控制台部署到自己的环境 → 看[构建与环境](/reference/build-and-env)。
4. 遇到报错 → 看[常见问题](/reference/faq)；那里没有的，在[术语表](/guide/glossary)里把名词搞懂再回头看。
