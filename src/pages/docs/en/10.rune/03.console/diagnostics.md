---
title: 'AI Diagnostics Assistant'
updated: '2026-09-14'
description: 'Use the floating AI assistant on the right of the page to find out why an instance will not start or a service is unreachable.'
tags:
  - rune
  - console
  - diagnostics
---

# AI Diagnostics Assistant

The AI Diagnostics Assistant is a **floating helper** that follows you along the right edge of the page, and its job is to **help you see why an instance will not start**. It reads the state and configuration of the instances in the current workspace; you describe the symptom, and it walks you through the troubleshooting steps and its conclusion.

It is not a standalone page, but a side drawer you can summon and dismiss at any time.

:::tip What the assistant is
Think of it as an operations colleague sitting next to you who can look through the current workspace: you describe the problem, it goes and checks the data, then tells you roughly where things went wrong.
:::

## Before you start
- Toggle: the administrator turns this assistant on in the platform settings. If you cannot see it on the right, the current environment has it switched off.
- Context: you need to have entered a **workspace** before the assistant appears.
- Model: a usable chat model must be configured in the environment.

## Open the assistant
1. Find the vertical assistant tab on the **right edge** of the page (hovering it shows the assistant's name, which the platform administrator sets).
2. Click the tab and the chat panel slides out on the right.
3. The tab can be **dragged up and down**; drop it wherever suits you and it stays there.

Once open, it looks like this:

![AI diagnostics drawer: the header names the current workspace and how many resources it can see, the middle holds quick entries and suggested questions, and the bottom has the input box and model picker](/assets/screenshots/rune/diagnostics-01.png)

The header tells you which **workspace** it read and how many resources it can reach; the middle lists clickable quick entries and suggested questions; the bottom is the input box plus the **Model** currently in use. The screenshot shows `deepseek-v4-flash`; your environment shows whichever model is actually configured.

## Run a diagnosis
1. At the bottom of the panel, make sure a usable model is selected in the **Model** dropdown (once loaded, the first one is selected by default).
2. Describe the problem in the input box, for example "Why is this instance not running normally?".
3. To target a specific instance, type `@` in the input box and pick an instance from the candidate list; the chosen instance appears as a tag above the input box and is sent to the assistant with this question. On the Inference, Apps, Traning&Fine tuning, Runebox, Metrics and Evaluations list pages, `@` lists instances of the matching type.
4. Press Enter, or click the send button at the bottom right. The answer **streams out one character at a time**.
5. If you lose interest midway, click **Stop** to interrupt generation.

When the panel is open it also offers a few shortcuts and suggested questions that you can click to ask directly:

| Shortcut | When it helps |
| --- | --- |
| Locate abnormal resources | Quickly locate instances in the current workspace whose state is abnormal |
| Instance runtime diagnostics | Diagnose one instance's runtime state and health |
| Unreachable service triage | Trace the request path when a service cannot be reached |

## How to read the result
The assistant's answer has two parts:

1. **Diagnosis phases**: it lists the steps it is taking, for example **Load diagnostics skill**, **Collect Rune diagnostics data** and **Update diagnostics phases**. Each phase shows as in progress and then turns successful; if a step fails it is marked in red with an explanation.
2. **Conclusion and suggestions**: the body gives its judgement and what to do next. You can follow the suggestions to keep investigating on the matching tab, for example **Logging** for the exact error or **Events** for scheduling information.

The conversation keeps context, so you can keep asking, for example "So how should I change the configuration?".

## Other actions
| Action | How to use it |
| --- | --- |
| Clear chat | The trash icon at the top of the panel, which clears the current conversation |
| Close | The close icon at the top of the panel, which collapses the drawer; click the tab again to reopen it |

## Common issues
| Symptom | Possible cause | What to do |
| --- | --- | --- |
| No assistant tab on the right | The administrator has not enabled it, or you have not entered a workspace | Contact the administrator, or select a workspace first |
| The model dropdown is empty | No usable model is configured in the environment | Ask the administrator to confirm the model configuration |
| The answer stops midway | Generation was interrupted | Send the question again, or check the network |
| A message says an action needs manual confirmation | That diagnostic action requires manual approval | Follow the prompt and have the administrator handle it |

## Related
- [Logs](/rune/console/logging)
- [Inference](/rune/console/inference)
