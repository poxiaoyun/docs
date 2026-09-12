---
title: 'Model access process'
updated: '2025-12-05'
author: Rune Docs Team
description: 'Overview of the steps for model access.'
tags:
  - moha
  - integration
---
## Model access

Integrate the models in the Moha warehouse into practical applications.

## Access method

### Deployment of inference service

Deploy the model inference service through the Rune platform and obtain the API endpoint:

1. Select the model in the Moha warehouse
2. Deploy inference engines (such as vLLM, TGI) through the application market
3. Configure the model path to point to the Moha warehouse
4. Obtain the inference API endpoint after deployment is completed

### Direct loading

Load the model directly from the repository in the development environment:

```python
# 配置魔哈仓库地址
import os
os.environ["HF_ENDPOINT"] = "https://moha.your-domain"

# 使用 transformers 加载
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("ai-lab/qwen2-7b")
tokenizer = AutoTokenizer.from_pretrained("ai-lab/qwen2-7b")
```

### LLM gateway access

Register the inference service with the LLM gateway and access it through the unified API:

1. Deploy the inference service
2. Add in BOSS → LLM Gateway → Service Registration
3. Unified call through gateway API

## Related documents

- [Inference service deployment](../10.rune/inference)
- [LLM Gateway](../20.boss/02.gateway/)
- [SDK Tutorial](../sdk-tutorial/)