---
title: 'Prices'
updated: '2026-10-21'
description: 'Want to know the unit price your account pays per model, why one model shows several price rows, and what to do when a price is missing?'
---

# Prices

**Prices** answers one concrete question: **for this account, calling this model, how much per million tokens?**

The description at the top of the page is blunt — "Model prices from the rate plan associated with this account." So this is **your** price list, not a public catalogue: the same model can show different numbers for different accounts.

:::tip An analogy
Like a staff price list: the tags are printed centrally, but the copy in your hands shows "the price your department negotiated". **Prices** is your copy.
:::

![Prices page: the note "Shows model prices from the rate plan linked to your account in the operations platform", with input / output / cache-read / cache-write / per-call price per model](/assets/screenshots/airouter/prices-01.png)

## Before you start

- Any signed-in account works; no extra role is needed.
- The account must have a **rate plan** attached in the operations console. Without one, the page shows "This account has no associated rate plan." and you need an administrator.
- This page only **shows** prices; nothing here can be edited. Prices are configured by administrators, and users have no edit entry.

## Key concepts

| Term | Plain explanation |
| --- | --- |
| Rate plan | A price list an administrator attaches to an account, holding "which model, what price" line by line |
| Key rate | A price bound to a specific API key; it applies only when that key makes the call, and outranks other layers |
| Plan rate | The price that comes with an active subscription |
| Account rate | A price attached directly to your single account |
| Tenant default | The default price shared by your whole tenant |
| Platform default | The platform-wide fallback price |
| Default unified price | When none of the above match, every model is billed at this one price |
| Per-request price | For models not billed by tokens (images, audio), the price per single call |

## How to read the table

The page is one table, one row per model. The left five columns describe the model, the right five are prices:

| Column | Meaning |
| --- | --- |
| **Model** | The model ID, with an icon to make scanning easier |
| **Context** | How much the model remembers at once, shown as `32K`, `128K`, `1M`; `-` when not configured |
| **Capabilities** | Category tags such as **Vision**, **Reasoning**, **Coder**; `-` when not configured |
| **Type** | **Chat**, **Image**, **Video**, **Audio**, **Embedding**, **Rerank**; `-` when not configured |
| **Parameters** | Parameter scale in `B` (billion), shown as `T` above 1000; `-` when not configured |
| **Input price** | Your prompt and context, billed at this price. Unit: **CNY / million tokens** |
| **Output price** | What the model generates, billed at this price. Unit: **CNY / million tokens** |
| **Cache read price** | Price when context is reused from cache. Unit: **CNY / million tokens** |
| **Cache write price** | Price for writing context into cache. Unit: **CNY / million tokens** |
| **Per-request price** | For per-call billing. Unit: **CNY / request** |

:::info Read the unit carefully
Each price column carries its unit underneath: the first four are "**CNY / million tokens**", the last is "**CNY / request**". An input price of `2` means **CNY 2 per million tokens**, not CNY 2 per message.
:::

### Three price states

A price cell has exactly three appearances, and the colour tells you the state:

| Appearance | Meaning | How to read it |
| --- | --- | --- |
| Green background with a number | **Priced** | This is the current unit price; cost is computed from it |
| Amber background reading **Unified price** | The model has no price of its own and falls back to the default unified price | The actual number is on the **Default unified price** row |
| Grey **Unpriced** chip | No price for this item | Cannot be used for billing; ask an administrator to add one |

### Why one model has several rows

When a model has more than one price (usually different prices per channel), a **More prices** button appears next to its name:

1. Click **More prices** and the **Channel** rows expand under the model, each titled like "**Channel (channel-name)**".
2. The **highest priority** row carries a black **Default price** label — that is what applies when you do not name a channel.
3. Click **Hide** to fold them again.

:::tip Why channels have separate prices
One model may be served from several sources with different costs, so their prices differ. The default price is "the price of the route taken when you do not name one".
:::

### The default unified price row

One row is named **Default unified price** (internally the "all models" wildcard entry). An info icon next to it says "Models without their own price are billed at the unified price."

When this row exists, the account has a fallback price: **every model without its own price is billed at it**. Without this row, models without a price are genuinely unpriced.

## Who decides the price you actually pay

For a given call, the price is resolved top-down in this order; **the first match wins** and nothing below it is consulted:

| Order | Pricing layer | Plain explanation |
| --- | --- | --- |
| 1 | **Key rate** | The key used for this call has its own rate, so use it |
| 2 | **Plan rate** | Your subscription carries a rate, so use the in-plan price |
| 3 | **Account rate** | A rate attached to your single account |
| 4 | **Tenant default** | The default rate for your tenant |
| 5 | **Platform default** | The platform-wide default rate |
| 6 | **Default unified price** | Nothing above matched, so the unified price applies |

:::warning All of this is configured by administrators
The order is fixed, but **what each layer contains and whether it is enabled is entirely up to administrators in the operations console**. Users can neither see nor change it. If a price does not match expectations, send the model ID and the price you see to an administrator.
:::

## When you cannot find a price

| Symptom | Cause | What to do |
| --- | --- | --- |
| The whole page shows "This account has no associated rate plan." | The account has no rate plan at all | Ask an administrator to attach one |
| A model's price cells are all **Unpriced** | The rate plan has no entry for it and no unified fallback | Ask an administrator to add a price; until then the model cannot be used in [Chat](./experience.md) |
| You want the actual cost of one model's calls | This page only lists unit prices | Check the amount in [Usage analysis](./usage-statistics.md), and line-by-line detail in **Request Logs** under [API Keys](./token.md) |
| Some cells show `-` | Context, capabilities, type or parameter scale is not configured | It does not affect billing, only readability |

## Related

- [Subscribe](./subscribe.md)
- [Account](./billing.md)
- [Usage analysis](./usage-statistics.md)
- [Models](./marketplace.md)
- [API docs](./api-docs.md)
