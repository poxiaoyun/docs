---
title: 'Usage analysis'
updated: '2026-09-12'
description: 'Understand your call volume, token consumption and cost: how to filter by time, what each chart says, and where the numbers come from.'
---

# Usage analysis

**Usage analysis** is your account's usage dashboard in AIRouter. If you want to know how many times the model was called these past few days, how many tokens were burned and what that amounts to in money, come here — no need to tally it up yourself.

:::tip An analogy
Like a phone bill: a few big numbers for "this month's charges" at the top, and a bar chart of daily usage below, so you can see at a glance which day used the most.
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- The data covers only the **currently signed-in account**; you cannot see anyone else's usage.

## How to get there

Click **Usage analysis** in the top navigation. The page shows **Today** by default.

## How to filter by time

1. In the filter bar at the top of the page, click a time range:
   **Today** (default), **Yesterday**, **3 days**, **7 days**, **30 days** or **Custom**.
2. When you choose **Custom**, a **Start time** and an **End time** appear on the right — pick a date for each.
3. **Granularity** is read-only and chosen automatically by the range, so you do not need to set it:
   - **Today**, **Yesterday**: **Hourly**.
   - **3 days**, **7 days**, **30 days**: **Daily**.
   - **Custom**: hourly when the span is within 240 hours, daily beyond that.
4. To get the latest numbers right away, click **Refresh data**.
5. To go back to the initial state, click **Reset filters**, which returns to **Today**.

:::info The page refreshes automatically
The dashboard refreshes itself every 30 seconds, so the numbers update even if you leave it alone. Click **Refresh data** to update immediately.
:::

## The five metric cards

The row at the top holds summary numbers, and each card shows the change "vs. previous period":

| Metric card | Meaning |
| --- | --- |
| **Total calls** | How many calls were made in this period |
| **Token consumption** | How many tokens were used in this period |
| **Total spend** | The amount in money. Lower cost is better, so its direction of change is the opposite of the other metrics |
| **Success rate** | Successful calls as a share of all calls. When there is no previous-period data, the card shows "No previous-period data" |
| **API keys** | The number of active keys under the current account |

## The four charts

| Chart | Description |
| --- | --- |
| **Call trend** | Request count per time bucket. A taller bar means calls clustered in that period |
| **Model usage** | Stacked usage by model. Lower-ranked models are merged into "Other models" |
| **Cost trend** | Cost per time bucket, to find "which period the money went into" |
| **Model ranking** | Sorted by total calls, taking the top **10**, listing each model's calls, tokens and cost row by row |

:::tip How to read the charts together
First use **Call trend** to find the usage peak, then use **Model usage** to see which model drove it, and finally use **Model ranking** to confirm that model's cumulative cost.
:::

## Where these numbers come from

- The dashboard aggregates the call records of the **current account** in the selected time range; sign in with another account and you see that account's data.
- Cost is calculated from the **model price** in effect at the time of the call, so the same set of calls costs different amounts with a different model.
- To check a single call, go to the **Request Logs** tab under [API Keys](./token.md) and filter by time and model — that is the item-by-item detail.
- A red message at the top of the page means this data fetch failed; click **Refresh data** to retry.

## Common issues

| Symptom | Possible cause | What to do |
| --- | --- | --- |
| Every number is 0 | There really were no calls in this period, or the time range is off | Click **Reset filters** to return to Today, or choose a wider range |
| There are call records but **Total spend** is ¥0 | The matching model has no input/output price configured | Check the price in the [Models](./marketplace.md) details, or ask the administrator to fill it in |
| **Model ranking** shows only a few models | The ranking only takes the top 10 by call count | To see every model, filter by model in **Request Logs** |
| The success rate does not match the row count in the request logs | The time range or filters differ between the two | Align the time ranges before comparing |
| **Model usage** and **Model ranking** say "No model usage in this range" | No calls in this range were counted by model | Switch to another time range, or confirm that models really were called in this period |

## Related

- [API Keys](./token.md)
- [Models](./marketplace.md)
- [Playground](./experience.md)
