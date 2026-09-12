---
title: 协作
updated: '2026-09-12'
description: 介绍魔哈中模型、数据集、镜像和 Space 的统一仓库详情页。
tags:
  - moha
  - repository
---

# 协作

模型、数据集、镜像和 Space 虽然资源类型不同，但在魔哈中共享统一的仓库详情框架。用户进入任一仓库后，都会围绕概览、文件、冻结、讨论、标签与设置开展协作。

## 统一标签页

根据资源类型不同，详情页会显示以下标签中的一部分：

| 标签 | `value` | 适用范围 | 说明 |
| --- | --- | --- | --- |
| 概览 / 卡片 | `content` | 全部资源 | 查看 README 与右侧信息区块 |
| 文件 | `file` | 模型、数据集、Space | 浏览文件树、预览文件、查看提交记录，并切换分支/冻结 |
| 版本冻结 | `freezes` | 模型、数据集、Space | 创建冻结快照、对比差异与回滚 |
| 标签 | `tags` | 镜像 | 查看镜像标签与安全扫描结果 |
| 讨论 | `discussion` | 模型、数据集、Space（镜像不支持） | 发起讨论、问题或 Pull Request 协作 |
| 设置 | `setting` | 具备权限的成员 | 修改可见性、别名、成员、元数据和删除仓库 |

## 推荐阅读

- [仓库详情页结构](/moha/repository/detail)
- [文件浏览与版本查看](/moha/repository/files)
- [版本冻结](/moha/repository/freezes)
- [讨论与协作](/moha/repository/discussion)
- [仓库设置与发布](/moha/repository/settings)
