---
title: 'Parameter Settings'
updated: '2026-10-21'
description: 'Answers too rambling, too rigid or cut off mid-sentence? Know where the parameters are, which one to change and by how much.'
---

# Parameter Settings

When a model's answers are not right — too rambling, too rigid, or cut off mid-sentence — do not rush to switch models. Changing a few parameters is often enough. This page explains where the parameters are, what each one controls, and which to change for a given symptom.

:::info This is not a standalone page
There is no "debug" entry in the AIrouter top navigation. Parameters are adjusted on the [Chat](./experience.md) and [Comparison](./compare.md) pages, through the **Parameter Settings** dialog (or the **Parameter settings** panel on the right). This page describes both.
:::

## Where to open the parameters

| Page | How to open |
| --- | --- |
| **Chat** | Click **Playground** → **Chat** in the top nav, then click the parameter icon in the row at the top of the conversation area (hover shows **Parameter Settings**). On a wide enough window you can also edit directly in the right-hand **Parameter settings** panel |
| **Comparison** | Click **Playground** → **Comparison**, then use the parameter icon at the top of each column; the two sides are **independent**, so you can set them separately |

Both entry points on a page (the dialog and the right-hand panel) edit the same values: change one and the other follows, with exactly the same limits.

![The Parameter Settings dialog, opened from the parameter icon in a narrow window; it holds System, Top P, Temperature, Max Tokens and Stop](/assets/screenshots/airouter/debug-01.png)

Above is the dialog form: from top to bottom **System** (multi-line), **Top P**, **Temperature**, **Max Tokens** and **Stop**, each slider with a number box for exact values. The dialog covers part of the conversation area — that is expected; close it when done.

## When changes take effect

- Changes are **remembered immediately**; closing the dialog does not lose them.
- But they only apply to **messages sent afterwards**. Answers already sent and received are unaffected.
- To undo, reopen the dialog and change the value back. The **System** and **Stop** boxes show a clear button once they contain text, so you can empty them in one click (the right-hand panel has no such button).

## What the five parameters do

| Parameter | Default | Range | Effect |
| --- | --- | --- | --- |
| **System** | Empty | Any text | The system prompt: persona and rules, e.g. "You are an AI assistant". Empty means none is added |
| **Top P** | Unset | 0.1 to 1, step 0.1 | Controls the sampling pool; larger values mean more randomness |
| **Temperature** | Unset | 0 to 2, step 0.1 | Controls randomness and diversity. Higher is more diverse, lower is more consistent |
| **Max Tokens** | Unset | 0 to 32768, step 10 | Maximum tokens per reply. `0` means unlimited |
| **Stop** | Empty | Any text | Generation stops as soon as this text appears. Empty means it does nothing |

:::info What "unset" means
**Top P**, **Temperature** and **Max Tokens** start empty — they are not pre-filled with 0.7 or 4096. An empty field is **not sent to the model**, so the model decides. Defaults differ per model, which is exactly why you only fill them in to override.
:::

:::tip Two practical notes
- **Temperature** and **Top P** both influence randomness. Change only one and leave the other empty, otherwise you cannot tell which one had the effect.
- Out-of-range numbers are **not silently clamped**; the send is blocked with "Please correct the invalid generation parameters before sending." Adjust to a value in range and send again.
:::

![At 1536px and wider, the Model information and Parameter settings panels appear to the right of the conversation](/assets/screenshots/airouter/debug-02.png)

On a wide window the right side shows **Model information** plus **Parameter settings**. The panel only carries the `Temperature`, `Max Tokens` and `Top P` sliders; `System` and `Stop` live under **More parameters** at the bottom, and the key switches through the **API Key / credential** dropdown at the top. It edits the same values as the dialog, and the two stay in sync.

## Symptom → which parameter to change

| Symptom | What to do here |
| --- | --- |
| The reply is cut off mid-sentence | Raise **Max Tokens** (up to 32768); `0` means unlimited |
| Answers differ every time and drift off topic | Lower **Temperature**, e.g. 0.1 to 0.3 |
| Answers feel rigid and repeat themselves | Raise **Temperature**, e.g. 0.8 to 1.2 |
| You want a fixed persona or style | Write the persona and requirements into **System** |
| Generation always stops after a certain string | Check whether **Stop** contains something, and clear it |
| You want to know if it is the model or the parameters | Go to [Comparison](./compare.md), pick the same model on both sides and change one side only |
| Errors: too many requests, context length exceeded, invalid API key | Unrelated to parameters; match them in [Chat](./experience.md) common issues |
| Errors: balance too low, plan credits used up, weekly quota used up | Also unrelated to parameters — billing issues. Check [Account](./billing.md), or buy a plan in [Subscribe](./subscribe.md) |

## Suggested settings by scenario

| Scenario | Suggestion |
| --- | --- |
| Factual Q&A, answering from documents | **Temperature** 0.1 to 0.3, and a lower **Top P** |
| Writing code | **Temperature** 0.2 to 0.4, and state the language and code style in **System** |
| Creative writing, brainstorming | **Temperature** 0.8 to 1.2 |
| Answers never finish | Raise **Max Tokens** |
| You just want shorter answers | Say the length or format in **System**; it works better than tuning parameters |

:::warning Not every model honours these parameters
Parameters are passed through as-is, but **whether they take effect depends on the model**: some do not support Temperature, or impose their own limits. The page only checks that values are in range; it does not adapt them per model. If nothing changes, try a model that supports the parameter.
:::

:::tip Parameters are not billing
Tuning parameters changes style and length only; it **does not lower the price you pay**. To spend less, switch to a cheaper model (see [Prices](./prices.md)) or use plan credits.
:::

## Confirm it worked

Send a new message after the change and watch the answer: shorter, steadier, no longer truncated means it took effect. To verify the same set of parameters repeatedly, fix both sides in [Comparison](./compare.md) — it is the clearest A/B setup.

## Related

- [Chat](./experience.md)
- [Comparison](./compare.md)
- [Models](./marketplace.md)
- [Prices](./prices.md)
- [Account](./billing.md)
