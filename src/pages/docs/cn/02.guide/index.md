---
title: 入门指南
updated: '2026-09-12'
description: 三篇入门文档怎么读、按什么顺序读，帮你最快跑通第一套流程。
tags:
  - guide
  - getting-started
---

# 入门指南

这一章是给第一次使用晓石 AI 的人准备的。你不用先学 Kubernetes，也不用懂大模型术语——读完这三个页面，你能知道平台由哪些部分组成、页面上每个词是什么意思，以及从登录到跑通第一个模型服务该点哪里。

## 三篇文档分别解决什么问题

| 页面 | 读完你能 | 什么时候读 |
| --- | --- | --- |
| [快速开始](/guide/quick-start) | 按五个阶段走完全流程：登录 → 领算力 → 部署推理服务 → 上传模型 → 微调与评测 | 第一次上手，边看边操作 |
| [平台概念](/guide/architecture) | 看懂平台是怎么分层的、一个请求从哪来到哪去、数据存在哪 | 操作完一轮，想搞明白背后原理 |
| [术语表](/guide/glossary) | 查到任意一个名词的白话解释、类比，以及第一次会在哪遇到它 | 随时翻阅，看不懂就查 |

## 推荐阅读顺序

| 你的身份 | 推荐路径 |
| --- | --- |
| **开发者** | [快速开始](/guide/quick-start) → [术语表](/guide/glossary) → [在线推理](/rune/console/inference) → [AIRouter](/airouter/) |
| **租户管理员** | [快速开始](/guide/quick-start) → [权限说明](/account/auth/roles) → [工作空间](/rune/console/workspace) → [租户管理](/account/iam/tenant) |
| **平台管理员** | [平台概念](/guide/architecture) → [集群管理](/boss/rune-admin/clusters) → [资源池](/boss/rune-admin/resource-pools) → [大模型网关](/boss/gateway/) |
| **只想体验一下模型** | [快速开始](/guide/quick-start) 的「跑通第一个推理服务」 → [模型体验](/airouter/experience) |

## 开始之前

- 你需要一个账号。没有的话联系平台管理员，或在登录页自助注册，见[注册账号](/account/auth/register)。
- 你需要至少属于一个**租户**（可以理解成一家公司的独立空间）。如果登录后进不去，见[选择与注册租户](/account/auth/select-tenant)。
- 你需要在租户下有一个**工作空间**（可以理解成大楼里的一间办公室）。没有的话可以让租户管理员创建，或自己创建，见[工作空间](/rune/console/workspace)。

## 下一步

- [快速开始](/guide/quick-start)
- [平台概念](/guide/architecture)
- [术语表](/guide/glossary)
