---
title: 'Alerts'
updated: '2026-10-21'
description: 'Where to see alerts, how to attach alert rules to an instance, how to read alert history, and what to check when no alert arrives.'
tags:
  - rune
  - console
  - alerts
---

# Alerts

Alerts watch things for you when you are not staring at the page: when an instance's resource metric crosses the threshold you set, the platform sends a message to the in-app inbox, Feishu, or email according to the rule.
After reading this page you will know what the two entry points are for — the **bell in the top bar** shows what already happened, and the **Alerts tab in an instance detail** is where you configure rules and read history.

:::tip The journey of one alert
**Rule** (what to watch, at what value, for how long) → **trigger** (the condition holds long enough) → **notification** (sent to the channels you picked) → **inbox / history** (where you see it).
When no alert arrives, usually one link in this chain is not configured.
:::

## Core concepts

| Term | Plain explanation |
| --- | --- |
| Alert rule | A condition: which metric to watch, at what threshold, and for how long it must hold |
| Alert template | A rule template provided by the platform; it decides which metrics a rule can watch and the allowed parameter ranges |
| Severity | Critical / Warning / Info, used to prioritise handling |
| Notification channel | Where the alert goes: **in-app (built-in)**, Feishu, or email |
| Notify interval | While one alert keeps firing, at most one notification per interval, to avoid flooding |
| Alert inbox | The message inbox behind the bell in the top-right corner |
| Alert history | Alerts that already fired for one instance |

## Before you start

- Your tenant role must be **Administrator** or **Developer**.
- **Region** and **Workspace** are selected in the top left; the inbox and instance alerts are scoped to the current tenant / workspace.
- To send to Feishu or email, the platform must have configured those **alert channels** first. Without them you can still use alerts, but messages only land in the in-app inbox.

## The alert bell: what already happened

There is a bell icon in the top-right corner of the page:

1. When something is unread, the bell carries a red dot and the unread count appears next to it.
2. Click the bell and the **alert inbox** drawer slides out, with "N unread" under the title.
3. At the top of the drawer you can switch between **All** and **Unread only**.
4. Each message shows its title, severity, status, unread / read marker, plus the alert object, rule, condition, current value, cluster, and trigger time.
5. Click a message to mark it read; when more than one is unread, **Mark all as read** appears at the top right.
6. The delete icon at the bottom right of each message removes it from your inbox.

When there is nothing to show, the drawer says "No alert notifications" or "No unread alerts".

![Alert inbox drawer: unread count, All / Unread only switch, one message with severity and details](/assets/screenshots/rune/alerting-01.png)

:::warning Deleting a message does not fix the problem
The inbox is only a copy of the notification. Deleting affects your inbox alone; if the rule is still there and the metric still exceeds the threshold, the next alert will arrive anyway.
:::

## Attach alerts to an instance

Alerts are configured **per instance**, and every instance type has this tab (Inference, Training & Fine-tuning, Runebox, Application Instances, Metrics, Evaluations).

1. Click an instance name in a list to open its detail page.
2. Click the **Alerts** tab at the top.
3. In the **Alert rules** block, click **Add alert rule**.
4. Fill in the dialog:

   | Field | What to enter | Notes |
   | --- | --- | --- |
   | Rule name | For example `gpu-util-high` | Required; letters, digits, `-`, `_`, and `.`, up to 63 characters |
   | Alert template | Pick one from the dropdown | Decides which metric the rule watches and which parameters it takes |
   | Severity | Critical / Warning / Info | One severity per rule |
   | Threshold | A number within the range the template allows | For example 90 for 90% CPU usage |
   | Duration | For example `30s`, `5m`, `1h` | The condition must hold this long before it actually fires, which avoids flapping |
   | Notify interval | `10m` by default | Repeat interval while the alert keeps firing; leave empty for the system default |
   | Channels | Tick the channels | **In-app (built-in)** is always included; Feishu and email can be added when configured |

5. Click **Confirm** and the rule appears in the **Alert rules** table.

The rule table has the columns **rule name / condition / duration / notify interval / channels / status**. The row menu offers:

| Action | Effect |
| --- | --- |
| Edit alert rule | Change the threshold, duration, channels and so on; whether the name can change is decided by the platform |
| Pause / Resume alert | Temporarily switch the rule off without deleting the configuration |
| Delete | Remove the rule entirely |

:::tip How to choose a threshold
Start with a value that is clearly abnormal — CPU 90%, GPU memory 95% — and tighten it after a week or two of observation. Starting at 60% drowns you in false positives, and eventually nobody reads the alerts.
:::

## Read the alert history

Below the rules, the same **Alerts** tab shows **Alert history**, with the columns **rule name / status / severity / observed at / trigger count / summary** (the summary carries the condition and current value).

- Status values: **Firing / Pending / Inactive / Paused / Resolved / Unknown / Error**.
- Severity values: **Critical / Warning / Info**.
- Select several rows to delete in bulk, or delete a single row.

:::info Deleting history only clears records
Deleting a history record does not touch the rule, and does not make an incident that already happened go away.
:::

## What to check when no alert arrives

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| The bell never shows a red dot | No rule configured, or the rule is paused | Open the **Alerts** tab of the instance and check whether the status is Paused |
| The rule is enabled but nothing arrives | The metric never crossed the threshold, or the duration has not elapsed | Lower the threshold and shorten the duration for a quick verification |
| The inbox has it but Feishu / email does not | The channel is not configured on the platform, or was not ticked on the rule | Ask the platform administrator about channels, then tick it when editing the rule |
| Too many repeated messages | The notify interval is too short | Increase the **Notify interval**, for example to `1h` |
| Nothing at all is visible | Your role is not Administrator or Developer | Ask the tenant administrator to adjust your role |

## Related

- [Inference](/rune/console/inference)
- [Application Instances](/rune/console/app)
- [Logs](/rune/console/logging)
- [Home](/rune/console/dashboard)
