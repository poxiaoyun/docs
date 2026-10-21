---
title: 'Subscribe'
updated: '2026-10-21'
description: 'Buying a plan but unsure about products, tiers, billing cycles, auto-renew and overage charges? Read this page first.'
---

# Subscribe

**Subscribe** is where you buy a plan: pick a product, choose a tier, confirm the billing cycle, and pay from your **account balance**. Afterwards, chats spend the plan's **credits** first, and once credits run out the rules you chose at checkout take over.

This page covers: how to find the plan you want, what the four button states mean, whether to flip the two switches in the confirmation dialog, and how upgrade differs from reset.

:::tip An analogy
Like buying a mobile data bundle: the product is "data package", the tiers are 5 GB / 20 GB / 50 GB, the cycle is monthly or yearly. Plan credits are the "data", and the overage switch decides whether you get cut off or keep paying per use.
:::

![Subscriptions page: the Plus / Ultra / Pro plan cards of the Coding Plan product, with the buttons "Cannot change current subscription", "Your current plan" and "Upgrade to this plan"](/assets/screenshots/airouter/subscribe-01.png)

## Before you start

- Any signed-in account works; no extra role is needed.
- **The account balance must be sufficient.** Every payment comes from the account balance, and **there is no top-up entry on this page** — when it is too low you get "Not enough balance to buy this plan. Contact an administrator to add credit."
- To compare unit prices first, see [Prices](./prices.md); to see how many credits are left, see [Account](./billing.md).

## Key concepts

| Term | Plain explanation |
| --- | --- |
| Product | A group of plans, for example "Standard" or "Enterprise". The **Subscribe** dropdown in the top nav lists products |
| Plan | One tier inside a product, e.g. Starter / Pro / Ultimate. Higher tiers usually carry more allowance |
| Billing cycle | Whether a tier is sold by **month**, **quarter** or **year** |
| Credits | The unit inside a plan, where **1 credit = CNY 0.01**. Cards say "Includes N credits (worth ¥X)" |
| Credit reset | Whether the allowance is **cleared and refilled monthly**. Plans that do not reset monthly grant the allowance once at purchase |
| Weekly quota | A periodic call limit attached to the plan; remaining amount is shown in [Account](./billing.md) |
| Auto-renew | Charge one more period from the balance automatically at expiry |
| Overage charges | Whether calls may keep charging the balance after credits run out |
| Exclusive plan | A product only offered to specific accounts; labelled in the dropdown and on the page |

## Pick a plan

1. Click **Subscribe** in the top nav; the dropdown lists the products you can buy, with **Exclusive plan** labels where applicable. With nothing available it shows **No plans**; while loading it shows **Loading plans**.
2. Click a product to open its plan page. The top shows the product name and description, plus an **Exclusive plan** label for exclusive products.
3. Plan cards are ordered by tier from left to right, four per row; more than four tiers scroll horizontally. Each card carries:

   | Card element | Meaning |
   | --- | --- |
   | Plan name | The tier's name, largest text on the card |
   | **Recommended** label | The product's featured tier, with a coloured border |
   | Tagline + description | Who the tier suits and what it is for |
   | Button | See the four states below |
   | Price | Shaped like `¥99 / month`, `¥299 / quarter`, `¥999 / year` |
   | Bullet list | How many credits (and their worth), whether the allowance resets monthly, whether it renews automatically |

4. The button has four states — read it before clicking:

   | Button text | Meaning | Clickable |
   | --- | --- | --- |
   | **Subscribe** | You have no active subscription and this tier can be bought | Yes |
   | **Upgrade to this plan** | You have a subscription and this is a higher tier of the same product | Yes |
   | **Your current plan** | This is the tier you are on | No, greyed out |
   | **Not available for your plan** | Cannot be chosen: a downgrade, same level, different product, or the tiers are unranked | No, greyed out |

:::info Why upgrades only
The rule is: with an active subscription you **can only upgrade to a higher tier of the same product**. To downgrade, cancel the current subscription or wait until it expires. The page gives you no way around it.
:::

## Confirm the subscription

Clicking a button opens a confirmation dialog. Check every line and the amount:

| Dialog item | Notes |
| --- | --- |
| Title | **Confirm subscription** for a first purchase; **Confirm upgrade** for an upgrade |
| **Plan** | Shown as "product · plan", with "Includes N credits (worth ¥X)" underneath |
| Amount + period | The tier price at the top right, with **monthly** / **quarterly** / **yearly** underneath |
| **Billing cycle** | **Monthly** / **Quarterly** / **Yearly** |
| **Credit reset** | **Allowance resets every month** or **Allowance does not reset monthly** |
| **Pay with** | Always **Account balance**; not changeable |
| **Auto-renew** | A switch — see below |
| **Overage charges** | A switch — see below |
| **Amount due** | What will actually be charged |
| Bottom buttons | **Cancel** on the left; **Confirm · ¥x** on the right (**Confirm upgrade** when upgrading) |

