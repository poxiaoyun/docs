---
title: Gateway Configuration
updated: '2026-09-14'
description: Configure the gateway-wide switches, IP allowlist, caching and retry policy, and know when each change applies.
tags:
  - boss
  - gateway
---

# Gateway Configuration

Gateway Configuration is the gateway's **main control panel**: whether rate limiting is on, whether content is screened, how long caches live, whether a failed upstream is retried, which IPs may connect — all platform-wide behaviour is set here.

By the end you will be able to turn capabilities on and off, configure routing preferences and the IP allowlist, tune caching and retry policy, and know whether each change takes effect immediately or needs a moment.

:::tip These are the settings for the whole vehicle
Channel Management and Model Configuration deal with individual parts; Gateway Configuration deals with how the vehicle behaves — whether the brakes work (rate limiting), whether you pass the security gate (moderation), how often the air is exchanged (caching). Changes here affect calls across the entire platform.
:::

## Before you start

- Permission: you need a platform administrator account (one that can enter the BOSS console).
- Think about the blast radius first: these parameters apply to the **whole platform**, not to one tenant or one channel.

## Open Gateway Configuration

1. Click **Model Gateway** in the left sidebar.
2. Expand **Platform Settings** and click **Gateway Configuration**.

## What the page contains, top to bottom

1. Routing Configuration
2. Core Switches
3. Security Configuration
4. Caching
5. Channel Fallback Policy
6. Cache Management

At the bottom are two buttons, **Reset** and **Save Changes**. The save button stays grey until something changes, and **Reset** restores the form to the last configuration loaded from the server.

## Core Switches

| Switch | Default | What turning it on / off does |
| --- | --- | --- |
| Enable Rate Limiting | On | When off, every RPM / TPM limit for users, tenants and channels stops applying at once |
| Enable Audit Logging | On | When off, request metadata is no longer recorded, which greatly reduces storage pressure but makes past requests untraceable |
| Enable Content Moderation | On | When off, inputs and outputs skip the sensitive-word check entirely |
| Enable Billing | On | When off, no usage cost data (cost snapshots) is generated |
| Allow Overdraft | Off | When off, requests are rejected once the account balance is insufficient |

:::warning Turning these off needs care
- Turning off **rate limiting**: an upstream provider can be overwhelmed by a traffic spike.
- Turning off **audit logging**: you will no longer be able to trace who called what in the past.
- Turning off **content moderation**: disallowed content passes straight through.
Turn them off only for debugging or an emergency, and restore them as soon as you are done.
:::

:::info Enabling billing is not the same as charging
**Enable Billing** only controls whether **cost snapshots** are generated, i.e. the amounts shown in Call Logs and on the Dashboard. It does not mean the platform deducts money from an account balance — the gateway itself does no top-ups, deductions or payments.
:::

## Routing Configuration

This decides who wins when several channels are available.

| Setting | How to fill it | Notes |
| --- | --- | --- |
| Preferred Providers | Type a provider identifier and press Enter; several allowed | When several providers are available, the ones listed here are preferred |
| Blocked Providers | Type a provider identifier and press Enter; several allowed | Providers listed here are disabled globally, even if their channels are enabled |

- Both are **free-text, multi-value** boxes with no preset dropdown. You type the provider name (for example `openai`, `siliconflow`).
- **Preference is a nudge; blocking is a hard limit**: a wrong preference simply has no effect, but a wrong block cuts off all traffic to that provider.

:::warning Blocking a provider is an emergency cut
Once a provider is on the blocked list, every request through it fails. Treat it as the switch for cutting off a broken or non-compliant provider in an emergency, and remove the entry when you are done.
:::

## Security Configuration

| Setting | Notes |
| --- | --- |
| Global IP Whitelist | Only requests from whitelisted IPs may reach the gateway; leave it empty to allow all sources |

Supported formats:

