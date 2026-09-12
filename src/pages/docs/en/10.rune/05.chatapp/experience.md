---
title: 'Playground'
updated: '2026-09-12'
description: 'Layout, model selection, chat parameters and streaming mechanics of the ChatApp Experience page.'
---

## Overview

The Experience page (`/chatapp/experience`) is the core interactive page of ChatApp. It provides **real-time streaming chat** with models exposed through the LLM Gateway, with Markdown rendering, deep thinking, parameter tuning and token usage statistics.

## Page layout

The page has three areas (`chat.tsx`):

| Area | Position | Width | Description |
|------|----------|-------|-------------|
| **Model list** | Left `aside` | 264px, shown from `md` up | Tree of models, with a search box (appears when there are more than 5 models) |
| **Conversation** | Center | Fluid | Top info bar + message list + bottom input box |
| **Model info / parameters** | Right `aside` | 300px, `xl` only | Model information and parameter settings (including the API key) |

> 💡 **Tip**: Below `xl` the right panel is hidden and the top of the conversation area exposes two popover entries instead: **API key selection** and **parameter settings**.

The top info bar shows the current model `id`, `provider · channel`, a parameter popover entry, the API key selector, and a **New chat** button once a model is selected.

## Model list

The list is a collapsible tree ordered **visibility → channel → model** (`model-list-panel.tsx`); the visibility order is `public` → `private` → `tenant`:

| Level | Description |
|-------|-------------|
| Visibility group | Public (`public`) / Tenant (`tenant`) / Private (`private`) |
| Channel group | Sorted by channel name, showing the number of models in that channel |
| Model entry | Shows the model `id` (one-click copy), type tag, visibility tag, and `tenant / workspace` |

**Filtering**: only chat-capable models are listed (`isChatModel`, `model-utils.ts:11-17`). A model qualifies when `metadata.type` is present; otherwise `metadata.task` must be empty or equal to `generate`, which filters out non-chat models such as Embedding.

**Search**: filters live by model `id`, `tenant`, `workspace`, `channel` and `provider` keywords.

> ⚠️ **Note**: When the list is empty the page shows "no models available", which usually means no model channel is configured for the current tenant/workspace.

## Chat parameters

Defaults are defined in the `params` prop of `ChatView` (`chat.tsx:59-77`); the adjustable ranges come from the parameter component (`chat-params.tsx`):

| Parameter | Field | Default | Range | Step | Description |
|-----------|-------|---------|-------|------|-------------|
| Temperature | `temperature` | `0.7` | 0 ~ 1.999 | 0.1 | Sampling temperature; higher is more random |
| Top P | `topP` | `0.8` | 0.1 ~ 1.0 | 0.1 | Nucleus sampling threshold |
| Max Tokens | `maxTokens` | `4096` | 0 ~ 32768 | 10 | Maximum output tokens per reply |
| System Prompt | `systemPrompt` | `""` (empty) | Free text | — | System prompt |
| Stop | `stop` | `""` (empty) | Free text | — | Stop sequence; not submitted when empty |

- **Temperature and Top P** are usually adjusted one at a time; both affect sampling randomness.
- **Max Tokens** set to `0` means unlimited (the model default is used).
- **Stop** is wrapped into an array when non-empty, e.g. `stop: ["stop"]`; when empty the request sends `stop: null`.

## Deep thinking

The **Deep thinking** toggle sits next to the input box and is **on by default** (`deepThinking = true`). Its state is passed to the model through the `reasoning_effort` parameter:

| UI state | Submitted value |
|----------|-----------------|
| On (default) | `reasoning_effort: "high"` |
| Off | `reasoning_effort: "none"` |

> ⚠️ **Note**: `reasoning_effort` only accepts `high` and `none` — there is no `low` or `medium` level.

When enabled, models that support it return both a `reasoning_content` part (the reasoning trace, shown collapsed) and the final reply. Deep thinking consumes more tokens.

## Input and messages

| Interaction | Behaviour |
|-------------|-----------|
| Send | **Enter** |
| New line | **Shift + Enter** |
| IME input | Enter during IME composition does not send |
| Attach image | Use the image-upload icon or paste an image; submitted as an `image_url` content block |
| Stop generation | Click **Stop** while generating; the SSE connection is aborted and generated content is kept |

The message list supports Markdown rendering, collapsible reasoning content, copy and retry. The assistant reply footer shows the token usage of that request (`prompt_tokens` / `completion_tokens` / `total_tokens`).

## Error messages

When a chat request fails, the front end maps the upstream `error.code` to a message (`chat-error.ts`):

| Error code | Description |
|------------|-------------|
| `rate_limit_exceeded` | Rate limited; when `error.message` matches one of these reasons a specific message is shown: `token_tpm_penalty`, `channel_tpm_penalty`, `token_tpm_insufficient`, `channel_tpm_insufficient`, `token_rpm_insufficient`, `channel_rpm_insufficient` |
| `policy_violation` | Blocked by content moderation / safety policy |
| `context_length_exceeded` | Context length exceeded |
| `invalid_api_key` | API key is invalid, expired or deleted |
| `insufficient_quota` | Quota exhausted |

In addition, when the streaming `finish_reason` is `sensitive` or `content_filter`, the page reports that the upstream stopped the response due to sensitive content or content filtering.

> 💡 **Tip**: If the upstream response carries a request ID (`request_id` / `requestId` / `id`), the error message appends it to help with troubleshooting.

## Request details

```text
POST /airouter-data/v1/chat/completions
Authorization: Bearer {token}
Accept: text/event-stream
X-Tenant / X-Workspace / X-Channel   # non-ASCII values are URL-encoded

{
  "messages": [...],
  "stream": true,
  "model": "<model id>",
  "temperature": 0.7,
  "max_tokens": 4096,
  "top_p": 0.8,
  "reasoning_effort": "high",
  "stop": null
}
```

If the URL carries a `model` query parameter (and optionally `channel_id`), the Experience page selects that model automatically (`chat.tsx:268-295`); a `new_chat` parameter clears the current conversation.

> 💡 **Tip**: A parameter combination tuned here can be used directly for API integration — the parameter names match the request body exactly.
