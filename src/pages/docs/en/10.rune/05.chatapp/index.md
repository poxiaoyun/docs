---
title: 'ChatApp Intelligent Conversation'
updated: '2025-12-04'
author: Rune Docs Team
description: 'Function overview and usage guide of the ChatApp intelligent conversation platform.'
tags:
 - rune
 - chatapp
---
# ChatApp Overview

## Introduction

ChatApp is the **LLM Playground** (large language model playground) built into the Rune Console, providing developers and business users with a one-stop AI large model interaction experience. Through ChatApp, you can directly conduct real-time conversations, parameter debugging, and multi-model horizontal comparison with various large language models deployed on the platform, and integrate capabilities into external applications through the API Key mechanism.

The bottom layer of ChatApp is connected to the **LLM Gateway (AI Router)** service. All requests are routed and controlled through a unified OpenAI compatible API endpoint. It supports enterprise-level features such as streaming output (SSE), rate limiting, content review, and multi-channel distribution.

![ChatApp Overview](/screenshots/console/chatapp-overview.png)

## Enter path

Console Homepage → Click on the **ChatApp** card, or via the top navigation bar → **ChatApp**

## Core concepts

### OpenAI compatible API

All ChatApp conversation requests are completed through the OpenAI-compatible Chat Completions endpoint:

```
POST /airouter-data/v1/chat/completions
```

The request and response formats are completely consistent with the OpenAI API, supporting both streaming (`stream: true`) and non-streaming modes. This means you can use any OpenAI SDK-compatible client to interact with platform models.

### Model Visibility

Models on the platform are divided into three categories based on visibility:

| Visibility | Description |
|--------|------|
| **Public** | Common model available to all tenants |
| **Tenant** | Models visible only within the current tenant |
| **Private** | Models visible only within a specific workspace |

### LLM Gateway Service

ChatApp routes requests through LLM Gateway, which provides the following core capabilities:

- **Channel Management**: unified access to multiple model providers
- **Rate Limit**: Limit current flow based on Token (TPM) and number of requests (RPM) dimensions
- **Content Moderation**: Policy-based request/response moderation
- **Audit Log**: Complete request link tracing

## Function module

| Module | Entry | Description |
|------|------|------|
| [AI conversation experience](./experience.md) | ChatApp → Conversation experience | Real-time conversation with the model, supporting in-depth thinking, parameter tuning and Markdown rendering |
| [Conversation debugging](./debug.md) | ChatApp → Debugging | Left and right column layout, real-time adjustment of parameters and observation of model output changes |
| [Multi-model comparison](./compare.md) | ChatApp → Comparison | Symmetrical double-column layout, sending the same message to two models at the same time for comparison |
| [API Key Management](./token.md) | ChatApp → Token Management | Create and manage ChatApp API access tokens, configure current limiting and IP whitelisting |

## Typical workflow

```mermaid
graph TD
 Start["开始使用 ChatApp"] --> SelectModel["选择模型"]
 SelectModel --> Experience["对话体验<br/>快速验证模型能力"]
 Experience --> NeedTune{"需要调优?"}
 NeedTune -- 是 --> Debug["调试模式<br/>调整参数观察效果"]
 Debug --> NeedCompare{"需要对比?"}
 NeedTune -- 否 --> NeedCompare
 NeedCompare -- 是 --> Compare["对比模式<br/>两个模型同时对话"]
 NeedCompare -- 否 --> Integrate{"需要 API 集成?"}
 Compare --> Integrate
 Integrate -- 是 --> Token["创建 API Key<br/>获取访问凭证"]
 Token --> API["通过 API 调用<br/>集成到外部应用"]
 Integrate -- 否 --> End["完成"]
 API --> End
```

## Request flow structure

```mermaid
sequenceDiagram
 participant User as 用户/ChatApp
 participant Gateway as LLM Gateway
 participant Channel as 渠道路由
 participant Model as 模型服务

 User->>Gateway: POST /v1/chat/completions
 Note over User,Gateway: Headers: Authorization, X-Tenant, X-Workspace, X-Channel
 Gateway->>Gateway: 鉴权 & 限流检查
 Gateway->>Channel: 路由到目标渠道
 Channel->>Model: 转发请求
 Model-->>Channel: SSE 流式响应
 Channel-->>Gateway: 转发流式数据
 Gateway-->>User: SSE: data: {"choices":[{"delta":{"content":"..."}}]}
```

:::tip
All conversation parameters and model selection experience in ChatApp can be directly applied to API integration, and the parameter names and value ranges are exactly the same.
:::

:::warning
Before using ChatApp, make sure there are model channels available under the current tenant/workspace, otherwise the model list will be empty. If you need to configure channels, please contact the platform administrator to add them in [Gateway Management](../boss/gateway/channels.md) in the Boss backend.
:::

## Quick start

1. Enter ChatApp → **Conversation Experience**
2. Select an available model from the top model selector
3. Enter your question in the input box and press **Enter** to send
4. View the model’s streaming responses
5. As needed, switch to **Debug** or **Compare** mode to evaluate the model in depth
6. For API integration, go to **Token Management** to create an access key