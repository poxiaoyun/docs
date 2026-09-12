---
title: 'Parameter Settings'
updated: '2026-09-12'
description: 'Where to open the parameters, what each one controls, and which to change when the answers are not right.'
---

# Parameter Settings

When a model's answers are not right — too rambling, too rigid, or cut off mid-sentence — do not rush to switch models. Changing a few parameters is often enough. This page explains where the parameters are, what each one controls, and which to change for a given symptom.

:::info This is not a standalone page
There is no "debug" entry in the ChatApp top navigation. Parameters are adjusted on the [Playground](./experience.md) and [Comparison](./compare.md) pages, through the **Parameter Settings** dialog at the top. This page describes that dialog.
:::

## Where to open the parameters

| Page | How to open |
| --- | --- |
| **Playground** | Click the parameter icon in the row at the top of the conversation area (hover shows **Parameter Settings**). On a wide enough window you can also edit directly in the right-hand **Parameter settings** panel |
| **Comparison** | Each column has its own parameter icon at the top; the two sides are **independent**, so you can set them separately |

Within one page, the two entry points (the dialog and the right-hand panel) edit the same set of parameters — change one and the other follows.

## When changes take effect

- Changes are **remembered immediately**; closing the dialog does not lose them.
- But they only apply to **messages sent afterwards**. Messages already sent and answers already received are unaffected.
- To undo a change, reopen the dialog and change it back; once **System** or **Stop** has content, a clear button appears on the right of the field to wipe it in one click.

## What the five parameters control

| Parameter | Default | Allowed range | What it does |
| --- | --- | --- | --- |
| **System** | empty | Any text | The system prompt, which sets the model's persona and rules, for example "You are an AI assistant". Leave it empty to add nothing |
| **Top P** | `0.8` | 0.1 ~ 1.0, step 0.1 | Controls the word-selection range; the larger the value, the more random the output |
| **Temperature** | `0.7` | 0 ~ 1.999, step 0.1 | Controls randomness and diversity. Higher is more varied, lower is more consistent |
| **Max Tokens** | `4096` | 0 ~ 32768, step 10 | The maximum number of tokens one reply may generate. `0` means unlimited |
| **Stop** | empty | Any text | Generation stops as soon as this text is encountered. Empty means it does not apply |

:::tip Two rules of thumb

- **Temperature** and **Top P** both affect randomness, so change only one of them and leave the other at its default; otherwise it is hard to tell which one made the difference.
- The number fields take plain integers or decimals — type them directly (letters such as `e` are not accepted and reset the field).

:::

## When you see this, change that

| Symptom | What to do on this page |
| --- | --- |
| The reply is truncated, stopping mid-sentence | Raise **Max Tokens** (up to 32768); `0` means unlimited |
| Every answer is different and easily goes off topic | Lower **Temperature**, for example 0.1 ~ 0.3 |
| The answer is too rigid and repeats itself | Raise **Temperature**, for example 0.8 ~ 1.2 |
| You want it to always answer in a certain role or style | Write the role and requirements clearly in **System** |
| It always stops right after a certain piece of text | Check whether **Stop** has content and clear it |
| You want to know whether the model or the parameters are at fault | Go to [Comparison](./compare.md), pick the same model on both sides and change only one side's parameters |
| Errors: too many requests, insufficient quota, invalid API key, context length exceeded | These are unrelated to parameters. The error text appears where the message would be on the conversation page; handle it using the common issues in [Playground](./experience.md) |

## Tuning suggestions by scenario

| Scenario | Suggestion |
| --- | --- |
| Factual Q&A, answering from reference material | Set **Temperature** to 0.1 ~ 0.3 and lower **Top P** somewhat |
| Writing code | Set **Temperature** to 0.2 ~ 0.4 and state the language and code style in **System** |
| Creative writing, brainstorming | Set **Temperature** to 0.8 ~ 1.2 |
| Answers never seem to finish | Raise **Max Tokens** |
| You just want shorter answers | State the length or format in **System** — more direct than tuning parameters |

:::warning Not every model honours these parameters
The parameters are passed through into the call as they are, but **whether they take effect depends on the model**: some models do not support settings such as Temperature, or have their own limits on the values. The page does not block them, so if nothing changes after editing, try a model that supports the parameter first.
:::

## Confirm it worked

After changing the parameters, send a new message and see whether the answer matches expectations: shorter, steadier, no longer truncated — that means it took effect. To verify one set of parameters repeatedly, fixing both sides in [Comparison](./compare.md) is the most direct way.

## Related

- [Playground](./experience.md)
- [Comparison](./compare.md)
- [Models](./marketplace.md)
