---
title: 'Comparison'
updated: '2026-10-21'
description: "Can't decide between two models? Send the same question to both at once and compare the answers side by side."
---

# Comparison

**Comparison** sends **the same question to two models at the same time** and shows their answers side by side. When you are choosing a model, comparing channels, or testing how parameters behave, this page is far more efficient than switching back and forth.

Get there from the top nav: click **Playground** → **Comparison**.

The layout is fixed at two columns, so you can compare at most two models at a time — there is no "add another" entry.

:::tip An analogy
Like interviewing two candidates: ask them the same question at once, then compare their answers, speed and cost together.
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- Your account needs **at least one API key** (see [API Keys](./token.md)).
- Your account needs **at least one available model**: the two columns may use different models, or the same one.
- Both columns only list **chat models that are already priced**. Unpriced models do not appear.
- Work on a **wide window**. On narrow windows the model lists on the far left are hidden and you cannot pick a model.

## The page has three areas

| Area | Position | Notes |
| --- | --- | --- |
| Model lists | Far left | Stacked blocks: **Left Model** and **Right Model** |
| Conversation columns | Middle | The left and right column each show one model's answers |
| Shared input box | Very bottom | One input box; a message goes to both sides at once |

![Comparison before selection: two stacked model lists on the far left, both columns showing "Please select a model"](/assets/screenshots/airouter/compare-01.png)

This is the page before you pick anything: two blocks stacked on the far left, the upper one labelled **Left Model** and the lower one **Right Model**; the middle has two conversation columns reading "Select the left model / Select the right model"; the input box sits at the very bottom and only activates once both models are chosen.

## Choose both models

1. Click **Playground** → **Comparison** in the top nav.
2. In the upper **Left Model** list, click a model.
3. In the lower **Right Model** list, click a model.
4. The two sides may use **different models** (compare capability) or **the same model** (compare channels or parameters).

The lists behave like the ones on [Chat](./experience.md): three levels of **visibility** (**Public** / **Internal** / **Private**) → **model** → **channel**, with channel rows shown as "provider: channel-name". When there are more than 5 models, a **Search models** box appears at the top.

:::warning Changing a model clears that column
Clicking another model in one column clears that column's conversation. The other column is unaffected.
:::

## Check the key on each side

- Each column has its own key selector at the top, both defaulting to the account's first **usable** key.
- To change one side, use that column's selector; it **does not affect** the other side.
- **Expired** (marked `Expired`) and **disabled** keys cannot be selected.

## Send one message

1. Once both models are chosen, the shared input box at the bottom activates; its placeholder is "Type to chat with the model...".
2. Type your question and press **Enter** or click send.
3. The same message goes to **both** sides at once, and each column streams independently.

## Read the results

| What to compare | How to read it |
| --- | --- |
| Answer quality | Compare the two columns directly: which is more accurate, more complete, more on point |
| Response speed | Watch which column fills in faster |
| Reasoning | With **Deep Thinking** on, expand **Show thoughts** on each side and compare their reasoning |
| Token usage | Check the usage numbers under each answer |
| Instruction following | Put the same System text into both **Parameter Settings** and see which obeys better |

![The same question sent to deepseek-v4-flash and deepseek-v4-pro, each column showing its own reasoning and answer](/assets/screenshots/airouter/compare-02.png)

Above, each column has its own model and received the same question: both headers show their model name, and both answers carry their own collapsed reasoning and token usage. The input and output lengths differ between the two models — exactly what the Comparison page is meant to reveal.

## What is shared and what is separate

| Setting | Left column | Right column |
| --- | --- | --- |
| Model | Chosen separately | Chosen separately |
| API key | Chosen separately, first usable key by default | Chosen separately, first usable key by default |
| Conversation parameters | Set separately | Set separately |
| Message history | Independent | Independent |
| Errors and stopping | Independent; a failure on one side does not affect the other | Independent |
| **Deep Thinking** | One shared switch | One shared switch |

Conversation parameters open from the **Parameter Settings** icon at the top of each column, and the two sides never affect each other. For each field, see [Parameter Settings](./debug.md).

## Stop and clear

| What you want | How to do it |
| --- | --- |
| Stop one side | Click the stop icon in that column's message area |
| Stop both | Click **Stop** in the bottom input box |
| Clear one side | Click the clear icon at the top of that column; the tooltip reads **Clear chat** |
| Switch models | Click another model in that side's list; that column's conversation is cleared |

## Comparison tips

1. **Change one variable at a time.** Comparing models: pick two different models and keep parameters identical. Comparing parameters: pick the same model and change Temperature or Top P on one side only.
2. To compare channels of the same model, pick two different channels of that model.
3. Run a batch of real business questions over several rounds; one question is rarely enough.
4. Afterwards, check what it cost in [Usage analysis](./usage-statistics.md).

:::warning Refresh and it is gone
Comparison history lives only in the current page. Refreshing or closing the page clears everything. Screenshot or copy important results first.
:::

## Confirm it worked

Both columns start streaming answers, so the comparison was sent successfully. If only one side responds, that side's model or key is usually the problem — check the selector at the top.

If only one side reports a billing error such as "The balance is too low", "Plan credits are used up" or "Weekly quota is used up", that side's call was blocked and **the other side is unaffected** and still answers. Handling matches the "Balance and plans" section of [Chat](./experience.md).

## Related

- [Chat](./experience.md)
- [Models](./marketplace.md)
- [Parameter Settings](./debug.md)
- [API Keys](./token.md)
- [Usage analysis](./usage-statistics.md)
