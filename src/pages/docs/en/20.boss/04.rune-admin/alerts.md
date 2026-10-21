---
title: Alerts
updated: '2026-10-21'
description: Add alert rules from templates in a cluster, choose notification channels and durations, and review or clear records in the alert history.
tags:
  - boss
  - rune-admin
  - alerting
---

# Alerts

Cluster alerts solve "someone must know when something breaks": configure rules for cluster metrics from templates, and once a threshold holds for a while a notification goes out and a record is kept.

After this page you will be able to add an alert rule, pick the right severity and notification channels, pause or resume a rule, and search or clear records in the alert history.

:::tip The four parts of an alert

- **Template** ≈ a preset check (for example node CPU usage) that decides which parameters you fill in.
- **Rule** ≈ a template applied to this cluster: the threshold, and how long the condition must hold.
- **Notification channel** ≈ where the message goes, configured under **Alert Channels** in the top navigation.
- **Alert history** ≈ a record of every firing and recovery.

:::

## Concepts

| Term | Plain explanation |
| --- | --- |
| Alert template | A preset check on the platform; each template allows only one rule |
| Rule name | Name of this rule: letters, digits, `-`, `_`, `.`, up to 63 characters |
| Severity | Critical / Warning / Info, used to rank priority |
| Duration | How long the condition must hold before alerting, to avoid flapping |
| Notification interval | While the same alert keeps firing, at most how often to notify; leave blank for the system default |
| Notification channels | Where to send when the rule fires; multi-select. If none is chosen, the built-in **In-app message (built-in)** is used |
| Alert history | A record of each state change: Alerting, Pending, Inactive, Paused, Resolved, Unknown, Error |

## Before you start

- You need a **system administrator** account.
- To send to Feishu or email, configure the channel first under **Alert Channels** in the top navigation, see [Alert Channels](/boss/settings/alert-channels).
- The cluster is connected to the platform and the monitoring collector is deployed, otherwise templates have no data.

## How to open it

1. Click **AI Platform** in the top navigation bar, then click **Cluster Management** under the **AI Platform** group in the left sidebar.
2. Click into the target cluster.
3. Under the **Operations Management** group in the left-hand menu, click **Alerts**.

## Reading the rule list

| Column | Meaning |
| --- | --- |
| Rule name | Display name of the rule; sortable |
| Alert template | Template description on the first line, template name below |
| Duration | Listed per severity, for example "Critical: 5m, Warning: 10m" |
| Notification interval | Shows `-` when unset |
| Notification channels | Channel name labels; shows **In-app message (built-in)** when empty |
| Status | **Enabled** or **Paused** |

Actions on each row:

| Action | Meaning |
| --- | --- |
| Pause alert / Resume alert | Toggle the rule's enabled state; takes effect immediately |
| Edit alert rule | Open the rule dialog to change parameters and channels |
| Delete | Asks for confirmation; afterwards the template can be used for a new rule |

![Alerts page: rule table and the add-alert-rule button above, alert history below](/assets/screenshots/boss/rune-alerts-01.png)

## Add an alert rule

1. Click **Add alert rule** at the top right.
2. Choose an **alert template**. **Templates that already have a rule do not appear in the drop-down** — one rule per template.
3. Fill in the **rule name** (letters, digits, `-`, `_`, `.`, up to 63 characters).
4. Fill in the **parameters** the template asks for, for example threshold, warning threshold, critical threshold.
5. Tick the **severities** and set a **duration** for each (for example 30s, 5m, 1h).
6. Choose the **notification channels** (multi-select; if none, the built-in in-app message is used).
7. Optionally fill in the **notification interval**, for example `10m`; leave blank for the system default.
8. Save.

:::warning What if the template is used up
Each template allows only one rule. To configure the same template a second time (for example with a different threshold) you must delete the existing rule first. Deleting a rule does **not** delete existing alert history.
:::

## Alert history

The **alert history** at the bottom of the page records every firing and recovery:

| Column | Meaning |
| --- | --- |
| Status | Alerting / Pending / Inactive / Paused / Resolved / Unknown / Error |
| Severity | Critical / Warning / Info |
| Occurred at | When this state change happened |
| Firing count | How many times it has fired in total |

You can delete one record, or tick several and delete them in bulk.

:::info History is "what happened", not current state
After a rule is paused its earlier records are still in the history. To judge whether something is alerting right now, read the rule's **status** and the latest history entry.
:::

## Confirming the result

| What you want to confirm | Where to look |
| --- | --- |
| The rule was created | A new row appears in the rule list with status **Enabled** |
| The channels are right | The **notification channels** column of that row |
| Messages actually arrive | Click **Test channel** under **Alert Channels** first; then confirm in the Feishu group or mailbox after a trigger |
| Whether it has fired | The latest entries in **alert history** below |

## Common questions

| What you see | Likely cause | What to do |
| --- | --- | --- |
| The template you want is missing from the drop-down | That template already has a rule | Edit the existing rule, or delete it and create a new one |
| Saving the rule name fails | Non-ASCII characters or too long | Use only letters, digits, `-`, `_`, `.`, at most 63 characters |
| The rule exists but never fires | Duration too long, or threshold too high | Shorten the duration, lower the threshold |
| No notification arrives | No channel selected and nobody watches in-app messages, or the channel is misconfigured | Select a channel and test it under **Alert Channels** |
| The template is still missing after deleting a rule | The page has not refreshed | Refresh and retry |

## Related

- [Alert Channels](/boss/settings/alert-channels)
- [Cluster Status](/boss/rune-admin/cluster-overview)
- [Log Management](/boss/rune-admin/logs)
- [Scheduling](/boss/rune-admin/scheduling)
