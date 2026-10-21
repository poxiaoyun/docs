---
title: 'Call Logs'
updated: '2026-10-21'
description: 'Inspect every gateway call: who called which model, through which channel, how long it took, and which price layer charged it.'
tags:
  - boss
  - gateway
---

# Call Logs

Call Logs records **every** request that passed through the gateway, including the caller, channel, model, latency, token counts and cost. It is the main tool for troubleshooting, reconciling usage and tracing sensitive content.

After reading this you can filter by time, user, key, channel and model, read the Cost and Standard columns correctly, and open one record to see its request and response.

:::tip Like the building's camera footage
The dashboard tells you how many people entered the building today; Call Logs is the frame-by-frame footage showing who came in at what time, through which door, and where they went. When something breaks, this is where you rewind.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- **Enable Audit Logging** in **Gateway Configuration** must be on, otherwise new calls are not recorded.

## Opening Call Logs

1. Click **Model Gateway** in the top navigation bar.
2. Expand **User Management** and click **Call Logs**.

## How to filter

A filter bar sits at the top of the page:

| Filter | Notes |
| --- | --- |
| Time Range | Today / Yesterday / Last 3 days / Last week / Custom |
| Start date, End date | Only editable with **Custom** |
| User | Fuzzy match on the user name |
| API Key | Searches by key |
| Channel | Dropdown of **channel names**, with an All entry. This is not a provider filter |
| Model | Fuzzy match on the model name |

The toolbar also has **Refresh** and **Reset**; reset puts the time range back to **Today**.

:::info There is no Result filter
The UI offers no filter by success or failure. To find failing calls, look for rows with a red marker, or narrow down by user or model first.
:::

## What the list shows

| Column | Meaning |
| --- | --- |
| Time | When the request happened, with the result underneath; click it to open the detail |
| Channel | The channel actually used, shown as `# name`, with provider / tenant / cluster / workspace underneath |
| User | The caller, with the tenant name |
| API Key | The key used; click to copy |
| Model | The requested model |
| Latency | End-to-end latency; when a first-token time exists, both first token and total are shown |
| Tokens | Input and output lines; cache reads and writes are added when present |
| Cost | The amount payable; "Not priced" when nothing could be calculated |
| Standard | The unit price used and which price layer it came from |

Rows whose result is not Success carry a red vertical bar on the left, so anomalies stand out at a glance.

![Call Logs: time range and filters at the top, calls listed newest first](/assets/screenshots/boss/gateway-audit-01.png)

This filter bar has two dimensions the user-facing pages lack — **User** and **Channel** — because it covers the whole platform. The **API Key** column is the key used, and **User** is the person who made the call.

### Reading the Cost column

The Cost column has several states; do not mix them up:

| Display | Meaning | Action needed |
| --- | --- | --- |
| An amount (for example `0.006 CNY`) | The payable amount from the pricing snapshot | None |
| Amount plus **reference** | The USD conversion is being shown; the CNY amount is the booked one | None, display only |
| **Not priced** | No effective price covered this call, so no amount exists | Yes: add the price in [Rate Plans](/boss/gateway/rate-plans), or reprice it in [Pricing Exceptions](/boss/gateway/usage-events) |
| Amount plus **N plan credits used** | The cost was paid from subscription credits, with the credit count on the second line | None |

### Reading the Standard column

The Standard column answers "which price produced this amount". The shape is roughly:

> input price / completion price · cache read · cache write (layer #planID priced as model)

The **price layer** in parentheses is the most valuable part of the record. There are seven:

| Price layer | Meaning |
| --- | --- |
| Key rate | A price bound directly to this API key |
| Plan rate | The rate plan carried by the active subscription |
| Account rate | The plan bound to this person's billing account |
| Tenant default | The tenant's own default plan |
| Platform default | The platform-wide default plan |
| Catalog price | The migration fallback from the model catalog, not a target state |
| Repriced | A price an administrator chose by hand in Pricing Exceptions |

Seeing "Catalog price" means the fallback produced this amount; seeing "Repriced" means someone repriced it manually.

## Viewing one call in detail

1. Click the **Time** cell of a record (or the detail icon next to it).
2. The dialog has several tabs:

   | Tab | Content |
   | --- | --- |
   | Basic Info | Request ID, user, channel, model, latency, status code, token breakdown |
   | Request Data | What was sent to the model (read-only) |
   | Response Data | What the model returned (read-only) |
   | Metadata | Extra information (read-only) |
   | Moderation | The sensitive-content report, present only when this call tripped moderation |

3. Tabs with nothing to show display "No Data".

### Result states

| Result | Meaning |
| --- | --- |
| Success | The request completed normally |
| Failed | The request errored |
| Blocked | Stopped by content moderation |
| Quota Exceeded | Hit a plan credit or quota cap, so it was not processed |

## How long records are kept

The page itself has **no retention setting and no cleanup entry**:

- You cannot delete log records or configure automatic cleanup in the UI.
- How long records survive depends on how the platform is deployed and its database policy.

For capacity or compliance reasons, contact platform operations to purge history.

## Confirming the result

Once a time range is set, records appear and opening one shows request and response content — the query works. To verify that a channel or key is in use, filter by it and check whether records keep arriving.

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| No records at all | Audit logging is off, or the range is too narrow | Check the audit switch in [Gateway Configuration](/boss/gateway/config) and widen the range |
| A request failed | Upstream channel problem, invalid key, and so on | Open the detail for the error, then check the channel in [Channel Management](/boss/gateway/channels) |
| Cost shows "Not priced" | None of the five price layers covered this model | Add an item in [Rate Plans](/boss/gateway/rate-plans), or reprice in [Pricing Exceptions](/boss/gateway/usage-events) |
| Status is "Blocked" | A moderation policy fired | See what matched in [Hit Records](/boss/gateway/sensitive-hits) |
| Old records cannot be deleted | The page offers no cleanup | Contact platform operations |

## Related

- [Channel Management](/boss/gateway/channels): fix the channel behind a failed request
- [Rate Plans](/boss/gateway/rate-plans): where Cost and Standard come from
- [Pricing Exceptions](/boss/gateway/usage-events): reprice calls that produced no cost
- [Hit Records](/boss/gateway/sensitive-hits): only the calls that tripped moderation
