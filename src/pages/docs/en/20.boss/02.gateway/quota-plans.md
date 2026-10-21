---
title: Quota Plans
updated: '2026-10-21'
description: 'Set hard usage caps for users or API keys: create a quota plan, bind subjects, watch the waterline and reset usage.'
tags:
  - boss
  - gateway
---

# Quota Plans

A quota plan is an **admin-imposed hard cap on usage**. It only governs "how much may be used in one period" and takes no part in pricing — the same call is still priced by a [rate plan](/boss/gateway/rate-plans).

After reading this you can create a quota plan, bind it to users or keys, see who is about to hit the cap, and reset one subject's usage.

:::tip A quota plan is the data cap on a phone contract
It does not care what a megabyte costs (that is the price list's job); it only cuts you off past a set amount. The cap and the billing are two independent gates that apply at the same time.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Decide what to cap: **users** (counted per person) or **API keys** (counted per key). This choice cannot be changed after creation.
- Quota plans and plans are different mechanisms: a plan decides *whose credits get spent first*, a quota plan decides *when usage stops*. Both apply together.

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Quota plan | A template for a usage cap that can be bound to many subjects |
| Subject | Who the cap applies to: a user or an API key (labelled Token in the UI) |
| Metered allowance | What is metered. Currently fixed to Token |
| Period | Rolling N days from the first usage / each calendar day / each calendar month |
| Token limit | Maximum tokens per period, a positive integer |
| Binding | Attaching a user or key to this plan so it is capped from then on |
| Waterline | Used against the limit, shown on the binding page as a progress bar with "used / limit" |
| Reset coupon | A count of "start the allowance over once" uses. Spending one clears used quota |

## Reading the list

| Column | Meaning |
| --- | --- |
| Name | The plan name; click it to open the binding page |
| Subject | User / Token |
| Metered allowance | Currently Token for every plan |
| Period | Rolling N days / each calendar day / each calendar month |
| Token limit | Maximum tokens allowed in one period |
| Bindings | How many subjects are bound; the number is also a link to the binding page |
| Status | Enabled / Disabled |
| Auto-bind | Yes / No. Yes means billing accounts created later are bound automatically |

The row menu offers **Edit**, **Bind** and **Delete**.

![Quota plan list: name, subject, metered allowance, period, token limit, bindings, status, auto-bind](/assets/screenshots/boss/gateway-quota-plans-01.png)

A note at the top states the purpose: quota plans are admin-imposed hard caps that limit usage and never set prices, and they apply together with plan credits. Plans projected from subscriptions never appear here.

## Creating a quota plan

1. Click **Create quota plan** in the top right corner.
2. Enter a **Name**. It may not start with `subscription:` — that prefix is reserved for plans projected from subscriptions.
3. Choose the **Subject**: User or Token. **This cannot be changed later**.
4. **Metered allowance** is currently fixed to Token, with a single option.
5. Choose the **Period**:
   - **Rolling**: counted from the first usage; also fill **Period days** (`1`–`366`);
   - **Each calendar day**: restarts at midnight every day;
   - **Each calendar month**: restarts every calendar month.
6. Enter the **Token limit** as a positive integer.
7. Turn on **Enabled** and **Bind new accounts automatically** as needed.
8. Click **Save**.

:::info Auto-bind only affects accounts created later
Turning on "Bind new accounts automatically" does not back-fill accounts that already exist; it only covers billing accounts created afterwards. Existing people must be bound with **Bind**.
:::

## Binding and unbinding

1. Click a plan **name** in the list (or **Bind** in the row menu) to open "Bindings for …".
2. Click **Bind subjects** in the top right corner and pick users or keys according to the subject type.
3. To remove one, click **Unbind** on its row and confirm: "Unbind X from this quota plan?"

Columns on the binding page:

| Column | Meaning |
| --- | --- |
| User / Token | The bound subject. When the subject is Token, the subject ID is shown |
| Quota usage | Used / limit with a progress bar |
| Quota resets at | When this period starts counting again |
| Reset coupons | Remaining count (only present when the subject is User) |

:::warning Unbinding does not refund usage
Unbinding only removes the cap from that subject. Usage already consumed is not cleared, and no extra allowance is granted.
:::

## Watching the waterline and resetting usage

The binding page shows each subject's waterline directly: the fuller the bar, the closer it is to being blocked.

To start one subject over **right now**:

1. Find its row on the binding page and click **Reset quota**.
2. Choose **Use a reset coupon** or **Do not use a coupon**:
   - a coupon spends 1 of that subject's coupons and clears this plan's used quota;
   - skipping it only clears used quota and leaves the count alone.
3. Confirm. The confirmation states that **plan credits stay unchanged**.

:::info A reset only clears this plan
One subject may be constrained by several quota plans at once. A reset clears only the current plan's usage; the others keep their counters.
:::

## How it relates to plan credits and overage charging

The three have distinct jobs:

| Mechanism | What it governs | What happens when it runs out |
| --- | --- | --- |
| [Plan credits](/boss/gateway/billing-plans) | Whose money is spent first | The subscription's **Overage charge** switch decides: charge the balance, or refuse |
| [Billing account](/boss/gateway/billing-accounts) | Whether there is money | Refused when the balance is short and the credit limit is exhausted |
| Quota plan | How much may be used | Refused at the cap, regardless of balance |

So "the account still holds money but the call is blocked" is a normal outcome of a quota plan, not a billing bug.

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The binding page shows `-1 / -1` | The server has not produced this subject's waterline yet | Refresh; if it persists, contact operations — it does not mean a negative allowance |
| A user has balance but is refused | The quota plan's token limit was reached | Raise the limit, reset the usage, or unbind |
| A new person was not auto-bound | The account existed before auto-bind was turned on | Bind them with **Bind** |
| The subject type is wrong | It cannot be changed after creation | Delete and recreate the plan, then move the subjects over |
| The name will not save | It starts with `subscription:` | That prefix is reserved for projected plans; choose another name |
| Usage went up after deleting a plan | Deleting removes every binding and only affects caps, never prices | Expected; recreate and rebind if the cap is still needed |

## Related

- [Billing Accounts](/boss/gateway/billing-accounts): where money is actually charged, beyond the cap
- [Plans](/boss/gateway/billing-plans): credits and overage charging
- [Rate Plans](/boss/gateway/rate-plans): prices, unrelated to caps
- [Call Logs](/boss/gateway/audit): how much one subject actually used
