---
title: Space 工作空间
updated: '2026-09-12'
description: 介绍魔哈中的 Space 列表、筛选、详情、生命周期与部署入口。
tags:
  - moha
  - spaces
---

# Space 工作空间

Space 用于承载可交互的应用或演示界面，是魔哈中最接近“可运行产物”的资源类型。

## 进入路径

魔哈顶部导航 -> Space

路径：`/moha/spaces`

## 核心能力

| 能力 | 说明 |
| --- | --- |
| 列表筛选 | 精选推荐区、公开/私有/内部切换、搜索、排序，以及 `domain` / `scene` 分类筛选 |
| 仓库详情 | 查看概览、文件、版本冻结、讨论和设置 |
| 部署入口 | 在设置页为 Space 配置部署参数，保存后自动重启 |
| 生命周期 | 未部署时可「上线」，已部署时可「停止 / 重启 / 查看日志」 |
| 团队协作 | 通过成员、讨论和文件变更实现协作 |

## 创建 Space

创建表单除基础信息（组织、名称、可见性、描述、`license`、`domain`、`scene`）外，还需要部署配置 `spaceMetadata`：

| 字段 | 说明 |
| --- | --- |
| `cluster` | 部署到哪个集群 |
| `namespace` | 命名空间 |
| `flavorID` | 运行规格 |
| `product` | 产品模板（`{ id, name }`） |
| `gitAddress` | 代码仓库地址（默认指向本仓库） |
| `gitUsername` / `gitPassword` | 拉取代码的凭据（默认取当前用户与访问令牌） |
| `baseDomain` | 基础域名 |
| `env` | 运行时环境变量 |

> 💡 提示: Space 仓库详情页没有「标签」标签，标签能力用于镜像仓库。

## 推荐阅读

- [Space 列表与筛选](/moha/spaces/list)
- [协作](/moha/repository)
- [版本冻结](/moha/repository/freezes)
