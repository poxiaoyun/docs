---
title: Dashboard
updated: '2026-09-14'
description: See gateway health at a glance: requests, success rate, tokens, cost and uptime.
tags:
  - boss
  - gateway
---

# Dashboard

The Dashboard is the gateway's **operations instrument panel**. It aggregates request volume, success rate, token usage, cost, response speed and channel health over a period of time into metric cards, trend charts and rankings, so you can tell in seconds whether the gateway is healthy today.

By the end you will be able to filter the data by time and dimension, understand what each chart means, and know where to go when a number looks wrong.

:::tip The Dashboard is the car's instrument cluster
When you drive you do not stare at the engine — you watch the speedometer and the fuel gauge. This page is the gateway's instrument cluster: it gives you conclusions, not individual calls. To inspect one specific call, go to [Call Logs](/boss/gateway/audit).
:::

## Before you start

- Permission: you need a platform administrator account (one that can enter the BOSS console).
- No prior configuration is needed; the page reads from calls that have already happened.

## Open the Dashboard

1. Click **Model Gateway** in the top navigation bar.
2. Click **Dashboard**.

The page refreshes automatically every **30 seconds**, and you can also refresh it manually at any time.

![Dashboard: time range plus tenant / channel / model filters and time granularity, with seven metric cards below](/assets/screenshots/boss/gateway-operations-01.png)

Compared with the user-facing [usage analysis](../../15.airouter/usage-statistics.md) page, this one adds **Tenant**, **Channel** and **Model** filters, so you can look at the whole platform or drill into one tenant. Below the filter bar sit seven metric cards, each carrying a period-over-period delta.

## How to filter

| Filter | Notes |
| --- | --- |
| Time range | Today / 7 days / 30 days / Custom |
| Start Time, End Time | Only editable when **Custom** is selected |
| Tenant | Show only one tenant's calls |
| Channel | Show only one channel's calls |
| Model | Show only one model's calls |
| Time bucket | Read-only, derived from the time range; shows **Hourly** or **Daily** |

The two buttons on the toolbar:

- **Refresh data**: pulls the data again immediately.
- **Reset Filters**: clears the tenant, channel and model filters and puts the time range back to **Today**.

The time bucket is derived automatically; you never set it by hand:

| Time range | Bucket |
| --- | --- |
| Today | Hourly |
| 7 days / 30 days | Daily |
| Custom | Hourly when the span is 240 hours or less, otherwise daily |

## The seven metric cards

The row of cards across the top of the page, from left to right:

| Card | Meaning |
| --- | --- |
| Requests | Total requests in the range, with a "vs previous" change rate |
| Success rate | Share of successful requests, expressed as a change in percentage points |
| Token usage | Total tokens consumed in the range, abbreviated with K / M and similar |
| Sensitive hits | Number of requests that tripped content moderation |
| TTFT | Time to first token, showing the max over the **last 1 minute**; lower is better |
| Active API Keys | How many keys made calls during the period |
| Runtime | How long the gateway has been running, shown as days / hours / minutes |

:::info What "No previous data" means
If there is no comparable data before the selected range, the success-rate card shows **No previous data**. It means there is no period-over-period figure to compute for that item — it is not an error.
:::

TTFT is the time from sending a request to receiving the first character — the closest thing to the "is it laggy?" that a user actually feels. Values under 1 second are written as `300ms`; anything longer switches to seconds, such as `1.5s`.

## Charts and rankings

**Call trend**: at the current bucket size, shows the request volume (a single-series bar chart) for each time slot.

**Model usage**: a stacked bar chart split by model, taking up to the top 10 models and merging the rest into **Other models**.

The lower part of the page has three columns:

| Card | Content |
| --- | --- |
| Model ranking | Sorted by request volume; lists each model's requests, tokens and cost |
| User usage ranking | The top 10 users, showing requests and tokens with a share progress bar |
| TTFT trend + Gateway health | See below |

**TTFT historical latency trend**: a line chart with two lines — **Max TTFT** and **TTFT P95**. The first shows the slowest case; the second shows what most requests experience.

**Gateway health**: shows availability (a percentage with a progress bar) plus three details — **Upstream channels** as "healthy / total", the number of **Rate limit events**, and the number of **Abnormal requests**.

## No details and no export on this page

The Dashboard only gives aggregates. It has **no per-record table and no export**. To see a single call, how much one person used, or why a request failed, query [Call Logs](/boss/gateway/audit).

## Confirm it worked

Once you pick a time range, the metric cards and charts show numbers and change as you change the filters — that means the data loaded correctly. To check whether a channel or a model is serving normally, filter by **Channel** or **Model** first and then read the request volume and success-rate trend.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The charts are blank | No calls in the selected range | Widen the time range or clear the filters |
| Want to filter by token or by user | The page only offers tenant / channel / model | Use those three, or query precisely by user and token in Call Logs |
| Numbers do not match Call Logs | The Dashboard aggregates by bucket, the log is per record | Trends here, detail there — the difference in granularity is expected |
| Cannot find an export button | The Dashboard does not export | Query the Call Logs page if you need detail data |

## Related

- [Call Logs](/boss/gateway/audit): inspect the details of every call
- [Channel Management](/boss/gateway/channels): deal with unhealthy channels here
- [Gateway Configuration](/boss/gateway/config): adjust global rate limits and other runtime parameters
