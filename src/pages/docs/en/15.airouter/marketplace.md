---
title: 'Models'
updated: '2026-09-12'
description: 'Pick the right model in the Models page: read the cards, filter and search, check prices, and start a chat in one click.'
---

# Models

**Models** is where you pick a model in AIrouter. Visit this page before you start chatting: you can see which models you may use, how much content each one can remember, what each costs per 1M tokens, and then jump straight into a conversation.

:::tip An analogy
Models is like the list page of an app store: the card tells you what the "app" does, how big it is and what it costs; open the details to decide whether to install it (start chatting).
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- You only see the models **you are allowed to use**. If you see none, the administrator has not opened a model channel for you yet.

## What the page looks like

| Area | Position | Description |
| --- | --- | --- |
| Filter area | Left (above the cards on a narrow window) | Grouped filters by **Type**, **Category**, **Vendor**, **Context** and **Parameters** |
| Visibility tabs | Top left | **All** / **Public** / **Tenant** / **Private**; the number after each label is the model count in that scope |
| Search and sort | Top right | The search box finds models by name or keyword; the dropdown sorts by **Sort by name** or **Newest** |
| Model cards | Center | Arranged into 1 to 4 columns by window width; each card is one model |
| Model count | Below the cards | Shows "N models" |

## Pick a model

1. Click **Models** in the top navigation.
2. Set the scope first: click one of **All**, **Public**, **Tenant** or **Private** at the top.
3. Narrow further with the left-hand filters. A tag is **selected on the first click and cleared on the second**, and different groups can be combined:
   - **Type**: for example Chat.
   - **Category**: for example Vision, Reasoning, Coder.
   - **Vendor**: for example DeepSeek, Qwen, Zhipu, Kimi, OpenAI.
   - **Context**: `< 32K`, `32K - 128K`, `128K - 1M`, `≥ 1M`.
   - **Parameters**: `< 10B`, `10B - 30B`, `30B - 100B`, `100B - 300B`, `≥ 300B`.
4. Still cannot find it? Type directly: the search box matches model names or keywords, including model IDs, vendors, channels, tenants and workspaces.
5. To change the order, pick **Sort by name** or **Newest** in the dropdown to the right of the search box.
6. Results appear in the card area and the count "N models" shows below. When nothing matches, "No matching models" appears — loosen the conditions as the message suggests.

## Reading the card

| Card element | What it means |
| --- | --- |
| Model icon + model name | This ID is what you use when calling the API. The copy button next to the name copies it in one click; hover shows **Copy model ID** |
| Provider | Who provides this model |
| **New** (top right) | A recently added model |
| Colored tag (top right) | Visibility: **Public** (available platform-wide), **Tenant** (this tenant only), **Private** (only you or this workspace) |
| Description | A one-line introduction to the model, shown on at most two lines |
| Bottom tags | Type, categories (up to 2), **Context**, parameter scale and custom tags (up to 2); the full set is in the details |

### What context length means

It is the upper bound on how much content a model can remember in one conversation. The `128K` or `1M` on the card is that bound; the bigger the number, the better it handles long documents and long code. Beyond the bound the model forgets the earliest content, or even returns a "Context length exceeded" error.

### What parameter scale means

The unit is `B` (billion). `7B` means 7 billion parameters. More parameters usually means stronger capability, but speed, price and memory use differ too — the card price is the reliable guide.

### How do I know whether a model supports images

There is no separate "supports images" switch. Check the **Category** tag: **Vision** means the model can process images. On the [Playground](./experience.md) page, the image button in the input toolbar sends an image together with your message.

## Open the model details

1. Click any card and the detail panel slides out on the right.
2. The top of the panel shows the model name, visibility, provider, description and all tags, plus the **Try model** and **API docs** buttons.
3. In the middle is **Available channels (N)**: every source this model is served from, with its **Tenant** and **Priority**.
4. Below that is **Pricing**.
5. To see call samples, click **API docs**. The panel expands into **Examples**, which switch between the curl, Python and Go tabs, and it also shows the **Gateway Address**.

:::tip Why does one model have several channels
A model may be connected through more than one source. They are merged into a single card, and the details list them by **Priority** from high to low; clicking **Try model** uses the highest-priority channel by default.
:::

## How to read the prices

| Price item | Meaning |
| --- | --- |
| **Input price** | What you send to the model (question and context) is billed at this rate |
| **Output price** | What the model generates is billed at this rate |
| **Cache read price** | The rate when a cache hit lets the model reuse existing context directly |
| **Cache write price** | The rate for writing context into the cache |

The unit is "price per 1M tokens", shown on the page as something like `0.5 CNY / 1M`. When a price item has no configured value it shows `-`.

## Start a conversation

1. Click **Try model** at the top of the detail panel.
2. The page jumps to **Playground** with this model already selected.
3. Type your question in the input box at the bottom and press **Enter** to send.

:::warning This clears the current conversation
Entering through **Try model** from Models starts a fresh conversation, and earlier messages are not kept. Copy or screenshot anything you want to keep first.
:::

## Common issues

| Symptom | Possible cause | What to do |
| --- | --- | --- |
| "No matching models" is shown | The search term or filters are too narrow | Adjust the search term or filter scope as suggested and retry |
| A model you want has no card | It is not under the current visibility tab | Switch to **All** or the matching visibility |
| A model has several channels and you are unsure which to use | One model may be connected through several sources | Open the details and check the **Available channels** priority; the highest one is used by default |
| The price shows `-` | That price item is not configured | Use the other price items, or check the actual cost in [Usage analysis](./usage-statistics.md) |

## Related

- [Playground](./experience.md)
- [Comparison](./compare.md)
- [API Keys](./token.md)
- [Usage analysis](./usage-statistics.md)
