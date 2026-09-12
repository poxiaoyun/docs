---
title: SDK 教程
updated: '2026-09-12'
author: Rune Docs Team
description: SDK 与 CLI 教程目录：从安装、认证到命令参考。
tags:
  - moha
  - sdk
---

# SDK 教程

这里教你在终端和 Python 代码里操作魔哈仓库，不打开网页也能上传、下载、管理模型和数据集。
如果你完全没接触过，先看 **5 分钟快速开始**，跑通第一条命令再回头看其他章节。

## 入门

| 章节 | 这页帮你做什么 |
| --- | --- |
| [5 分钟快速开始](./quick-start) | 装好工具后，用三条命令跑通登录、下载、上传 |
| [SDK 介绍](./intro) | 搞清楚这套工具由什么组成、能做什么 |
| [安装与环境配置](./install) | 装好 `moha` 命令并确认安装成功 |
| [认证与令牌管理](./authentication) | 拿到令牌、登录，以及令牌存哪、怎么换 |

## 工具参考

| 章节 | 这页帮你做什么 |
| --- | --- |
| [CLI 工具完整参考](./cli-reference) | 查 `moha` 每个子命令的用法和参数 |
| [HubClient API](./hub-api) | 在 Python 代码里调用上传、下载、仓库管理 |

## 工作流

| 章节 | 这页帮你做什么 |
| --- | --- |
| [模型加载与推理](./transformers-datasets) | 用 Transformers / Datasets 直接加载平台上的模型和数据集 |
| [模型训练与导出](./training-export) | 微调、LoRA、评测与导出 ONNX / TorchScript |

## 进阶

| 章节 | 这页帮你做什么 |
| --- | --- |
| [上传下载与同步](./transfer) | 用过滤规则精确控制传哪些文件、怎么提速 |
| [数据加密](./encryption) | 上传时给大模型文件加密 |
| [错误处理与 FAQ](./error-handling) | 看懂报错，知道下一步怎么办 |
