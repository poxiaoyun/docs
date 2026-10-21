---
title: Alert Channels
updated: '2026-10-21'
description: Configure where alerts are delivered — a Feishu bot or email — and send a test message before relying on it.
tags:
  - boss
  - settings
  - alerting
---

# Alert Channels

Alert channels answer one question: **when the cluster misbehaves, where does the message go?** You can point it at a Feishu bot, at an SMTP mailbox, or use the built-in in-app inbox. Cluster alert rules pick their "notification channels" from the ones defined here.

After reading this page you can add a Feishu or email channel, send a test message to confirm delivery, edit an existing channel, and delete one you no longer need.

:::tip Top-bar entry, not a sidebar item
**Alert channels** is a top-level entry in the top bar. Clicking it shows the **Platform** group in the sidebar, but the list there does **not** contain "Alert channels" — do not go looking for it.
:::

## Key terms

| Term | Plain explanation |
| --- | --- |
| Alert channel | One "where to send" configuration, either a Feishu bot or email |
| In-app inbox (built-in) | The platform's own inbox; needs no configuration and no secret |
| Feishu bot URL | The webhook of a Feishu group bot; posting to it shows the message in that group |
| Feishu signing secret | Required when the bot enforces signature verification, proving the message came from the platform |
| Test channel | Sends one test message immediately to verify the configuration |

## Before you start

- You need a **system administrator** account.
- For Feishu: add a custom bot to the group first to obtain the webhook URL, plus the signing secret if signature verification is on.
- For email: have the SMTP server, sender, recipients and SMTP password ready.

## Reading the list

Go to **Alert channels** in the top bar. The list has three columns:

| Column | Meaning |
| --- | --- |
| Name | Channel name; sortable |
| Type | **Feishu** or **Email** |
| Configuration | The bot URL for Feishu, the SMTP server for email; built-in channels show **In-app inbox (built-in)** |

**Create alert channel** sits in the top-right corner. Row actions:

| Action | Notes |
| --- | --- |
| Test channel | Sends a test message immediately |
| Edit | Opens the edit dialog |
| Delete | Asks for confirmation; alert rules that referenced it lose this delivery target |

![Alert channel list: name, type and configuration, with a create action in the top-right corner](/assets/screenshots/boss/alert-channels-01.png)

## Add an alert channel

1. Click **Alert channels** in the top bar.
2. Click **Create alert channel**.
3. Fill in **Name**, pick a **Type**, then fill the matching fields:

   Type = **Feishu**:

   | Field | Required | Notes |
   | --- | --- | --- |
   | Feishu bot URL | Yes | The group bot webhook |
   | Feishu signing secret | Yes when creating | Required when the bot verifies signatures; **leave empty when editing to keep the stored secret** |

   Type = **Email**:

   | Field | Required | Notes |
   | --- | --- | --- |
   | SMTP server | Yes | The sending server |
   | From | Yes | Sender address of alert mail |
   | To | Yes | Separate multiple addresses with **commas** |
   | Password | Yes when creating | SMTP password or app password; **leave empty when editing to keep the stored one** |
   | Transport encryption | No | Switch, **on** by default |

4. Click **Save**. The button stays disabled until the required fields are filled.

:::info Name and type are fixed after creation
**Name** and **Type** are greyed out in the edit dialog. To switch to a different delivery mechanism, create a new channel and repoint the alert rules.
:::

## Test a channel

1. Open the row menu on the target channel and click **Test channel**.
2. On success the page shows: "**The test message has been sent; check the target channel to confirm receipt**".

:::warning The test message really goes out
One click posts a real message to the Feishu group or the recipient's mailbox. Warn the group before testing, and do not treat it as a configuration-only check.
:::

On failure an error bar appears at the top of the page; check the URL, secret or SMTP credentials.

## Edit and delete

| Action | Notes |
| --- | --- |
| Edit | Name and type are fixed; URL, secret (empty means unchanged), recipients and the encryption switch can change |
| Delete | Confirmation dialog, then the channel is removed. Confirm no alert rule still points at it |

:::tip Check the alert rules first
Alert rules reference these channels through **Notification channels**. After a channel is deleted, its rules still fire but nothing is delivered. Check the cluster's **Alerts** page before deleting.
:::

## How this relates to cluster alerts

Alerting has two layers; you need both:

| Layer | Where | Purpose |
| --- | --- | --- |
| Channel | This page (top-bar **Alert channels**) | Where messages go |
| Rule | Cluster → **Operations Management → Alerts** | What triggers a message, and through which channels |

When adding a rule on the **Alerts** page, the **Notification channels** dropdown lists the channels defined here; with nothing selected the built-in **In-app inbox (built-in)** is used. See [Alerts](/boss/rune-admin/alerts).

## Verify the result

| What you want to confirm | Where to look |
| --- | --- |
| The channel exists | The list shows it with the right type and configuration |
| It actually works | **Test channel** shows the success message, and the group or mailbox receives it |
| Alerts will reach it | On the cluster's **Alerts** page, the rule lists this channel |

## FAQ

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Test fails with a signature error | Signature verification is on but the secret is missing or wrong | Copy the secret from the bot settings and re-enter it |
| Test succeeds but the group sees nothing | The bot was removed from the group, or the URL points elsewhere | Check the bot membership and the URL |
| Email test fails | Wrong SMTP server/port, or wrong password | Verify the SMTP settings; you can also test the same values in [Email Providers](/boss/iam/email-providers) |
| Only one recipient receives mail | Addresses were not comma separated | Use commas between addresses |
| Type cannot be changed while editing | By design | Create a new channel and repoint the rules |

## Related

- [Alerts](/boss/rune-admin/alerts)
- [Platform](/boss/settings)
- [Email Providers](/boss/iam/email-providers)
