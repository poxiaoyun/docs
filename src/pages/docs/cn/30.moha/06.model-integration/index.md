---
title: 模型接入流程
updated: '2025-12-05'
author: Rune Docs Team
description: 概览模型接入的步骤。
tags:
  - moha
  - integration
---
## 模型接入

将魔哈仓库中的模型接入到实际应用中。

## 接入方式

### 推理服务部署

通过 Rune 平台部署模型推理服务，获得 API 端点：

1. 在魔哈仓库中选择模型
2. 通过应用市场部署推理引擎（如 vLLM、TGI）
3. 配置模型路径指向魔哈仓库
4. 部署完成后获得推理 API 端点

### 直接加载

在开发环境中直接从仓库加载模型：

```python
# 配置魔哈仓库地址
import os
os.environ["HF_ENDPOINT"] = "https://moha.your-domain"

# 使用 transformers 加载
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("ai-lab/qwen2-7b")
tokenizer = AutoTokenizer.from_pretrained("ai-lab/qwen2-7b")
```

### LLM 网关接入

将推理服务注册到 LLM 网关，通过统一 API 访问：

1. 部署推理服务
2. 在 BOSS → LLM 网关 → 服务注册 中添加
3. 通过网关 API 统一调用

## 相关文档

- [推理服务部署](/docs/cn/10.rune/inference)
- [LLM 网关](/docs/cn/20.boss/02.gateway/)
- [SDK 教程](../07.sdk-tutorial/)
