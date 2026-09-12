---
title: 'Parameter Tuning'
updated: '2026-09-12'
description: 'Entry points, fields and ranges of the ChatApp parameter popover (ChatParamsPopover).'
---

## Note: this is not a standalone page

ChatApp has **no standalone "Debug" page**, and the top navigation has no such entry. What used to be called "parameter debugging" is really **the parameter popover at the top of the Experience page (and the Comparison page)** — `ChatParamsPopover` (`src/pages/chatapp/components/chat-params-popover.tsx`), which renders the parameter form `ChatParams` (`chat-params.tsx`).

| Fact | Evidence |
|------|----------|
| The top navigation has 5 items and no `debug` | `layout.tsx:24-50` |
| There is no `/chatapp/debug` route | `routes/paths.ts:71-85` — `paths.chatapp` only contains experience / marketplace / contrast / analysis / docs / token |
| Parameter popover components | `components/chat-params-popover.tsx`, `components/chat-params.tsx` |

> ⚠️ **Note**: This page exists to keep the URL `/rune/chatapp/debug` alive; it documents the parameter popover, not a standalone page.

## How to open it

| Page | Entry | Evidence |
|------|-------|----------|
| **Experience** | The **parameter settings** icon in the top info bar (a popover below `xl`; the right-hand "parameters" panel at `xl` and above) | `chat.tsx:602-614`, `components/model-inspector-panel.tsx:184` |
| **Comparison** | A parameter icon in each column header; the two sides are independent | `contrast.tsx:582,632` |

The popover is an overlay: click the icon to open it and click outside to close. Edits are written back to the parent state **immediately** and take effect on the next message; already-sent messages are unaffected.

## Available fields

| Field | Control | Default | Range | Step |
|-------|---------|---------|-------|------|
| **System** (`systemPrompt`) | Multiline text area | `""` (empty) | Free text | — |
| **Top P** (`topP`) | Slider + number input | `0.8` | 0.1 ~ 1.0 | 0.1 |
| **Temperature** (`temperature`) | Slider + number input | `0.7` | 0 ~ 1.999 | 0.1 |
| **Max Tokens** (`maxTokens`) | Slider + number input | `4096` | 0 ~ 32768 | 10 |
| **Stop** (`stop`) | Multiline text area | `""` (empty) | Free text | — |

- When System or Stop is non-empty a clear button appears on the right.
- The number inputs reject scientific notation (`e`/`E`/`+`/`-`/`.`).
- `Max Tokens = 0` means unlimited.

> 💡 **Tip**: On the same page (Experience or Comparison) the two entry points — the top popover and the right-hand panel at `xl` — are bound to the same parameter state, so editing one updates the other.

## How parameters reach the request

The parameters are written into the Chat Completions request body (`chat.tsx:159-173`):

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

| UI field | Request field | Note |
|----------|---------------|------|
| System | `messages[0]` (`role: "system"`) | Inserted only when non-empty |
| Temperature | `temperature` | |
| Top P | `top_p` | |
| Max Tokens | `max_tokens` | |
| Stop | `stop` | `["<value>"]` when non-empty, `null` when empty |

## Tuning suggestions

| Scenario | Suggestion |
|----------|-----------|
| Factual Q&A / FAQ | Low Temperature (0.1 ~ 0.3) and a moderately lower Top P |
| Code generation | Temperature 0.2 ~ 0.4, with a System Prompt specifying language and style |
| Creative writing / brainstorming | Temperature 0.8 ~ 1.2 |
| Output truncated | Increase Max Tokens |
| Reproducing upstream output | Use `stop` to set a stop sequence, or inspect the usage log on the token detail page |

> ⚠️ **Note**: The ranges here match the back-end contract, but how much each model actually honours these parameters is decided by the upstream channel; the front end adds no further constraint, so this documentation cannot confirm the behaviour of every model.