:::warning These two switches are set once
**Auto-renew** and **Overage charges** are only set here, at checkout. Afterwards the [Account](./billing.md) page has **no** control to change either of them, and **no** button to cancel a subscription. To change them later, contact an administrator.
:::

### Auto-renew

When it is on, the dialog shows "¥x / month will be charged automatically at expiry" (the period changes for quarterly and yearly tiers).

- **On**: at expiry one period is charged from the balance automatically; if the balance is short, the plan lapses.
- **Off**: the plan simply ends; nothing is charged, and you come back to buy again when you need it.

:::tip When to turn it off
For trials, short projects, or when you want spending fully under control. For steady long-term use, turn it on so calls do not suddenly stop because you forgot to renew.
:::

### Overage charges

The hint under the switch reads: "After the plan credits run out, keep charging the balance. When off, calls stop even if the account still has a balance."

- **On**: calls continue past the credit limit, and the excess is charged from the balance at the unit price in [Prices](./prices.md).
- **Off**: calls stop the moment credits hit the ceiling, no matter how much balance remains. Chats then report "Plan credits are used up. Turn on overage charging to keep going; the extra is paid from your balance."

:::warning Turn it off and money will not help you
This is the most common trap: assuming "I still have balance" means you can keep calling. Either turn overage charging on, or buy a new plan in time.
:::

## Upgrading and downgrading

| What you want | Allowed | How |
| --- | --- | --- |
| Upgrade to a higher tier of the same product | Yes | Click **Upgrade to this plan**; the dialog title is **Confirm upgrade** |
| Downgrade to a lower tier | No | "Your subscription can only be upgraded to a higher level of the same product. To downgrade, cancel it or wait until it expires." |
| Switch to another product | Not directly | Same rule: end the current subscription first |
| Buy the current tier again | No | The button reads **Your current plan** and is greyed out |

An upgrade is bought at the **new plan's full price**, not as a top-up of the difference. The dialog explains that your current plan ends and is refunded to your balance **in proportion to its unused credits** (the page shows an estimated refund; the final amount follows the unused credits when it is credited).

:::info Do the maths before upgrading
Because an upgrade charges the full price again and only returns unused credits, **upgrading near expiry rarely pays** — little remains unused, so the refund is small. Consider waiting for the plan to expire and then buying the higher tier.
:::

## Reset the current plan

"Reset" is not a renewal: it **buys the current plan again at full price**. It charges the full amount, clears the current credits, and **does not refund** unused credits.

1. Go to [Account](./billing.md) and click **Reset plan** on the **Current plan** card.
2. The dialog title is **Reset plan**. It only lists the plan, cycle, payment method and amount due — **no** auto-renew or overage switches (those keep their existing values).
3. If credits remain, you must tick "I understand unused credits are not refunded" before continuing.
4. Click **Confirm reset ¥x**.

:::warning This cannot be undone
After a reset the old credits are void immediately — not converted, not refunded. It is only worth doing when you want the allowance back to full and the remaining credits would be wasted anyway.
:::

## When the plan you want is missing

| Symptom | Cause | What to do |
| --- | --- | --- |
| The dropdown shows **No plans** | You have no purchasable products | Ask an administrator to enable products or plans |
| The dropdown shows **Loading plans** forever | Plan data never arrived | Refresh the page; if it persists, contact an administrator |
| The page says "This plan is not available to buy." | The product in the link does not exist or was withdrawn | Pick a product again from the **Subscribe** dropdown |
| The dialog says "This plan has no credits or rate plan configured yet and cannot be bought. Please contact an administrator." | The tier lacks credits or price configuration | Ask an administrator to complete it, or choose another tier |
| The dialog says "Not enough balance to buy this plan. Contact an administrator to add credit." | The balance cannot cover the full amount | Ask an administrator to add credit, then buy |
| The dialog says "This purchase was already used for another plan. Start a new purchase." | The previous order was already consumed (duplicate submit or page replay) | Close the dialog and run the purchase again |
| A button is grey and does nothing | It is **Your current plan** or **Not available for your plan** | Follow the upgrade/downgrade rules above |

## Related

- [Account](./billing.md)
- [Prices](./prices.md)
- [Usage analysis](./usage-statistics.md)
- [Chat](./experience.md)
