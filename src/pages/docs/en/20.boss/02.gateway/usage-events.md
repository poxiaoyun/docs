---
title: Pricing Exceptions
updated: '2026-10-21'
description: 'Handle calls that produced no cost: read the price-missing, failed, pending and processing states, and reprice a usage record.'
tags:
  - boss
  - gateway
---

# Pricing Exceptions

Pricing Exceptions is the **safety net** of the billing chain. Some calls happen without producing an amount — most often because the model has no price. This page lists them and lets you point at a rate plan item, write a reason, and turn the record into a definite charge.

After reading it you can filter usage by state, tell "price missing" from "pricing failed", reprice one record, and know how to eliminate missing prices at the source.

:::tip Like a barcode that will not scan at the till
The goods have left the shelf (the call already happened), but the till cannot find a price. The cashier sets the item aside until a supervisor assigns a price. Pricing Exceptions is that "price pending" tray.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Decide which price should apply before you start: repricing **names one rate plan item by hand**, so it is usually better to add the missing price in [Rate Plans](/boss/gateway/rate-plans) first, then come back to clean up historical usage.
- A reason is mandatory and is kept as an audit trail. State the basis, for example "model launched today, price added to the default plan".

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Price missing | The call matched no effective price, so no amount could be produced |
| Failed | Pricing itself errored; this is not a missing price |
| Pending | Usage is recorded but has not been priced yet |
| Processing | Being priced right now, usually a brief moment |
| Calculated | An amount was produced; the normal end state |
| Reprice | Name one rate plan item by hand and calculate this record again |
| Pricing snapshot | The unit price and amount used at the time; it never changes when prices change later |

## The four stat cards and filtering

Four clickable stat cards sit at the top, each showing a count:

| Stat card | What clicking it does |
| --- | --- |
| Price missing | Shows only usage that matched no price (**selected by default**) |
| Failed | Shows only usage whose pricing errored |
| Pending | Shows only usage that has not been priced yet |
| Processing | Shows only usage being priced |

Clicking a card filters the list below by that state, and the selected card is highlighted. Switching state means switching cards; there is no extra dropdown.

![Pricing exceptions: four status cards on top (Price missing selected by default), list and Reprice action below](/assets/screenshots/boss/gateway-usage-events-01.png)

:::info This page has no search box
The list can only be switched by state, not searched by user or model. To find one person's exceptions, scan the **User** column, or trace their recent calls in [Call Logs](/boss/gateway/audit).
:::

## Reading the list

| Column | Meaning |
| --- | --- |
| Time | When the call happened |
| User | Who made the call |
| Model | The model name used for pricing; the line below, "Requested …", is the name the caller actually sent |
| Usage | Input / output / total token counts |
| Pricing status | Price missing / Failed / Pending / Processing / Calculated |
| Cost | The amount produced; "Not priced" while the price is missing |

:::info Why the "Requested …" line matters
A channel can map the caller's model name to the real upstream model before forwarding. Pricing works on the **mapped** name, so when Model and Requested differ, a missing price usually sits in that mapping — the price was written for one name while the lookup used the other.
:::

## Repricing one usage record

Reprice only appears for usage whose state is **Price missing**.

1. Confirm the **Price missing** card is selected at the top.
2. Find the record and click **Reprice** at the end of its row.
3. In the "Reprice …" dialog, choose a **Rate plan item** (required). Options are listed as "plan name / model match / input price" and come from the prices already defined in your plans.
4. Enter a **Reason** (required).
5. Click **Reprice**.

After saving, the record is priced again: the cost changes from "Not priced" to an amount, and the state moves from Price missing to Calculated.

:::warning Repricing is one record at a time
This page only offers single-record repricing; there is no batch entry point. When there are many missing prices, do not grind through them one by one — add the model's price in [Rate Plans](/boss/gateway/rate-plans) so future calls are priced, then come back for the historical records.
:::

## Eliminating missing prices at the source

Work in this order and you will spend far less time repricing later:

1. **Price first**: in [Rate Plans](/boss/gateway/rate-plans), add a currently effective price for the model in the platform default plan. The name must match what the channel lists and what callers send.
2. **Then enable or edit the channel**: enabling a channel checks prices and rejects missing ones, and adding a model behaves the same way. See [Channel Management](/boss/gateway/channels).
3. **Check the mapping**: if the names look identical but the price is still missing, check whether the channel maps the request to a different upstream model name while the price only covers one of them.
4. **Reprice history last**: handle whatever historical records remain with the single-record reprice above.

## Where priced calls can be seen

This page only handles usage that **produced no amount**. Calls that were priced never appear here; per-call cost, the price layer used and deducted plan credits are all in [Call Logs](/boss/gateway/audit).

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Far too many missing prices | The model has no price at all | Add the model's price in Rate Plans, then clean up history |
| Still missing although a price exists | Case or whitespace differs in the name, or the channel maps the model | Compare the three name sources character by character |
| The amount is wrong after repricing | The chosen item was not the right price for this record | Reprice again with the correct item and state the correction in the reason |
| The state stays Pending | The pricing job has not run yet | Wait and refresh; contact operations if it does not move |
| No batch reprice available | This page supports one record at a time | Follow "Eliminating missing prices at the source" |
| Cost shows "Not priced" | This record has no amount yet | Reprice it, or add the model's price first |

## Related

- [Rate Plans](/boss/gateway/rate-plans): where missing prices are fixed for good
- [Call Logs](/boss/gateway/audit): cost and price layer of priced calls
- [Billing Accounts](/boss/gateway/billing-accounts): which account settles the money after repricing
- [Channel Management](/boss/gateway/channels): model mapping and the price check before enabling
