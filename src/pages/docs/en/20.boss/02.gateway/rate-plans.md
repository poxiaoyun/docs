---
title: Rate Plans
updated: '2026-10-21'
description: 'Price your models: create the platform default plan, append price items, understand model-wide prices and channel overrides, and change prices safely.'
tags:
  - boss
  - gateway
---

# Rate Plans

A rate plan is the platform's **price list**. Every call turns its tokens into money using the prices written here. Models without their own price are billed by the **platform default plan**.

After reading this you can create a plan, set prices for models, read the window and channel override of each item, run an impact check before changing prices, and disable or switch the default plan safely.

:::tip A price list only changes the future
A rate plan is like a restaurant menu: change the price today and today's later bills use the new price, while yesterday's closed bills are never recalculated. That is why you never "edit an old price" — you **append a new one** and let the old one end.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Understand one rule first: **the platform keeps exactly one default plan**. Marking a plan as default clears the mark on the others.
- If all you need is to enable a channel, the minimum is one **currently effective** price item for that model in the default plan.

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Rate plan | One price list. Every price belongs to exactly one plan |
| Default plan | The plan with a star. Models without their own price use it; there is exactly one |
| Price item | One row in a plan: which models, which channel, what price, and when it applies |
| Model match | Which models a price applies to: an exact name, a glob such as `gpt-*`, or `*` for all models |
| Channel override | A price that applies only on one channel. Empty means a **model-wide price** |
| Model-wide price | A price not tied to a channel; it is used no matter which channel serves the request |
| Not priced | No effective item covers the model, so calls are recorded as price missing |
| Zero price | A price explicitly set to `0`, meaning free. A different state from "not priced" |
| Price layer | Which price this call finally used: dedicated rate, plan rate, account rate, tenant default, platform default, catalog price, reprice |

:::info Amounts carry up to 6 decimal places
Prices are entered as decimals with at most 6 decimal places. Storage is in micro-units (CNY 1 = 1,000,000 micro-units), while the page still shows an ordinary amount.
:::

## Reading the plan list

| Column | Meaning |
| --- | --- |
| Name | The plan name; the default plan carries a star. Click it to open its price items |
| Default | Yes / No. Only one plan is "Yes" |
| Price items | How many prices the plan holds, shown as "N items" |
| Status | Enabled / Disabled |

Above the list there is a **Status** filter with **Enabled** and **All**, and it **shows only enabled plans by default**. Switch to All to see disabled plans.

The collapsed menu at the end of each row offers five actions:

| Action | What it does |
| --- | --- |
| Edit plan | Change the name, status and default flag |
| Price items | Open the detail page with current and historical prices |
| Set price | Append a price item straight to this plan |
| Impact | See how many accounts, key bindings and channels a disable would affect |
| Clone plan | Only shown for the default plan; copies it with a discount |

![Rate plan list: name with a star on the default plan, default, price item count, status, and the status filter](/assets/screenshots/boss/gateway-rate-plans-01.png)

## Creating a plan

1. Click **Create rate plan** in the top right corner.
2. Enter a **Name** (required).
3. Choose whether it is **Default** (Yes / No); the default is "No".
4. Click **Save**.

Two notes sit at the top of the dialog: create an empty plan first, then add prices; and when Default is set to Yes, a warning appears — **setting this plan as the default clears the default mark on every other plan. The platform keeps only this one.**

:::info Starting with an empty plan is normal
A new plan holds no prices, and that is fine: prices are appended one at a time with **Set price**. An empty plan marked as default would turn every previously priced model into "not priced", so the usual order is: create the plan → add prices → confirm → then mark it default.
:::

## Setting a price

Setting a price **appends one item** to a plan. There are two entrances: **Set price** at the end of a row in the plan list, or **Set price** in the top right corner of the detail page.

1. Pick or type a model in **Model match**. The dropdown lists every model your channels expose, and each option is tagged with its current state (not priced / 0 CNY / current price).
2. Leave **Channel override** empty to make this the model's **model-wide price**; pick a channel only when that one channel needs its own price.
3. Fill in **Input price** and **Output price** — both required, in CNY per million tokens. `0` means free and an empty value is not allowed.
4. Optionally fill **Cache read price**, **Cache write price** (default `0`) and **Per-request price** (default `0`, in CNY per request).
5. Click **Save**.

| Field | Required | Unit | Notes |
| --- | --- | --- | --- |
| Model match | Yes | — | Exact name, glob, or `*` |
| Channel override | No | — | Empty means model-wide |
| Input price | Yes | CNY / 1M tokens | Charges the tokens sent to the model |
| Output price | Yes | CNY / 1M tokens | Charges the tokens the model returns |
| Cache read price | No | CNY / 1M tokens | Charged when the request reads from a cache hit |
| Cache write price | No | CNY / 1M tokens | Charged when this request writes its context into the cache |
| Per-request price | No | CNY per request | Charged once per **successful** request; failures are free. Suits image or speech models |

