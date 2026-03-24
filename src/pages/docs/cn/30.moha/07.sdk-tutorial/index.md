---
title: SDK 教程
updated: '2026-03-24'
author: Rune Docs Team
description: Moha SDK 教程与 API 参考，涵盖 CLI、Python SDK 和 Transformers/Datasets 集成。
tags:
  - moha
  - sdk
---

## SDK 教程

Moha SDK 提供完整的命令行工具和 Python API，方便与魔哈仓库进行交互——包括模型/数据集的上传下载、认证管理、加密传输等。

### 入门

| 章节 | 说明 |
|------|------|
| [快速开始](./quick-start) | 5 分钟完成安装、登录、下载、上传 |
| [SDK 概述](./intro) | 兼容性说明与环境配置 |
| [安装与环境配置](./install) | 安装方式、依赖要求、环境变量 |
| [认证与 Token 管理](./authentication) | Token、用户名/密码、持久化管理 |

### 工具参考

| 章节 | 说明 |
|------|------|
| [CLI 工具参考](./cli-reference) | `moha` 命令行完整命令参考 |
| [HubClient API](./hub-api) | Python SDK 核心类 API 详解 |

### 工作流

| 章节 | 说明 |
|------|------|
| [模型加载与推理](./transformers-datasets) | Transformers/Datasets 集成、Pipeline、多 GPU |
| [模型训练与导出](./training-export) | 微调、LoRA、评测、导出 ONNX/TorchScript |

### 进阶

| 章节 | 说明 |
|------|------|
| [上传下载与同步](./transfer) | 文件过滤、批量操作、性能优化 |
| [数据加密](./encryption) | AES/SM4 加密上传、自动解密、KMS |
| [错误处理与 FAQ](./error-handling) | 异常类型、重试机制、常见问题 |
