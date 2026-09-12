---
title: Gateway Configuration
updated: '2026-09-12'
description: 'Global LLM gateway runtime settings — switches, caches, routing preferences, channel fallback and IP allowlist.'
tags:
  - boss
  - gateway
---

## Feature overview

The gateway config page manages the global LLM gateway runtime settings: core switches, caches, routing preferences, channel fallback, the global IP allowlist and cache rebuild. Settings are stored in the global configuration and apply to the whole gateway.

This page corresponds to **LLM gateway → Platform settings → Gateway config** in the Boss console (menu label from `navbar.gateway_config`).

## Access path

Boss console → LLM gateway → Platform settings → **Gateway config**

Console route: `/gateway/config`. Settings are read and written through `/api/airouter/v1/settings` (`GET` / `PUT`).

## Page structure

The form is ordered top to bottom:

1. Routing
2. Core switches
3. Security
4. Cache
5. Channel fallback
6. Cache management

The footer has **Save** and **Reset**: Save is disabled until the form is dirty, and Reset restores the last loaded server configuration.

## Core switches

| Setting | Field | Type | Default | Description |
|---------|-------|------|---------|-------------|
| Enable rate limiting | `rateLimitEnabled` | Boolean | `true` | Turning it off disables all RPM/TPM limits |
| Enable audit log | `auditEnabled` | Boolean | `true` | Turning it off stops recording request metadata |
| Enable moderation | `moderationEnabled` | Boolean | `true` | Turning it off skips sensitive-word detection |
| Enable billing | `billingEnabled` | Boolean | `true` | Turning it off stops recording billing data |
| Allow overdraft | `billingAllowOverdraft` | Boolean | `false` | When off, a balance `<= 0` returns `402 Payment Required` |

> ⚠️ Note: the default for `billingEnabled` is **`true`** (`DEFAULT_GLOBAL_SETTINGS`), not `false` as some older docs claim.

## Routing

| Setting | Field | Type | Default | Description |
|---------|-------|------|---------|-------------|
| Preferred providers | `routingPreferredProviders` | String[] | `[]` | Providers preferred when several are available |
| Blocked providers | `routingBlockedProviders` | String[] | `[]` | Providers globally disabled even when their channels are enabled |

Both are free-input multi-value fields (`freeSolo`) with no preset options; the value is the provider id.

```yaml
routingPreferredProviders: ["siliconflow"]
routingBlockedProviders: ["openai"]
```

> 💡 Tip: "preferred" is a soft preference; "blocked" is a hard restriction.

## Security

| Setting | Field | Type | Default | Description |
|---------|-------|------|---------|-------------|
| Global IP allowlist | `globalWhitelist` | String[] | `[]` | Only allowlisted sources can reach the gateway API; empty means allow all |

| Form | Example | Notes |
|------|---------|-------|
| Single IPv4 | `192.168.1.100` | Exact match |
| IPv4 CIDR | `10.0.0.0/8` | Prefix `0`–`32` |

Validation matches the token allowlist: IPv4 only, each octet `0`–`255`, no leading zeros; **`*` is not accepted and IPv6 is not supported**.

Entering a CIDR whose host bits are set (e.g. `192.168.1.100/24`) shows a normalization hint with the normalized network and covered range.

> ⚠️ Note: make sure the admin node IP is included before enabling the allowlist, or admins will be locked out too.

## Cache

| Setting | Field | Type | Default | Validation |
|---------|-------|------|---------|-----------|
| Enable channel cache | `cacheChannelEnabled` | Boolean | `true` | — |
| Channel cache TTL (s) | `cacheChannelTTL` | Number | `300` | `>= 0` |
| Enable user/tenant cache | `cacheUserTenantEnabled` | Boolean | `true` | — |
| User/tenant cache TTL (s) | `cacheUserTenantTTL` | Number | `600` | `>= 0` |
| Enable billing cache | `cacheBillingEnabled` | Boolean | `true` | — |
| Token cache TTL (s) | `cacheTokenTTL` | Number | `300` | `>= 1` |
| Billing account cache TTL (s) | `cacheBillingAccountTTL` | Number | `300` | `>= 1` |
| Token binding cache TTL (s) | `cacheTokenBindingTTL` | Number | `300` | `>= 1` |

> ⚠️ Note: the billing cache TTL field is **`cacheBillingAccountTTL`** (not `cacheBillingTTL`). The billing cache switch sits next to the *Token* TTL field, while `cacheBillingAccountTTL` and `cacheTokenBindingTTL` have no paired switch.

### Cache management

Click **Rebuild cache** to force-clear and rebuild all cache indexes.

- Request: `POST /api/airouter/v1/cache/rebuild`
- Success message: `Cache rebuilt: {channels} channels, {users} users`

> 💡 Tip: use this when channel enable/disable state is out of sync; the rebuild briefly increases database load.

## Channel fallback

Channel fallback defines retry and degradation behaviour when an upstream channel fails. All fields live inside the `channelFallback` object.

Editable fields:

| Setting | Field | Type | Default | Validation |
|---------|-------|------|---------|-----------|
| Enable channel fallback | `channelFallback.enabled` | Boolean | `true` | — |
| Max retries per channel | `channelFallback.maxRetryPerChannel` | Number | `1` | `0`–`5` |
| Max fallback count | `channelFallback.maxFallbackCount` | Number | `2` | `0`–`10` |
| Retry delay (ms) | `channelFallback.retryDelayMs` | Number | `0` | `>= 0` |

The type also defines `channelFallback.retryableStatusCodes` (default `[500, 502, 503, 504, 429]`) and `channelFallback.fallbackDelayMs` (default `0`), but the **form renders no controls for them**.

> ⚠️ Note: `channelFallback` is a **nested object**, not a flat `fallbackEnabled`. The older flat names and values (`2` retries, `3` fallbacks, `100`/`200` ms delays) do not match the code.

> ⚠️ Note: since `retryableStatusCodes` and `fallbackDelayMs` are not editable in the UI, their effective values depend on the server-side configuration and are not guaranteed here.

Behaviour:

- `maxRetryPerChannel = 1` means up to 2 requests to the same channel including the first
- `maxFallbackCount = 2` means up to 3 channels total

> 💡 Tip: retries and fallbacks add latency; lower both for latency-sensitive workloads.

## When settings take effect

| Setting | When it applies |
|---------|-----------------|
| Switches, routing, allowlist | Immediately after save |
| Cache TTLs | After the cache expires or a manual rebuild |
| Channel fallback | Immediately after save |

## Permissions

Requires the **system administrator** role.
