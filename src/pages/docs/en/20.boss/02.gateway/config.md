---
title: 'Gateway Configuration'
updated: '2026-10-21'
description: 'Set the gateway''s global switches, billing switches, IP whitelist, caching and channel fallback, and know when each change takes effect.'
tags:
  - boss
  - gateway
---

# Gateway Configuration

Gateway Configuration is the gateway's **control desk**: rate limiting, content moderation, whether money is calculated, whether money is charged, how long caches live, whether a failed upstream is retried on another line, and which IPs may connect — every platform-wide behaviour is set here.

After reading this you can enable the billing switches in the right order, configure routing preferences and the IP whitelist, tune caching and fallback, and know whether a change applies immediately or later.

:::tip This page is the whole-vehicle setting
Channel Management and Model Configuration manage parts; Gateway Configuration manages how the vehicle behaves — whether the brakes work (rate limiting), whether the scanner runs (moderation), whether the fuel gauge is honest (billing). Changes affect every call on the platform.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Think about the blast radius first: these parameters apply to the **whole platform**, not to one tenant or one channel.
- The three billing switches have a strict order. Do not skip steps; see "Turning on the three billing switches" below.

## The sections, top to bottom

1. Routing Configuration
2. Core Switches
3. Security Configuration
4. Caching
5. Channel fallback
6. Cache Management

Two buttons sit at the bottom: **Reset** and **Save Changes**. Save is greyed out until something changes; **Reset** restores the form to the last configuration loaded from the server.

![Gateway configuration: routing (preferred / blocked providers), core switches, security, caching](/assets/screenshots/boss/gateway-config-01.png)

The page is one long form. The **Enable Content Moderation** switch belongs with [Sensitive Word Management](/boss/gateway/moderation-lexicon) and [Policy Management](/boss/gateway/moderation-policies): switch it off and those rules stop applying. Remember to save at the bottom; see the last section for when changes take effect.

## Routing Configuration

Decides who wins when several channels are available.

| Field | How to fill it | Notes |
| --- | --- | --- |
| Preferred Providers | Type a provider identifier and press Enter; several allowed | When several providers can serve a model, prefer these |
| Blocked Providers | Type a provider identifier and press Enter; several allowed | Providers here are disabled globally, even if their channels are enabled |

- Both are **free-text** multi-value boxes with no preset dropdown; type the provider identifier (for example `openai`, `siliconflow`).
- **Preference is soft, blocking is hard**: a wrong preference simply has no effect, while a wrong block cuts off every request to that provider.

:::warning Blocking a provider is an emergency cut
Once a provider is in the blocked list, every request through it fails. Treat it as the switch for cutting off a broken or non-compliant provider, and remove it afterwards.
:::

## Core Switches

There are 8 switches in three groups: base capabilities, price source, and the charging chain.

| Switch | Default | What on / off means |
| --- | --- | --- |
| Enable Rate Limiting | On | When off, every user, tenant and channel RPM / TPM limit stops applying |
| Enable Audit Logging | On | When off, request metadata is no longer recorded: much less storage, but history becomes untraceable |
| Enable Content Moderation | On | When off, no input or output is screened and everything passes |
| Enable Billing | On | When off, no pricing data is recorded, so no cost snapshots exist |
| Catalog price fallback | On | When no rate plan matches, fall back to the price in the model catalog. On during migration; turn it off once rate plans cover your models |
| Allow Overdraft | Off | **Fixed off and not editable.** Whether a call may proceed is decided by the balance pre-check and the account credit limit |
| Enable settlement | Off | Deducts the calculated cost snapshots from account balances |
| Enable balance pre-check | Off | Checks the account balance before calling upstream; rejects when the balance is short or the account is frozen |

:::warning Turning these off has consequences
- **Rate limiting off**: an upstream can be overwhelmed by a traffic spike.
- **Audit logging off**: you can no longer trace who called what.
- **Content moderation off**: non-compliant content flows straight through.
Only switch them off for debugging or an emergency, and restore them as soon as possible.
:::

:::info Why "Allow Overdraft" is greyed out
It is fixed off. The page explains that global overdraft stays off and that whether someone may keep calling is decided by the **balance pre-check and the account credit limit**. To relax the limit for one person, set a credit limit in [Billing Accounts](/boss/gateway/billing-accounts).
:::

:::info Catalog price fallback is a stopgap
It is the rollback path for the migration: when no rate plan covers a model, the last layer looks up the model catalog. Once rate plans cover everything it should be turned off — otherwise "not priced" is quietly converted into a catalog price and the missing-price problem goes into hiding.
:::

## Turning on the three billing switches

**Enable Billing**, **Enable settlement** and **Enable balance pre-check** must not be switched on together. Go step by step:

1. Turn on **Enable Billing** first. This only produces cost snapshots and touches nobody's money.
2. Check a batch of snapshots in [Call Logs](/boss/gateway/audit): are the amounts sensible, is the price layer what you expect, is there a large pile of "not priced"?
3. Once the snapshots look right, turn on **Enable settlement**. From then on balances are deducted from those snapshots.
4. After watching for a while and confirming that balance changes match the ledger, turn on **Enable balance pre-check** last. From then on, an insufficient balance rejects the call before it reaches upstream.

