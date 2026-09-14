---
title: Call Logs
updated: '2026-09-14'
description: Look up individual gateway calls by time, user, key, provider or model, and read the details.
tags:
  - boss
  - gateway
---

# Call Logs

Call Logs records **every** request that passes through the gateway, including the caller, the channel, the model, the latency, the token count and the cost. It is the main evidence you use to troubleshoot problems, reconcile usage and trace sensitive content.

By the end you will be able to filter by time, user, key, channel provider and model, and open a record to inspect its request and response details.

:::tip Like a building's security footage
The Dashboard gives you the statistics of "how many people entered the building today"; Call Logs is the frame-by-frame footage, recording who came in at what time, through which door, and which floor they went to. When something goes wrong, this is what you replay, record by record.
:::

## Before you start

- Permission: you need a platform administrator account (one that can enter the BOSS console).
- **Enable Audit Logging** in **Gateway Configuration** must be on, otherwise new calls are not recorded.

## Open Call Logs

1. Click **Model Gateway** in the left sidebar.
2. Expand **User Management** and click **Call Logs**.

## How to filter

A filter toolbar sits at the top of the page:

| Filter | Notes |
| --- | --- |
| Time Range | Today / Yesterday / Last 3 days / Last week / Custom |
| Start date, End date | Editable only when **Custom** is selected |
| User | Fuzzy search by username |
| Token | Query by key |
| Channel provider | A dropdown that includes **All** |
| Model | Fuzzy search by model name |

The toolbar has **Refresh** and **Reset**. Reset puts the time range back to **Today**.

:::info There is no "Result" filter
The interface offers no way to filter by success or failure. To find failed requests, watch for rows with a red marker in the list, or narrow the range by user and model first.
:::

## What the list contains

| Column | Meaning |
| --- | --- |
| Time | When the request happened; the small text below is the result of that call, and clicking it opens the details |
| Channel | The channel it was actually routed to; the small text below shows provider / tenant / workspace |
| User | The user who made the call, with the tenant name |
| Token | The key that was used |
| Model | The model requested |
| Duration | End-to-end duration; when a first-token time exists, both **First token** and **Duration** are shown |
| Tokens | Total tokens consumed by this call |
| Cost | The billed amount, converted according to Currency Configuration |
| Standard | The standard price calculated from the model's price table |

Any row whose result is not a success shows a fixed red vertical line on the left, so anomalies are easy to spot at a glance.

:::info Cost is a calculated number
The cost here is a **cost snapshot** calculated from the model price, used for reconciliation and analysis. The gateway itself does no top-ups or deductions; the cost column is just a monetary statistic.
:::

## View the details of a call

1. Click the **Time** cell of a record.
2. The dialog has several tabs:

   | Tab | Content |
   | --- | --- |
   | Basic Info | Request ID, user, channel, model, duration, status code, token breakdown and more |
   | Request Data | The content sent to the model (read-only) |
   | Response Data | The content the model returned (read-only) |
   | Metadata | Additional information (read-only) |
   | Moderation | The sensitive-content report, shown only when this call tripped moderation |

3. When a tab has nothing in it, it shows **No Data**.

### Result states

| Result | Meaning |
| --- | --- |
| Success | The request completed normally |
| Failed | The request errored |
| Blocked | It was stopped by content moderation |
| Quota Exceeded | A limit was reached and processing stopped |

The list uses colour to separate **Success** from the other results, making anomalies quick to find.

## How long records are kept

The page itself has **no retention setting and no cleanup entry**. That means:

- You cannot delete call logs or schedule automatic cleanup from the interface.
- How long records are actually kept depends on how the platform is deployed and on the database policy.

If you need to clear historical records for capacity or compliance reasons, contact platform operations.

## Confirm it worked

Once you set a time range, the list shows matching records and opening one reveals its request and response content — that means the query is working. To check whether a channel or key is in use, filter by it and see whether records are still being produced.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No records at all | Audit logging is off, or the time range is too narrow | Check the audit switch in [Gateway Configuration](/boss/gateway/config) and widen the range |
| A request shows as failed | An upstream channel failure, an invalid key, and so on | Open the details to read the error, then check the channel in [Channel Management](/boss/gateway/channels) |
| The cost column is empty | The model has no price configured yet | Add the price in [Model Configuration](/boss/gateway/model-metadata) |
| The state is Blocked | A content moderation policy matched | See what matched in [Hit Records](/boss/gateway/sensitive-hits) |
| Want to delete old records | The page offers no cleanup | Contact platform operations |

## Related

- [Channel Management](/boss/gateway/channels): deal with the channel behind a failed request
- [Model Configuration](/boss/gateway/model-metadata): the model prices cost is calculated from
- [Hit Records](/boss/gateway/sensitive-hits): only the calls that tripped moderation
