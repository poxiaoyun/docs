---
title: Rune 智算管理
updated: '2026-09-12'
description: Boss 平台对 Rune 智算资源的运维管理——集群、资源池、算力规格、产品模板等。
tags:
  - boss
  - rune-admin
---

## 概述

Rune 智算管理是 Boss 运营平台中用于维护 Rune 智算平台基础设施的模块。管理员可以在此接入并管理 GPU/CPU 集群、划分资源池与租户配额、维护算力规格、管理系统级应用与产品模板。

## 章节导航

| 模块 | 说明 |
|------|------|
| [集群管理](/boss/rune-admin/clusters) | 接入并管理 K8s 计算集群 |
| [集群总览](/boss/rune-admin/cluster-overview) | 查看单个集群的容量、用量与状态 |
| [动态仪表盘](/boss/rune-admin/dynamic-dashboard) | 用 YAML 定义集群监控面板 |
| [节点与 GPU 仪表盘](/boss/rune-admin/nodes-gpu) | 查看节点状态与加速卡信息 |
| [Kubernetes 资源浏览](/boss/rune-admin/resources) | 浏览集群内的工作负载与 K8s 资源 |
| [资源池管理](/boss/rune-admin/resource-pools) | 在集群中划分资源池，关联节点 |
| [存储与运行时服务](/boss/rune-admin/storage-runtime) | 管理存储集群与运行时组件 |
| [监控、日志与调度](/boss/rune-admin/observability) | 可观测性、日志与调度器管理 |
| [规格管理（管理员）](/boss/rune-admin/flavors) | 定义和维护可选的算力规格模板 |
| [租户资源管理](/boss/rune-admin/tenants) | 为租户分配资源池及 GPU/CPU 配额 |
| [产品模板管理](/boss/rune-admin/templates) | 维护用户域与系统域的产品模板 |
| [系统模板市场](/boss/rune-admin/system-market) | 从系统域模板部署集群系统应用 |
| [系统实例管理](/boss/rune-admin/systems) | 管理集群级系统应用实例 |
