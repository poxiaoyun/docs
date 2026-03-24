---
title: 魔哈仓库
updated: '2026-03-24'
author: Rune Docs Team
description: 面向模型、数据集、镜像与 Space 协作的魔哈仓库用户文档，覆盖首页、仓库浏览、协作讨论、文件管理与设置发布。
tags:
  - moha
  - overview
---

# 魔哈仓库

魔哈仓库是平台内的 AI 资产协作中心，用于统一管理模型、数据集、镜像和 Space。它同时提供个人首页、组织空间、仓库详情、文件浏览、讨论协作与仓库设置能力，既能做资源发现，也能做团队协作。

## 当前产品信息架构

根据 `xiaoshi-rune-console` 前端实现，魔哈的主要用户入口包括：

| 模块 | 作用 | 典型入口 |
| --- | --- | --- |
| 首页与个人工作台 | 查看推荐资源、公告、访问令牌、我创建的资源和我收藏的资源 | `/docs/moha/home` |
| 模型仓库 | 浏览和维护模型资源 | `/docs/moha/models` |
| 数据集 | 浏览和维护数据集资源 | `/docs/moha/datasets` |
| 镜像仓库 | 管理镜像类资源 | `/docs/moha/images` |
| Space 工作空间 | 浏览和部署可交互应用类资源 | `/docs/moha/spaces` |
| 协作 | 查看概览、文件、讨论、标签与设置 | `/docs/moha/repository` |

## 典型使用流程

1. 登录魔哈首页，查看推荐资源和平台公告。
2. 进入个人或组织视图，定位自己要管理的模型、数据集、镜像或 Space。
3. 新建资源仓库，填写别名、描述、可见性与成员权限。
4. 在仓库详情中维护文件、发起讨论、更新 README 或配置成员。
5. 对 Space 资源可进一步执行部署，联动 Rune 做交付。

## 推荐阅读

- [快速开始](/docs/moha/quickstart)
- [首页与个人工作台](/docs/moha/home)
- [模型仓库](/docs/moha/models)
- [数据集](/docs/moha/datasets)
- [镜像仓库](/docs/moha/images)
- [Space 工作空间](/docs/moha/spaces)
- [协作](/docs/moha/repository)