:::warning The cost of skipping the order
Settlement before billing moves money with no basis; pre-check before verifying snapshots locks out users who were working fine. A wrong order does not necessarily raise an error — it just makes the books wrong.
:::

## Security Configuration

| Field | Notes |
| --- | --- |
| Global IP Whitelist | Only IPs on the list may reach the gateway; empty means every source is allowed |

Accepted formats:

| Format | Example |
| --- | --- |
| Single IPv4 | `192.168.1.100` |
| IPv4 CIDR | `10.0.0.0/8` |

The validation matches the API key whitelist: IPv4 only, each octet `0`–`255`, no leading zeros; **`*` is not accepted and IPv6 is not supported**.

If the address you type is not the network address of its range (for example `192.168.1.100/24`), the page shows the normalized CIDR and the range it actually covers; confirm it and continue.

:::warning Do not lock yourself out
Once the whitelist is set, requests from outside it are rejected. Before saving, make sure **your own admin IP** is on the list.
:::

## Caching

Caching avoids a database lookup on every request, at the cost of changes taking a while to show up.

| Field | Default | Notes |
| --- | --- | --- |
| Enable Channel Cache | On | Keeps channel configuration in memory |
| Channel Cache TTL (seconds) | `300` | How long channel entries live |
| Enable User/Tenant Cache | On | Caches user-to-tenant bindings |
| User/Tenant Cache TTL (seconds) | `600` | How long those bindings live |
| Enable Billing Cache | On | Caches billing account information |
| Token Cache TTL (seconds) | `300` | How long key information lives |
| Billing Account Cache TTL (seconds) | `300` | How long billing account entries live |
| Token Binding Cache TTL (seconds) | `300` | How long key-to-channel bindings live |

Shorter means fresher data, longer means better performance. Every TTL is in **seconds**.

## Channel fallback

When an upstream channel fails, this decides whether to give up or try another line. It only applies to **chat** requests; non-chat requests, requests pinned to a channel, and streams that already wrote bytes never fall back.

| Field | Default | Range / notes |
| --- | --- | --- |
| Retry channels on the list | On | When off, no retry or switching inside the list, though the fixed fallback can still run |
| Retryable status codes | `500,502,503,504,429` | Only these codes trigger a retry, a switch, or the fixed fallback |
| Extra retries on the same channel | `1` | `0`–`5`, **excluding the first attempt**. `1` means each channel is tried at most twice |
| Extra channel switches | `2` | `0`–`10`. `2` means at most three channels in total; the fixed fallback does not count |
| Retry delay (ms) | `0` | Wait before calling the same channel again |
| Switch delay (ms) | `0` | Wait before moving to the next channel |
| Enable fixed fallback (last-resort) | Off | After the list is exhausted, still try one fixed channel and model |
| Fallback channel | Empty | Selectable only when the fixed fallback is on; it must be visible to the caller, a public channel is recommended |
| Fallback model | Empty | Selectable only when the fixed fallback is on; the request model is rewritten before hitting the fallback channel |

Reading the two counters: **Extra retries on the same channel** = `1` means each channel is called at most twice (first attempt plus one retry); **Extra channel switches** = `2` means up to three channels are attempted.

:::info Retries make the caller wait
Both retries and switches add latency. For latency-sensitive workloads, lower these values.
:::

## Cache Management

Clicking **Rebuild Cache** clears and rebuilds every cache index, then reports something like "Cache rebuilt successfully: 12 channels, 34 users".

Use it when a channel's enabled state and its actual behaviour disagree.

:::warning Rebuilding adds load
The rebuild hits the database all at once and can cause a short spike. Do it off-peak and do not click repeatedly.
:::

## When changes take effect

| Configuration | When it applies |
| --- | --- |
| Core switches, routing, whitelist, channel fallback | Immediately after clicking **Save Changes** |
| Cache switches and TTLs | After the cache expires naturally, or immediately after **Rebuild Cache** |

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Save is greyed out | Nothing in the form changed | Change any field and the button becomes available |
| "Allow Overdraft" cannot be toggled | It is fixed off | Use the account credit limit plus the balance pre-check |
| Cache TTL changed but nothing happened | The cache has not expired | Click **Rebuild Cache** |
| The admin console itself cannot reach the gateway | The global whitelist excludes your IP | Add your admin IP first |
| Channel state and reality disagree | The in-memory cache is stale | Use **Rebuild Cache** |
| Balances were charged wrongly after enabling settlement | Settlement was enabled before verifying snapshots | Turn settlement off and redo the sequence |

## Related

- [Channel Management](/boss/gateway/channels): the targets of routing and fallback
- [Sensitive Word Management](/boss/gateway/moderation-lexicon): the word list behind moderation
- [Policy Management](/boss/gateway/moderation-policies): the handling rules behind moderation
- [Billing Accounts](/boss/gateway/billing-accounts): settlement and credit limits
- [Currency Configuration](/boss/gateway/currency-settings): the display currency of amounts
