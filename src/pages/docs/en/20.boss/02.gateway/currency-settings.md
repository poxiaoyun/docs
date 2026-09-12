---
title: Currency Configuration
updated: '2026-09-12'
description: 'Configure the display currency for model prices and the CNY to USD rate.'
tags:
  - boss
  - gateway
---

## Feature overview

Currency settings decide which currency the gateway uses to display prices and costs, and set the CNY → USD conversion rate. Model metadata prices are stored in CNY / 1M tokens and converted on display using this page's configuration.

This page corresponds to **LLM gateway → Platform settings → Currency config** in the Boss console (menu label from `navbar.currency_settings`).

## Access path

Boss console → LLM gateway → Platform settings → **Currency config**

Console route: `/gateway/currency-settings`

## Settings

| Setting | Field | Type | Default | Notes |
|---------|-------|------|---------|-------|
| Display currency | `displayCurrency` | Select | `CNY` | `CNY` or `USD` |
| USD rate | `cnyToUsdRate` | Text | `0.14` | CNY → USD rate, two decimal places |

> 💡 Tip: the label reads "USD rate" while the field name is `cnyToUsdRate`. The backend uses fixed-point integer conversion to avoid floating-point error.

A successful save shows "Currency settings saved" and re-fetches the configuration.

## Relations to other modules

- Model prices live in [Model metadata](/boss/gateway/model-metadata)
- Cost columns in [Call logs](/boss/gateway/audit) and token/cost metrics in [Operations overview](/boss/gateway/operations) are rendered with this currency setting

## Permissions

Requires the **system administrator** role.
