---
title: '模型体验'
updated: '2026-09-12'
description: 'ChatApp 模型体验页的布局、模型选择、对话参数与流式对话机制。'
---

## 功能简介

模型体验（`/chatapp/experience`）是 ChatApp 的核心交互页，提供与已部署模型（经 LLM Gateway 暴露）的**实时流式对话**，支持 Markdown 渲染、深度思考、参数调整与 Token 用量统计。

## 页面布局

页面由三块组成（`chat.tsx`）：

| 区域 | 位置 | 宽度 | 说明 |
|------|------|------|------|
| **模型列表** | 左侧 `aside` | 264px，`md` 起显示 | 树形模型列表，含搜索框（模型数 > 5 时出现） |
| **对话区** | 中间主体 | 自适应 | 顶部信息栏 + 消息列表 + 底部输入框 |
| **模型信息 / 参数设置** | 右侧 `aside` | 300px，仅 `xl` 显示 | 模型信息与参数设置（含 API Key） |

> 💡 提示: 在小于 `xl` 的屏幕上，右侧面板隐藏，改为在对话区顶部显示 **API Key 选择** 与 **参数配置** 两个弹窗入口。

对话区顶部信息栏包含：当前模型 `id`、`provider · channel`、参数弹窗入口、API Key 选择，以及模型已选中时出现的 **新建对话** 按钮。

## 模型列表

模型列表按 **可见性 → 渠道 → 模型** 组织为可折叠的树（`model-list-panel.tsx`），可见性顺序为 `public` → `private` → `tenant`：

| 层级 | 说明 |
|------|------|
| 可见性分组 | 公开（`public`）/ 租户内（`tenant`）/ 个人（`private`） |
| 渠道分组 | 分组内按渠道名排序，显示该渠道下的模型数量 |
| 模型条目 | 显示模型 `id`（可一键复制）、类型标签、可见性标签，以及 `tenant / workspace` |

**过滤规则**：列表只展示对话类模型（`isChatModel`，`model-utils.ts:11-17`）。当模型带有 `metadata.type` 时视为可用；否则要求 `metadata.task` 为空或等于 `generate`，从而过滤掉 Embedding 等非对话模型。

**搜索**：按模型 `id`、`tenant`、`workspace`、`channel`、`provider` 关键字实时过滤。

> ⚠️ 注意: 模型列表为空时，页面会提示「暂无可用模型」，通常是当前租户/工作空间下未配置模型渠道。

## 对话参数

参数默认值定义在 `ChatView` 的 `params` 入参（`chat.tsx:59-77`），界面上的可调范围来自参数组件（`chat-params.tsx`）：

| 参数 | 字段 | 默认值 | 取值范围 | 步长 | 说明 |
|------|------|--------|----------|------|------|
| Temperature | `temperature` | `0.7` | 0 ~ 1.999 | 0.1 | 采样温度，越高越随机 |
| Top P | `topP` | `0.8` | 0.1 ~ 1.0 | 0.1 | 核采样概率阈值 |
| Max Tokens | `maxTokens` | `4096` | 0 ~ 32768 | 10 | 单次回复最大 Token 数 |
| System Prompt | `systemPrompt` | `""`（空） | 自由文本 | — | 系统提示词 |
| Stop | `stop` | `""`（空） | 自由文本 | — | 停止序列；为空时不提交 |

- **Temperature 与 Top P** 通常只调整其中一个，两者会叠加影响采样随机性。
- **Max Tokens** 设为 `0` 表示不限制（使用模型默认上限）。
- **Stop** 非空时会被包装为数组提交，例如 `stop: ["stop"]`；为空时提交 `stop: null`。

## 深度思考

对话输入框右侧有 **深度思考** 按钮，默认**开启**（`deepThinking = true`）。开启状态通过推理参数 `reasoning_effort` 传给模型：

| 界面状态 | 提交值 |
|----------|--------|
| 开启（默认） | `reasoning_effort: "high"` |
| 关闭 | `reasoning_effort: "none"` |

> ⚠️ 注意: `reasoning_effort` 的取值只有 `high` 与 `none` 两种，没有 `low` / `medium` 档位。

开启后，支持该能力的模型会在回复中返回 `reasoning_content`（推理过程，折叠展示）与正式回复内容两部分。深度思考会消耗更多 Token。

## 输入与消息

| 交互 | 行为 |
|------|------|
| 发送 | **Enter** |
| 换行 | **Shift + Enter** |
| 中文输入法 | IME 组合输入中的 Enter 不会触发发送 |
| 上传图片 | 点击图片上传图标选择图片，或直接粘贴剪贴板图片；以 `image_url` 内容块随消息提交 |
| 停止生成 | 生成中点击 **停止** 按钮，中断当前 SSE 连接，已生成内容保留 |

消息列表支持 Markdown 渲染、思考内容折叠、复制、重试；助手回复底部显示本次请求的 Token 用量（`prompt_tokens` / `completion_tokens` / `total_tokens`）。

## 错误提示

对话请求异常时，前端按上游返回的 `error.code` 映射为提示文案（`chat-error.ts`）：

| 错误码 | 说明 |
|--------|------|
| `rate_limit_exceeded` | 触发限流；`error.message` 命中下列原因时展示对应文案：`token_tpm_penalty`、`channel_tpm_penalty`、`token_tpm_insufficient`、`channel_tpm_insufficient`、`token_rpm_insufficient`、`channel_rpm_insufficient` |
| `policy_violation` | 内容审查/安全策略拦截 |
| `context_length_exceeded` | 上下文长度超限 |
| `invalid_api_key` | API Key 无效、过期或已删除 |
| `insufficient_quota` | 配额不足 |

此外，流式响应中的 `finish_reason` 为 `sensitive` 或 `content_filter` 时，页面会分别提示上游因敏感内容/内容过滤而中断。

> 💡 提示: 若上游响应里带有请求 ID（`request_id` / `requestId` / `id`），错误提示会追加上游请求 ID，便于排查。

## 请求细节

```text
POST /airouter-data/v1/chat/completions
Authorization: Bearer {token}
Accept: text/event-stream
X-Tenant / X-Workspace / X-Channel   # 非 ASCII 值做 URL 编码

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

若 URL 中带有 `model`（及可选 `channel_id`）查询参数，体验页会自动定位并选中对应模型（`chat.tsx:268-295`）；`new_chat` 参数会清空当前对话。

> 💡 提示: 体验页中调试好的参数组合可直接用于 API 集成，参数名与请求体完全一致。
