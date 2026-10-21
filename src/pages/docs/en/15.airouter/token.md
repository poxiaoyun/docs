---
title: 'API Keys'
updated: '2026-10-21'
description: 'Wiring a program up to the models, or unsure how keys are created, disabled or where call logs live? Start here.'
---

# API Keys

**API Keys** manages the credential used to **call the AIrouter model API**. You need it to chat by hand on the [Chat](./experience.md) page, and even more so to connect models to your own programs — a program uses this key to prove "this call came from me".

The page also provides **Request Logs**, so you can check every single call you or your program made.

:::warning This is not the same as the API key in the Account Center
The API key in the Account Center is used for the platform's own management APIs; the keys here are used only for the **conversation model API**. The two cannot be interchanged.
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- You can only see and manage the keys under your own account.
- **Rate limits (RPM / TPM) and allowed IPs are configured by administrators and cannot be changed by users; there is no edit entry either.** Contact an administrator if they need adjusting.

## The page has two tabs

| Tab | What you see |
| --- | --- |
| **API Keys** | The key list, plus create, enable, disable and delete |
| **Request Logs** | A record of every call |

They are two views of one page: **API Keys** answers "what keys exist", **Request Logs** answers "what happened with them".

## Read the key list

| Column | Notes |
| --- | --- |
| **Name** | Click it to open the details |
| **API Key** | Only the first 6 characters plus `************`; the copy button copies the full value |
| **Status** | **Active** / **Disabled** / **Expired**. Keys disabled by an administrator also show a shield icon, with the tooltip "This API key was disabled by an administrator and cannot be enabled by you. Please contact an administrator." |
| **Expiration time** | **Never expires** means it stays valid; once past, the value turns red with an "Expired" label and the key stops working |
| **Created at** | When the key was created |

:::info No rate limits on this page
The list has **no RPM, TPM or allowlist columns**. Those three are configured by administrators and only appear as read-only values on the key detail page.
:::

What the row menu offers:

| Action | When it is available | Notes |
| --- | --- | --- |
| **Enable** | The key was disabled by **you** | Restores access with this key |
| **Disable** | The key is currently active | **New** requests using this key are rejected; requests already in progress are not interrupted |
| **Delete** | Any status | A confirmation dialog asks you to type the key name to continue |

A key blocked by an **administrator** is read-only: enabling it yourself will fail, so contact an administrator.

## Create a key

1. Click **API Keys** in the top nav.
2. Click **Create API key** at the top right.
3. In the **Create API key** form, fill in:

   | Field | How to fill it | Notes |
   | --- | --- | --- |
   | **Name** | e.g. `my-app-prod` | Required, trimmed; **cannot be changed after creation** |
   | **Never expires** | On by default | Turning it off reveals **Expiration time** |
   | **Expiration time** | Pick a date and time | Only shown when **Never expires** is off, and required |

4. Click **Confirm**. Click **Cancel** to back out.

The new key appears in the list right away. It starts with **no rate limit and no IP restriction**; ask an administrator to add them if needed.

:::warning Think about the name first
Names cannot be edited or renamed. Use "app + environment" (for example `crm-prod`, `crm-test`) so dozens of keys stay distinguishable.
:::

## Get the full key value

In both the list and the details, the key itself is always masked (first 6 characters plus asterisks). To get the full value, click the **copy button** next to it.

:::warning What you copy is the full key
Store it somewhere safe immediately (a password manager, or an environment variable in your program). Never paste it into chat tools, documents or repositories. A leaked key lets someone else spend your quota.
:::

## What the key can do

1. Start conversations on [Chat](./experience.md) and [Comparison](./compare.md) — the page picks the first usable key automatically, and you can switch it there.
2. Call the model API from your own program. The endpoint list and auth headers are in [API docs](./api-docs.md); for a ready-made sample per model, open the model in [Models](./marketplace.md) and click **Examples**.
3. In the sample, replace `YOUR_TOKEN` with the key you copied and `YOUR_MODEL` with the model ID from the card, and the first call runs.

## Read the key details

Click a key **name** in the list to open its detail page, titled "API Key / your-key-name". It shows:

