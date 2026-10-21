---
title: Currency Configuration
updated: '2026-10-21'
description: 'Choose whether amounts display in CNY or USD and which rate converts them. The bookkeeping currency stays CNY.'
tags:
  - boss
  - gateway
---

# Currency Configuration

Currency Configuration decides **which currency prices and costs display in**. Every amount is actually booked in CNY; switching to USD only adds a display conversion on top.

After reading this you can switch between CNY and USD, change the rate, and understand which pages follow the change and which do not.

:::tip Like the currency converter in a banking app
Your balance in a banking app is really in one currency, but you can switch to "view in USD". Change the rate and the converted number moves while the real money does not. Currency Configuration is that conversion layer for the gateway.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Switch only when you need to quote or reconcile in USD; teams that settle in CNY internally can leave the default.

## Opening Currency Configuration

1. Click **Model Gateway** in the top navigation bar.
2. Expand **Platform Settings** and click **Currency Configuration**.

## The two settings

| Setting | Default | Notes |
| --- | --- | --- |
| Currency display mode | Chinese Yuan CNY | Chinese Yuan CNY or US Dollar USD. Display only; the bookkeeping currency stays CNY |
| CNY to USD rate | `0.14` | USD is a display reference converted from CNY with this rate, never used for charges |

- **Currency display mode** affects display only: CNY shows ¥, USD converts with the rate and shows $.
- **CNY to USD rate** is the ratio used for display conversion. The helper text asks for 2 decimal places; the backend converts with fixed-point integers to avoid floating-point drift.

![Currency configuration: display mode and the CNY to USD rate](/assets/screenshots/boss/gateway-currency-01.png)

The page holds exactly two fields: **Currency display mode** and **CNY to USD rate**. In the screenshot the mode is CNY, so all amounts show in yuan; switching to USD changes every place that converts. Click **Save** when done.

## Changing and saving

1. Pick CNY or USD in the **Currency display mode** dropdown.
2. Change the **CNY to USD rate** if needed.
3. Click **Save**.

On success the page reports "Currency settings saved" and reloads the configuration once.

:::warning The input has no format validation
There is no front-end format limit on this box, only helper text asking for 2 decimals. The real conversion uses the backend's fixed-point arithmetic — do not type many decimals and expect the page to round them for you.
:::

## Which pages are affected

Three kinds of place display amounts:

| Location | What changes |
| --- | --- |
| Price items in [Rate Plans](/boss/gateway/rate-plans) | Unit prices display in the chosen currency |
| Cost and Standard columns in [Call Logs](/boss/gateway/audit) | Per-call cost and unit price display in the chosen currency; USD amounts may be labelled as a reference price |
| Model ranking on the [Dashboard](/boss/gateway/operations) | The cost column displays in the chosen currency |

Prices themselves are always stored in CNY, so enter them in CNY and never convert by hand.

## Does this rewrite past bills

No recorded data is rewritten, but **the numbers displayed for historical costs do change**.

- Each call's cost was calculated and stored with the prices in force at the time (a pricing snapshot), and switching currency or changing the rate never rewrites those amounts.
- The display converts with the **current** rate, so after changing the rate an old record shows a USD figure consistent with the new rate.
- In other words: the CNY amount inside the record is unchanged; only the converted display value moves.

:::info If you want old amounts to stay put
Keep the rate stable, or stay on CNY display, when historical figures must not drift.
:::

## Confirming the result

After saving, open a price item in [Rate Plans](/boss/gateway/rate-plans) or a record in [Call Logs](/boss/gateway/audit) and confirm the amount is shown in the currency you chose.

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Some amounts did not change | That amount has no source data to convert | Check in Rate Plans that the model has a price item |
| Historical cost figures changed | Display converts with the current rate | Expected; the underlying record is untouched |
| An amount is prefixed with "reference price" | It is the USD conversion | Expected; USD is display only and never charged |
| The rate accepted many decimals | The input has no format validation | Enter 2 decimals; the backend does the fixed-point conversion |

## Related

- [Rate Plans](/boss/gateway/rate-plans): prices are entered there and displayed per this setting
- [Call Logs](/boss/gateway/audit): costs display per this setting
- [Dashboard](/boss/gateway/operations): the cost ranking follows this setting
