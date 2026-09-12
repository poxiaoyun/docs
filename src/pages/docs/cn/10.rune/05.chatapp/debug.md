---
title: '参数调优'
updated: '2026-09-12'
description: 'ChatApp 参数弹窗（ChatParamsPopover）的入口、字段与取值范围。'
---

## 说明：这不是一个独立页面

ChatApp **没有独立的「调试」页面**，顶部导航里也不存在该入口。所谓「参数调试」实际是**模型体验页（以及模型对比页）顶部的参数弹窗** —— `ChatParamsPopover`（`src/pages/chatapp/components/chat-params-popover.tsx`），内部渲染参数表单 `ChatParams`（`chat-params.tsx`）。

| 事实 | 依据 |
|------|------|
| 顶部导航只有 5 项，无 `debug` | `layout.tsx:24-50` |
| 不存在 `/chatapp/debug` 路由 | `routes/paths.ts:71-85` 的 `paths.chatapp` 只有 experience / marketplace / contrast / analysis / docs / token |
| 参数弹窗组件 | `components/chat-params-popover.tsx`、`components/chat-params.tsx` |

> ⚠️ 注意: 本文档为保留 URL `/rune/chatapp/debug` 而存在，内容描述的是参数弹窗，而非一个独立页面。

## 打开方式

| 页面 | 入口 | 依据 |
|------|------|------|
| **模型体验** | 顶部信息栏的**参数配置**图标（小屏为弹窗入口；`xl` 及以上为右侧「参数设置」面板） | `chat.tsx:602-614`、`components/model-inspector-panel.tsx:184` |
| **模型对比** | 左、右两侧顶栏各自的参数图标，两侧参数相互独立 | `contrast.tsx:582,632` |

弹窗为浮层，点击图标弹出、点击外部关闭；修改参数后**实时写回**上层状态，下一次发送消息时生效，不影响已发送的消息。

## 可配置字段

| 字段 | 控件 | 默认值 | 取值范围 | 步长 |
|------|------|--------|----------|------|
| **System**（`systemPrompt`） | 多行文本域 | `""`（空） | 自由文本 | — |
| **Top P**（`topP`） | 滑块 + 数字输入 | `0.8` | 0.1 ~ 1.0 | 0.1 |
| **Temperature**（`temperature`） | 滑块 + 数字输入 | `0.7` | 0 ~ 1.999 | 0.1 |
| **Max Tokens**（`maxTokens`） | 滑块 + 数字输入 | `4096` | 0 ~ 32768 | 10 |
| **Stop**（`stop`） | 多行文本域 | `""`（空） | 自由文本 | — |

- System 与 Stop 非空时右侧出现清除按钮，可一键清空。
- 数字输入框禁止科学计数法（`e`/`E`/`+`/`-`/`.`）。
- Max Tokens 为 `0` 表示不限制。

> 💡 提示: 在同一页面（体验或对比）中，两处参数入口（顶部弹窗与 `xl` 下的右侧面板）绑定的是同一份参数状态，改一处另一处同步。

## 参数如何进入请求

参数最终写入 Chat Completions 请求体（`chat.tsx:159-173`）：

```json
{
  "messages": [ ... ],
  "stream": true,
  "model": "<model id>",
  "temperature": 0.7,
  "max_tokens": 4096,
  "top_p": 0.8,
  "reasoning_effort": "high",
  "stop": null
}
```

| 界面字段 | 请求字段 | 备注 |
|----------|----------|------|
| System | `messages[0]`（`role: "system"`） | 仅当非空时插入 |
| Temperature | `temperature` | |
| Top P | `top_p` | |
| Max Tokens | `max_tokens` | |
| Stop | `stop` | 非空时为 `["<内容>"]`，为空时为 `null` |

## 调参建议

| 场景 | 建议 |
|------|------|
| 事实性问答 / FAQ | 低 Temperature（0.1 ~ 0.3），Top P 适当降低 |
| 代码生成 | Temperature 0.2 ~ 0.4，配合 System Prompt 指定语言与风格 |
| 创意写作 / 头脑风暴 | Temperature 0.8 ~ 1.2 |
| 输出被截断 | 增大 Max Tokens |
| 复现上游返回 | 通过 `stop` 指定停止序列，或在 Token 详情页查看使用日志 |

> ⚠️ 注意: 参数弹窗中的取值与后端契约一致，但各模型对参数的**实际支持程度**由上游渠道决定；前端不做额外约束，文档无法逐一确认每个模型的行为。