| Field | Notes |
| --- | --- |
| Key | Masked, with a copy button |
| Belong to | What the key belongs to |
| Created at | When it was created |
| Expiration time | **Never expires** when none was set |
| **RPM** | Max requests per minute. `∞` means unlimited |
| **TPM (K)** | Max tokens per minute, shown converted from K to a concrete number. `∞` means unlimited |
| **Allowed IPs** | `*` means every IP may use it |

The last three are **read-only** — they show what an administrator configured, and cannot be changed here.

To disable or delete, click the **Actions** menu at the top right. It only offers **Disable** / **Enable** / **Delete** — **there is no edit**. To change rate limits or allowed IPs, contact an administrator.

## Read the request logs

Switch to the **Request Logs** tab to see every call made under your account:

1. Pick a time range at the top: **Today** (default), **Yesterday**, **3 days**, **7 days**, **Custom**. Choosing **Custom** reveals **Start date** and **End date**.
2. Four filters are available:
   - **API key**: type a key name; filtering applies as you type.
   - **Channel**: filter by channel name.
   - **Model**: filter by model name.
   - **Result**: **All**, **Success**, **Failure**, **Blocked**, **Quota exceeded**.
3. Click **Refresh** to fetch again, **Reset** to clear every filter and return to **Today**.
4. Each row is one call; see the column table below.
5. For details, click the eye icon next to the time column (hover shows **View detail**) to open the detail dialog.

| Column | Notes |
| --- | --- |
| **Timestamp** | When the request started; below it a coloured dot and the result text |
| **Channel** | Which channel served it, with provider, tenant, cluster and workspace |
| **API Key** | Which key this call used |
| **Model** | The model ID called |
| **Request ID** | The identifier of this request |
| **Duration** | First-token latency and total duration |
| **Tokens** | Input, output and total |
| **Cost** | The amount charged for this call |
| **Standard** | The pricing standard used (for example which rate plan) |

:::tip The small icons in the time column
- **Coloured dot + text**: whether the call succeeded. Failed rows also carry a red bar on the left edge, so problems stand out.
- **Warning icon**: sensitive content was detected in this call; hover for the exact message.
- **Eye icon**: open the details for this row.
:::

When troubleshooting failures, **Request ID** and **Result** are the two most useful columns: give the request ID to an administrator and they can locate the call directly.

![The Request Logs tab: time range and four filter inputs on top, calls listed by time in the table](/assets/screenshots/airouter/token-03.png)

Above is the **Request Logs** page. It is a tab of the same page as **API Keys**, so switching does not reload anything. The account had no calls that day, so the table is empty; normally every request is listed newest first.

## How quota works

This page **sets no quota** and does not cap your spend. What decides whether you can call, and what it costs, is elsewhere:

| Where | What it controls |
| --- | --- |
| [Prices](./prices.md) | Each model's unit price; call cost is computed from it |
| [Account](./billing.md) | Balance, current plan, plan credit usage, weekly quota |
| [Subscribe](./subscribe.md) | Buying plans; the **overage charges** switch is set when you order |

So when you see these messages, the key is not the problem: **balance too low** → check the account balance; **plan credits used up** → turn overage charging on or buy a new plan; **weekly quota used up** → wait for the reset or move to a higher plan; **account frozen or disabled** → only an administrator can fix it. See the common issues in [Chat](./experience.md) for the full list.

## Security recommendations

| Recommendation | Why |
| --- | --- |
| One key per application | Separate programs and environments, so each can be disabled and measured independently |
| Delete or disable what you do not use | Delete unused keys; disable keys you only pause temporarily |
| Set an expiration | Avoid "never expires" unless the key really is long-lived |
| Rotate and clean up | Replace keys periodically and remove old ones; verify the new key works first |
| Ask an administrator for limits | RPM / TPM / allowed IPs are configured by administrators, not on the user side |

## Related

- [Models](./marketplace.md)
- [Chat](./experience.md)
- [Usage analysis](./usage-statistics.md)
- [API docs](./api-docs.md)
- [Account](./billing.md)
- [Parameter Settings](./debug.md)
