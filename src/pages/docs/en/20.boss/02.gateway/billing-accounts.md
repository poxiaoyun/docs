---
title: Billing Accounts
updated: '2026-10-21'
description: 'Manage each person''s wallet: read balances, add credit, adjust, refund, set a credit limit and account rate, and inspect the ledger.'
tags:
  - boss
  - gateway
---

# Billing Accounts

A billing account is **each person's default wallet**. The cost of model calls and the money spent on plans both move through this account. This page is the only place on the platform where money can be added to or taken from an account.

After reading it you can find someone's account, read how its balance is composed, add credit or refund it, set a credit limit, change its account rate, and inspect every ledger entry.

:::tip An account is a petty-cash float per person
Everyone gets one wallet, and when it is empty it is empty. A credit limit is an allowance to go slightly negative — not free money. A plan is a pack of credits bought up front: credits are consumed first, and only the shortfall touches the balance.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- **You cannot create or delete an account here.** An account is created automatically when a user registers, when an API key is created for them, or when they open the billing page. If you cannot find someone's account, none of that has happened yet.
- A rate plan must exist before you can bind an account rate.

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Billing account | Each person's default wallet, created automatically; exactly one per person |
| Balance | The money in the account: credit adds, charges subtract, and it can go negative |
| Available balance | What can actually be spent now. Frozen amounts are excluded, so it is usually less than or equal to the balance |
| Frozen | An amount temporarily held and unavailable |
| Credit limit | How far the account may go negative. `0` means no credit at all |
| Account rate | Which rate plan this account is billed by by default. The platform default plan is used when none is chosen |
| Plan credits | Prepaid credits inside a subscription, 1 credit = CNY 0.01; they take precedence over the account rate while active |
| Idempotency key | An identifier attached to every money movement. Re-submitting the same operation does not book it twice, and you can match it in the ledger |

## Reading the account list

| Column | Meaning |
| --- | --- |
| User | The account owner, with avatar and nickname |
| API KEY | How many keys this person holds |
| Available balance | What can actually be spent now |
| Balance | The book balance of the account |
| Frozen | Amounts held and unavailable |
| Credit limit | How far the account may go negative |
| Rate plan | The bound plan name; the platform default plan when nothing is bound |
| Status | Normal / Frozen / Arrears / Disabled |

This page has **no search box, no filters and no create button** — the list is every account on the platform. Once there are many, sort by a column or page through them.

![Billing account list: user, API key, available balance, balance, frozen, credit limit, rate plan, status](/assets/screenshots/boss/gateway-billing-accounts-01.png)

The collapsed menu at the end of each row holds seven actions: **Add credit**, **Adjust amount**, **Refund**, **Credit limit**, **Account rate**, **Account ledger** and **Account subscriptions**.

## Adding credit, adjusting and refunding

The three operations look almost identical; they differ in whether the amount may be negative and in the ledger type they record.

1. On the target account's row, click **Add credit** (or **Adjust amount** / **Refund**).
2. Enter the **Amount**: add-credit and refund must be greater than `0`; an adjustment may be negative but not `0`. At most 6 decimal places.
3. Enter the **Reason** (required, for example "bank transfer received, ticket 1234").
4. Click **Confirm**.

| Operation | Amount rule | Ledger type |
| --- | --- | --- |
| Add credit | Greater than `0`, at most 6 decimal places | Recharge |
| Adjust amount | May be negative, but not `0` | Adjustment |
| Refund | Greater than `0`, at most 6 decimal places | Refund |

:::warning Always write a clear reason
The ledger is the only evidence when reconciling later. A vague reason means nobody can explain the movement three months from now. Note the source: bank transfer, ticket number, compensation.
:::

:::info The idempotency key is automatic
You do not type an idempotency key. The system generates one per operation so a repeated submission is not booked twice; you can see it in the **Account ledger** and match it against your finance system.
:::

## Setting a credit limit

The credit limit decides how much this person may owe. It **does not change the balance** and is not a gift of money.

1. On the target account's row, click **Credit limit**.
2. Enter a value of at least `0`, with at most 6 decimal places.
3. Click **Confirm**.

The dialog notes: **0 means no credit. This does not change the balance or enable global overdraft.**

:::info A credit limit is not the "allow overdraft" switch
The "Allow overdraft" switch in [Gateway Configuration](/boss/gateway/config) is fixed off and cannot be changed. What really decides whether someone may keep calling is the **credit limit** here plus the balance pre-check: when the balance is short and the credit limit is exhausted, the request is rejected.
:::

## Setting the account rate

The account rate decides which price list this account is billed by.

1. On the target account's row, click **Account rate**.
2. Pick a rate plan. Each option is tagged with its scope (platform / tenant), status, whether it is the default, and its price item count.
3. Click **Confirm**.

:::warning An active subscription wins
The plan bound to an account is only the "no subscription" price. While a subscription is active and its package carries its own rate plan, that package's rate is used. So if the price does not change after you rebind the account rate, check for an active subscription first.
:::

## Reading the ledger

Click **Account ledger** on the target account's row; the dialog is titled "<nickname>'s ledger".

| Column | Meaning |
| --- | --- |
| Time | When the money movement happened |
| Type | Charge / Recharge / Refund / Adjustment / Plan purchase |
| Amount | The amount moved; the sign shows the direction |
| Balance after | The account balance after this entry |
| Idempotency key | The unique identifier of this operation, for reconciliation |

To jump straight to this person's subscriptions, click **Account subscriptions**: it opens [Subscription Management](/boss/gateway/billing-subscriptions) pre-filtered to that user.

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Cannot find someone's account | They have not registered fully, hold no key, and never opened billing | Ask them to open the billing page in Console once, or create an API key for them; the account appears automatically |
| The balance is negative | Overage charging is on and usage exceeded credits plus balance | Add credit to settle it, or turn off overage charging on that subscription |
| Available balance is lower than the balance | Some amount is frozen | Check the **Frozen** column; freezing usually comes from a settlement in progress |
| Status reads "Arrears" | The balance dropped below the usable floor | Add credit, or raise the credit limit |
| The price did not change after rebinding the rate | An active subscription takes precedence | Check the subscription status in Subscription Management |
| Cannot delete an account | This page does not support deletion | An account lives with its user and cannot be deleted on its own |

## Related

- [Rate Plans](/boss/gateway/rate-plans): which price list the account is billed by
- [Plan Packages](/boss/gateway/billing-plans): credits and plan tiers are maintained there
- [Subscription Management](/boss/gateway/billing-subscriptions): grant, cancel, and the overage switch
- [Call Logs](/boss/gateway/audit): cost and credit deduction of every call
