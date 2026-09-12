---
title: Currency Configuration
updated: '2026-09-12'
description: Choose the display currency and the CNY/USD rate.
tags:
  - boss
  - gateway
---

# Currency Configuration

Currency Configuration decides **which currency prices and costs are shown in** on the pages. Model prices are always entered in Chinese yuan; this page only controls the currency and exchange rate used when displaying them. It affects **display only** and never rewrites recorded data.

By the end you will be able to switch between CNY and USD display, adjust the exchange rate, and understand which pages follow the change.

:::tip Like the currency converter on your phone
Your bank account really holds one currency, but you can switch the app to show it "converted into US dollars". When the rate changes the converted figure changes, while the money in the account does not. Currency Configuration is that conversion switch for the gateway.
:::

## Before you start

- Permission: you need a platform administrator account (one that can enter the BOSS console).
- Switch only if you need to quote or reconcile in US dollars. Teams that settle in Chinese yuan can leave it at the default.

## Open Currency Configuration

1. Click **Model Gateway** in the left sidebar.
2. Expand **Platform Settings** and click **Currency Configuration**.

## The two settings

| Setting | Default | Notes |
| --- | --- | --- |
| Currency display mode | `CNY` | Choose `CNY` or `USD` |
| USD exchange rate | `0.14` | The CNY-to-USD ratio, kept to 2 decimal places |

- **Currency display mode** affects display only: choose `CNY` to show Chinese yuan, or `USD` to convert and show US dollars at the rate.
- **USD exchange rate** is the CNY-to-USD ratio. The system converts with fixed-point integers to avoid rounding drift.

## Change and save

1. Choose `CNY` or `USD` in the **Currency display mode** dropdown.
2. Change the **USD exchange rate** if you need to.
3. Click **Save**.

After a successful save the page reports "Currency settings saved" and pulls the configuration again.

## Which pages are affected

Currency settings mainly affect the three places that show amounts:

| Place | What changes |
| --- | --- |
| The price columns in [Model Configuration](/boss/gateway/model-metadata) | Prices are shown in the selected currency |
| The cost columns in [Call Logs](/boss/gateway/audit) | Each record's cost is shown in the selected currency |
| The cost metrics on the [Dashboard](/boss/gateway/operations) | Amounts in the rankings and metrics are shown in the selected currency |

Prices themselves are always stored in Chinese yuan, so enter them in yuan as usual — no need to convert to dollars.

## Does this affect historical billing

It does not rewrite any recorded data, but **the numbers shown for historical costs will change**.

- Each call's cost is calculated and stored at the time it happens, using the price in force then; switching currency or changing the rate never rewrites those stored amounts.
- Display converts using the **current** rate, so after you change the rate, older records will show US-dollar figures consistent with the new rate.
- In other words: the yuan amount in the record is unchanged; only the converted display value moves.

:::info If you want historical figures to stay put
If you do not want old records' displayed figures to drift with the rate, avoid changing the rate often, or keep the display in Chinese yuan.
:::

## Confirm it worked

After saving, go back to [Call Logs](/boss/gateway/audit) or [Model Configuration](/boss/gateway/model-metadata) and check that amounts are shown in the currency you selected — that means the setting is live.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Changed the currency but some amounts did not move | That amount has no convertible source data | Check that the model has a price entered in Model Configuration |
| Historical cost figures changed | Display converts at the current rate | This is expected; the original record was not rewritten |
| The rate I typed was very long | Only 2 decimal places are kept | Enter it with two decimals |

## Related

- [Model Configuration](/boss/gateway/model-metadata): prices are entered there
- [Call Logs](/boss/gateway/audit): costs are displayed according to Currency Configuration
