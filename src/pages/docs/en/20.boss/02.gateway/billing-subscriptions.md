---
title: Subscriptions
updated: '2026-10-21'
description: 'Manage who is on which plan: grant subscriptions, toggle overage charging and auto-renew, set reset coupons, and cancel.'
tags:
  - boss
  - gateway
---

# Subscriptions

A subscription is **the plan currently active for one person**. It decides which plan's credits a call consumes during that period, and whether the person can keep calling once those credits are gone. Granting happens only on this page; the Plans page only maintains what is for sale.

After reading it you can grant a plan to someone, list every active and ending subscription, toggle overage charging and auto-renew, set reset coupons, and cancel a subscription.

:::tip A subscription is a gym membership valid for a period
The card holds a number of entries (plan credits), an expiry date (end time), whether you may keep entering after they run out (overage charge), and whether it renews by itself (auto-renew). The card is issued here; the shop that prices it is the Plans page.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- A usable [plan](/boss/gateway/billing-plans) must exist first; without one there is nothing to grant.
- The person must already have a [billing account](/boss/gateway/billing-accounts), which is created automatically on registration, when a key is created, or when they open the billing page.

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Subscription | One active plan bound to a person's account |
| Active | Credits are being deducted right now. Only this state allows changes or cancellation |
| Pending | Granted, but the start time has not arrived |
| Expired | The cycle ended and no more credits are deducted |
| Canceled | Canceled by an administrator; it stops immediately |
| Credits used | How many credits this cycle has consumed, shown as a used / total progress bar |
| Overage charge | Whether usage beyond the credits keeps charging the account balance. When off, calls are refused outright |
| Auto-renew | Renew at the same price at the end of the cycle and grant credits again |
| Quota reset coupons | Extra "reset the allowance once" uses. Only editable here; purchases, upgrades and renewals never change the count |

## The list and its filters

| Column | Meaning |
| --- | --- |
| User | Who owns the subscription, shown as nickname (or user ID when there is none) |
| Program | The program the plan belongs to |
| Plan | The specific tier |
| Status | Active / Pending / Expired / Canceled |
| Credits used | Used / total with a progress bar |
| Overage charge | Yes / No |
| Auto-renew | Yes / No |
| Quota reset coupons | Remaining count |
| Ends | When this cycle ends |

There are two filters:

- **Status**: defaults to **Active**, with All / Pending / Expired / Canceled available. Switch to All to review history.
- **User**: the dropdown lists **only people who have subscriptions**, sorted by nickname.

The search box matches user ID, nickname, plan name and program name — any one of them counts as a hit.

![Subscription list: status filter defaults to Active, credit usage bar and overage charge column](/assets/screenshots/boss/gateway-subscriptions-01.png)

## Granting a subscription

1. Click **Grant subscription** in the top right corner.
2. Pick the **User account** (searchable by user name or user ID). Arriving from the accounts page pre-selects that person.
3. Pick the **Program** (usually only one exists on the platform, and it is auto-selected when so).
4. Pick the **Plan**. Disabled plans are still listed and tagged "Disabled" — an administrator grant is not limited by whether it is on sale.
5. Click **Confirm**.

:::info An administrator grant does not charge the balance
Granting from this page is free: nothing is deducted from the account balance and no free trial starts. Paying for a plan happens in the Console billing center.
:::

:::warning Granting the same tier twice needs care
When an active subscription already exists, granting another recomputes credits and the end time from the new subscription. Check whether the person already has an active one first — the status filter already defaults to Active.
:::

## Toggling overage charging and auto-renew

Both live in the row menu and appear as "turn on / turn off" pairs. They are **available only for active subscriptions**.

| Action | Effect |
| --- | --- |
| Allow overage charges | Once credits run out, extra usage is priced and deducted from the account balance |
| Stop overage charges | Once credits run out, calls are refused even if the account still holds money |
| Turn on auto-renew | Renew at the same price at the end of the cycle and grant credits again |
| Turn off auto-renew | The subscription simply ends at the end of the cycle |

:::info Stopping overage charging is a hard stop
It is tempting to read it as "stop topping up automatically". The real effect is harsher: as soon as credits hit zero, requests are rejected. Tell the customer before you switch it off.
:::

## Setting reset coupons

1. On an active subscription's row, click **Set reset coupons**.
2. Enter the **Remaining** count.
3. Click **Confirm**.

The dialog notes: **Only an active subscription can use these. Purchases, upgrades, and renewals do not change the count. After the subscription ends the count remains, but it cannot be spent.**

:::warning Reset coupons are not credits
A reset coupon only buys "one extra allowance cycle"; it never adds credits. It is also a different mechanism from the reset coupons on [Quota Plans](/boss/gateway/quota-plans) — do not mix them up.
:::

## Canceling a subscription

1. On an active subscription's row, click **Cancel subscription**.
2. The confirmation reads: **Canceling ends this subscription immediately. Used allowance is not refunded.**
3. Confirm.

:::warning Cancellation is immediate
It does not wait for the cycle to end and does not refund unused credits. After cancellation the person's calls fall back to the account rate or the platform default plan; if the balance is short too, requests are rejected.
:::

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Only a few rows are listed | The status filter defaults to Active | Switch to All to see history |
| Someone is missing from the user dropdown | They never had a subscription | The dropdown only lists people with subscriptions; the search box can still find their records by nickname |
| Calls are rejected once credits are gone | Overage charging is off | Turn it on if the business allows, or add credit and re-grant the plan |
| No renewal at the end of the cycle | Auto-renew is off | Turn it on while the subscription is active; an expired one must be granted again |
| "Set reset coupons" is missing from the row menu | The subscription is not active | Only active subscriptions can be changed |
| Credits did not change after switching a plan | Active subscriptions pick up new credits on renewal or re-activation | Expected; see [Plans](/boss/gateway/billing-plans) |

## Related

- [Plans](/boss/gateway/billing-plans): the tier a subscription is for
- [Billing Accounts](/boss/gateway/billing-accounts): balance and ledger behind a subscription
- [Rate Plans](/boss/gateway/rate-plans): plan credits are converted with it
- [Call Logs](/boss/gateway/audit): how many credits each call deducted
