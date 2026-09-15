---
title: Hit Records
updated: '2026-09-14'
description: 'See which calls tripped content moderation: matched words, risk level and how they were handled.'
tags:
  - boss
  - gateway
---

# Hit Records

Hit Records is the **archive of moderation results**. Every time a request or a response trips the sensitive-word check, a record is left here stating who it was, when it happened, which words matched, how risky they were and how the system finally handled it.

By the end you will be able to filter to the records you care about by time and user, read the risk level and handling method, and open a record to see exactly what matched.

:::tip Like replaying the scanner's footage
An airport scanner sweeps thousands of bags a day; to review "what set that alarm off", you rely on the recorded footage. Hit Records is the replay of content moderation: you do not have to dig through every call, because the system has already filtered down to the alarms.
:::

## Before you start

- Permission: you need a platform administrator account (one that can enter the BOSS console).
- The lexicon and policies must already be configured and real hits must have happened, otherwise this page has no data. See [Content Moderation](/boss/gateway/moderation) for how to set that up.

## Open Hit Records

1. Click **Model Gateway** in the top navigation bar.
2. Expand **Security Services** and click **Hit Records**.

![Hit records: the range is prefilled to the last month, with user and provider filters and rows newest first](/assets/screenshots/boss/gateway-hits-01.png)

This is what you see on arrival: **Start** and **End** are prefilled to the last month and there is no extra switch on top. A `-` in the **Word** column means the request was caught by a policy on its **total risk score** rather than on a single term; the **Risk level** column shows which band that score fell into.

## This page is already filtered for you

You do not have to say "only show hits" — the page always queries records that tripped sensitive content. The list is ordered by request time, **newest first**, with **15** records per page by default.

The default time range is **the last month**: from midnight one month ago up to the end of today.

## How to filter

| Filter | Notes |
| --- | --- |
| Start time | Accurate to the minute |
| End time | Accurate to the minute |
| User | Search by username |
| Channel provider | A dropdown that includes **All** |

The toolbar has **Reset** and **Refresh**. Reset puts the time range back to the default last month and clears the user and channel provider filters.

## What the list contains

| Column | Meaning |
| --- | --- |
| Time | When the request happened; the small text below is the result of that call |
| User | The user who made the call, with avatar and tenant name |
| Model | The model requested, with the model icon |
| Type | The category the sensitive content belongs to |
| Sensitive Words | The matched words, joined together when there are several |
| Risk Level | High / Medium / Low, distinguished by colour |
| Token | The name of the key used (the masked key when it has no name) |
| Handling Method | The action the policy finally took |

### How the risk level is decided

The risk level is derived from the **highest score** among the matched content:

| Score | Level |
| --- | --- |
| 8 or above | High |
| 5 or above | Medium |
| Anything else | Low |

If no score is available in the report for a call, a blocked call is recorded as **High** and the rest as **Medium**.

### The possible handling methods

The handling method matches the action configured in [Policy Management](/boss/gateway/moderation):

| Handling method | Meaning |
| --- | --- |
| Log | The content passed normally and only a record was left |
| Replace | The matched words were masked and the request continued |
| Webhook | An external moderation service made the decision |
| Block | The request was rejected outright |

## View the details of a hit

1. Click the **Time** cell of a record in the list (or the view-details icon next to the time).
2. The dialog lists the matched sensitive words as labels at the top.
3. Below that is the request content, with the matched words highlighted, so you can tell a real hit from a false positive.

:::info This page is read-only
Hit Records is for querying only. The page offers no delete, no export and no way to act on an individual record. To change how something is judged, go back and adjust the lexicon or the policies.
:::

## How this relates to the other pages

- Terms and scores are maintained in **Sensitive Word Management**.
- Trigger conditions and actions are configured in **Policy Management**.
- All calls (including those that tripped nothing) are queried in [Call Logs](/boss/gateway/audit).

## Confirm it worked

After changing the time range and user, if the list follows your changes and opening a record shows highlighted matched words, the query is working. If it stays empty for a long time, first check whether the master switch and the entries are enabled.

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The list is empty | The master switch is off, the entries are not enabled, or nothing was hit in that period | Check the moderation switch in [Gateway Configuration](/boss/gateway/config) and widen the time range |
| Cannot find older records | The default query covers only the last month | Move the start time back manually |
| Want to delete a record | This page is read-only | Not supported; adjust the lexicon or the policies as needed |
| The handling method is Log and the content was unchanged | That policy only records, it does not act | Change the policy's action if you want blocking or replacement |

## Related

- [Content Moderation](/boss/gateway/moderation): maintain the lexicon and policies
- [Call Logs](/boss/gateway/audit): query every call in detail
- [Gateway Configuration](/boss/gateway/config): the master switch for content moderation
