---
title: 应用市场
updated: '2026-09-12'
description: 应用市场的模板浏览、分类 Tab、搜索、推荐轮播与一键部署。
tags:
  - rune
  - console
---

# 应用市场

应用市场（App Market）是 Rune 的模板中心，提供覆盖推理、微调、开发环境、实验、应用等场景的产品模板。用户可以浏览、搜索、查看模板详情与版本，并一键跳转到部署页面。

路径：`/rune/app-market`

## 浏览模板

应用市场使用产品列表组件展示模板。

### 模板卡片

每张卡片展示模板的图标、名称、简介、分类与版本等信息，卡片网格根据窗口宽度自适应排列。

### 分类 Tab

页面顶部提供分类 Tab（`FilterTabs`），每个 Tab 带数量统计，取值来自模板分类配置：

| 类别标识 | 说明 |
| --- | --- |
| `inference` | 推理部署模板 |
| `tune` | 微调训练模板 |
| `im` | 交互式开发环境模板 |
| `experiment` | 实验跟踪模板 |
| `app` | 通用应用模板 |

> ⚠️ 注意: 开发环境的类别标识是 `im`，不是 `devenv`。

### 关键字搜索

搜索框对模板名称与描述做模糊搜索，内置 **500ms 防抖**（`useDebounce(searchQuery, 500)`，见 `src/business/components/product/list-view.tsx`）。

> ⚠️ 注意: 当前应用市场**没有按语言 / 框架 / 操作系统 / 工具等标签筛选**的能力。旧版本文档中的「标签筛选」已删除；定位模板请使用「分类 Tab + 关键字搜索」，或进入详情页查看 README。

### 推荐轮播与分页

- 页面顶部有一条**推荐产品轮播**（`RecommendedProducts`），按推荐优先级与时间排序，每 10 秒自动切换，鼠标悬停显示左右切换按钮。
- 列表下方提供**分页**控件；工具栏提供**刷新**按钮。

## 模板详情

点击模板卡片进入详情页（`/rune/app-market/:product`），采用产品详情布局，包含：

| 区域 | 内容 |
| --- | --- |
| 介绍 / 说明 Tab | `introduction` 与 `note` 两个 Tab |
| 产品信息卡片 | 名称、描述、分类、创建时间 |
| 版本选择 | 通过版本弹层切换版本 |
| 部署入口 | 详情页右上角的部署按钮 |

## 一键部署

1. 在模板详情页选择版本后点击「部署」。
2. 前端携带 `action=deploy`、产品 ID（`product`）与版本号（`version`）跳转到对应类别的实例列表路径（进入工作空间上下文后为 `.../clusters/:cluster/workspaces/:workspace/<category>s?action=deploy`，由该路由渲染部署表单）：
   - `inference` → `/rune/tenants/:tenant/inferences?action=deploy&product=<id>&version=<version>`
   - `tune` → `/rune/tenants/:tenant/tunes?action=deploy&product=<id>&version=<version>`
   - `im` → `/rune/tenants/:tenant/ims?action=deploy&product=<id>&version=<version>`
   - `experiment` → `/rune/tenants/:tenant/experiments?action=deploy&product=<id>&version=<version>`
   - `app` → `/rune/tenants/:tenant/apps?action=deploy&product=<id>&version=<version>`
3. 部署表单根据该版本 Schema 渲染参数，填写基本信息与参数后提交。

> 💡 提示: 部署表单只有 `id` / `name` / `description` 三个固定字段，其余参数全部由所选版本的 Schema 决定。

## 权限要求

应用市场属于仪表盘分组，可在工作空间上下文中浏览；实际部署动作受所选模板类别对应的模块权限约束。
