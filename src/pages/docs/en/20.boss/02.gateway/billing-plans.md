---
title: Plans
updated: '2026-10-21'
description: 'Maintain the programs and plan tiers you sell: design tiers, credits, cycles and benefits, and understand how credits convert into usage.'
tags:
  - boss
  - gateway
---

# Plans

A plan is **a pack of usage bought in advance**: pay once, receive a batch of credits for a period, and calls consume credits first. This page maintains *what you sell* — create a program (the container for a set of plans), then create plan tiers under it.

After reading it you can create a program, add plan tiers, work out how long a credit pack lasts, set recommendations and renewal, and judge whether a plan can be deleted.

:::tip A program is a booklet, a plan is one page in it
One program can hold several tiers: Basic, Pro, Ultimate. Users buy **one tier**, not the whole program. The program only groups similar tiers together and decides which tenants can see them.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Have at least one [Rate Plan](/boss/gateway/rate-plans) ready: plan credits are converted with it.
- This page **only maintains what you sell**; it does not grant anything. To give someone a plan, go to [Subscription Management](/boss/gateway/billing-subscriptions).

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Program | The container for a set of plans, also called the product. It decides which tenants can see and buy them |
| Plan | One specific tier for sale: how much it costs, how many credits, how long, what benefits |
| Plan level | The tier number inside a program. A higher number is a higher tier and must cost more |
| Credits | The allowance included in a tier; 1 credit = CNY 0.01 |
| Billing cycle | Monthly / Quarterly / Yearly. Decides how often the tier renews |
| Credit reset | Do not reset / Reset monthly. Decides whether credits refill inside a cycle |
| Auto-renew | Renew at the same price when the cycle ends and grant credits again; off means the subscription ends |
| Recommended | Highlights this tier on the user's subscription page |
| Tagline | A short line shown under the plan name |
| Benefits | A list of one-line selling points shown under the price |

## Page layout

The page is split into two parts:

- **Top half**: program cards. Each card shows the program name, status, plan count and tenant count (or "Platform" when no tenant is linked), with **Edit** in the bottom right corner.
- **Bottom half**: the plan table for the selected program. With nothing selected it reads "Choose a program above to view and maintain its plans."
- Two buttons sit in the top right corner: **Create program** and **Create plan**.

![Plans page: program cards on top, the selected program’s plan table below](/assets/screenshots/boss/gateway-billing-plans-01.png)

## Creating and editing a program

1. Click **Create program** in the top right corner.
2. Enter a **Name** (required).
3. Enter a **Description** (optional).
4. Choose the **Status**: enabled / disabled, enabled by default.
5. Choose **Tenant**: any number. **Leaving it unset makes the program visible to every user** (the card then shows "Platform").
6. Click **Save**.

To change a program, click **Edit** in the bottom right of its card: name, description, status and tenants are editable, and the dialog also offers **Delete program**.

## Creating a plan

1. **Click a program** in the top half first — a plan must belong to one.
2. Click **Create plan** in the top right corner.
3. Fill in each field:

   | Field | How to fill it | Notes |
   | --- | --- | --- |
   | Program | Pick the owning program | Required |
   | Name | For example "Pro monthly" | Required |
   | Price | For example `99` | Required, in CNY, at most 6 decimal places |
   | Billing cycle | Monthly / Quarterly / Yearly | Required, defaults to Monthly |
   | Plan level | For example `2` | Required, `1`–`1000`. Unique inside a program, and a higher level must cost more |
   | Credits | For example `10000` | A positive integer. **Credits require a rate plan** |
   | Rate plan | Pick a rate plan | Credits are converted with it, per-request prices included |
   | Credit reset | Do not reset / Reset monthly | Defaults to Do not reset |
   | Auto-renew | On / Off | Off by default. When on, the tier renews at the same price and grants credits again |
   | Recommended | On / Off | Off by default. When on, the tier is highlighted on the user's subscription page |
   | Tagline | One sentence | Optional, shown under the plan name |
   | Benefits | One per line | Optional, shown under the price; when empty the credits and renewal lines are shown instead |

4. Click **Save**.

:::warning Changing credits only affects the future
Editing a plan updates the credits of that tier only; **existing subscriptions** pick up the new credits when they renew or are activated again. To make it effective immediately, cancel the subscription and grant it again.
:::

## Reading the plan table

| Column | Meaning |
| --- | --- |
| Name | The plan name |
| Plan level | The tier number, sorted low to high |
| Price | Amount plus currency |
| Billing cycle | Monthly / Quarterly / Yearly |
| Credits | Shown as "N credits (worth about ¥X)" |
| Credit reset | Do not reset / Reset monthly |
| Auto-renew | Yes / No |
| Recommended | Yes / No |
| Status | Enabled / Disabled |

The row menu offers **Edit plan** and **Delete plan**.

## How credits are converted

A credit is not "a call" — it is **another unit of money**: 1 credit = CNY 0.01. Each call is first priced by the rate plan, then divided by 0.01 to get the credits to deduct.

> Credits deducted = request cost (CNY) ÷ 0.01

The cost itself is calculated as:

> Request cost = input tokens ÷ 1,000,000 × input price + output tokens ÷ 1,000,000 × output price + cache read/write likewise + per-request price

For example: input price 2 and output price 8 (CNY per million tokens); one request uses 1,000,000 input tokens and 200,000 output tokens, so the cost is 1 × 2 + 0.2 × 8 = CNY 3.6, deducting **360 credits**. A model priced at CNY 0.2 per request deducts **20 credits** each time.

:::info What happens when credits run out
The **Overage charge** switch on the subscription decides: when on, the extra usage keeps being priced and deducted from the account balance; when off, the call is refused. Credits and balance are two independent gates.
:::

:::warning Unpriced models do not consume credits
A model missing from the rate plan is not converted into credits; it goes down the overage path and leaves a price-missing record in [Pricing Exceptions](/boss/gateway/usage-events). A plan is not a permit to use unpriced models.
:::

## Deleting programs and plans

| Operation | Restriction | Message |
| --- | --- | --- |
| Delete program | Refused while the program still has plans | Delete program X. This is refused while the program still has plans. |
| Delete plan | Refused while anyone is subscribed | Delete plan X. This is refused while anyone is subscribed. |

:::warning Deletion is irreversible
A deleted program or plan cannot be restored. Subscriptions block the deletion of a plan, and that guard should not be worked around — handle the subscriptions first, then delete what you sell.
:::

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| A plan cannot be saved | No program selected, no level, or credits filled without a rate plan | Complete the required fields; credits and the rate plan must come together |
| Level is reported as duplicate, or price is rejected | Levels must be unique inside a program, and a higher level must cost more | Adjust the level or the price |
| A user cannot see the tier | The program is limited to tenants that exclude them, or the plan/program is disabled | Check the linked tenants and the status |
| A subscription is not consuming credits | The model is not priced in the rate plan the plan references | Add the price there; credits are converted only by that plan |
| Credits changed but the user sees no difference | Active subscriptions only pick up new credits on renewal or re-activation | Expected; cancel and re-grant if it must apply immediately |
| A plan cannot be deleted | Someone is subscribed | Cancel those subscriptions first |

## Related

- [Rate Plans](/boss/gateway/rate-plans): credits are converted with it, and a plan in use cannot be disabled
- [Subscription Management](/boss/gateway/billing-subscriptions): grant a plan to a person
- [Billing Accounts](/boss/gateway/billing-accounts): which balance is charged once credits run out
- [Pricing Exceptions](/boss/gateway/usage-events): reprice usage that could not be priced
