---
title: 'API Keys'
updated: '2026-10-21'
description: 'Issue and manage the keys that call the gateway: set rate limits, IP allowlists and expiry, and enable or disable them at any time.'
tags:
  - boss
  - gateway
---

# API Keys

An API key is the **door pass** for calling the gateway: every request must carry one. This page lets you view and manage **every API key on the platform** — whichever user or tenant it belongs to.

After reading this you can create a key for a user, set its rate limits and access scope, make it expire, disable it immediately when suspicious, and view or delete existing keys.

:::tip An API key is a door pass
The card says "who you are" (owner) and "which doors you may open" (IP allowlist, rate limits). If it is lost, disable it at once, or someone else can open the door too. Issue a separate key per person so problems stay traceable.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Decide **which user** receives the key — an owner is required at creation.
- To restrict sources, have the allowed IPs or CIDRs ready.

## Opening API Keys

1. Click **Model Gateway** in the top navigation bar.
2. Expand **User Management** and click **API Keys**.

## Reading the key list

| Column | Meaning |
| --- | --- |
| Name | The key name |
| API Key | Masked, with a copy button on the right |
| Status | Enabled / Disabled / Expired |
| Owner | Which user the key belongs to |
| RPM | Requests per minute cap; "∞" means unlimited |
| TPM(K) | Tokens per minute cap; "∞" means unlimited, otherwise shown like `48K` |
| Access IP Allowlist | Allowed source IPs; `*` means any IP |
| Expires At | "Never expires" when unset; expired keys are marked in red with the time |
| Created At | When the key was created |

Above the list there is a **search box** and an **Owner** filter (type at least one character for candidates to appear). Selecting several rows allows **batch delete**.

:::info The mask is display only
The list shows the first 6 characters and masks the rest with 12 asterisks. The **copy button** copies the **full key**, so do not share screenshots of this page carelessly.
:::

![API key list: name, API key, status, owner, RPM, TPM(K), access IP allowlist, expiry](/assets/screenshots/boss/gateway-token-01.png)

The key list in BOSS looks almost identical to a normal user's [API keys](../../15.airouter/token.md), with one extra column: **Owner** — because this page covers the whole platform and you need to see whose key each one is.

## Creating a key

1. On the **API Keys** page, click **Add API Key** in the top right corner.
2. Fill in the form:

   | Field | How to fill it | Notes |
   | --- | --- | --- |
   | Name | For example `team-a-key` | Required and immutable after creation |
   | Owner | Search and pick a user | Required; decides who owns the key |
   | RPM | For example `600` | Optional, `0`–`10000`; empty means unlimited |
   | TPM(K) | For example `48` | Optional, `0`–`100000`, unit K (1K = 1000 tokens per minute) |
   | Access IP Allowlist | Defaults to `*` | Optional; format below |
   | Never expires | On by default | Turning it off makes an expiry mandatory |
   | Expires At | Minute precision | Only shown when "Never expires" is off |

3. Click **Confirm**. You return to the list on success.

![Create API key form: name, owner, RPM, TPM(K), access IP allowlist](/assets/screenshots/boss/gateway-token-02.png)

Compared with the user-facing form, this one adds a required **Owner**; every other field (name, RPM, TPM(K), access IP allowlist, never expires) means exactly the same.

### Small rules for numeric input

RPM and TPM accept **integers** only; the inputs reject `e`, `E`, `+`, `-` and `.`.

### Writing the IP allowlist

Separate multiple values with **commas** or **new lines**.

| Format | Example | Notes |
| --- | --- | --- |
| Single IP | `192.168.1.100` | Matches exactly that address |
| CIDR | `10.0.0.0/8` | Allows the whole range; prefix `0`–`32` |
| Wildcard | `*` | Allows every IP; also the default |

:::warning IPv4 only
The allowlist accepts IPv4 addresses only, each octet `0`–`255`, with no leading zeros (so `01` is invalid). IPv6 addresses are not recognised.
:::

## Enabling and disabling

The row menu offers **Enable** and **Disable**, each with a confirmation dialog first:

| Action | Effect on callers |
| --- | --- |
| Disable | **New requests** with this key are rejected; requests already in flight are not interrupted. You can enable it again later, with the key and its settings intact |
| Enable | Restores access. The existing expiry, IP restrictions and rate limits still apply |

On success a toast reads "API key 'xxx' has been disabled / enabled".

:::info Disabling is more common than deleting
When you suspect a leak, **disable** first: it takes effect instantly and is reversible. Delete only once you are sure the key is not needed. A key disabled by an administrator cannot be re-enabled by the user in Console — you have to do it.
:::

## Editing a key

1. Click **Edit** on a row.
2. You can change the owner, rate limits, IP allowlist and expiry; the **name is read-only** and greyed out.
3. Click **Confirm** to save.

## Deleting a key

1. Click **Delete** on a row.
2. You must **type the key name** in the confirmation dialog before it is removed.

Selecting several rows also allows **batch delete**, with the same confirmation.

:::warning Deletion is irreversible
A deleted key stops working immediately and cannot be restored. Confirm that no application depends on it first; to pause it temporarily, use **Disable**.
:::

## There is no balance on this card

Be clear about the boundary: an API key only handles **authentication and rate limiting**. It carries no allowance or balance, and you cannot bind an account or a dedicated rate here. The form has no "used" or "remaining" fields. For costs and balances, go to [Call Logs](/boss/gateway/audit) and [Billing Accounts](/boss/gateway/billing-accounts).

## Confirming the result

Back on the **API Keys** list, the new key appears with a masked value in the **API Key** column. Copy the full key, hand it to the caller, and if their call succeeds the configuration is live.

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The Owner search finds nobody | Too few characters typed | Type at least one character |
| The key cannot be revealed | Only a mask is shown | Use the copy button; it copies the full key |
| Calls are rejected | The key is disabled, the IP is not allowlisted, or it has expired | Check the **Status** column, then fix the IP list or extend the expiry |
| Status is "Disabled" but you did not do it | Another administrator may have disabled it | Confirm the workload still needs it, click **Enable**, and check who acted |
| Rate limit changed but nothing happened | Key limits and channel limits are two layers | Both apply; check whether the other layer is the one biting |

## Related

- [Channel Management](/boss/gateway/channels): configure the line requests actually take
- [Call Logs](/boss/gateway/audit): how one key was used and what it cost
- [Billing Accounts](/boss/gateway/billing-accounts): where the key's owner is charged
- [Gateway Configuration](/boss/gateway/config): global rate limiting and security
