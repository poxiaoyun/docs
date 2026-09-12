---
title: 'Comparison'
updated: '2026-09-12'
description: 'Send one question to two models at once and compare the side-by-side results to decide which to use.'
---

# Comparison

**Comparison** sends **the same question to two models at the same time** and shows their answers side by side. When you are choosing a model, comparing versions, or testing how parameters behave, this page is far more efficient than switching back and forth.

:::tip An analogy
Like interviewing two candidates: ask them the same question at once, then compare their answers, speed and cost together.
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- Your account needs **at least one API key** (see [API Keys](./token.md)).
- Your account needs **at least two selectable models**; both sides may also use the same model.
- Use a **wide window**. On a narrow window the left-hand model list is hidden, and then you cannot choose models.

## The page has three parts

| Area | Position | Description |
| --- | --- | --- |
| Model list | Far left | Two stacked blocks, the **Left Model** and the **Right Model** |
| Conversation columns | Center | Two columns, each showing the answers of one model |
| Shared input | Bottom | One input box; a single message goes to both sides |

## Choose both models

1. Click **Comparison** in the top navigation.
2. In the upper half of the far-left panel, the **Left Model** list, click a model.
3. In the lower half, the **Right Model** list, click a model.
4. The two sides may use **different models** (to compare capability) or **the same model** (to compare parameters).

The model lists work the same as in [Playground](./experience.md): grouped by visibility → channel → model, searchable, and with model IDs you can copy.

## Confirm the keys on both sides

- Each column has its own key selector at the top, and both default to the first key in the account.
- To change one side's key, use that column's own selector at the top; it **does not affect the other side**.

## Send a message

1. Only once both sides have a model does the bottom input box light up, with the placeholder "Type to chat with the model...".
2. Type your question and press **Enter**, or click the send button.
3. The same message goes to **both** sides at once, and the two columns stream independently without waiting for each other.

## How to read the results

| What to compare | How to look |
| --- | --- |
| Answer quality | Put the two columns side by side and see which is more accurate, complete and on topic |
| Response speed | Watch how fast each column streams its text |
| Reasoning | With **Deep Thinking** on, expand **Show thoughts** on each side and compare their reasoning |
| Token cost | Look at the usage numbers under each answer |
| Instruction following | Type the same System into both sides' **Parameter Settings** and compare which obeys better |

## What is shared and what is independent

| Configuration | Left column | Right column |
| --- | --- | --- |
| Model | Chosen separately | Chosen separately |
| API key | Chosen separately, defaults to the first key | Chosen separately, defaults to the first key |
| Chat parameters | Set separately | Set separately |
| Message history | Independent | Independent |
| Errors and stopping | Independent; an error on one side does not affect the other | Independent |
| **Deep Thinking** | One shared toggle | One shared toggle |

Chat parameters are opened through the **Parameter Settings** icon at the top of each column, and the two sides do not affect each other. For what each item does, see [Parameter Settings](./debug.md).

## Stop and clear

| What you want | How to do it |
| --- | --- |
| Stop one side only | Click the stop icon in that column's message area |
| Stop both sides | Click **Stop** in the bottom input box |
| Clear one side only | Click the clear icon at the top of that column; its tooltip is **Clear chat** |
| Switch models | Click another model in the left-hand list; that column's conversation is cleared |

## Tips for comparing

1. **Change only one variable at a time.** To compare models, pick different models on the two sides and keep the parameters identical; to compare parameters, pick the same model and change only one side's Temperature or Top P.
2. To compare different channels of the same model, select a different channel under the same model name on each side.
3. Test over several rounds with the same set of business questions — more reliable than asking a single question.

:::warning A refresh wipes it
Comparison records live only in the current page; refreshing or closing the page clears everything. Screenshot or copy important results first.
:::

## Confirm it worked

Both sides start streaming their answers, which means the comparison was sent successfully. If only one side reacts, that side's model or key is usually not set correctly — check the selector at the top.

## Related

- [Playground](./experience.md)
- [Models](./marketplace.md)
- [Parameter Settings](./debug.md)
- [API Keys](./token.md)
