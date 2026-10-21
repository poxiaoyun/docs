---
title: Model Configuration
updated: '2026-10-21'
description: 'Give a model its business card: name, type, provider, context length and icon. Prices are not set here.'
tags:
  - boss
  - gateway
---

# Model Configuration

Model Configuration maintains a model's **business card**: what it is called, which vendor it comes from, how long its context is, and which icon it shows. The model name and description you see in lists, the model marketplace and Call Logs all read from this page.

After reading it you can create a model entry, complete its display metadata, upload an icon and delete it when no longer needed. This page **does not handle prices**; every price lives in [Rate Plans](/boss/gateway/rate-plans).

:::tip A business card and a price list are two different things
The card carries the model's public facts (name, type, context). What a call costs is written in a **rate plan**; which line the request takes is decided by [Channel Management](/boss/gateway/channels). The three are kept apart so changing one never drags the others along.
:::

:::warning Model configuration does not route traffic
A fixed note at the top of the page reads "Model configuration only manages model metadata and takes no part in model dispatch." Whether a request can use a model depends on whether a channel lists it under Supported Models.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- To change a model's price, go straight to [Rate Plans](/boss/gateway/rate-plans); there is no price field here.
- To make a model actually callable, some channel must list it in Supported Models **and** the platform default plan must price it.

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Model metadata | The description of a model: name, type, provider, categories, context, parameter scale, icon |
| Channel reference | How many channels list this model under Supported Models. It affects display only, never pricing |
| Not priced | No effective price item covers this model. Such calls end up in [Pricing Exceptions](/boss/gateway/usage-events) |
| Zero price | A price explicitly set to `0`, meaning free. Completely different from "not priced" |

## Reading the model list

| Column | Meaning |
| --- | --- |
| Model name | The model identifier, with its icon on the left and the description underneath |
| Type | Chat / Image / Video / Audio / Embedding / Rerank |
| Provider | Which company the model comes from |
| Categories | Labels such as Vision or Reasoning; several allowed |
| Context | The context window in tokens, shortened with K / M |
| Parameter scale | Model size, shown with B (billion) or T (trillion) |
| Channels | How many channels serve this model ("N"), hover to see channel names and priorities |

The list has **no price column**. Above it you can filter by **Type** and **Provider**. The menu at the end of each row offers **Edit** and **Delete**.

![Model list: model name, type, provider, categories, context, parameter scale, channels](/assets/screenshots/boss/gateway-modelmeta-01.png)

This page maintains **metadata only**. The **Channels** column shows which channels carry the model; to see which models are actually callable, go to [Channel Management](/boss/gateway/channels); to see prices, go to [Rate Plans](/boss/gateway/rate-plans).

## Creating a model

1. On the **Model Configuration** page, click **Create Model Configuration** in the top right corner.
2. Fill in the **Basic info** section:

   | Field | How to fill it | Notes |
   | --- | --- | --- |
   | Model name | For example `gpt-4o-mini` | Required and **immutable** after creation; must match the name used in channels exactly |
   | Type | Defaults to "Chat" | See "Types" below |
   | Provider | Defaults to "OpenAI" | See "Providers" below |
   | Model description | One sentence | Optional; shown under the name in the list |
   | Categories | Pick several presets | Optional; see "Categories" below |
   | Custom tags | Type and press Enter | Optional; for your own grouping |
   | Context | For example `128000` | Optional, in tokens |
   | Parameter scale | For example `7` | Optional, in B (billion); decimals allowed |

3. If the model needs an icon, click **Upload icon** and pick an image (any format, PNG / SVG are common).
4. Click **Create Model Configuration** to finish. On the edit page the button reads **Save**.

When you edit a model that channels already reference, a read-only **Channels** block appears, listing those channels and their priorities so you can judge the impact. It is hidden when nothing references the model.

![Create model configuration form: basic info (name, type, provider, description, categories, tags, context, parameter scale, icon)](/assets/screenshots/boss/gateway-modelmeta-02.png)

The form has a single **Basic info** section. **Model name** is required and everything else can be filled in later; the **Parameter scale** input shows a `B` unit suffix; **Categories** and **Custom tags** are both multi-value and are used for filtering the list.

### Types

| UI label | What it fits |
| --- | --- |
| Chat | Conversational and question-answering language models |
| Image | Text-to-image and image-to-image models |
| Video | Video generation models |
| Audio | Speech recognition or speech synthesis models |
| Embedding | Turns text into vectors for retrieval |
| Rerank | Reorders retrieval results |

### Providers

Options: DeepSeek, Qwen, Zhipu, Kimi, OpenAI, Anthropic, Google, MiniMax, Doubao.

:::info Two different "provider" lists
The provider here is the company that made the model. It is a different list from the **Provider** you pick in [Channel Management](/boss/gateway/channels); pick each on its own page.
:::

### Categories

Options: Vision, MoE, Reasoning, Tools, FIM, Math, Coder. Categories are labels for filtering only and never affect a call.

## Where to change prices

This page has **no price field** and cannot change what a call costs. Prices are maintained in [Rate Plans](/boss/gateway/rate-plans):

1. Open **Model Services → Rate Plans**.
2. Find the plan with a star (the platform default plan) and click **Set price** at the end of its row.
3. In **Model match**, enter this model's name (you can pick it from the models your channels expose), fill in the input and output prices and save.

Calls made after that are priced with the new price; calls that already happened keep the pricing snapshot taken at the time and are never recalculated.

:::warning The model name must match exactly
The model match in a rate plan, the Supported Models of a channel, and the model name in the caller's request must all line up before the price is found. One extra space or a different case can turn the call into "not priced".
:::

## Editing and deleting

- **Edit**: click **Edit** at the end of a row to change type, provider, description, categories, tags, context, parameter scale and icon. The **model name** is greyed out and read-only.
- **Delete**: click **Delete** at the end of a row and **type the model name** in the dialog before it is removed.

:::warning Check that no channel uses it first
If a channel still lists this model under Supported Models, deleting the card removes the record from lists and the model marketplace. Check the **Channels** block on the edit page before deleting.
:::

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Cannot change the model name | The name is fixed after creation | The name is only an identifier; create a new one and delete the old one if you must rename |
| Cannot find any price here | This page never handles prices | Set or read prices in [Rate Plans](/boss/gateway/rate-plans) |
| Call Logs shows "Not priced" | No effective price item covers this model | Add a currently effective price for it in Rate Plans, or reprice it in [Pricing Exceptions](/boss/gateway/usage-events) |
| The model exists but cannot be called | No channel lists it under Supported Models | Add the model name to a channel and confirm it is priced |
| Channel count is 0 | Nothing references the model | Expected; add the model name to a channel's Supported Models |

## Related

- [Rate Plans](/boss/gateway/rate-plans): every price is set there
- [Channel Management](/boss/gateway/channels): decides the route a request actually takes
- [Pricing Exceptions](/boss/gateway/usage-events): reprice calls that produced no cost
- [Currency Configuration](/boss/gateway/currency-settings): which currency amounts display in
