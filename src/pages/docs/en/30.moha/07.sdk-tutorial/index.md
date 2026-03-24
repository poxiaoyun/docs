---
title: 'SDK Tutorial'
updated: '2026-03-24'
author: Rune Docs Team
description: 'Moha SDK tutorials and API reference covering CLI, Python SDK, and Transformers/Datasets integration.'
tags:
  - moha
  - sdk
---
## SDK Tutorial

Moha SDK provides a complete command line tool and Python API to facilitate interaction with the Moha warehouse - including uploading and downloading of models/data sets, certification management, encrypted transmission, etc.

### getting Started

| Chapter | Description |
|------|------|
| [Quick Start](./quick-start) | Complete installation, login, download, and upload in 5 minutes |
| [SDK Overview](./intro) | Compatibility instructions and environment configuration |
| [Installation and environment configuration](./install) | Installation method, dependency requirements, environment variables |
| [Authentication and Token Management](./authentication) | Token, username/password, persistence management |

### Tool Reference

| Chapter | Description |
|------|------|
| [CLI tool reference](./cli-reference) | `moha` command line complete command reference |
| [HubClient API](./hub-api) | Detailed explanation of Python SDK core class API |

### Workflow

| Chapter | Description |
|------|------|
| [Model loading and inference](./transformers-datasets) | Transformers/Datasets integration, Pipeline, multi-GPU |
| [Model training and export](./training-export) | Fine-tuning, LoRA, evaluation, export ONNX/TorchScript |

### Advanced

| Chapter | Description |
|------|------|
| [Upload, download and synchronization](./transfer) | File filtering, batch operations, performance optimization |
| [Data encryption](./encryption) | AES/SM4 encrypted upload, automatic decryption, KMS |
| [Error handling and FAQ](./error-handling) | Exception types, retry mechanism, FAQ |