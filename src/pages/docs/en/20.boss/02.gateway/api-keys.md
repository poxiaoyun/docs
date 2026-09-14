---
title: Token Management
updated: '2026-09-14'
description: How to issue a gateway API key and set its rate limits, IP allowlist and expiry.
tags:
  - boss
  - gateway
---

# Token Management

An API key is the **door pass** for calling the gateway: every request for a model must carry one. This page lets you view and manage the API keys of the **whole platform** — no matter which user or tenant they belong to, they are all maintained here.

By the end you will be able to create a key for a user, set its rate limits and access scope, give it an expiry, and view or delete existing keys.

:::tip An API key is like a door pass
The pass says **who you are** (the owner) and **which doors you may walk through** (the allowed-IP list, the models you can call). If a pass is lost, cancel it at once or someone else can swipe through with it. Issue a different pass to each person so problems are easier to trace.
:::

## Before you start

- Permission: you need a platform administrator account (one that can enter the BOSS console).
- Decide first **which user** this key is for — an owner must be specified when creating it.
- If you want to restrict where calls come from, have the allowed IPs or network ranges ready.

## Open Token Management

1. Click **Model Gateway** in the left sidebar.
2. Expand **User Management** and click **Token Management**.

## Reading the key list

| Column | Meaning |
| --- | --- |
| Name | The key's name |
| API Key | Masked, with a copy button on the right |
| Owner | Which user the key belongs to |
| RPM | Requests-per-minute cap; an infinity symbol means unlimited |
| TPM (K) | Tokens-per-minute cap; an infinity symbol means unlimited, otherwise shown like `48K` |
| Allowed IPs | Permitted source IPs; `*` means any IP |
| Expiration time | Shows **Never expires** when unset; an expired key is flagged in red with an **Expired** badge |
| Created at | When the key was created |

The list supports multi-select, and there is a **refresh** button in the top-right corner. Above it you can filter by **Owner** (type at least one character before any candidates appear).

:::info The mask is only a display effect
In the list a key shows only its first 6 characters, followed by a fixed 12 asterisks. The **copy button** on the right copies the **complete key**, so do not send screenshots of this page to anyone who should not see it.
:::

## Create an API key

1. On the **Token Management** page click **Add API Keys** in the top-right corner.
2. Fill in the form:

   | Form field | How to fill it | Notes |
   | --- | --- | --- |
   | Name | For example `team-a-key` | Required; it cannot be changed after creation |
   | Owner | Search and select a user | Required; decides who the key belongs to |
   | RPM | For example `600` | Optional, `0`–`10000`; leave it empty for unlimited |
   | TPM (K) | For example `48` | Optional, `0`–`100000`, in units of K (1K = 1000 tokens per minute) |
   | Allowed IPs | Defaults to `*` | Optional; format is described below |
   | Never expires | On by default | Turning it off makes **Expiration time** mandatory |
   | Expiration time | Pick down to the minute | Appears only when "Never expires" is off |

3. Click **Confirm**. On success the page returns to the list.

### Small rules for the number fields

RPM and TPM accept **integers** only. The boxes reject the characters `e`, `E`, `+`, `-` and `.`.

### How to write the IP allowlist

Separate several values with a **comma** or a **newline**.

| Form | Example | Meaning |
| --- | --- | --- |
| Single IP | `192.168.1.100` | Matches exactly this address |
| Network range | `10.0.0.0/8` | Allows the whole range; the prefix may be `0`–`32` |
| Wildcard | `*` | Allows every IP; this is also the default |

:::warning IPv4 only
The allowlist accepts IPv4 addresses only. Each part must be `0`–`255` with no leading zeros (`01` is invalid). IPv6 addresses are not recognized.
:::

## Edit a key

1. Click **Edit** on a row in the list.
2. You can change the owner, the rate limits, the IP allowlist and the expiry. **The name cannot be changed** — that field is greyed out and read-only.
3. Click **Confirm** to save.

## Delete a key

1. Click **Delete** on a row in the list.
2. Confirm in the dialog and the key is deleted.

:::warning Make sure nothing depends on it first
Once deleted, the key you handed out stops working. Before deleting, confirm no application still relies on it, so that live calls are not cut off abruptly.
:::

## There is no balance on this pass

Be clear about the distinction: an API key handles **authentication and rate limiting only** — it carries no "quota" or "balance" of its own. Neither the list nor the form has a "used quota" or "remaining quota" field. To see how much a key has actually used, filter by it in **Call Logs**.

## Confirm it worked

Go back to the **Token Management** list: the new key appears and the **API Key** column shows a mask. Copy the full key, send it to the caller, and if they can successfully call a model, your configuration is live.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Cannot find a user under Owner | Too few characters typed | Type at least one character before selecting |
| The key cannot be read after saving | You only see the mask | Click the copy button; it copies the complete key |
| Calls are rejected | The IP is not in the allowlist, or the key has expired | Edit the key to add the source IP or extend the expiry |
| Changed the rate limit but saw no difference | Key limits and channel limits are two layers | Both apply — check that the other layer is not the one limiting you |

## Related

- [Channel Management](/boss/gateway/channels): configure the line requests actually leave through
- [Call Logs](/boss/gateway/audit): see how a particular key has been used
- [Gateway Configuration](/boss/gateway/config): global rate limits and security settings
