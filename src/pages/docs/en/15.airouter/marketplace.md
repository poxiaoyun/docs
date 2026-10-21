---
title: 'Models'
updated: '2026-10-21'
description: 'Too many models to choose from? Read the cards, filter by capability and visibility, grab a call sample, then jump straight into a chat.'
---

# Models

**Models** is where you pick a model in AIrouter, and it is the page you land on after signing in. See which models you can use, how much content each can remember and what it can do — then jump into a chat with one click.

This page **shows no prices**. To see what you actually pay per model, click **Prices** in the top nav (see [Prices](./prices.md)).

:::tip An analogy
Models is like the list page of an app store: each card tells you what the "app" does, how much it remembers and what tags it carries. Open the details before you decide to use it.
:::

## Before you start

- Any signed-in account works — no extra role, and no API key needed.
- You only see models **you are allowed to use**. If you see none, the administrator has not opened a model channel for you.

## What the page looks like

| Area | Position | Notes |
| --- | --- | --- |
| Filters | Left (moves above the cards on narrow windows) | Five groups: **Type**, **Category**, **Vendor**, **Context**, **Parameters** |
| Visibility tabs | Top left | **All** / **Public** / **Internal** / **Private**; the number after each label is the model count in that scope |
| Search and sort | Top right | Search by name or keyword; the dropdown offers **Sort by name** (default) or **Newest** |
| Model cards | Middle | 1 to 4 columns depending on window width, one card per model |
| Model count | Below the cards | Shows "{{count}} models" |

![The Models page: grouped filters on the left, visibility tabs plus search and sort on top, model cards in the middle](/assets/screenshots/airouter/marketplace-01.png)

Read the layout from the screenshot: the leftmost column holds the five filter groups **Type / Category / Vendor / Context / Parameters**; the top-left tabs switch visibility scope (the number on each tab is that scope's model count); the top right has the search box and sort dropdown; cards fill the middle.

## Pick a model

1. Click **Models** in the top nav.
2. Set the scope first: click one of **All**, **Public**, **Internal**, **Private**.
3. Narrow down with the left-hand filters. Each tag is **click to select, click again to clear**, and different groups stack:
   - **Type**: **Chat**, **Image**, **Video**, **Audio**, **Embedding**, **Rerank**.
   - **Category**: **Vision**, **MoE**, **Reasoning**, **Tools**, **FIM**, **Math**, **Coder**.
   - **Vendor**: DeepSeek, Qwen, Zhipu, Kimi, OpenAI, Anthropic, Google, MiniMax, Doubao.
   - **Context**: `< 32K`, `32K - 128K`, `128K - 1M`, `≥ 1M`.
   - **Parameters**: `< 10B`, `10B - 30B`, `30B - 100B`, `100B - 300B`, `≥ 300B`.
4. Or just type in the search box, labelled "Search models or keywords". It matches **model ID, vendor, description, type, category, custom tags, channel, tenant and workspace**.
5. To change the order, use the dropdown next to the search box: **Sort by name** or **Newest**.
6. Results appear as cards, and the count below them reads "{{count}} models". When one model is served by several channels, **those channels count as one model**. With no results you see "No matching models" and "Adjust the search or filters and try again."

## Read the cards

| Card element | Meaning |
| --- | --- |
| Icon + model name | This is the ID you use when calling the API |
| Provider | Who provides the model |
| **New** badge | Recently added model |
| Coloured badge at top right | Visibility: **Public** (whole platform), **Internal** (this tenant), **Private** (only you or your workspace) |
| Description | One-line introduction, at most two lines |
| Bottom tags | Type, up to two categories, **Context**, parameter scale, up to two custom tags. Full tags are in the details |

:::info No copy button on this page
Neither the cards nor the detail panel offer a copy button. Read the model ID straight off the card, or use **Examples**, where the ID is already filled in.
:::

### What context length means

The most content the model can remember in one conversation. The `128K` or `1M` on a card is that ceiling: the larger it is, the better it handles long documents and long code. Past the ceiling the model forgets the earliest content, or the request fails with "Context length exceeded".

### What parameter scale means

The unit is `B` (billion). `7B` means 7 billion parameters. More parameters usually means more capability, but also different speed, price and memory use.

### How do I know a model accepts images

There is no separate "accepts images" switch — check the **Category** tags: **Vision** means the model can process images. On [Chat](./experience.md), the image button in the input toolbar sends images along with your message.

## Open the model details

1. Click any card; the detail panel slides in from the right.
2. The top shows the model ID, visibility, provider, description and all tags (type, category, context, parameter scale, custom tags, plus the model's **task** tag).
3. Below that are two buttons: **Try model** and **Examples**.
4. Further down is **Available channels (N)**: every source of this model with its **tenant** and **priority**.
5. To see how to call it from code, click **Examples** and the call instructions expand inside the panel.

:::tip Why one model has several channels
A model may be reachable through several sources. They are merged into a single card, and listed in the details by **priority** from high to low. **Try model** uses the highest-priority channel by default.
:::

## What the call sample contains

Clicking **Examples** expands a block explaining how to call this model from code:

| Item | Notes |
| --- | --- |
| **Gateway Address** | Shaped like `https://your-site/airouter-data`; this is the root for every endpoint |
| Chat API address | The gateway address plus `/v1/chat/completions` |
| Channel ID / task tag | Which channel this call goes through, and what task the model belongs to |
| Sample code | Tabs for **curl**, **Python** and **Go**; the model ID and headers are already filled in |
| Auth | Samples use `Authorization: Bearer YOUR_TOKEN`; replace `YOUR_TOKEN` with your own API key |

For the full endpoint list (including the Anthropic protocol), see [API docs](./api-docs.md).

## Start a chat

1. Click **Try model** at the top of the detail panel.
2. The page jumps to **Chat** with that model already selected.
3. Type your question in the input box at the bottom and press **Enter**.

:::warning This clears the current conversation
Entering via **Try model** starts a new conversation; anything you were chatting about is not kept. Copy or screenshot the results first if you need them.
:::

## Common issues

| Symptom | Possible cause | What to do |
| --- | --- | --- |
| "No matching models" | The search term or filters are too narrow | Adjust the search or filters as prompted |
| A model I know about is missing | It is not in the visibility scope you selected | Switch to **All** or the right visibility scope |
| One model, several channels — which one | A model may be reachable through several sources | Open the details and check **Available channels** priority; the highest is used by default |
| I cannot find prices | This page does not show prices at all | Click **Prices** in the top nav — that is your account's unit price |
| No copy button for the model ID | This page does not offer one | Read it off the card, or use the pre-filled ID in **Examples** |

## Related

- [Chat](./experience.md)
- [Comparison](./compare.md)
- [API Keys](./token.md)
- [Prices](./prices.md)
- [API docs](./api-docs.md)
- [Usage analysis](./usage-statistics.md)
