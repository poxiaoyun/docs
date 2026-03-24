---
title: Kubernetes 资源浏览
updated: '2026-03-24'
author: Rune Docs Team
description: 介绍 Boss 中集群级 Kubernetes 资源浏览器的标签页和适用场景。
tags:
  - boss
  - rune-admin
  - kubernetes
---

# Kubernetes 资源浏览

Boss 为集群详情页提供了统一的 Kubernetes 资源浏览入口，便于管理员直接查看集群中的核心对象。

## 进入路径

Boss -> Rune 智算管理 -> 集群管理 -> 选择集群 -> 资源浏览

## 支持的资源标签

当前前端内置了以下资源类型标签：

- Pods
- Nodes
- Deployments
- StatefulSets
- DaemonSets
- Jobs
- CronJobs
- Services
- Ingresses
- IngressClasses
- StorageClasses
- ConfigMaps
- Secrets
- PersistentVolumeClaims

## 页面能力

| 能力 | 说明 |
| --- | --- |
| 标签切换 | 在不同资源类型间切换，快速查看对象列表 |
| 列表展示 | 按资源定义展示状态、名称、命名空间等字段 |
| 资源动作 | 部分资源支持查看详情或执行额外操作 |
| 节点扩展动作 | 在 Node 页签下可结合节点运维动作做进一步处理 |

## 适用场景

- 排查某类 Kubernetes 对象是否成功创建。
- 检查命名空间中的 Service、Ingress、PVC 等关联资源。
- 配合集群日志、事件和监控页做交叉排查。

> 💡 提示: 资源浏览适合做“对象视角”的排查；如果你关注的是容量、负载或性能，更适合先看总览、节点或 GPU 仪表盘。
