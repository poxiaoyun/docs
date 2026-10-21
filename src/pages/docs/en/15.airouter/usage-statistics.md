---
title: 'Usage analysis'
updated: '2026-10-21'
description: 'Want to know how many calls you made, how many tokens you burned, what that cost and which model drove it? This page has the numbers.'
---

# Usage analysis

**Usage analysis** is your account's usage dashboard in AIrouter. If you want to know how many times the model was called these past few days, how many tokens were burned and what that amounts to in money, come here — no need to tally it up yourself.

:::tip An analogy
Like a phone bill: a few big numbers for "this month's charges" at the top, and a bar chart of daily usage below, so you can see at a glance which day used the most. To see the unit price behind each item, you still have to check the price list — that is [Prices](./prices.md) next door.
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- The data covers only the **currently signed-in account**; you cannot see anyone else's usage.

## How to get there

Click **Usage analysis** in the top nav. The page shows **Today** by default.

## How to filter by time

1. Pick a range in the filter bar at the top:
   **Today** (default), **Yesterday**, **3 days**, **7 days**, **30 days**, **Custom**.
2. With **Custom**, **Start time** and **End time** appear; pick a date for each.
3. **Granularity** is read-only — the page decides it from the range:
   - **Today**, **Yesterday**: **Hourly**.
   - **3 days**, **7 days**, **30 days**: **Daily**.
   - **Custom**: hourly within 240 hours, daily beyond that.
4. Click **Refresh data** to pull the latest numbers immediately.
5. Click **Reset filters** to return to the initial state, which means **Today**.

:::info The page refreshes itself
The dashboard refreshes every 30 seconds, so the numbers update even if you leave it alone. **Refresh data** updates them immediately.
:::

## The five metric cards

The top row holds the summary numbers. Except for the success rate, each card shows a **vs. previous period** change:

| Card | Meaning |
| --- | --- |
| **Total calls** | How many calls were made in this period |
| **Token consumption** | How many tokens were used in this period |
| **Total spend** | The amount in money. Lower is better here, so its direction is inverted relative to the others |
| **Success rate** | Share of calls that succeeded. When there is no previous period, the card shows "No previous-period data" |
| **API keys** | How many keys the account currently has |

Amounts carry a `CNY`/`¥` prefix. Very small amounts are shown to **6 decimal places** — `¥0.000120` is real money spent, not zero.

## The four charts

| Chart | Notes |
| --- | --- |
| **Call trend** | Requests per time bucket. A taller bar means calls clustered in that bucket |
| **Model usage** | Stacked by model. Lower-ranked models are merged into **Other models** |
| **Cost trend** | Cost per time bucket, to find "where the money went" |
| **Model ranking** | Sorted by total calls, top **10**, listing calls, tokens and cost per model |

:::tip How to read them together
Start with **Call trend** to find the peak, then **Model usage** to see which model drove it, then **Model ranking** to confirm that model's accumulated cost.
:::

![The Usage analysis dashboard: filter bar on top, five metric cards, then call trend, model usage, cost trend and model ranking](/assets/screenshots/airouter/analysis-01.png)

Above is the whole dashboard: time range, **Granularity**, **Refresh data** / **Reset filters** at the top; five metric cards in a row; then **Call trend**, **Model usage** and **Cost trend**, and finally the **Model ranking** table. The screenshot was taken on an account with no calls that day, so every number is 0 and the charts show empty axes.

## Where these numbers come from

- The dashboard aggregates the **current account's** calls in the selected range; sign in as another account and you see that account's data.
- Cost is computed from the **pricing standard** that applied at call time — possibly the rate plan's unit price, possibly plan credits covering it, possibly the model catalog price. Check the unit price in [Prices](./prices.md).
- **Usage covered by plan credits does not count towards Total spend**: that part was already paid for when you bought the plan.
- To check one specific call, go to the **Request Logs** tab of [API Keys](./token.md) and filter by time and model; that is the line-by-line detail.
- To see whether the balance can cover more calls, go to [Account](./billing.md).
- A red banner at the top of the page means the fetch failed; click **Refresh data** to retry.

## Common issues

| Symptom | Possible cause | What to do |
| --- | --- | --- |
| Every number is 0 | No calls in this period, or the range is off | Click **Reset filters** to return to Today, or widen the range |
| Calls exist but **Total spend** is ¥0 | ① All calls in this period were covered by **plan credits**; ② the model has no price and counts as unpriced | Check credit usage in [Account](./billing.md), then confirm the model's price in [Prices](./prices.md) |
| The amount is too small to read | Small amounts use 6 decimal places | That is the real amount, not a rounded zero |
| **Model ranking** shows only a few models | The ranking keeps only the top 10 by calls | To see every model, filter **Request Logs** by model |
| Success rate does not match the log row count | The ranges or filters differ between the two pages | Align the time range, then compare |
| **Model usage** and **Model ranking** show "No model usage in this range" | No per-model usage was recorded in this range | Pick another range, or confirm there really were calls |
| The dashboard dropped but the bill did not | The dashboard counts calls, the bill charges balance and credits | They measure different things; read the ledger in [Account](./billing.md) alongside these cards |

## Related

- [API Keys](./token.md)
- [Models](./marketplace.md)
- [Chat](./experience.md)
- [Prices](./prices.md)
- [Account](./billing.md)
- [API docs](./api-docs.md)
