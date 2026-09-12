---
title: 'AI Diagnostics Assistant'
updated: '2026-09-12'
description: 'The floating AI diagnostics assistant in the Rune console: toggle, model selection, @-mentioning instances, and the SSE streaming diagnosis flow.'
tags:
  - rune
  - console
  - diagnostics
---

# AI Diagnostics Assistant

The AI Diagnostics Assistant (`RuneAIDiagnosticsAssistant`) is a floating assistant provided by the Rune console, used to run diagnostics against the resource context of the current workspace when troubleshooting an instance.

## Entry and Display Conditions

The assistant is not a standalone page; it is a floating component mounted on the workspace layout (`RuneAIDiagnosticsAssistant` in `src/routes/sections/rune.tsx`). It renders a draggable vertical tab on the right side of the page and expands into a drawer when clicked.

It is shown only when all of the following hold:

| Condition | Description |
| --- | --- |
| Feature toggle is on | The global setting `aiDiagnostics.enabled` is true |
| Tenant / cluster / workspace are all resolved | All three resolve to valid IDs |
| The current workspace is not empty | `workspaceContext.isEmpty` is false |

If any condition is not met, the assistant is not rendered.

### Toggle and Appearance

| Setting | Description | Default |
| --- | --- | --- |
| `aiDiagnostics.enabled` | Whether the assistant is enabled | — |
| `aiDiagnostics.name` | Assistant display name | `晓石 AI助手` |
| `aiDiagnostics.avatar` | Assistant avatar | empty |

The settings can come from both local and remote global settings (remote takes precedence).

## Panel Capabilities

### Model Dropdown

The bottom of the panel provides a model selection dropdown whose candidates come from `GET /api/cloud/diagnostics/models`; after loading, the first model is selected by default.

### @-Mentioning Instances

On pages that correspond to the current instance category (`/inferences`, `/apps`, `/tunes`, `/ims`, `/experiments`, `/evaluations`), the assistant infers the `category` from the path and fetches the instance list for that category (`GET .../diagnostics/resources`). In the input box, `@` opens a candidate list:

1. Type `@` and continue typing a keyword to filter instances.
2. After selecting, it inserts `@instance-name ` into the input box and adds the instance to the resource reference list for this request.
3. Resource references are sent with the request (`resourceRefs`) and cleared after sending.

### Streaming Diagnosis Flow

After you send a question, the assistant receives a streaming response over SSE:

- Request: `POST /api/cloud/tenants/:tenant/clusters/:cluster/workspaces/:workspace/diagnostics/chat`, with a payload containing `ask`, `model`, `stream: true`, `resourceRefs`, and the conversation history.
- Streaming rendering: the answer and reasoning content are displayed incrementally, and generation can be stopped midway.
- Phase hints: the stream events show diagnosis phases, currently including:

| Phase | Meaning (i18n text) |
| --- | --- |
| `fetch_skill` | Load diagnostics skill |
| `collect_data` | Collect Rune diagnostics data |
| `update_plan` | Update diagnostics phases |

### Other Interactions

| Interaction | Description |
| --- | --- |
| Clear conversation | Button in the panel header |
| Close | Button in the panel header |
| Quick prompts | The empty state provides several prompt cards and suggested questions; clicking sends them |
| Drag | The right-side vertical tab can be dragged up and down, constrained to the visible area |

## Related Pages

- [Run Logs](/rune/console/logging)
- [Inference Services](/rune/console/inference)

## Permission Requirements

The assistant loads with the workspace layout, and its visibility is determined jointly by `aiDiagnostics.enabled` and the workspace context; the role constraints for individual diagnostic actions are not fine-grained in the frontend, so they are not yet confirmed here.
