---
title: 'Account'
updated: '2026-10-21'
description: 'Want to know how much balance is left, how many plan credits and weekly quota remain, and how each charge was made? Start here.'
---

# Account

**Account** is AIrouter's wallet plus plan dashboard: two cards at the top show **how much balance remains** and **which plan you are on and how much of it is used**; the ledgers underneath list top-ups and charges line by line.

One common confusion up front: **this page only lets you look and reset quota. There is no top-up entry, and no switch to cancel a subscription, turn off auto-renew or turn off overage charges.** Those require an administrator.

:::tip An analogy
Like the "my account" page of a mobile carrier: balance, current plan and monthly data used are at the top, and the bill detail is underneath. Changing the plan or topping up happens somewhere else.
:::

![Account page: balance and top-up on the left, the current plan (allowance and weekly limit) on the right, and the top-up / consumption statements below](/assets/screenshots/airouter/billing-01.png)

## Before you start

- Any signed-in account works; no extra role is needed.
- All data belongs to the **currently signed-in account**; sign in as another account and you see that account's balance and ledger.

## Key concepts

| Term | Plain explanation |
| --- | --- |
| Balance | Money in the account. Buys plans and pays for overage calls |
| Current plan | The subscription in effect, shown as "product · plan" with an expiry date |
| Plan usage | How many **credits** remain out of the total, and the percentage used |
| Credits | The plan's unit, where **1 credit = CNY 0.01** |
| Weekly quota | Periodic call limits attached to the plan; there may be several (one per metric) or none |
| Quota reset coupons | How many times you may clear the used weekly quota; granted by the plan |
| Ledger | A record of every top-up, charge, refund, adjustment and plan purchase |

## Read the balance card

The first card is titled **Balance**; the number in the middle is the available balance (with currency), and **Top-up** sits at the top right.

:::warning The Top-up button is disabled
The button **cannot be clicked** right now. There is no self-service top-up, so when the balance is short, contact an administrator. A button that does nothing is by design, not a broken page.
:::

When the balance is charged:

- buying a plan (see [Subscribe](./subscribe.md));
- overage calls after plan credits run out, if overage charging is on;
- calls with no plan at all, billed at the unit price in [Prices](./prices.md).

## Read the plan card

The second card is titled **Current plan**:

| Card element | Notes |
| --- | --- |
| Plan name | Shown as "product · plan". With no active subscription it reads **No plan** |
| Expiry date | Shaped like "Expires 2026-11-30". Hidden when there is no expiry (or no plan) |
| **Reset plan** | Buys the current plan again at full price and clears credits. See below |
| **{{count}} quota resets left** | Spends one quota reset coupon to clear used weekly quota. The number is how many coupons you hold |
| **Plan usage** | "used / limit credits", with a percentage and progress bar. Shows "No usage" when no credits are configured |
| **Weekly quota** | One line per limit, "used / limit", with a percentage and progress bar; **Unlimited** when there are none |

Both **Reset plan** and the quota reset button only appear when you **have an active plan**; with no plan the card shows only **No plan**.

### Reset plan

1. Click **Reset plan** on the **Current plan** card.
2. In the confirmation dialog, check the plan, cycle, payment method and amount due.
3. If credits remain, tick "I understand unused credits are not refunded".
4. Click **Confirm reset ¥x**.

:::warning It charges the full price again
A reset is a purchase, not a free renewal. Old credits are cleared immediately and **not refunded**. Only worth it when you want the allowance back to full and the remaining credits would be wasted.
:::

### {{count}} quota resets left

This button spends a **quota reset coupon** — nothing to do with money or credits:

1. Click **{{count}} quota resets left**.
2. The dialog is titled **Reset weekly quota** and says: "This spends 1 quota reset coupon and clears used quota on the current quota plan. Plan credits and the account balance stay unchanged."
3. Click **Reset quota**.

When the button is disabled, one of these is true:

- the subscription is not **active**;
- you hold **no** quota reset coupons (the count is 0);
- the weekly quota is not **exactly one limit** (with several, there is no single limit to clear);
- the subscription has **expired**.

:::tip When you need it
The weekly quota normally recovers each period. If you must keep calling and cannot wait for the period to end, clear it manually with a coupon. Coupons are consumed one at a time, so make sure you really need it.
:::

## Read the ledgers

Two tabs sit at the bottom:

| Tab | Which types it holds |
| --- | --- |
| **Top-ups** | **Top-up**, **Refund**, **Adjustment** |
| **Charges** | **Charge**, **Plan purchase** |

Both tabs share the same columns:

| Column | Notes |
| --- | --- |
| **Time** | When the entry happened |
| **Type** | **Charge** / **Top-up** / **Refund** / **Adjustment** / **Plan purchase** |
| **Amount** | Signed. **Top-ups** show `+`, **Charges** show `-`, so money in and money out are obvious |
| **Balance** | The balance after this entry |
| **Description** | What the entry was for; over 36 characters is truncated, hover for the full text |
| **Request ID** | The related request identifier, used to reconcile against **Request Logs** under [API Keys](./token.md) |

:::info When the numbers do not reconcile
Take the **Request ID** to **Request Logs** and find the same entry; time, model and cost should line up. If there is no matching request, it is probably a top-up, refund or adjustment rather than a call.
:::

## Why a chat suddenly fails

| Message in the page or chat | Real cause | Where to fix it |
| --- | --- | --- |
| The balance is too low and the request was rejected. | The balance cannot cover the call | Check the balance here; ask an administrator to add credit; or buy a plan in [Subscribe](./subscribe.md) |
| Plan credits are used up. | Credits gone and overage charging off | Buy a new plan in [Subscribe](./subscribe.md), or ask an administrator to turn overage charging on |
| Your plan does not include this model. | The plan does not cover this model | Switch models, or ask an administrator to turn overage charging on so the balance pays |
| Weekly quota is used up. It resets at a given time. | The weekly quota hit its ceiling | Wait for the reset; if urgent, use **quota resets** while coupons last |
| The account is frozen or disabled. Contact an administrator. | Account status problem | Only an administrator can fix it |

:::warning Billing switches cannot be changed here
Auto-renew and overage charges are set **at checkout** in the confirmation dialog. This page has no switch for either, and no way to cancel a subscription. Contact an administrator to change them.
:::

## Related

- [Subscribe](./subscribe.md)
- [Prices](./prices.md)
- [Usage analysis](./usage-statistics.md)
- [API Keys](./token.md)
- [Chat](./experience.md)