| Form | Example |
| --- | --- |
| A single IPv4 address | `192.168.1.100` |
| An IPv4 network range | `10.0.0.0/8` |

Validation matches the key allowlist: IPv4 only, each part `0`–`255`, no leading zeros. **`*` is not accepted and IPv6 is not supported.**

If the IP you enter is not the network address of its range (for example `192.168.1.100/24`), the page shows the normalized range and the addresses it actually covers; just confirm it.

:::warning Do not lock yourself out
Once the whitelist is configured, any request from a source not on it is rejected. Before saving, make sure **your own administrative IP** is on the list, otherwise even your back-office requests will be blocked.
:::

## Caching

Caching reduces the cost of hitting the database on every request, at the price that a configuration change is only fully reflected once the cache expires.

| Setting | Default | Notes |
| --- | --- | --- |
| Enable Channel Cache | On | Caches channel configuration in memory |
| Channel Cache TTL (seconds) | `300` | How long the channel cache stays valid |
| Enable User/Tenant Cache | On | Caches the binding between users and tenants |
| User/Tenant Cache TTL (seconds) | `600` | How long the user/tenant cache stays valid |
| Enable Billing Cache | On | Caches billing account information |
| Token Cache TTL (seconds) | `300` | How long token information stays valid |
| Billing Account Cache TTL (seconds) | `300` | How long billing account information stays valid |
| Token Binding Cache TTL (seconds) | `300` | How long the token-to-channel binding stays valid |

Shorter times mean fresher data; longer times mean better performance. Every TTL is entered in **seconds**.

### Cache Management

Click **Rebuild Cache** and the system force-clears and rebuilds every cache index, then reports something like "Cache rebuilt successfully: 12 channels, 34 users".

Use it when a channel's enabled/disabled state does not match how it actually behaves.

:::warning Rebuilding the cache briefly adds load
During a rebuild the database is hit all at once, which can cause a momentary spike. Do it off-peak and do not click it repeatedly.
:::

## Channel Fallback Policy

When an upstream channel fails, this controls whether the request errors out or switches to another line. It only affects **chat-style** requests.

| Setting | Default | Range |
| --- | --- | --- |
| Enable Channel Fallback | On | — |
| Max Retries Per Channel | `1` | `0`–`5` |
| Max Fallback Count | `2` | `0`–`10` |
| Retry Delay (ms) | `0` | `0` or more |

How to read the two numbers:

- **Max Retries Per Channel** = `1` means the same channel is called at most **2 times** (the first attempt plus 1 retry).
- **Max Fallback Count** = `2` means at most **3 channels** are tried in total.

:::info Retrying makes callers wait longer
Retries and fallbacks both make the user wait. For latency-sensitive workloads you can lower these two values.
:::

## When changes take effect

| Setting | When it applies |
| --- | --- |
| Core switches, routing, allowlist, channel fallback | Immediately after you click **Save Changes** |
| Cache switches and TTLs | After the cache expires naturally, or immediately if you click **Rebuild Cache** |

## Confirm it worked

After clicking **Save Changes**, a "Configuration saved successfully" message appears in the top-right corner. To verify a specific change — for example after blocking a provider — watch [Call Logs](/boss/gateway/audit) and check that related requests are no longer routed to it.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The save button will not respond | Nothing in the form has changed | Change any field and the button becomes available |
| Changed a cache time but nothing happened | The cache has not expired yet | Click **Rebuild Cache** to refresh immediately |
| The back office can no longer reach the gateway | The global whitelist does not include your IP | Add your administrative IP to the whitelist first |
| A channel's status does not match reality | The in-memory cache is stale | Use **Rebuild Cache** |

## Related

- [Channel Management](/boss/gateway/channels): what fallback and routing act on
- [Content Moderation](/boss/gateway/moderation): the full chain behind the global moderation switch
- [Currency Configuration](/boss/gateway/currency-settings): the currency prices are displayed in