:::warning Empty is not "not priced"
An empty value keeps the Save button disabled; only a number can be saved. To express "this model has no price", the correct move is to **not create the item** and let the call land in [Pricing Exceptions](/boss/gateway/usage-events) — not to type `0`, which is read as free.
:::

## Reading the price items

Click a plan name in the list (or **Price items** at the end of a row) to open the detail page. A note at the top explains that current prices still drive billing, while historical prices only explain past charges.

| Column | Meaning |
| --- | --- |
| Model match | The models this price covers, followed by an "Effective" or "Expired" badge. `*` is shown as "\*(All models)" |
| Channel override | Empty means a model-wide price; a deleted channel is marked "Channel unavailable", a disabled one "Channel disabled" |
| Input price, Output price, Cache read price, Cache write price | CNY / 1M tokens. A column without its own price shows "Unified price" (meaning the model-wide price); with no price at all it shows "Not priced" |
| Per-request price | CNY per request |
| Effective from | When this price starts to apply |
| Effective to | "Open" when there is no end |

Above the list is a **Window** filter: **Effective** (default) or **All**. Switch to All to see expired historical prices.

The only row action is **End early**, and it appears only for a real item that has no end time yet.

## Ending a price early

1. Open the detail page and set the **Window** filter to **Effective**.
2. Find the price to stop and click **End early** at the end of its row.
3. The end time becomes "now", and the price no longer takes part in billing.

:::error When this is rejected
If ending the price would leave a model on an **enabled channel** without a price, the control plane refuses and reports "Enabled channels would lose a price: (model names)".

The right fix: append a new effective price for those models first, then end the old one — or disable the channels involved first.
:::

## Impact analysis

Click **Impact** at the end of a plan row to see what that plan currently affects:

| Message | Meaning |
| --- | --- |
| Affects N accounts and M token bindings. Falls back to X | That many people and keys move to the fallback plan if this one is disabled |
| Loses the default price | The models that would lose their default price |
| Enabled channels would lose a price | These channels could no longer stay enabled without a price |
| Affected channels | Which channels exactly |
| Plans X convert credits with this rate plan | A plan package references this rate plan. **Move those packages to another rate plan before disabling** |

Run an impact check before disabling a plan, deleting it, or clearing its default flag — it is far cheaper than reconciling bills afterwards.

## Cloning a plan

**Clone plan** only appears for the default plan and is the quick way to build an identically priced plan at a discount.

1. Click **Clone plan** on the default plan's row.
2. Enter the new plan's name.
3. Enter the **Discount**: `10` keeps the original price, `8` is 80%, `8.5` is 85%.
4. Click **Save**.

The clone copies only the prices that are **currently effective** on the default plan; historical prices are left behind. Every copied price can still be edited afterwards.

## Disabling a plan and switching the default

- **Disable**: set Status to "Disabled" in **Edit plan**. A disabled plan no longer takes part in billing; any package that references it must be moved first.
- **Switch the default**: mark another plan as default. The previous default loses its mark automatically.

:::warning The default plan cannot be unset directly
When you edit the default plan, the **Default** field is disabled with the note "This is the platform's only default plan and cannot be cleared here. Mark another plan as the default to replace it."
:::

## Live price tool

**Live prices** in the top right corner of the detail page pulls a set of upstream list prices so you can compare them with your own.

| Element | Meaning |
| --- | --- |
| Fetched | When this batch of prices was retrieved |
| Platform rate | How many USD one CNY buys, and how many CNY one USD buys |
| Fetch again | Pull the latest prices once more |
| Search models | Filter this batch by model name |
| Provider | Which vendor each price comes from |

:::info When prices cannot be fetched
If no new prices arrive, the dialog notes that the table still shows the last result cached in the browser. If no CNY-to-USD rate is configured, only USD prices are shown — set the rate in [Currency Configuration](/boss/gateway/currency-settings) first.
:::

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The plan list is empty | The filter sits on Enabled while all plans are disabled | Switch **Status** to **All** |
| Save stays disabled | Input price or output price is empty | Both are required; type `0` if the model should be free |
| Call Logs shows "Not priced" | No effective item covers the model, or the name does not match | Add a currently effective price and match the name exactly |
| An item is marked "Channel unavailable" | The channel that price was bound to was deleted | Append a model-wide price, or bind it to an existing channel |
| Ending a price is rejected | An enabled channel would lose its price | Add the new price first, or disable the channel |
| Cannot disable a plan | A package converts credits with it | Move those packages to another rate plan first |
| An old price cannot be edited | Prices that have taken effect are immutable | Append a new price so the old one ends, or **End early** manually |

## Related

- [Billing Accounts](/boss/gateway/billing-accounts): which account the money comes out of
- [Plan Packages](/boss/gateway/billing-plans): which plan converts amounts into credits
- [Pricing Exceptions](/boss/gateway/usage-events): calls that matched no price are repriced here
- [Call Logs](/boss/gateway/audit): which price layer each call used
- [Currency Configuration](/boss/gateway/currency-settings): the display currency of amounts
