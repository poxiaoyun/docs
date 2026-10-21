---
title: Policy Management
updated: '2026-10-21'
description: 'Define what happens when a sensitive word is matched: set a threshold, pick an action, configure masking or an external screening service.'
tags:
  - boss
  - gateway
---

# Policy Management

Policy Management defines **what happens after a sensitive word is matched**. It turns the scores in the word list into a total, compares that total with the threshold you set, and decides: just log it, mask the words, hand the content to an external screening service, or block the request outright.

After reading this you can create a "at this score, do this" rule, configure masking for the replace action, connect an external screening service, order several rules, and disable one when needed.

:::tip A policy is the scanner's handling manual
The word list tells you "there is contraband in the bag"; the policy tells you what to do about it: note it and let it through, confiscate it (block), or send it for a second look (delegate to an external service). One list can feed several sets of rules.
:::

## Before you start

- Permission: a platform administrator account (able to open the BOSS admin console).
- Confirm **Enable content moderation** is on in **Gateway Configuration**; otherwise no policy runs.
- The word list needs enabled terms, or there is no score to compare and no policy can ever fire.
- For "Webhook", have the service URL ready and know which of its responses should mean pass and which should mean block.

## Understand the concepts

| Term | Plain explanation |
| --- | --- |
| Trigger condition | How the score compares with the threshold, shown in the list as `≥ 50` |
| Threshold | The cut-off, `0`–`100`, default `50`. The action only runs when the score crosses it |
| Action | What to do on a match: Log / Replace / Webhook / Block |
| Priority | `1`–`10`; decides the order when several policies match. **A lower number means higher priority** |
| Mask | The character used by the replace action, default `*` |

## The policy list

| Column | Meaning |
| --- | --- |
| Policy Name | The policy name, with the description underneath; clicking the name opens the editor |
| Trigger Condition | For example `≥ 50` |
| Action | Which action this policy runs on a match |
| Priority | `1`–`10` |
| Status | Enabled / Disabled, shown as a coloured label, **not a switch** |
| Updated At | When it was last changed |

There is a single filter, **Enabled**, with Enabled / Disabled values, and **no search box**. The row menu offers **Enable**, **Disable**, **Edit** and **Delete**.

![Policy list: policy name, trigger condition, action, priority, status, updated at](/assets/screenshots/boss/gateway-policy-01.png)

One row is one rule: **Trigger Condition** is the score threshold (here `≥ 50`) and **Action** is what happens on a match (here Block). Status is a label, so switching it means using **Enable** or **Disable** in the row menu.

## Creating a policy

1. Click **Create Policy** in the top right corner.
2. Fill in the form:

   | Field | How to fill it | Notes |
   | --- | --- | --- |
   | Policy Name | For example "Block high scores" | Required |
   | Description | One sentence | Optional |
   | Comparison Operator | Defaults to "Greater than or equal (≥)" | Required, see below |
   | Threshold | Defaults to `50` | Required, `1`–`100` |
   | Action | Defaults to Block | Required, see below |
   | Priority | Defaults to `1` | `1`–`10` |
   | Enabled | On by default | When off, the policy does not run |

3. If the action is **Replace** or **Webhook**, the matching configuration appears below (see the next two sections).
4. Click **Confirm**.

**Comparison Operator** has exactly four options:

| Option | Meaning |
| --- | --- |
| Greater than or equal (≥) | Fires when the score reaches or exceeds the threshold |
| Greater than (>) | Fires when the score exceeds the threshold |
| Less than or equal (≤) | Fires when the score is at or below the threshold |
| Less than (<) | Fires when the score is below the threshold |

**Action** has four options:

| Option | What happens on a match |
| --- | --- |
| Log | The content passes normally, and only a record is kept in Hit Records |
| Replace | Matched words are replaced with the mask character and the request continues |
| Webhook | The content is sent to an external screening service, which decides |
| Block | The request is rejected and an error is returned |

:::info Start with Log
Run a low-risk action for a while on a first setup, watch whether Hit Records look accurate, then move on to Replace or Block. Blocking from day one very easily takes normal traffic down.
:::

## Configuring Replace

Choosing **Replace** reveals two fields:

| Field | Default | Notes |
| --- | --- | --- |
| Mask Character | `*` | The character used for replacement |
| Mask Mode | Character Repeat | Character Repeat (`word` → `****`) / Fixed Length (always the same length) / Single Character (the whole word becomes one character) |

## Configuring Webhook

Choosing **Webhook** reveals the webhook settings.

| Field | Default | Notes |
| --- | --- | --- |
| Request URL | Empty | Required; the URL of the external screening service |
| HTTP Method | `POST` | POST / GET |
| Timeout (seconds) | `5` | Request timeout |
| Custom Headers | Empty | Click **Create Header** to add name/value pairs; each can be deleted |

**Response Check** interprets what the service returns:

| Field | Notes |
| --- | --- |
| JSON Path | Extracts the decision value, for example `$.result.blocked` |
| Pass Values | Return values treated as pass; press Enter to add |
| Block Values | Return values treated as block |
| Default Action | Used when the value is in neither list: Pass / Block |
| Message Path | Optional; extracts the message shown to the caller |

:::warning The helper text and the actual default differ
The helper text says "default 30", but a new policy pre-fills `5` in the timeout box. Trust the box, not the sentence.
:::

:::info There is no Authentication section
Only headers can be configured. When you need Bearer or Basic auth, add a header yourself with **Create Header** (for example `Authorization: Bearer xxx`).
:::

## Enabling, disabling and deleting

| Action | Notes |
| --- | --- |
| Enable | Click **Enable** in the row menu; the policy takes part in decisions immediately |
| Disable | Click **Disable** in the row menu; the policy is kept but no longer runs |
| Edit | Returns to the form to change every setting |
| Delete | You must **type the policy name** in the confirmation dialog |

:::warning Deletion is irreversible
A deleted policy cannot be restored. When you only want to pause it, use **Disable** — do not delete.
:::

## Understanding priority

Priority ranges from `1` to `10`. **A lower number means higher priority**, so when several policies match, the one with the higher priority runs first. The page also suggests giving high-threshold rules a higher priority.

A practical arrangement:

| Policy | Condition | Action | Priority |
| --- | --- | --- | --- |
| Observe | `≥ 5` | Log | `5` |
| Mask mid scores | `≥ 8` | Replace | `3` |
| Block high scores | `≥ 9` | Block | `1` |

Low scores are only recorded, mid scores are rewritten, and only high scores are blocked, which keeps false positives to a minimum.

## Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The policy has no effect | The master switch is off, or this policy is disabled | Check the moderation switch and this policy's status |
| Hit Records is empty | The threshold is too high, or term scores are too low | Lower the threshold or raise the term scores |
| Words in the content became asterisks | The action is Replace | Expected; switch the action to Block if you want a refusal |
| Requests are rejected outright | The action is Block | Check whether the threshold is too low, or switch to Log / Replace |
| The external service said pass but the call was blocked | The returned value does not match the Pass Values format, or JSON Path reads the wrong field | Verify the JSON Path and the value lists, and set a sane Default Action |
| A policy cannot be deleted | Deletion requires typing the name | Type the policy name as prompted |

## Related

- [Sensitive Word Management](/boss/gateway/moderation-lexicon): the scores a policy compares come from there
- [Hit Records](/boss/gateway/sensitive-hits): the outcome of each hit
- [Gateway Configuration](/boss/gateway/config): the content moderation master switch
- [Call Logs](/boss/gateway/audit): every call, including those that were never matched
