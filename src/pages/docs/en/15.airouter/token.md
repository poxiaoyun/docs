---
title: 'API Keys'
updated: '2026-09-14'
description: 'Wiring a program up to the models, or unsure how keys are created, managed or billed? Start here.'
---

# API Keys

**API Keys** manages the credential used to **call the AIrouter model API**. You need it to chat by hand on the [Playground](./experience.md) page, and even more so to connect models to your own programs — a program uses this key to prove "this call came from me".

:::warning This is not the same as the API key in the Account Center
The API key in the Account Center is used for the platform's own management APIs; the keys here are used only for the **conversation model API**. The two cannot be interchanged.
:::

## Before you start

- Any signed-in account works; no extra role is needed.
- You can only see and manage the keys under your own account.

## The page has two tabs

| Tab | What you see |
| --- | --- |
| **API Keys** | The key list, plus create, edit and delete |
| **Request Logs** | A detailed record of each call |

## Reading the key list

| Column | Description |
| --- | --- |
| **Name** | Click the name to open the details |
| **API Key** | Shows only the first 6 characters plus `************`; the copy button on the right copies the full value |
| **RPM** | Maximum requests per minute; `∞` means unlimited |
| **TPM (K)** | Maximum tokens per minute, in K; `∞` means unlimited |
| **Allowed IPs** | `*` means every IP can use it |
| **Expiration time** | **Never expires** means it stays valid long term; an expired key is flagged in red as "Expired", after which it can no longer call |
| **Created at** | When the key was created |

![API Keys list: two tabs on top, then a table of name, key, RPM, TPM, IP allowlist and expiry](/assets/screenshots/airouter/token-01.png)

The list page looks like this: two tabs under the title with **API Keys** selected by default, and the **Add API Key** button at the top right. The key column only exposes the leading characters, and they are blurred further in the screenshot.

## Create a key

1. Click **API Keys** in the top navigation.
2. Click **Add API Key** in the top-right corner of the page.
3. Fill in the **API Key Configuration** form:

   | Form item | How to fill | Notes |
   | --- | --- | --- |
   | Name | For example `my-app-prod` | Required; **cannot be changed** after creation |
   | RPM | For example `60` | Maximum requests per minute, range 0 ~ 10000; empty or `0` means unlimited |
   | TPM (K) | For example `100` | Maximum tokens per minute, in K (1K = 1000 tokens/min), range 0 ~ 100000; empty or `0` means unlimited |
   | Allowed IPs | Defaults to `*` | Only addresses on the list may call; see the next section for the format |
   | Never expires | On by default | After turning the switch off, **Expiration time** appears and you must pick a time |

4. Click **Confirm**. To give up, click **Cancel**.

Once created, the new key appears back in the list.

### How to write the Allowed IPs

| Format | Example |
| --- | --- |
| A single IP | `192.168.1.100` |
| A subnet | `10.0.0.0/24`, where the mask after the slash must be 0 ~ 32 |
| All IPs | `*` |

Separate multiple values with a **comma** or a **newline**. Note that each number must be 0 ~ 255 and **must not have leading zeros** (`01` will fail validation).

![The API Key configuration form opened by Add API Key](/assets/screenshots/airouter/token-02.png)

That is the creation form: **Name** (required), **RPM**, **TPM(K)**, **IP allowlist**, and the **Never expires** toggle which is on by default. **Cancel** at the bottom left, **Confirm** at the bottom right.

## Get the full value of a key

In both the list and the detail page, the key itself is always masked. To get the full value, click the **copy button** beside the key.

:::warning What you copy is the full key
Once you have the full key, store it somewhere safe immediately (for example a password manager or an environment variable in your program). Do not paste it into chat tools, documents or code repositories. A leaked key means someone else can spend your allowance calling models.
:::

## What this key can do

1. Start conversations on the [Playground](./experience.md) and [Comparison](./compare.md) pages — the page automatically picks the first key in the account, and you can switch keys on the page.
2. Let your own programs call the model API. In [Models](./marketplace.md), open any model's details and click **API docs**, which gives the **Gateway Address** and curl, Python and Go samples you can copy.
3. In the samples, replace `YOUR_TOKEN` with the key you copied and `YOUR_MODEL` with the model ID on the card, and your first call will go through.

## How cost is counted

This page **sets no allowance** and does not limit how much you spend. Cost works like this:

The cost of each call is calculated from the **model price** — the input price and output price you see in the [Models](./marketplace.md) details (per 1M tokens) — and the running total is the **Total spend** on the **Usage analysis** page. To control spending, work from two sides: set a sensible RPM / TPM on the key, or switch to a cheaper model.

If the account's overall allowance runs out, calls return "Insufficient quota" directly, and you need to ask the administrator to handle the allowance.

## Edit and delete

- **Edit**: choose **Edit** from the action menu at the end of a row to open the edit form. The name field is locked and cannot be changed; RPM, TPM, the allowlist and the expiry setting can all be changed — click **Confirm** when done. You can also use **Actions** → **Edit** at the top right of the detail page.
- **Delete**: choose **Delete** from the row's action menu, or **Actions** → **Delete** on the detail page. Deleting opens a confirmation dialog and requires you to type the key's name to continue.

:::warning Deletion cannot be undone
After deletion, every request still using this key **fails immediately**, and the action cannot be undone. Before deleting, confirm that no program is still using it.
:::

## View the key details

Click a key's **name** in the list to open its detail page, which shows the key value (masked, with a copy button), ownership, created at, expiration time, RPM, TPM (K) and Allowed IPs.

To change the configuration or delete it, use the **Actions** menu at the top right.

## View the request logs

Switch to the **Request Logs** tab to see a record of every call under your account:

1. At the top, choose a **Time Range**: **Today** (default), **Yesterday**, **Last 3 days**, **Last week** or **Custom**. Choosing Custom reveals a **Start date** and an **End date**.
2. You can filter further by **Token**, **Channel**, **Model** and **Result**; Result offers **All**, **Success**, **Error**, **Blocked** and **Quota Exceeded**.
3. Click **Refresh** to fetch again, or **Reset** to clear every filter.
4. Each row in the table is one call, listing the time, channel, token, model, request ID, duration (including first-token time), tokens, cost and standard.
5. To see a row's details, click the eye icon next to the time column.

When troubleshooting a failed call, the **Request ID** and **Result** columns are the most useful: give the request ID to the administrator and they can locate that exact call.

![The Request logs tab: time range and four filter dropdowns on top, one row per call below](/assets/screenshots/airouter/token-03.png)

The **Request logs** tab looks like this. It shares a page with **API Keys**, so switching tabs does not reload anything. This account had no calls that day, so the table is empty; with traffic it lists every request newest first.

## Security advice

| Advice | Description |
| --- | --- |
| One key per application | Create separate keys for different programs and environments, so you can disable and meter them individually |
| Set up the allowlist | Allow only the IPs of the machines that run your programs; do not keep using `*` |
| Set an expiry | Avoid long-lived, never-expiring keys where not necessary |
| Set sensible RPM / TPM | Prevent a misbehaving program from burning the whole allowance in an instant |
| Rotate and clean up | Rotate keys regularly and delete old ones you no longer use |

## Related

- [Models](./marketplace.md)
- [Playground](./experience.md)
- [Usage analysis](./usage-statistics.md)
- [Parameter Settings](./debug.md)
