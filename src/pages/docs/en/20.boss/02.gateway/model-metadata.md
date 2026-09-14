---
title: Model Configuration
updated: '2026-09-14'
description: Give a model its business card: name, type, context length and unit prices.
tags:
  - boss
  - gateway
---

# Model Configuration

Model Configuration maintains a model's **business card**: what it is called, which vendor it comes from, how long its context is, and how each call is priced. The list page, the cost column in Call Logs and the cost figures on the Dashboard all read from here.

By the end you will be able to create a model entry, fill in its display information and prices, upload an icon, and delete it when it is no longer needed.

:::tip Model Configuration is the business card, not the line
The card carries the model's outward-facing information (name, type, price). Which line a request actually leaves through is decided by [Channel Management](/boss/gateway/channels). The two are managed separately: one model can be served by several channels, while its price is written once on the card.
:::

:::warning Model Configuration does not take part in routing
This page only maintains display information and prices; it **never decides which channel a request uses**. Whether a model can be called depends on whether it is listed in a channel's **Supported Models**.
:::

## Before you start

- Permission: you need a platform administrator account (one that can enter the BOSS console).
- Confirm the channel already exists and that the model name is listed in that channel's **Supported Models**; otherwise the model cannot be called even after you configure a price.

## Open Model Configuration

1. Click **Model Gateway** in the top navigation bar.
2. Expand **Model Services** and click **Model Configuration**.

## Reading the model list

| Column | Meaning |
| --- | --- |
| Model name | The model identifier; the small text below is its description |
| Type | Chat / Image / Video and so on |
| Vendor | Which company the model comes from |
| Categories | Labels such as Vision or Reasoning; there can be several |
| Context | The context window size in tokens, abbreviated with K / M |
| Parameter scale | The parameter count, shown in B (billion) or T (trillion) |
| Pricing | Input and output unit prices, in "currency per 1M" |
| Channel vendors | How many channels serve this model; hover to see their names and priorities |

Above the list you can filter by **Type** and **Vendor**. The actions menu at the end of each row has **Edit** and **Delete**.

![Model configuration list: model name, type, vendor, categories, context, size, price and providers](/assets/screenshots/boss/gateway-modelmeta-01.png)

Model configuration only maintains **metadata**, as the on-page hint says: this page takes no part in model routing. The **Provider** column shows which channels a model is attached to; for the models you can actually call, see [Channel Management](./channels.md).

## Create a model

1. On the **Model Configuration** page click **Create model** in the top-right corner.
2. Fill in the **Basic information** block:

   | Form field | How to fill it | Notes |
   | --- | --- | --- |
   | Model name | For example `gpt-4o-mini` | Required; **cannot be changed after creation**, and must match the model name used in the channel exactly |
   | Type | Defaults to **Chat** | See "Type" below |
   | Vendor | Defaults to **OpenAI** | See "Vendor" below |
   | Description | One sentence | Optional; shown under the name in the list |
   | Categories | Multi-select from the presets | Optional; see "Categories" below |
   | Custom tags | Type and press Enter to add | Optional, for your own grouping |
   | Context | For example `128000` | Optional, in tokens |
   | Parameter scale | For example `7` | Optional, in units of B (billion); decimals are allowed |

3. If you want an icon, click **Upload icon** and choose an image (any format; PNG and SVG are common).
4. In the **Pricing** block fill in the four unit prices, in **CNY / 1M** (Chinese yuan per million tokens):

   | Form field | Meaning |
   | --- | --- |
   | Input price | Price per million tokens for the user's input |
   | Completion price | Price per million tokens for the model's output |
   | Cache read price | Price when a cached value is read |
   | Cache write price | Price when a value is written to the cache |

5. Click **Create model** to finish. On the edit page the button reads **Save** instead.

When you edit an existing model that already has channels using it, the form also shows a **Channel vendors** block listing those channels and their priorities, so you can judge the impact of your change. When no channel references the model, the block is not shown.

![The Create model form: Basic information (name, type, vendor, description, categories, tags, context, size, icon) and Price](/assets/screenshots/boss/gateway-modelmeta-02.png)

The form is split into **Basic information** and **Price**. Only **Model name** is required; everything else can be filled in later. The size field carries a `B` unit hint, and both **Categories** and **Custom tags** are multi-select, feeding the filters users see in the model marketplace.

### Type

| Label in the UI | Which models it suits |
| --- | --- |
| Chat | Chat and question-answering language models |
| Image | Text-to-image and image-to-image models |
| Video | Video generation models |
| Audio | Speech recognition or speech synthesis models |
| Embedding | Turns text into vectors for retrieval |
| Rerank | Re-orders retrieval results |

### Vendor

Options: DeepSeek, Qwen, Zhipu, Kimi, OpenAI, Anthropic, Google, MiniMax, Doubao.

:::info Two different "provider" lists
The **Vendor** here is the company that made the model. It is not the same list as the **Provider** you choose in [Channel Management](/boss/gateway/channels); pick from each list independently.
:::

### Categories

Options: Vision, MoE, Reasoning, Tools, FIM, Math, Coder. Categories are only labels that make filtering easier; they do not affect calls.

## Prices and currency

Always enter prices as **CNY / 1M Tokens**. When [Currency Configuration](/boss/gateway/currency-settings) is set to display US dollars, the page converts the values using the configured exchange rate automatically — you do not need to enter them in dollars.

## Delete a model

1. Click **Delete** on a row in the list.
2. You must **type the model name** in the confirmation dialog before the delete will run.

:::warning Check that no channel is using it first
If a channel still lists this model under **Supported Models**, deleting the card removes its price and display information. Before deleting, check the **Channel vendors** block on the edit page to see what references it.
:::

## Confirm it worked

Go back to the **Model Configuration** list: the new model appears with its type, vendor and prices. Then find a call to that model in [Call Logs](/boss/gateway/audit) — if the cost column shows an amount, the price configuration is live.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The model name cannot be changed | The name is fixed once created | The name is only an identifier; if you really need a new one, create it and delete the old entry |
| Cost is empty in Call Logs | The model has no price yet, or the called model name does not match | Add the price here and check the model name |
| The model exists but cannot be called | No channel lists it under **Supported Models** | Add the model name to the right channel in Channel Management |
| The currency shown in the list differs | Currency display is config-driven | Switch the display currency in Currency Configuration |

## Related

- [Channel Management](/boss/gateway/channels): decides which line a request actually takes
- [Currency Configuration](/boss/gateway/currency-settings): which currency prices are shown in
- [Call Logs](/boss/gateway/audit): see the cost calculated from these prices
