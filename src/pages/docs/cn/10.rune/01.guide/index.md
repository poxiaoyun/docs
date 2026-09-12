---
title: 开始使用
updated: '2026-09-12'
description: 从账号与工作空间准备，到基于模板创建第一个工作负载，再到把推理服务注册到网关。
tags:
  - rune
  - getting-started
---

# 开始使用

Rune 控制台里没有独立的「工作负载」概念，也没有命令行工具。所有可创建的对象都是 **Instance（实例）**，通过 `category`（也就是实例类型）区分推理、微调、开发环境、应用、实验和评测。实例的部署方式是统一的**模板 + 表单**：先选一个产品模板（Helm Chart），再按模板的 JSON Schema 动态生成表单填写参数。

本指南按下面三步介绍首次使用流程。

## 章节导航

1. [环境准备](./01.prerequisites)：确认账号、租户、集群、工作空间和配额
2. [创建工作负载](./02.workloads)：理解模板驱动部署模型并创建第一个实例
3. [推理托管](./03.inference)：把推理实例注册到网关对外提供服务

## 你需要的入口

| 入口 | 前端路径 | 说明 |
| --- | --- | --- |
| 应用市场 | `/rune/app-market` | 浏览全部可用模板 |
| 产品列表 | `/rune/products/:category` | 按类别查看可部署模板，`category` 取 `inference` / `tune` / `im` / `app` / `experiment` / `evaluation` |
| 实例列表 | `/rune/tenants/:tenant/clusters/:cluster/workspaces/:workspace/<category>s` | 查看已创建实例，如 `.../ims`、`.../inferences` |
| 仪表盘 | `/rune/dashboard` | 查看当前工作空间的资源与工作负载概览 |
